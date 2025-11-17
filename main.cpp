/*
 * MRF Compiler
 * Converts graphical models to MRF and then to QPU circuits
 * Copyright (C) 2025, Shyamal Suhana Chandra
 */

#include "graph.h"
#include "mrf.h"
#include "qpu_circuit.h"
#include "framework_exporters.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>

// Simple parser for graphical model input
GraphicalModel parseGraphicalModel(const std::string& filename) {
    GraphicalModel gm(GraphType::UNDIRECTED);
    
    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Warning: Could not open file " << filename 
                  << ". Creating example model.\n";
        // Create example model
        gm.addNode(0, "A", 2);
        gm.addNode(1, "B", 2);
        gm.addNode(2, "C", 2);
        gm.addEdge(0, 1, false);
        gm.addEdge(1, 2, false);
        
        // Set example potentials
        gm.setNodePotential(0, {1.0, 1.5});
        gm.setNodePotential(1, {1.0, 1.2});
        gm.setNodePotential(2, {1.0, 1.3});
        
        std::vector<std::vector<double>> edge_pot_01 = {
            {2.0, 0.5},
            {0.5, 2.0}
        };
        gm.setEdgePotential(0, 1, edge_pot_01);
        
        std::vector<std::vector<double>> edge_pot_12 = {
            {1.5, 0.8},
            {0.8, 1.5}
        };
        gm.setEdgePotential(1, 2, edge_pot_12);
        
        return gm;
    }
    
    std::string line;
    while (std::getline(file, line)) {
        std::istringstream iss(line);
        std::string command;
        iss >> command;
        
        if (command == "NODE") {
            int id;
            std::string name;
            int num_states = 2;
            iss >> id >> name;
            if (iss >> num_states) {}
            gm.addNode(id, name, num_states);
        } else if (command == "EDGE") {
            int from, to;
            bool directed = false;
            iss >> from >> to;
            std::string dir;
            if (iss >> dir && dir == "directed") {
                directed = true;
            }
            gm.addEdge(from, to, directed);
        } else if (command == "TYPE") {
            std::string type;
            iss >> type;
            if (type == "directed") {
                gm.type = GraphType::DIRECTED;
            } else {
                gm.type = GraphType::UNDIRECTED;
            }
        } else if (command == "CPT") {
            // Parse CPT: CPT <node_id> [parent_states...] <prob_state0> <prob_state1> ...
            // Format examples:
            //   CPT 0 0.8 0.2                    (root node, no parents)
            //   CPT 2 0 0 0.99 0.01             (node 2 with parents in state 0,0)
            //   CPT 2 0 1 0.9 0.1               (node 2 with parents in state 0,1)
            //   CPT 2 1 0 0.8 0.2               (node 2 with parents in state 1,0)
            //   CPT 2 1 1 0.0 1.0               (node 2 with parents in state 1,1)
            
            int node_id;
            if (!(iss >> node_id)) {
                std::cerr << "Warning: Invalid CPT command, missing node_id\n";
                continue;
            }
            
            Node* node = gm.getNode(node_id);
            if (!node) {
                std::cerr << "Warning: CPT specified for non-existent node " << node_id << "\n";
                continue;
            }
            
            // Get parents of this node
            std::vector<int> parents = gm.getParents(node_id);
            int num_parents = parents.size();
            
            // Read all remaining values
            std::vector<double> values;
            double val;
            while (iss >> val) {
                values.push_back(val);
            }
            
            // Determine format: if we have exactly num_states values, it's a root node CPT
            // Otherwise, we need to parse parent states + probabilities
            if (num_parents == 0) {
                // Root node: just probabilities
                if (values.size() != (size_t)node->num_states) {
                    std::cerr << "Warning: CPT for root node " << node_id 
                              << " should have " << node->num_states << " values, got " 
                              << values.size() << "\n";
                    continue;
                }
                std::map<std::vector<int>, std::vector<double>> cpt_table;
                cpt_table[std::vector<int>()] = values;  // Empty parent state vector
                gm.setCPT(node_id, cpt_table);
            } else {
                // Node with parents: format is [parent_states...] [probabilities...]
                // Each entry has num_parents parent states + num_states probabilities
                int entry_size = num_parents + node->num_states;
                if (values.size() % entry_size != 0) {
                    std::cerr << "Warning: CPT for node " << node_id 
                              << " has incorrect number of values. Expected multiple of " 
                              << entry_size << ", got " << values.size() << "\n";
                    continue;
                }
                
                std::map<std::vector<int>, std::vector<double>> cpt_table;
                for (size_t i = 0; i < values.size(); i += entry_size) {
                    std::vector<int> parent_states;
                    std::vector<double> probs;
                    
                    // Read parent states
                    for (int j = 0; j < num_parents; j++) {
                        parent_states.push_back((int)values[i + j]);
                    }
                    
                    // Read probabilities
                    for (int j = 0; j < node->num_states; j++) {
                        probs.push_back(values[i + num_parents + j]);
                    }
                    
                    cpt_table[parent_states] = probs;
                }
                gm.setCPT(node_id, cpt_table);
            }
        }
    }
    
    file.close();
    return gm;
}

