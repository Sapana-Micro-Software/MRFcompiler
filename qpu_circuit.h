#ifndef QPU_CIRCUIT_H
#define QPU_CIRCUIT_H

#include "mrf.h"
#include <vector>
#include <string>
#include <complex>

// Quantum gate types
enum class GateType {
    H,      // Hadamard
    X,      // Pauli-X
    Y,      // Pauli-Y
    Z,      // Pauli-Z
    CNOT,   // Controlled-NOT
    RZ,     // Rotation around Z-axis
    RY,     // Rotation around Y-axis
    RX,     // Rotation around X-axis
    CPHASE, // Controlled phase
    MEASURE // Measurement
};

// Quantum gate
class QuantumGate {
public:
    GateType type;
    int target_qubit;
    int control_qubit;  // -1 if no control
    double parameter;   // For rotation gates
    
    QuantumGate(GateType t, int target, int control = -1, double param = 0.0);
    std::string toString() const;
};

// QPU Circuit representation
class QPUCircuit {
public:
    int num_qubits;
    std::vector<QuantumGate> gates;
    std::vector<int> measurement_qubits;
    
    QPUCircuit(int num_qubits);
    
    void addGate(GateType type, int target, int control = -1, double param = 0.0);
    void addMeasurement(int qubit);
    void print() const;
    void printQASM() const;  // Print in QASM format
    void printOpenQASM() const;  // Print in OpenQASM 2.0 format
};

// Conversion functions
QPUCircuit convertMRFToQPU(const MRF& mrf);
void encodeCliquePotential(const Clique& clique, QPUCircuit& circuit, 
                          const std::map<int, int>& qubit_map);
void applyIsingHamiltonian(const MRF& mrf, QPUCircuit& circuit);

#endif // QPU_CIRCUIT_H
