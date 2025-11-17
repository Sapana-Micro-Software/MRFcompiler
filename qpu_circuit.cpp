#include "qpu_circuit.h"
#include "mrf.h"
#include <iostream>
#include <sstream>
#include <iomanip>
#include <cmath>

// QuantumGate implementation
QuantumGate::QuantumGate(GateType t, int target, int control, double param)
    : type(t), target_qubit(target), control_qubit(control), parameter(param) {
}

std::string QuantumGate::toString() const {
    std::ostringstream oss;
    switch (type) {
        case GateType::H:
            oss << "H(" << target_qubit << ")";
            break;
        case GateType::X:
            oss << "X(" << target_qubit << ")";
            break;
        case GateType::Y:
            oss << "Y(" << target_qubit << ")";
            break;
        case GateType::Z:
            oss << "Z(" << target_qubit << ")";
            break;
        case GateType::CNOT:
            oss << "CNOT(" << control_qubit << ", " << target_qubit << ")";
            break;
        case GateType::RZ:
            oss << "RZ(" << target_qubit << ", " << parameter << ")";
            break;
        case GateType::RY:
            oss << "RY(" << target_qubit << ", " << parameter << ")";
            break;
        case GateType::RX:
            oss << "RX(" << target_qubit << ", " << parameter << ")";
            break;
        case GateType::CPHASE:
            oss << "CPHASE(" << control_qubit << ", " << target_qubit << ", " << parameter << ")";
            break;
        case GateType::MEASURE:
            oss << "MEASURE(" << target_qubit << ")";
            break;
    }
    return oss.str();
}

// QPUCircuit implementation
QPUCircuit::QPUCircuit(int num_qubits) : num_qubits(num_qubits) {
}

void QPUCircuit::addGate(GateType type, int target, int control, double param) {
    gates.emplace_back(type, target, control, param);
}

void QPUCircuit::addMeasurement(int qubit) {
    addGate(GateType::MEASURE, qubit);
    measurement_qubits.push_back(qubit);
}

void QPUCircuit::print() const {
    std::cout << "QPU Circuit (" << num_qubits << " qubits)\n";
    std::cout << "Gates:\n";
    for (size_t i = 0; i < gates.size(); i++) {
        std::cout << "  " << i << ": " << gates[i].toString() << "\n";
    }
}

void QPUCircuit::printQASM() const {
    std::cout << "OPENQASM 2.0;\n";
    std::cout << "include \"qelib1.inc\";\n";
    std::cout << "qreg q[" << num_qubits << "];\n";
    std::cout << "creg c[" << num_qubits << "];\n\n";
    
    for (const auto& gate : gates) {
        switch (gate.type) {
            case GateType::H:
                std::cout << "h q[" << gate.target_qubit << "];\n";
                break;
            case GateType::X:
                std::cout << "x q[" << gate.target_qubit << "];\n";
                break;
            case GateType::Y:
                std::cout << "y q[" << gate.target_qubit << "];\n";
                break;
            case GateType::Z:
                std::cout << "z q[" << gate.target_qubit << "];\n";
                break;
            case GateType::CNOT:
                std::cout << "cx q[" << gate.control_qubit << "],q[" << gate.target_qubit << "];\n";
                break;
            case GateType::RZ:
                std::cout << "rz(" << gate.parameter << ") q[" << gate.target_qubit << "];\n";
                break;
            case GateType::RY:
                std::cout << "ry(" << gate.parameter << ") q[" << gate.target_qubit << "];\n";
                break;
            case GateType::RX:
                std::cout << "rx(" << gate.parameter << ") q[" << gate.target_qubit << "];\n";
                break;
            case GateType::CPHASE:
                std::cout << "cp(" << gate.parameter << ") q[" << gate.control_qubit 
                          << "],q[" << gate.target_qubit << "];\n";
                break;
            case GateType::MEASURE:
                std::cout << "measure q[" << gate.target_qubit << "] -> c[" << gate.target_qubit << "];\n";
                break;
        }
    }
}

void QPUCircuit::printOpenQASM() const {
    printQASM();
}

// Encode clique potential into quantum circuit
void encodeCliquePotential(const Clique& clique, QPUCircuit& circuit, 
                          const std::map<int, int>& qubit_map) {
    if (clique.nodes.size() == 1) {
        // Single qubit potential - use rotation gates
        int qubit = qubit_map.at(clique.nodes[0]);
        // Encode potential as rotation
        double angle = std::log(clique.potential[1] / clique.potential[0]);
        circuit.addGate(GateType::RY, qubit, -1, angle);
    } else if (clique.nodes.size() == 2) {
        // Two-qubit potential - use CNOT and rotations
        int q1 = qubit_map.at(clique.nodes[0]);
        int q2 = qubit_map.at(clique.nodes[1]);
        
        // Encode Ising interaction
        // For binary states, we can encode as: exp(-J * Z_i * Z_j)
        double J = std::log(clique.potential[3] * clique.potential[0] / 
                           (clique.potential[1] * clique.potential[2])) / 4.0;
        
        if (std::abs(J) > 1e-10) {
            // Apply CNOT
            circuit.addGate(GateType::CNOT, q2, q1);
            // Apply RZ rotation
            circuit.addGate(GateType::RZ, q2, -1, 2.0 * J);
            // Apply CNOT again
            circuit.addGate(GateType::CNOT, q2, q1);
        }
    }
}

// Apply Ising Hamiltonian representation
void applyIsingHamiltonian(const MRF& mrf, QPUCircuit& circuit) {
    // Create qubit mapping
    std::map<int, int> qubit_map;
    for (size_t i = 0; i < mrf.nodes.size(); i++) {
        qubit_map[mrf.nodes[i].id] = i;
    }
    
    // Initialize all qubits in superposition
    for (size_t i = 0; i < mrf.nodes.size(); i++) {
        circuit.addGate(GateType::H, i);
    }
    
    // Encode each clique
    for (const auto& clique : mrf.cliques) {
        encodeCliquePotential(clique, circuit, qubit_map);
    }
    
    // Add measurements
    for (size_t i = 0; i < mrf.nodes.size(); i++) {
        circuit.addMeasurement(i);
    }
}

// Convert MRF to QPU Circuit
QPUCircuit convertMRFToQPU(const MRF& mrf) {
    QPUCircuit circuit(mrf.nodes.size());
    
    // Apply Ising Hamiltonian encoding
    applyIsingHamiltonian(mrf, circuit);
    
    return circuit;
}