void printUsage(const char* program_name) {
    std::cout << "Usage: " << program_name << " [options] [input_file] [output_file]\n";
    std::cout << "\nOptions:\n";
    std::cout << "  -f, --framework <name>  Output framework (default: qasm)\n";
    std::cout << "                          Supported: qasm, qiskit, cirq, pennylane, qsharp, braket, qulacs, tfq\n";
    std::cout << "  -a, --all               Export to all frameworks\n";
    std::cout << "  -h, --help              Show this help message\n";
    std::cout << "\nExamples:\n";
    std::cout << "  " << program_name << " example.txt output.qasm\n";
    std::cout << "  " << program_name << " -f qiskit example.txt circuit.py\n";
    std::cout << "  " << program_name << " -a example.txt\n";
}

int main(int argc, char* argv[]) {
    std::cout << "MRF Compiler - Graphical Model to QPU Circuit Converter\n";
    std::cout << "Copyright (C) 2025, Shyamal Suhana Chandra\n\n";
    
    std::string input_file = "";
    std::string output_file = "";
    Framework framework = Framework::QASM;
    bool export_all = false;
    
    // Parse command line arguments
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        if (arg == "-h" || arg == "--help") {
            printUsage(argv[0]);
            return 0;
        } else if (arg == "-f" || arg == "--framework") {
            if (i + 1 < argc) {
                framework = stringToFramework(argv[++i]);
            } else {
                std::cerr << "Error: -f requires a framework name\n";
                return 1;
            }
        } else if (arg == "-a" || arg == "--all") {
            export_all = true;
        } else if (arg[0] != '-') {
            if (input_file.empty()) {
                input_file = arg;
            } else if (output_file.empty()) {
                output_file = arg;
            }
        }
    }
    
    // Step 1: Parse graphical model
    std::cout << "=== Step 1: Parsing Graphical Model ===\n";
    GraphicalModel gm = parseGraphicalModel(input_file);
    gm.print();
    std::cout << "\n";
    
    // Step 2: Convert to MRF
    std::cout << "=== Step 2: Converting to MRF ===\n";
    MRF mrf = convertToMRF(gm);
    mrf.print();
    std::cout << "\n";
    
    // Step 3: Convert MRF to QPU Circuit
    std::cout << "=== Step 3: Converting MRF to QPU Circuit ===\n";
    QPUCircuit circuit = convertMRFToQPU(mrf);
    circuit.print();
    std::cout << "\n";
    
    // Step 4: Export to framework(s)
    std::vector<Framework> frameworks;
    if (export_all) {
        frameworks = {Framework::QASM, Framework::QISKIT, Framework::CIRQ, 
                     Framework::PENNYLANE, Framework::QSHARP, Framework::BRAKET,
                     Framework::QULACS, Framework::TENSORFLOW_QUANTUM};
    } else {
        frameworks = {framework};
    }
    
    std::cout << "=== Step 4: Exporting to Framework(s) ===\n";
    for (Framework fw : frameworks) {
        FrameworkExporter* exporter = createExporter(fw);
        std::string code = exporter->exportCircuit(circuit, "mrf_circuit");
        
        std::string filename = output_file;
        if (export_all || filename.empty()) {
            filename = "output." + exporter->getFileExtension();
            if (export_all) {
                filename = "output_" + frameworkToString(fw) + "." + exporter->getFileExtension();
            }
        }
        
        std::ofstream outfile(filename);
        if (outfile.is_open()) {
            outfile << code;
            outfile.close();
            std::cout << "Exported to " << exporter->getFrameworkName() 
                      << " -> " << filename << "\n";
        } else {
            std::cerr << "Warning: Could not write to " << filename << "\n";
        }
        
        // Also print to console for single framework
        if (!export_all && frameworks.size() == 1) {
            std::cout << "\n" << exporter->getFrameworkName() << " Code:\n";
            std::cout << "----------------------------------------\n";
            std::cout << code;
            std::cout << "----------------------------------------\n";
        }
        
        delete exporter;
    }
    std::cout << "\n";
    
    return 0;
}
