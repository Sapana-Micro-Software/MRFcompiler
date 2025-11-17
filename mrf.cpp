#include "mrf.h"
#include "graph.h"
#include <iostream>
#include <algorithm>
#include <cmath>

// Clique implementation
Clique::Clique(const std::vector<int>& nodes) : nodes(nodes) {
    // Calculate potential table size
    int size = 1;
    for (size_t i = 0; i < nodes.size(); i++) {
        size *= 2;  // Assuming binary states for now
    }
    potential.resize(size, 1.0);
}

void Clique::setPotential(const std::vector<double>& pot) {
    potential = pot;
}

int Clique::getPotentialIndex(const std::vector<int>& states) const {
    int index = 0;
    int multiplier = 1;
    for (int i = nodes.size() - 1; i >= 0; i--) {
        index += states[i] * multiplier;
        multiplier *= 2;
    }
    return index;
}

// MRF implementation
MRF::MRF() {
}

void MRF::addNode(int id, const std::string& name, int num_states) {
    nodes.emplace_back(id, name, num_states);
    adjacency_list[id] = std::set<int>();
}

void MRF::addClique(const std::vector<int>& nodes) {
    cliques.emplace_back(nodes);
    // Update adjacency list
    for (size_t i = 0; i < nodes.size(); i++) {
        for (size_t j = i + 1; j < nodes.size(); j++) {
            adjacency_list[nodes[i]].insert(nodes[j]);
            adjacency_list[nodes[j]].insert(nodes[i]);
        }
    }
}

void MRF::setCliquePotential(int clique_idx, const std::vector<double>& potential) {
    if (clique_idx >= 0 && clique_idx < (int)cliques.size()) {
        cliques[clique_idx].setPotential(potential);
    }
}

void MRF::print() const {
    std::cout << "Markov Random Field (MRF)\n";
    std::cout << "Nodes:\n";
    for (const auto& node : nodes) {
        std::cout << "  Node " << node.id << " (" << node.name 
                  << "): " << node.num_states << " states\n";
    }
    std::cout << "Cliques:\n";
    for (size_t i = 0; i < cliques.size(); i++) {
        std::cout << "  Clique " << i << ": {";
        for (size_t j = 0; j < cliques[i].nodes.size(); j++) {
            std::cout << cliques[i].nodes[j];
            if (j < cliques[i].nodes.size() - 1) std::cout << ", ";
        }
        std::cout << "}\n";
    }
}

int MRF::getTotalStates() const {
    int total = 1;
    for (const auto& node : nodes) {
        total *= node.num_states;
    }
    return total;
}

// Convert directed graph to MRF by moralization
void moralizeGraph(GraphicalModel& gm) {
    if (gm.type != GraphType::DIRECTED) {
        return;  // Already undirected
    }
    
    // For each node, connect all its parents (moralization)
    for (const auto& node : gm.nodes) {
        std::vector<int> parents;
        for (const auto& edge : gm.edges) {
            if (edge.to == node.id && edge.directed) {
                parents.push_back(edge.from);
            }
        }
        
        // Add edges between all pairs of parents
        for (size_t i = 0; i < parents.size(); i++) {
            for (size_t j = i + 1; j < parents.size(); j++) {
                if (!gm.hasEdge(parents[i], parents[j])) {
                    gm.addEdge(parents[i], parents[j], false);
                }
            }
        }
    }
    
    // Make all edges undirected
    for (auto& edge : gm.edges) {
        edge.directed = false;
    }
    
    gm.type = GraphType::UNDIRECTED;
}

// Find maximal cliques (simplified version)
std::vector<Clique> findMaximalCliques(const GraphicalModel& gm) {
    std::vector<Clique> cliques;
    
    // Simple approach: each edge forms a 2-clique, and we find larger cliques
    // For a more complete implementation, use Bron-Kerbosch algorithm
    
    // For each node, try to form cliques with its neighbors
    std::set<std::set<int>> clique_sets;
    
    for (const auto& node : gm.nodes) {
        std::vector<int> neighbors = gm.getNeighbors(node.id);
        
        // Add single-node clique
        clique_sets.insert({node.id});
        
        // Add 2-cliques (edges)
        for (int neighbor : neighbors) {
            if (node.id < neighbor) {  // Avoid duplicates
                clique_sets.insert({node.id, neighbor});
            }
        }
        
        // Try to extend to 3-cliques
        for (size_t i = 0; i < neighbors.size(); i++) {
            for (size_t j = i + 1; j < neighbors.size(); j++) {
                int n1 = neighbors[i];
                int n2 = neighbors[j];
                if (gm.hasEdge(n1, n2)) {
                    std::set<int> clique = {node.id, n1, n2};
                    clique_sets.insert(clique);
                }
            }
        }
    }
    
    // Convert to Clique objects
    for (const auto& clique_set : clique_sets) {
        std::vector<int> nodes_vec(clique_set.begin(), clique_set.end());
        cliques.emplace_back(nodes_vec);
    }
    
    return cliques;
}

