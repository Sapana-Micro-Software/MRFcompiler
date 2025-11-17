#include "graph.h"
#include <iostream>
#include <algorithm>
#include <sstream>

// Node implementation
Node::Node(int id, const std::string& name, int num_states) 
    : id(id), name(name), num_states(num_states), has_cpt(false) {
    potential.resize(num_states, 1.0);  // Default uniform potential
}

void Node::setCPT(const std::map<std::vector<int>, std::vector<double>>& cpt_table) {
    cpt = cpt_table;
    has_cpt = true;
}

// Edge implementation
Edge::Edge(int from, int to, bool directed) 
    : from(from), to(to), directed(directed) {
}

void Edge::setPotential(const std::vector<std::vector<double>>& pot) {
    potential = pot;
}

// GraphicalModel implementation
GraphicalModel::GraphicalModel(GraphType t) : type(t) {
}

void GraphicalModel::addNode(int id, const std::string& name, int num_states) {
    nodes.emplace_back(id, name, num_states);
    adjacency_list[id] = std::set<int>();
}

void GraphicalModel::addEdge(int from, int to, bool directed) {
    edges.emplace_back(from, to, directed);
    adjacency_list[from].insert(to);
    if (!directed || type == GraphType::UNDIRECTED) {
        adjacency_list[to].insert(from);
    }
}

void GraphicalModel::setNodePotential(int node_id, const std::vector<double>& potential) {
    Node* node = getNode(node_id);
    if (node) {
        node->potential = potential;
    }
}

void GraphicalModel::setEdgePotential(int from, int to, const std::vector<std::vector<double>>& potential) {
    Edge* edge = getEdge(from, to);
    if (edge) {
        edge->setPotential(potential);
    }
}

void GraphicalModel::setCPT(int node_id, const std::map<std::vector<int>, std::vector<double>>& cpt_table) {
    Node* node = getNode(node_id);
    if (node) {
        node->setCPT(cpt_table);
    }
}

std::vector<int> GraphicalModel::getParents(int node_id) const {
    std::vector<int> parents;
    for (const auto& edge : edges) {
        if (edge.to == node_id && edge.directed) {
            parents.push_back(edge.from);
        }
    }
    return parents;
}

Node* GraphicalModel::getNode(int id) {
    for (auto& node : nodes) {
        if (node.id == id) {
            return &node;
        }
    }
    return nullptr;
}

const Node* GraphicalModel::getNode(int id) const {
    for (const auto& node : nodes) {
        if (node.id == id) {
            return &node;
        }
    }
    return nullptr;
}

Edge* GraphicalModel::getEdge(int from, int to) {
    for (auto& edge : edges) {
        if ((edge.from == from && edge.to == to) ||
            (!edge.directed && edge.from == to && edge.to == from)) {
            return &edge;
        }
    }
    return nullptr;
}

std::vector<int> GraphicalModel::getNeighbors(int node_id) const {
    std::vector<int> neighbors;
    auto it = adjacency_list.find(node_id);
    if (it != adjacency_list.end()) {
        neighbors.assign(it->second.begin(), it->second.end());
    }
    return neighbors;
}

bool GraphicalModel::hasEdge(int from, int to) const {
    auto it = adjacency_list.find(from);
    if (it != adjacency_list.end()) {
        return it->second.find(to) != it->second.end();
    }
    return false;
}

void GraphicalModel::print() const {
    std::cout << "Graphical Model (" 
              << (type == GraphType::DIRECTED ? "Directed" : "Undirected") 
              << ")\n";
    std::cout << "Nodes:\n";
    for (const auto& node : nodes) {
        std::cout << "  Node " << node.id << " (" << node.name 
                  << "): " << node.num_states << " states";
        if (node.has_cpt) {
            std::cout << " [CPT defined]";
        }
        std::cout << "\n";
    }
    std::cout << "Edges:\n";
    for (const auto& edge : edges) {
        std::cout << "  " << edge.from << " -> " << edge.to 
                  << (edge.directed ? " (directed)" : " (undirected)") << "\n";
    }
    // Print CPTs if available
    for (const auto& node : nodes) {
        if (node.has_cpt && !node.cpt.empty()) {
            std::vector<int> parents = getParents(node.id);
            std::cout << "  CPT for Node " << node.id << " (" << node.name << "):\n";
            for (const auto& entry : node.cpt) {
                std::cout << "    P(" << node.name;
                if (!parents.empty()) {
                    std::cout << " | ";
                    for (size_t i = 0; i < parents.size(); i++) {
                        const Node* parent = getNode(parents[i]);
                        if (parent) {
                            std::cout << parent->name << "=" << entry.first[i];
                            if (i < parents.size() - 1) std::cout << ", ";
                        }
                    }
                }
                std::cout << ") = [";
                for (size_t i = 0; i < entry.second.size(); i++) {
                    std::cout << entry.second[i];
                    if (i < entry.second.size() - 1) std::cout << ", ";
                }
                std::cout << "]\n";
            }
        }
    }
}
