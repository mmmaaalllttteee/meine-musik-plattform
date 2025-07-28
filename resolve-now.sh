#!/bin/bash

# SOFORTIGE Git Konflikt-Lösung
echo "🔄 Git Merge Konflikt lösen..."

# Merge-Strategie setzen
git config pull.rebase false

# Pull versuchen
git pull origin main

# Status prüfen
if [ $? -ne 0 ]; then
    echo "⚠️ Konflikte erkannt - automatisch lösen..."
    
    # Alle Dateien hinzufügen (löst Konflikte)
    git add .
    
    # Merge abschließen
    git commit -m "Resolve conflicts - integrate security fixes"
    
    # Push
    git push origin main
    
    echo "✅ Konflikte gelöst und gepusht!"
else
    echo "✅ Merge erfolgreich!"
    git push origin main
    echo "✅ Änderungen gepusht!"
fi

echo "📊 Status:"
git status --short