// Helper function to convert CPT to clique potential
std::vector<double> convertCPTToPotential(const std::vector<int>& clique_nodes, 
                                         const GraphicalModel& gm) {
    // Find which node in the clique has the CPT
    int cpt_node_id = -1;
    std::vector<int> parent_ids;
    
    for (int node_id : clique_nodes) {
        const Node* n = gm.getNode(node_id);
        if (n && n->has_cpt) {
            cpt_node_id = node_id;
            parent_ids = gm.getParents(node_id);
            break;
        }
    }
    
    if (cpt_node_id == -1) {
        // No CPT found, return uniform potential
        int size = 1;
        for (int n : clique_nodes) {
            const Node* node_ptr = gm.getNode(n);
            if (node_ptr) size *= node_ptr->num_states;
        }
        return std::vector<double>(size, 1.0);
    }
    
    const Node* cpt_node = gm.getNode(cpt_node_id);
    if (!cpt_node || !cpt_node->has_cpt) {
        int size = 1;
        for (int n : clique_nodes) {
            const Node* node_ptr = gm.getNode(n);
            if (node_ptr) size *= node_ptr->num_states;
        }
        return std::vector<double>(size, 1.0);
    }
    
    // Build potential table from CPT
    // The clique contains the node and its parents
    // We need to map each state combination to the CPT value
    
    // Determine the order of nodes in the clique (node first, then parents)
    std::vector<int> node_order;
    node_order.push_back(cpt_node_id);
    for (int parent_id : parent_ids) {
        if (std::find(clique_nodes.begin(), clique_nodes.end(), parent_id) != clique_nodes.end()) {
            node_order.push_back(parent_id);
        }
    }
    
    // Calculate potential table size
    int potential_size = 1;
    std::vector<int> node_sizes;
    for (int n : node_order) {
        const Node* node_ptr = gm.getNode(n);
        if (node_ptr) {
            node_sizes.push_back(node_ptr->num_states);
            potential_size *= node_ptr->num_states;
        }
    }
    
    std::vector<double> potential(potential_size, 1.0);
    
    // Fill potential table from CPT
    for (int i = 0; i < potential_size; i++) {
        // Decode state combination
        std::vector<int> states;
        int temp = i;
        for (int size : node_sizes) {
            states.push_back(temp % size);
            temp /= size;
        }
        
        // Get node state (first in order)
        int node_state = states[0];
        
        // Get parent states
        std::vector<int> parent_states;
        for (size_t j = 1; j < states.size(); j++) {
            parent_states.push_back(states[j]);
        }
        
        // Look up in CPT
        auto cpt_it = cpt_node->cpt.find(parent_states);
        if (cpt_it != cpt_node->cpt.end() && node_state < (int)cpt_it->second.size()) {
            potential[i] = cpt_it->second[node_state];
        }
    }
    
    return potential;
}

// Convert Graphical Model to MRF
MRF convertToMRF(const GraphicalModel& gm) {
    MRF mrf;
    
    // Copy nodes
    for (const auto& node : gm.nodes) {
        mrf.addNode(node.id, node.name, node.num_states);
    }
    
    // If directed, moralize first
    GraphicalModel gm_copy = gm;
    if (gm_copy.type == GraphType::DIRECTED) {
        moralizeGraph(gm_copy);
    }
    
    // Find maximal cliques
    std::vector<Clique> cliques = findMaximalCliques(gm_copy);
    
    // Add cliques to MRF
    for (const auto& clique : cliques) {
        mrf.addClique(clique.nodes);
        
        // Check if any node in clique has CPT (for Bayesian Networks)
        bool has_cpt = false;
        for (int node_id : clique.nodes) {
            const Node* node = gm.getNode(node_id);
            if (node && node->has_cpt) {
                has_cpt = true;
                break;
            }
        }
        
        if (has_cpt && gm.type == GraphType::DIRECTED) {
            // Convert CPT to potential
            std::vector<double> potential = convertCPTToPotential(clique.nodes, gm);
            mrf.cliques.back().setPotential(potential);
        } else {
            // Use standard potential assignment
            if (clique.nodes.size() == 1) {
                // Single node clique - use node potential or CPT if available
                const Node* node = gm.getNode(clique.nodes[0]);
                if (node) {
                    if (node->has_cpt && !node->cpt.empty()) {
                        // Use CPT for root node (no parents)
                        auto cpt_it = node->cpt.find(std::vector<int>());
                        if (cpt_it != node->cpt.end()) {
                            mrf.cliques.back().setPotential(cpt_it->second);
                        } else {
                            mrf.cliques.back().setPotential(node->potential);
                        }
                    } else {
                        mrf.cliques.back().setPotential(node->potential);
                    }
                }
            } else if (clique.nodes.size() == 2) {
                // Edge clique - use edge potential
                Edge* edge = gm_copy.getEdge(clique.nodes[0], clique.nodes[1]);
                if (edge && !edge->potential.empty()) {
                    // Flatten 2D potential to 1D
                    std::vector<double> flat_pot;
                    for (const auto& row : edge->potential) {
                        for (double val : row) {
                            flat_pot.push_back(val);
                        }
                    }
                    mrf.cliques.back().setPotential(flat_pot);
                }
            }
        }
    }
    
    return mrf;
}
