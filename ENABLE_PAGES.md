# 🔧 Enable GitHub Pages - Step by Step Guide

## The Error
```
Error: Get Pages site failed. Please verify that the repository has Pages enabled 
and configured to build using GitHub Actions
```

This means GitHub Pages needs to be enabled in your repository settings.

## ✅ Solution: Enable GitHub Pages

### Step 1: Go to Repository Settings
1. Open your repository on GitHub: `https://github.com/Sapana-Micro-Software/MRFcompiler`
2. Click on the **Settings** tab (top menu)
3. Scroll down to **Pages** in the left sidebar

### Step 2: Configure GitHub Pages
1. Under **"Source"**, you'll see options:
   - ❌ Deploy from a branch
   - ✅ **Deploy from a branch** (select this)
   - OR
   - ✅ **GitHub Actions** (preferred - select this if available)

2. **If "GitHub Actions" option is available:**
   - Select **"GitHub Actions"** as the source
   - Click **Save**

3. **If only "Deploy from a branch" is available:**
   - Select **"Deploy from a branch"**
   - Branch: Select **`main`** or **`master`**
   - Folder: Select **`/ (root)`**
   - Click **Save**
   - Then go back and change it to **"GitHub Actions"** if that option appears

### Step 3: Verify Permissions
1. Still in **Settings**
2. Go to **Actions** → **General** (in left sidebar)
3. Scroll to **"Workflow permissions"**
4. Select: **"Read and write permissions"**
5. Check: ✅ **"Allow GitHub Actions to create and approve pull requests"**
6. Click **Save**

### Step 4: Re-run the Workflow
1. Go to the **Actions** tab
2. Find the failed workflow run
3. Click **"Re-run all jobs"** or **"Re-run failed jobs"**

## 🎯 Alternative: Update Workflow (Already Done)

I've updated the workflow to automatically enable Pages if needed. The workflow now includes:
```yaml
- name: Setup Pages
  uses: actions/configure-pages@v4
  with:
    enablement: true
```

This should help, but you still need to:
1. Enable Pages in Settings (Step 1-2 above)
2. Set permissions (Step 3 above)

## 📝 Quick Checklist

- [ ] Repository Settings → Pages → Source = "GitHub Actions" (or "Deploy from a branch")
- [ ] Settings → Actions → General → Workflow permissions = "Read and write"
- [ ] Re-run the failed workflow
- [ ] Wait 2-3 minutes for deployment

## 🔍 After Enabling

Once enabled, your site will be available at:
```
https://sapana-micro-software.github.io/MRFcompiler
```
or
```
https://shyamalchandra.github.io/MRFcompiler
```

(depending on your GitHub username/organization)

## ❓ Still Having Issues?

If the "GitHub Actions" option doesn't appear:
1. Make sure you're using a public repository, OR
2. You have GitHub Pro/Team/Enterprise (for private repos)
3. Try the "Deploy from a branch" option first, then switch to GitHub Actions

Let me know once you've enabled it and I can help verify the deployment!
