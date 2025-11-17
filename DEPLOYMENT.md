# GitHub Pages Deployment Guide

This repository uses GitHub Actions to automatically build and deploy the website to GitHub Pages.

## 🚀 Automatic Deployment

The site is automatically deployed when you:

1. **Push to main/master branch** - Automatically triggers deployment
2. **Manual trigger** - Go to Actions tab → "Build and Deploy GitHub Pages" → "Run workflow"

## 📋 Prerequisites

Before the first deployment, ensure:

1. **GitHub Pages is enabled** in your repository settings:
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"
   - Save

2. **Repository permissions** are set correctly:
   - Settings → Actions → General
   - Workflow permissions: "Read and write permissions"
   - Allow GitHub Actions to create and approve pull requests: ✅

## 🔧 Workflow Details

The GitHub Actions workflow (`.github/workflows/pages.yml`) performs:

1. **Checkout** - Clones the repository
2. **Setup Ruby** - Installs Ruby 3.1 and Jekyll dependencies
3. **Setup Node.js** - Installs Node.js 20 and npm dependencies
4. **Install Dependencies** - Installs npm and Ruby gems
5. **Compile TypeScript** - Compiles TypeScript to JavaScript
6. **Build Jekyll** - Builds the static site
7. **Deploy** - Uploads to GitHub Pages

## 📝 Manual Deployment Steps

If you need to deploy manually:

```bash
# 1. Install dependencies
npm install
bundle install

# 2. Build TypeScript
npx tsc

# 3. Build Jekyll site
bundle exec jekyll build

# 4. The _site directory contains the built site
```

## 🔍 Troubleshooting

### Build Fails

1. Check the Actions tab for error messages
2. Verify TypeScript compiles: `npx tsc`
3. Verify Jekyll builds: `bundle exec jekyll build`
4. Check that all dependencies are in `package.json` and `Gemfile`

### Site Not Updating

1. Wait a few minutes for GitHub Pages to update (can take up to 10 minutes)
2. Clear your browser cache
3. Check the Actions tab to ensure deployment succeeded
4. Verify the deployment URL in the Actions output

### TypeScript Errors

- Ensure all TypeScript files compile: `npx tsc --noEmit`
- Check for type errors in the Actions log

### Jekyll Errors

- Verify `_config.yml` is valid
- Check that all required Jekyll plugins are in `Gemfile`
- Ensure all HTML files use the correct layout

## 📊 Deployment Status

After deployment, you can check:

- **Actions Tab** - See build and deployment status
- **Settings → Pages** - View deployment history
- **Site URL** - Usually: `https://shyamalchandra.github.io/MRFcompiler`

## 🎯 Best Practices

1. **Test locally** before pushing:
   ```bash
   npm run build
   bundle exec jekyll serve
   ```

2. **Commit changes** to trigger automatic deployment:
   ```bash
   git add .
   git commit -m "Update website"
   git push origin main
   ```

3. **Monitor deployments** in the Actions tab

4. **Use pull requests** to test changes before merging to main

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
