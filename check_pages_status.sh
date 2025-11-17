#!/bin/bash
# Check GitHub Pages status
# This script helps verify if GitHub Pages is enabled

echo "🔍 Checking GitHub Pages Status..."
echo ""

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found"
    echo ""
    echo "Checking Pages status..."
    gh api repos/Sapana-Micro-Software/MRFcompiler/pages 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ GitHub Pages appears to be configured!"
    else
        echo ""
        echo "❌ GitHub Pages is not enabled or not accessible"
        echo ""
        echo "To enable it manually:"
        echo "1. Go to: https://github.com/Sapana-Micro-Software/MRFcompiler/settings/pages"
        echo "2. Select 'GitHub Actions' as source"
        echo "3. Click Save"
    fi
else
    echo "ℹ️  GitHub CLI not found"
    echo ""
    echo "To enable GitHub Pages manually:"
    echo "1. Visit: https://github.com/Sapana-Micro-Software/MRFcompiler/settings/pages"
    echo "2. Under 'Source', select 'GitHub Actions'"
    echo "3. Click 'Save'"
    echo ""
    echo "Or install GitHub CLI: brew install gh"
fi
