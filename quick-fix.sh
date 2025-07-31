#!/bin/bash

echo "🚨 SOFORTIGER PROBLEMFIX & START"
echo "================================="

cd /workspaces/meine-musik-plattform

# Bereinige .env von problematischen Kommentaren
echo "🔧 Bereinige .env Datei..."
sed -i 's/# 15 Minuten//g' .env 2>/dev/null
sed -i 's/# Max 100 Anfragen pro IP//g' .env 2>/dev/null  
sed -i 's/# 30 Sekunden Timeout//g' .env 2>/dev/null

# Entferne alle Zeilen mit inline Kommentaren nach Werten
sed -i 's/^\([^#]*\)#.*$/\1/' .env 2>/dev/null

# Entferne Leerzeilen am Ende
sed -i '/^$/d' .env 2>/dev/null

echo "✅ .env bereinigt"

# Prüfe kritische Dateien
echo ""
echo "📋 Prüfe Dateien..."

if [ ! -f "package.json" ]; then
    echo "🔧 Erstelle package.json..."
    cat > package.json << 'EOF'
{
  "name": "meine-musik-plattform",
  "version": "1.0.0",
  "description": "Musik-Business-Plattform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^6.7.0",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF
fi

if [ ! -f "index.html" ]; then
    echo "🔧 Erstelle minimale index.html..."
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Musik-Plattform</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">🎵 Musik-Plattform</h1>
            <p class="text-lg text-gray-300">Backend läuft erfolgreich!</p>
            <div class="mt-4">
                <a href="/api/health" class="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">API Health Check</a>
            </div>
        </div>
    </div>
</body>
</html>
EOF
fi

# Stoppe bestehende Prozesse
echo ""
echo "🛑 Stoppe bestehende Prozesse..."
pkill -f "node.*server" 2>/dev/null || true
sleep 2

# Installiere Dependencies
echo ""
echo "📦 Installiere Dependencies..."
rm -rf node_modules package-lock.json 2>/dev/null
npm install --no-optional

if [ $? -ne 0 ]; then
    echo "⚠️ Normale Installation fehlgeschlagen, versuche Legacy-Modus..."
    npm install --legacy-peer-deps --no-optional
fi

# Erstelle notwendige Verzeichnisse
mkdir -p uploads templates logs public/assets 2>/dev/null

# Test ob Server startbar ist
echo ""
echo "🧪 Teste Server-Fähigkeit..."

timeout 10s node -e "
require('dotenv').config();
const express = require('express');
const app = express();
app.get('/test', (req, res) => res.json({status: 'OK'}));
const server = app.listen(3001, () => {
    console.log('✅ Server-Test erfolgreich');
    server.close();
    process.exit(0);
});
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Server-Test bestanden"
else
    echo "⚠️ Server-Test fehlgeschlagen, aber trotzdem versuchen..."
fi

echo ""
echo "🎯 ALLES BEREIT - STARTE MUSIK-PLATTFORM!"
echo "=========================================="
echo ""
echo "🚀 Startet auf: http://localhost:3001"
echo "⚕️ Health Check: http://localhost:3001/api/health"
echo "🔥 Firebase Config: http://localhost:3001/api/config/firebase"
echo ""
echo "💡 Zum Beenden: Ctrl+C"
echo ""

# Starte Server
node server.js