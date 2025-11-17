# Makefile for MRF Compiler
# Copyright (C) 2025, Shyamal Suhana Chandra

CXX = g++
CXXFLAGS = -std=c++11 -Wall -Wextra -O2
TARGET = mrf_compiler
SOURCES = main.cpp graph.cpp mrf.cpp qpu_circuit.cpp framework_exporters.cpp
OBJECTS = $(SOURCES:.cpp=.o)
HEADERS = graph.h mrf.h qpu_circuit.h framework_exporters.h

.PHONY: all clean

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJECTS)

%.o: %.cpp $(HEADERS)
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(TARGET)

install: $(TARGET)
	cp $(TARGET) /usr/local/bin/

test: $(TARGET)
	./$(TARGET) example.txt output.qasm
