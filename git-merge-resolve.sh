#!/bin/bash

# Git Merge Resolution Script
# Löst den divergent branches Konflikt

echo "🔄 Resolving Git divergent branches..."

# Option 1: Merge (empfohlen für kollaborative Projekte)
echo "📝 Configuring git to use merge strategy..."
git config pull.rebase false

echo "🔄 Pulling with merge strategy..."
git pull origin main

# Falls Merge-Konflikte auftreten, zeige Status
if [ $? -ne 0 ]; then
    echo "❌ Merge conflicts detected. Checking status..."
    git status
    echo ""
    echo "🔧 To resolve manually:"
    echo "1. Edit conflicted files shown above"
    echo "2. Run: git add ."
    echo "3. Run: git commit -m 'Resolve merge conflicts'"
    echo "4. Run: git push origin main"
else
    echo "✅ Merge successful!"
    
    # Push die merged changes
    echo "📤 Pushing merged changes..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ All changes successfully pushed to remote!"
    else
        echo "❌ Push failed. Manual intervention required."
    fi
fi

echo ""
echo "📊 Current repository status:"
git status --short
echo ""
echo "📈 Recent commits:"
git log --oneline -5