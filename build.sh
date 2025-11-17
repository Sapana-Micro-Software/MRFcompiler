#!/bin/bash
# Build script for MRF Compiler website
# Copyright (C) 2025, Shyamal Suhana Chandra

set -e

echo "Building MRF Compiler website..."

# Compile TypeScript
echo "Compiling TypeScript..."
npx tsc

# Build Jekyll site
echo "Building Jekyll site..."
bundle exec jekyll build

echo "Build complete! Site is in _site/"
