#!/bin/bash

# Backend-Starter für Musik-Plattform
echo "🚀 Starte Musik-Plattform Backend und Frontend..."

# Prüfe ob wir im richtigen Verzeichnis sind
if [ ! -f "package.json" ]; then
    echo "❌ package.json nicht gefunden!"
    echo "📁 Wechsle in das richtige Verzeichnis..."
    cd /workspaces/meine-musik-plattform || exit 1
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

# Backend im Hintergrund starten
npm start &
SERVER_PID=$!

echo "⏱️ Warte auf Server-Start..."
sleep 3

# Prüfe ob Server läuft
echo "🔍 Prüfe Server-Status..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend-Server läuft erfolgreich!"
    echo ""
    echo "🎵 Musik-Plattform ist jetzt verfügbar unter:"
    echo "   🌐 Frontend: http://localhost:3001"
    echo "   ⚕️ Health Check: http://localhost:3001/api/health"
    echo "   🔥 Firebase Config: http://localhost:3001/api/config/firebase"
    echo ""
    echo "✅ Alle Features sind aktiv:"
    echo "  🔒 Multi-Character-Sanitization"
    echo "  🔒 Sichere URL-Validierung"
    echo "  🔒 Input-Validation & XSS-Protection"
    echo "  🔒 CORS & Security Headers"
    echo "  📱 Responsive Design"
    echo "  🔐 Firebase Authentication"
    echo ""
    echo "💡 Öffne http://localhost:3001 in deinem Browser!"
    echo "🛑 Zum Beenden: Ctrl+C drücken"
    
    # Warte auf Benutzer-Eingabe zum Beenden
    wait $SERVER_PID
else
    echo "⚠️ Server startet noch oder ist nicht erreichbar"
    echo "🎭 Du kannst trotzdem die Demo-Version nutzen:"
    echo "   Öffne index.html direkt im Browser"
    echo "   Klicke auf '🎭 Im Demo-Modus fortfahren'"
    
    # Versuche weiter zu warten
    echo "⏱️ Warte weitere 5 Sekunden..."
    sleep 5
    
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "✅ Server ist jetzt bereit!"
        echo "🌐 Öffne http://localhost:3001"
        wait $SERVER_PID
    else
        echo "❌ Server konnte nicht gestartet werden"
        echo "📱 Nutze die Demo-Version: index.html öffnen"
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi
fi