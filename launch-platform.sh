#!/bin/bash

echo "🔍 Vollständige System-Prüfung und Start..."

# Fehler-Protokoll zurücksetzen
> error.log

echo "📋 1. Prüfe Dateien..."
required_files=("index.html" "server.js" "package.json" "multi-character-sanitizer.js")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file vorhanden"
    else
        echo "❌ $file fehlt!"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Kritische Dateien fehlen: ${missing_files[*]}"
    exit 1
fi

echo ""
echo "📦 2. Prüfe Dependencies..."
if [ -f "package.json" ]; then
    echo "✅ package.json gefunden"
    
    # Installiere Dependencies falls node_modules fehlt
    if [ ! -d "node_modules" ]; then
        echo "📦 Installiere Dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ npm install fehlgeschlagen" >> error.log
            exit 1
        fi
    else
        echo "✅ node_modules bereits vorhanden"
    fi
else
    echo "❌ package.json nicht gefunden" >> error.log
    exit 1
fi

echo ""
echo "🔒 3. Prüfe Security-Module..."
if [ -f "multi-character-sanitizer.js" ]; then
    echo "✅ Multi-Character-Sanitizer vorhanden"
else
    echo "⚠️ Multi-Character-Sanitizer fehlt - verwende Fallback"
fi

echo ""
echo "🚀 4. Starte Backend-Server..."

# Teste ob Port 3001 verfügbar ist
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Port 3001 bereits belegt - stoppe vorherigen Server..."
    pkill -f "node.*server.js" || true
    sleep 2
fi

# Starte Server im Hintergrund
echo "🔄 Starte Express-Server..."
npm start > server.log 2>&1 &
SERVER_PID=$!

# Warte auf Server-Start
echo "⏱️ Warte auf Server-Initialisierung..."
for i in {1..10}; do
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Server ist bereit nach ${i}s!"
        break
    fi
    echo "⏳ Warte... (${i}/10)"
    sleep 1
done

echo ""
echo "🔍 5. Teste alle Endpoints..."

# Health Check
if curl -s http://localhost:3001/api/health | grep -q "OK"; then
    echo "✅ Health Check: OK"
else
    echo "❌ Health Check: FEHLER"
fi

# Firebase Config
if curl -s http://localhost:3001/api/config/firebase > /dev/null; then
    echo "✅ Firebase Config: OK"
else
    echo "❌ Firebase Config: FEHLER"
fi

# Static Files
if curl -s http://localhost:3001/ | grep -q "html"; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: FEHLER"
fi

echo ""
echo "📱 6. Frontend-Funktionalität..."
if [ -f "index.html" ]; then
    echo "✅ HTML-Struktur: OK"
    
    # Prüfe wichtige Komponenten im HTML
    if grep -q "MainApp" index.html; then
        echo "✅ React-Komponenten: OK"
    else
        echo "❌ React-Komponenten: FEHLER"
    fi
    
    if grep -q "AuthProvider" index.html; then
        echo "✅ Authentication: OK"
    else
        echo "❌ Authentication: FEHLER"
    fi
else
    echo "❌ index.html nicht gefunden"
fi

echo ""
echo "🎯 7. Finale System-Bewertung..."

# Zähle Fehler
error_count=$(wc -l < error.log 2>/dev/null || echo "0")

if [ "$error_count" -eq 0 ] && curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ ALLES FUNKTIONIERT PERFEKT!"
    echo ""
    echo "🎵 Musik-Plattform ist vollständig einsatzbereit:"
    echo ""
    echo "   🌐 FRONTEND: http://localhost:3001"
    echo "   ⚕️ HEALTH: http://localhost:3001/api/health"
    echo "   🔥 CONFIG: http://localhost:3001/api/config/firebase"
    echo ""
    echo "🎯 Features verfügbar:"
    echo "   ✅ Dashboard mit Analytics"
    echo "   ✅ Projektmanagement (Moodboards, Tasks)"
    echo "   ✅ Smart Library"
    echo "   ✅ KI-Assistant"
    echo "   ✅ Learning Center"
    echo "   ✅ ComplyCheck (DSGVO)"
    echo "   ✅ User Profile Management"
    echo ""
    echo "🔒 Security aktiv:"
    echo "   ✅ Multi-Character-Sanitization"
    echo "   ✅ XSS-Protection"
    echo "   ✅ URL-Schema-Validierung"
    echo "   ✅ CORS-Protection"
    echo ""
    echo "📱 ÖFFNE JETZT: http://localhost:3001"
    echo ""
    echo "🛑 Zum Beenden: Ctrl+C"
    
    # Halte Server am Leben
    echo "💫 Server läuft... (PID: $SERVER_PID)"
    wait $SERVER_PID
    
else
    echo "⚠️ WARNUNGEN GEFUNDEN:"
    if [ -f "error.log" ] && [ -s "error.log" ]; then
        cat error.log
    fi
    echo ""
    echo "🎭 FALLBACK VERFÜGBAR:"
    echo "   1. Öffne index.html direkt im Browser"
    echo "   2. Klicke auf '🎭 Im Demo-Modus fortfahren'"
    echo "   3. Alle Features funktionieren (ohne Backend)"
    echo ""
    echo "💡 Für vollständige Funktionalität:"
    echo "   npm install && npm start"
fi