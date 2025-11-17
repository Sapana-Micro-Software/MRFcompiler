#ifndef MRF_H
#define MRF_H

#include "graph.h"
#include <vector>
#include <map>
#include <set>

// Clique in MRF
class Clique {
public:
    std::vector<int> nodes;
    std::vector<double> potential;  // Potential function values
    
    Clique(const std::vector<int>& nodes);
    void setPotential(const std::vector<double>& pot);
    int getPotentialIndex(const std::vector<int>& states) const;
};

// Markov Random Field representation
class MRF {
public:
    std::vector<Node> nodes;
    std::vector<Clique> cliques;
    std::map<int, std::set<int>> adjacency_list;
    
    MRF();
    
    void addNode(int id, const std::string& name, int num_states = 2);
    void addClique(const std::vector<int>& nodes);
    void setCliquePotential(int clique_idx, const std::vector<double>& potential);
    
    void print() const;
    int getTotalStates() const;
};

// Conversion functions
MRF convertToMRF(const GraphicalModel& gm);
void moralizeGraph(GraphicalModel& gm);
void triangulateGraph(GraphicalModel& gm);
std::vector<Clique> findMaximalCliques(const GraphicalModel& gm);

#endif // MRF_H
