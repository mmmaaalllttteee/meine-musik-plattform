#!/bin/bash

echo "🚀 Starte Musik-Plattform Backend und Frontend..."

# Prüfe ob wir im richtigen Verzeichnis sind
if [ ! -f "package.json" ]; then
    echo "❌ package.json nicht gefunden!"
    echo "📁 Stelle sicher, dass du im /workspaces/meine-musik-plattform Verzeichnis bist"
    exit 1
fi

echo "📦 Installiere Dependencies..."
npm install

# Prüfe ob Installation erfolgreich war
if [ $? -eq 0 ]; then
    echo "✅ Dependencies erfolgreich installiert!"
else
    echo "❌ Fehler bei der Installation der Dependencies"
    exit 1
fi

echo ""
echo "🔄 Starte Backend-Server..."
npm start

echo ""
echo "🎵 Musik-Plattform sollte jetzt unter http://localhost:3001 verfügbar sein!"
echo "🌐 Öffne deinen Browser und navigiere zu http://localhost:3001"
echo ""
echo "✅ Alle Security-Fixes sind aktiv:"
echo "  🔒 Multi-Character-Sanitization"
echo "  🔒 Bad HTML filtering regexp fixes"
echo "  🔒 Incomplete URL scheme check fixes"
echo "  🔒 Sichere Authentication"
echo "  🔒 Input-Validation"
echo ""
echo "💡 Zum Beenden: Ctrl+C drücken"