# Makefile for MRF Compiler
# Copyright (C) 2025, Shyamal Suhana Chandra

# Detect OS
UNAME_S := $(shell uname -s)

# Default compiler settings
CXXFLAGS = -std=c++11 -Wall -Wextra -O2
TARGET = mrf_compiler
SOURCES = main.cpp graph.cpp mrf.cpp qpu_circuit.cpp framework_exporters.cpp
OBJECTS = $(SOURCES:.cpp=.o)
HEADERS = graph.h mrf.h qpu_circuit.h framework_exporters.h

# macOS-specific compiler detection
ifeq ($(UNAME_S),Darwin)
    # Check for Homebrew LLVM (clang)
    ifneq ($(wildcard /opt/homebrew/opt/llvm/bin/clang++),)
        CXX = /opt/homebrew/opt/llvm/bin/clang++
        CXXFLAGS += -I/opt/homebrew/opt/llvm/include
        LDFLAGS = -L/opt/homebrew/opt/llvm/lib
    # Check for Homebrew LLVM in Intel location
    else ifneq ($(wildcard /usr/local/opt/llvm/bin/clang++),)
        CXX = /usr/local/opt/llvm/bin/clang++
        CXXFLAGS += -I/usr/local/opt/llvm/include
        LDFLAGS = -L/usr/local/opt/llvm/lib
    # Check for Homebrew GCC
    else ifneq ($(wildcard /opt/homebrew/bin/g++-13),)
        CXX = /opt/homebrew/bin/g++-13
    else ifneq ($(wildcard /opt/homebrew/bin/g++-12),)
        CXX = /opt/homebrew/bin/g++-12
    else ifneq ($(wildcard /opt/homebrew/bin/g++-11),)
        CXX = /opt/homebrew/bin/g++-11
    else ifneq ($(wildcard /usr/local/bin/g++-13),)
        CXX = /usr/local/bin/g++-13
    else ifneq ($(wildcard /usr/local/bin/g++-12),)
        CXX = /usr/local/bin/g++-12
    else ifneq ($(wildcard /usr/local/bin/g++-11),)
        CXX = /usr/local/bin/g++-11
    # Use system clang (Apple LLVM)
    else
        CXX = clang++
    endif
    # macOS-specific flags
    CXXFLAGS += -stdlib=libc++
    INSTALL_PREFIX ?= /usr/local
else
    # Linux/Unix - use g++ by default
    CXX = g++
    INSTALL_PREFIX ?= /usr/local
endif

.PHONY: all clean install test help check-compiler

help:
	@echo "MRF Compiler Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  make              - Build the compiler"
	@echo "  make clean        - Remove build artifacts"
	@echo "  make install      - Install to $(INSTALL_PREFIX)/bin"
	@echo "  make test         - Run test compilation"
	@echo "  make check-compiler - Show detected compiler"
	@echo ""
	@echo "Compiler: $(CXX)"
	@echo "OS: $(UNAME_S)"

check-compiler:
	@echo "Detected OS: $(UNAME_S)"
	@echo "Using compiler: $(CXX)"
	@$(CXX) --version | head -1
	@echo ""
	@echo "Compiler flags: $(CXXFLAGS)"

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CXX) $(CXXFLAGS) $(LDFLAGS) -o $(TARGET) $(OBJECTS)

%.o: %.cpp $(HEADERS)
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(TARGET)

install: $(TARGET)
	@mkdir -p $(INSTALL_PREFIX)/bin
	cp $(TARGET) $(INSTALL_PREFIX)/bin/
	@echo "Installed $(TARGET) to $(INSTALL_PREFIX)/bin"
	@echo "Make sure $(INSTALL_PREFIX)/bin is in your PATH"

test: $(TARGET)
	./$(TARGET) example.txt output.qasm
