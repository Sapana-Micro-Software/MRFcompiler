# MRF Compiler

A C++ program that converts graphical models (directed or undirected) into Markov Random Fields (MRF) and then into Quantum Processing Unit (QPU) circuits with support for multiple quantum computing frameworks.

Copyright (C) 2025, Shyamal Suhana Chandra

## Overview

This compiler implements a pipeline for converting probabilistic graphical models to quantum circuits:

1. **Graphical Model Parsing**: Reads directed or undirected graphical models
2. **MRF Conversion**: Converts graphical models to Markov Random Fields
   - For directed graphs: performs moralization
   - Finds maximal cliques
   - Preserves potential functions
3. **QPU Circuit Generation**: Converts MRF to quantum circuits
   - Encodes potentials as quantum gates
   - Uses Ising Hamiltonian representation
   - Supports multiple quantum computing frameworks

## Supported Frameworks

The compiler can export to the following quantum computing frameworks:

- **OpenQASM 2.0** (`qasm`) - Standard quantum assembly language
- **Qiskit** (`qiskit`) - IBM's quantum computing framework
- **Cirq** (`cirq`) - Google's quantum computing framework
- **PennyLane** (`pennylane`) - Xanadu's quantum machine learning library
- **Q#** (`qsharp`) - Microsoft's quantum programming language
- **AWS Braket** (`braket`) - Amazon's quantum computing service
- **Qulacs** (`qulacs`) - Fast quantum circuit simulator
- **TensorFlow Quantum** (`tfq`) - Google's quantum machine learning framework

## Building

```bash
make
```

This will create the `mrf_compiler` executable.

## Usage

```bash
./mrf_compiler [options] [input_file] [output_file]
```

### Options

- `-f, --framework <name>`: Specify output framework (default: `qasm`)
  - Supported: `qasm`, `qiskit`, `cirq`, `pennylane`, `qsharp`, `braket`, `qulacs`, `tfq`
- `-a, --all`: Export to all supported frameworks
- `-h, --help`: Show help message

### Examples

```bash
# Export to OpenQASM (default)
./mrf_compiler example.txt output.qasm

# Export to Qiskit
./mrf_compiler -f qiskit example.txt circuit.py

# Export to Cirq
./mrf_compiler -f cirq example.txt circuit.py

# Export to PennyLane
./mrf_compiler -f pennylane example.txt circuit.py

# Export to all frameworks
./mrf_compiler -a example.txt
```

If no input file is provided, the program will create an example model.

### Input File Format

The input file should contain lines in the following format:

```
TYPE directed|undirected
NODE <id> <name> [num_states]
EDGE <from> <to> [directed]
```

Example:
```
TYPE undirected
NODE 0 A 2
NODE 1 B 2
NODE 2 C 2
EDGE 0 1
EDGE 1 2
```

## Architecture

### Components

- **graph.h/cpp**: Graph data structures and graphical model representation
- **mrf.h/cpp**: MRF representation and conversion algorithms
- **qpu_circuit.h/cpp**: Quantum circuit representation
- **framework_exporters.h/cpp**: Framework-specific code generators
- **main.cpp**: Main program and pipeline

### Conversion Pipeline

1. **Graphical Model** → Parse input or create example
2. **Moralization** (if directed) → Connect all parents of each node
3. **Clique Finding** → Identify maximal cliques
4. **MRF Construction** → Build MRF with clique potentials
5. **Quantum Encoding** → Map MRF to quantum gates
6. **Framework Export** → Generate framework-specific code

## Quantum Circuit Encoding

The MRF is encoded as an Ising Hamiltonian:
- Single-node cliques → Rotation gates (RY)
- Two-node cliques → CNOT + RZ gates
- All qubits initialized in superposition (Hadamard gates)

## Framework-Specific Output

### Qiskit
Generates a Python file with a function that returns a `QuantumCircuit` object. Can be executed directly or imported.

### Cirq
Generates a Python file with a function that returns a `cirq.Circuit` object. Compatible with Cirq's quantum computing framework.

### PennyLane
Generates a Python file with a QNode decorated function that can be executed on various quantum devices and backends.

### Q#
Generates a Q# source file with an operation that can be called from Q# programs or from Python/C# host programs.

### AWS Braket
Generates a Python file with a function that returns a `braket.Circuit` object, ready for execution on AWS Braket devices.

### Qulacs
Generates a Python file with a function that returns a `qulacs.QuantumCircuit` object for fast simulation.

### TensorFlow Quantum
Generates a Python file that creates a tensor representation of the circuit compatible with TensorFlow Quantum.

## Example Output

The compiler outputs:
- Graphical model structure
- MRF cliques
- Quantum circuit gates
- Framework-specific code files

## Requirements

The generated Python files require the respective framework packages:

```bash
# Qiskit
pip install qiskit

# Cirq
pip install cirq

# PennyLane
pip install pennylane

# AWS Braket
pip install amazon-braket-sdk

# Qulacs
pip install qulacs

# TensorFlow Quantum
pip install tensorflow-quantum
```

## License

Copyright (C) 2025, Shyamal Suhana Chandra

For licensing, contact Sapana Micro Software at sapanamicrosoftware@duck.com.
