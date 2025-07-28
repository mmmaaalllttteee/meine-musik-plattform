#!/bin/bash

echo "🚀 Starte die Musik-Plattform mit npm install && npm start"
echo "================================================="

# Navigiere zum Projekt-Verzeichnis
cd /workspaces/meine-musik-plattform

# Mache Scripts ausführbar
chmod +x *.sh

echo "📍 Aktuelles Verzeichnis: $(pwd)"
echo "📋 Verfügbare Dateien:"
ls -la

echo ""
echo "📦 Führe npm install aus..."
npm install

echo ""
echo "🎵 Führe npm start aus..."
npm start