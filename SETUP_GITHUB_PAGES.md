# GitHub Pages Setup Guide

This guide explains how to set up and deploy the MRF Compiler website to GitHub Pages.

## Quick Start

1. **Enable GitHub Pages in your repository:**
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

2. **Push the code to GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages website"
   git push origin main
   ```

3. **The site will automatically build and deploy** via GitHub Actions.

## What's Included

### Website Structure
- ✅ Modern, responsive design with gradient hero section
- ✅ Homepage with features, frameworks, and quick start
- ✅ Installation guide with platform-specific tabs
- ✅ Documentation page with links to PDFs and LaTeX sources
- ✅ Examples page with code samples
- ✅ Mobile-responsive navigation

### Technologies Used
- **Jekyll** - Static site generator
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Modern styling with gradients and animations
- **GitHub Actions** - Automated build and deployment

### Documentation Links
The website includes links to:
- Research Paper (PDF and LaTeX source)
- Beamer Presentation (PDF and LaTeX source)
- Reference Manual (PDF and LaTeX source)

## Local Development

```bash
# Install dependencies
bundle install
npm install

# Start development server
npm run dev
# or
bundle exec jekyll serve --watch
```

Visit `http://localhost:4000`

## Building Documentation PDFs

To generate the PDF documentation files:

```bash
cd docs
pdflatex _paper.tex
pdflatex _presentation.tex
pdflatex _reference.tex
```

Then move the PDFs to the `docs/` directory:
```bash
mv _paper.pdf paper.pdf
mv _presentation.pdf presentation.pdf
mv _reference.pdf reference.pdf
```

## Customization

### Change Colors
Edit `assets/css/main.css` and modify the CSS variables in `:root`.

### Add Content
- Edit HTML files directly
- Modify `_config.yml` for site-wide settings
- Add new pages by creating HTML files with Jekyll front matter

### Modify Layout
Edit `_layouts/default.html` to change the overall page structure.

## GitHub Actions Workflow

The `.github/workflows/pages.yml` file automatically:
1. Builds TypeScript files
2. Compiles Jekyll site
3. Deploys to GitHub Pages

No manual intervention needed after pushing to main branch!

## Troubleshooting

### Site not updating
- Check GitHub Actions tab for build errors
- Ensure `baseurl` in `_config.yml` matches your repository name
- Verify GitHub Pages is enabled in repository settings

### TypeScript not compiling
- Run `npm install` to ensure dependencies are installed
- Check `tsconfig.json` configuration
- Verify Node.js version (20+ required)

### Jekyll build errors
- Run `bundle install` to install Ruby dependencies
- Check `Gemfile` for correct versions
- Verify Ruby version (3.1+ recommended)

## Repository Structure

```
MRFcompiler/
├── .github/
│   └── workflows/
│       ├── pages.yml          # GitHub Pages deployment
│       └── build-docs.yml     # Documentation build (optional)
├── _config.yml                # Jekyll configuration
├── _layouts/
│   └── default.html           # Default page layout
├── assets/
│   ├── css/
│   │   └── main.css          # Main stylesheet
│   └── js/                    # Compiled JavaScript
├── docs/
│   ├── _paper.tex            # LaTeX paper source
│   ├── _presentation.tex     # Beamer presentation source
│   ├── _reference.tex        # Reference manual source
│   ├── paper.pdf             # Compiled PDF (add manually)
│   ├── presentation.pdf      # Compiled PDF (add manually)
│   └── reference.pdf         # Compiled PDF (add manually)
├── src/
│   └── ts/                   # TypeScript source files
├── index.html                # Homepage
├── installation.html         # Installation page
├── docs.html                 # Documentation page
├── examples.html             # Examples page
├── Gemfile                   # Ruby dependencies
├── package.json              # Node.js dependencies
└── tsconfig.json             # TypeScript configuration
```

## Next Steps

1. **Add PDF documentation files** to the `docs/` directory
2. **Customize content** in HTML files
3. **Update colors/branding** in CSS
4. **Add your repository URL** to `_config.yml`
5. **Push to GitHub** and watch it deploy!

## Support

For issues or questions:
- Check GitHub Actions logs
- Review Jekyll documentation: https://jekyllrb.com/
- Review GitHub Pages documentation: https://docs.github.com/en/pages

---

**Copyright (C) 2025, Shyamal Suhana Chandra**
