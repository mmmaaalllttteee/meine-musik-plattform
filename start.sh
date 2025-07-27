#!/bin/bash

# Startup-Script für die sichere Musik-Plattform
# Verwendung: ./start.sh

echo "🎵 Musik-Plattform wird gestartet..."
echo "================================"

# Prüfen ob Node.js installiert ist
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installieren Sie Node.js 16+"
    exit 1
fi

echo "✅ Node.js gefunden: $(node --version)"

# Prüfen ob .env existiert
if [ ! -f ".env" ]; then
    echo "❌ .env Datei fehlt! Kopieren Sie .env.example zu .env und tragen Sie Ihre API-Schlüssel ein."
    exit 1
fi

echo "✅ Umgebungsvariablen gefunden"

# Abhängigkeiten installieren (falls nötig)
if [ ! -d "node_modules" ]; then
    echo "📦 Installiere Dependencies..."
    npm install
fi

echo "✅ Dependencies installiert"

# Server starten
echo "🚀 Server wird gestartet..."
echo "📍 Frontend: http://localhost:3001"
echo "📍 API: http://localhost:3001/api/health"
echo "🔐 Sichere API-Schlüssel: Aktiviert"
echo ""
echo "Drücken Sie Ctrl+C zum Beenden"
echo "================================"

npm start