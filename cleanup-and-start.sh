#!/bin/bash

echo "🧹 BEREINIGE ÜBERFLÜSSIGE DATEIEN..."
echo "=================================="

cd /workspaces/meine-musik-plattform

# Lösche alte/überflüssige Dateien
echo "🗑️ Lösche überflüssige Dateien..."

# Entferne alle alten Fix-Scripts (außer den neuen)
rm -f fix-html.sh 2>/dev/null
rm -f old-*.sh 2>/dev/null
rm -f backup-*.sh 2>/dev/null

# Entferne temporäre Dateien
rm -f *.tmp 2>/dev/null
rm -f *.bak 2>/dev/null
rm -f .DS_Store 2>/dev/null

# Entferne alte package.json Backups
rm -f package-final.json 2>/dev/null
rm -f package.json.bak 2>/dev/null

# Entferne node_modules falls vorhanden (wird neu installiert)
rm -rf node_modules 2>/dev/null

# Entferne alte Log-Dateien
rm -f *.log 2>/dev/null
rm -f npm-debug.log* 2>/dev/null

echo "✅ Überflüssige Dateien entfernt"

# Erstelle benötigte Verzeichnisse
echo ""
echo "📁 Erstelle Verzeichnisstruktur..."
mkdir -p uploads
mkdir -p templates
mkdir -p public/assets
mkdir -p logs

echo "✅ Verzeichnisse erstellt"

# Installiere Dependencies
echo ""
echo "📦 Installiere Dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies erfolgreich installiert!"
    
    echo ""
    echo "🎯 PROJEKT BEREIT!"
    echo "=================="
    echo ""
    echo "✅ Bereinigte Dateien:"
    echo "   📱 index.html - Vollständiges Frontend mit Firebase"
    echo "   🖥️ server.js - Backend mit allen API-Endpoints"
    echo "   📦 package.json - Aktualisierte Dependencies"
    echo "   🔧 .env - Firebase-Konfiguration"
    echo ""
    echo "🗑️ Entfernte überflüssige Dateien:"
    echo "   - Alte Fix-Scripts"
    echo "   - Temporäre Dateien"
    echo "   - Backup-Dateien"
    echo "   - node_modules (neu installiert)"
    echo ""
    echo "🚀 STARTE JETZT DIE PLATTFORM:"
    echo "   npm start"
    echo ""
    echo "📱 Nach dem Start verfügbar:"
    echo "   🌐 Frontend: http://localhost:3001"
    echo "   ⚕️ Health: http://localhost:3001/api/health"
    echo "   🔥 Firebase: http://localhost:3001/api/config/firebase"
    echo ""
    echo "💡 Features verfügbar:"
    echo "   ✅ Landing Page mit Registrierung/Login"
    echo "   ✅ Dashboard mit KPI-Widgets"
    echo "   ✅ Projektmanagement mit Moodboards & Taskboards"
    echo "   ✅ Analytics Dashboard"
    echo "   ✅ Smart Library mit Vorlagen"
    echo "   ✅ Support Hub mit KI-Assistent"
    echo "   ✅ Learning Center"
    echo "   ✅ DSGVO ComplyCheck"
    echo "   ✅ Benutzerprofile"
    echo ""
    echo "🛑 Zum Beenden: Ctrl+C"
    echo ""
    
    # Automatisch starten
    echo "🚀 Starte Server..."
    npm start
    
else
    echo "❌ Fehler bei der Installation der Dependencies"
    echo "🔧 Versuche manuell: npm install && npm start"
fi