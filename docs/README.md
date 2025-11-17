# Documentation Source Files

This directory contains the LaTeX source files for the MRF Compiler documentation.

## Files

- `_paper.tex` - Research paper describing the MRF compiler methodology
- `_presentation.tex` - Beamer presentation slides
- `_reference.tex` - Complete reference manual

## Compiling

### Prerequisites

Install a LaTeX distribution:
- **Linux**: `sudo apt-get install texlive-full` (Ubuntu/Debian)
- **macOS**: Install MacTeX from https://www.tug.org/mactex/
- **Windows**: Install MiKTeX from https://miktex.org/

### Compile Paper

```bash
pdflatex _paper.tex
bibtex _paper
pdflatex _paper.tex
pdflatex _paper.tex
```

### Compile Presentation

```bash
pdflatex _presentation.tex
```

### Compile Reference Manual

```bash
pdflatex _reference.tex
```

## Output

The compiled PDFs should be placed in the parent `docs/` directory for the website to link to them:
- `../paper.pdf`
- `../presentation.pdf`
- `../reference.pdf`

## Note

These are template files. You should expand them with actual content describing your MRF compiler implementation, algorithms, and usage.
