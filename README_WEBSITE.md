# MRF Compiler Website

This directory contains the GitHub Pages website for the MRF Compiler project.

## Setup

### Prerequisites

- Ruby 3.1+ (for Jekyll)
- Node.js 20+ (for TypeScript compilation)
- Bundler (Ruby gem manager)
- npm (Node package manager)

### Installation

```bash
# Install Ruby dependencies
bundle install

# Install Node.js dependencies
npm install
```

## Development

### Local Development Server

```bash
# Compile TypeScript and start Jekyll server
npm run dev

# Or separately:
npx tsc --watch
bundle exec jekyll serve --watch
```

The site will be available at `http://localhost:4000`

### Build for Production

```bash
# Build TypeScript
npm run build

# Build Jekyll site
bundle exec jekyll build
```

The built site will be in the `_site/` directory.

## Project Structure

```
.
├── _config.yml          # Jekyll configuration
├── _layouts/            # Jekyll layouts
│   └── default.html     # Default page layout
├── assets/
│   ├── css/             # Stylesheets
│   │   └── main.css     # Main stylesheet
│   └── js/              # Compiled JavaScript (generated)
├── src/
│   └── ts/              # TypeScript source files
│       ├── main.ts      # Main TypeScript
│       └── installation.ts
├── docs/                # Documentation files
│   ├── _paper.tex       # LaTeX paper source
│   ├── _presentation.tex # Beamer presentation source
│   └── _reference.tex    # Reference manual source
├── index.html           # Homepage
├── installation.html     # Installation page
├── docs.html            # Documentation page
├── examples.html        # Examples page
├── Gemfile              # Ruby dependencies
├── package.json         # Node.js dependencies
└── tsconfig.json        # TypeScript configuration
```

## Documentation Files

The documentation files (PDFs) should be placed in the `docs/` directory:

- `docs/paper.pdf` - Research paper (compile from `_paper.tex`)
- `docs/presentation.pdf` - Beamer presentation (compile from `_presentation.tex`)
- `docs/reference.pdf` - Reference manual (compile from `_reference.tex`)

To compile LaTeX files:

```bash
# Compile paper
cd docs
pdflatex _paper.tex
bibtex _paper
pdflatex _paper.tex
pdflatex _paper.tex

# Compile presentation
pdflatex _presentation.tex

# Compile reference manual
pdflatex _reference.tex
```

## GitHub Pages Deployment

The site is automatically deployed via GitHub Actions when changes are pushed to the main branch. The workflow is defined in `.github/workflows/pages.yml`.

### Manual Deployment

1. Build the site: `npm run build && bundle exec jekyll build`
2. Push the `_site/` directory to the `gh-pages` branch, or
3. Use GitHub Actions (recommended)

## Customization

### Styling

Edit `assets/css/main.css` to customize the appearance.

### TypeScript

Edit files in `src/ts/` and compile with `npx tsc`.

### Content

- Edit HTML files directly or use Jekyll front matter
- Modify `_config.yml` for site-wide settings

## License

Copyright (C) 2025, Shyamal Suhana Chandra
