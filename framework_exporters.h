#ifndef FRAMEWORK_EXPORTERS_H
#define FRAMEWORK_EXPORTERS_H

#include "qpu_circuit.h"
#include <string>
#include <vector>

// Framework types
enum class Framework {
    QASM,      // OpenQASM
    QISKIT,    // IBM Qiskit
    CIRQ,      // Google Cirq
    PENNYLANE, // Xanadu PennyLane
    QSHARP,    // Microsoft Q#
    BRAKET,    // AWS Braket
    QULACS,    // Qulacs
    TENSORFLOW_QUANTUM // TensorFlow Quantum
};

// Base exporter class
class FrameworkExporter {
public:
    virtual ~FrameworkExporter() = default;
    virtual std::string exportCircuit(const QPUCircuit& circuit, const std::string& circuit_name = "mrf_circuit") = 0;
    virtual std::string getFileExtension() const = 0;
    virtual std::string getFrameworkName() const = 0;
};

// QASM Exporter
class QASMExporter : public FrameworkExporter {
public:
    std::string exportCircuit(const QPUCircuit& circuit, const std::string& circuit_name = "mrf_circuit") override;
    std::string getFileExtension() const override { return "qasm"; }
    std::string getFrameworkName() const override { return "OpenQASM"; }
};

// Qiskit Exporter
class QiskitExporter : public FrameworkExporter {
public:
    std::string exportCircuit(const QPUCircuit& circuit, const std::string& circuit_name = "mrf_circuit") override;
    std::string getFileExtension() const override { return "py"; }
    std::string getFrameworkName() const override { return "Qiskit"; }
};

// Cirq Exporter
class CirqExporter : public FrameworkExporter {
public:
    std::string exportCircuit(const QPUCircuit& circuit, const std::string& circuit_name = "mrf_circuit") override;
    std::string getFileExtension() const override { return "py"; }
    std::string getFrameworkName() const override { return "Cirq"; }
};

// PennyLane Exporter
class PennyLaneExporter : public FrameworkExporter {
public:
    std::string exportCircuit(const QPUCircuit& circuit, const std::string& circuit_name = "mrf_circuit") override;
    std::string getFileExtension() const override { return "py"; }
    std::string getFrameworkName() const override { return "PennyLane"; }
};

// Q# Exporter
class QSharpExporter : public FrameworkExporter {
public:
    std::string exportCircuit(const QPUCircuit& circuit, const std::string& circuit_name = "mrf_circuit") override;
    std::string getFileExtension() const override { return "qs"; }
    std::string getFrameworkName() const override { return "QSharp"; }
};

// AWS Braket Exporter
class BraketExporter : public FrameworkExporter {
public:
    std::string exportCircuit(const QPUCircuit& circuit, const std::string& circuit_name = "mrf_circuit") override;
    std::string getFileExtension() const override { return "py"; }
    std::string getFrameworkName() const override { return "Braket"; }
};

// Qulacs Exporter
class QulacsExporter : public FrameworkExporter {
public:
    std::string exportCircuit(const QPUCircuit& circuit, const std::string& circuit_name = "mrf_circuit") override;
    std::string getFileExtension() const override { return "py"; }
    std::string getFrameworkName() const override { return "Qulacs"; }
};

// TensorFlow Quantum Exporter
class TFQExporter : public FrameworkExporter {
public:
    std::string exportCircuit(const QPUCircuit& circuit, const std::string& circuit_name = "mrf_circuit") override;
    std::string getFileExtension() const override { return "py"; }
    std::string getFrameworkName() const override { return "TensorFlow Quantum"; }
};

// Factory function
FrameworkExporter* createExporter(Framework framework);
std::string frameworkToString(Framework framework);
Framework stringToFramework(const std::string& str);

#endif // FRAMEWORK_EXPORTERS_H
