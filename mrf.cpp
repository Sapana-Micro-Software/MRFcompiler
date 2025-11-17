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
        
        // Set potential from original graph
        if (clique.nodes.size() == 1) {
            // Single node clique - use node potential
            Node* node = gm_copy.getNode(clique.nodes[0]);
            if (node) {
                mrf.cliques.back().setPotential(node->potential);
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
    
    return mrf;
}
