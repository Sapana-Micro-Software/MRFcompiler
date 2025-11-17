#ifndef GRAPH_H
#define GRAPH_H

#include <vector>
#include <string>
#include <map>
#include <set>

// Forward declarations
class Node;
class Edge;

// Graph types
enum class GraphType {
    DIRECTED,
    UNDIRECTED
};

// Node in the graphical model
class Node {
public:
    int id;
    std::string name;
    int num_states;
    std::vector<double> potential;  // For undirected graphs or node potentials
    
    Node(int id, const std::string& name, int num_states = 2);
};

// Edge in the graphical model
class Edge {
public:
    int from;
    int to;
    std::vector<std::vector<double>> potential;  // Edge potential table
    bool directed;
    
    Edge(int from, int to, bool directed = true);
    void setPotential(const std::vector<std::vector<double>>& pot);
};

// Graphical Model representation
class GraphicalModel {
public:
    GraphType type;
    std::vector<Node> nodes;
    std::vector<Edge> edges;
    std::map<int, std::set<int>> adjacency_list;
    
    GraphicalModel(GraphType t = GraphType::UNDIRECTED);
    
    void addNode(int id, const std::string& name, int num_states = 2);
    void addEdge(int from, int to, bool directed = true);
    void setNodePotential(int node_id, const std::vector<double>& potential);
    void setEdgePotential(int from, int to, const std::vector<std::vector<double>>& potential);
    
    Node* getNode(int id);
    Edge* getEdge(int from, int to);
    std::vector<int> getNeighbors(int node_id) const;
    bool hasEdge(int from, int to) const;
    
    void print() const;
};

#endif // GRAPH_H
