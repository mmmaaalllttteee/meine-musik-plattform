#!/bin/bash

# Wechsle ins Projekt-Verzeichnis
cd /workspaces/meine-musik-plattform

echo "🚀 Führe 'npm install && npm start' aus..."
echo "📍 Verzeichnis: $(pwd)"
echo ""

# Prüfe ob package.json existiert
if [ -f "package.json" ]; then
    echo "✅ package.json gefunden"
    
    # Installiere Dependencies
    echo "📦 Installiere npm Dependencies..."
    npm install
    
    # Prüfe Installation
    if [ $? -eq 0 ]; then
        echo "✅ npm install erfolgreich abgeschlossen!"
        echo ""
        echo "🎵 Starte Express Server..."
        echo "⚡ Server wird auf Port 3001 gestartet..."
        
        # Starte Server
        npm start
        
    else
        echo "❌ npm install fehlgeschlagen"
        echo "🔄 Versuche Server trotzdem zu starten..."
        npm start
    fi
    
else
    echo "❌ package.json nicht gefunden!"
    echo "📁 Verfügbare Dateien:"
    ls -la
    exit 1
fi