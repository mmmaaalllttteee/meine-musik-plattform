#!/bin/bash

cd /workspaces/meine-musik-plattform

echo "🚀 Starte Musik-Plattform..."
echo "📦 Installiere Dependencies..."

# Dependencies installieren
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies erfolgreich installiert!"
    echo ""
    echo "🎵 Starte Backend-Server..."
    
    # Server starten
    npm start
    
else
    echo "❌ Fehler bei der Installation"
    echo "💡 Versuche alternative Installation..."
    
    # Fallback: Direkt starten falls bereits installiert
    npm start
fi