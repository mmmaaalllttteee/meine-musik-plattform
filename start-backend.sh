#!/bin/bash

# Backend-Starter für Musik-Plattform
echo "🚀 Starte Musik-Plattform Backend..."

# Prüfe ob Node.js installiert ist
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert!"
    echo "📝 Installiere Node.js von https://nodejs.org/"
    exit 1
fi

# Prüfe ob server.js existiert
if [ ! -f "server.js" ]; then
    echo "⚠️ server.js nicht gefunden - erstelle minimal Server..."
    
    cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend läuft', timestamp: new Date() });
});

// Firebase Config API
app.get('/api/config/firebase', (req, res) => {
    res.json({
        apiKey: "AIzaSyDdgu05VJewoLG9-Ad1jdU8ogee2C4_tKs",
        authDomain: "meine-musikplattform.firebaseapp.com",
        projectId: "meine-musikplattform",
        storageBucket: "meine-musikplattform.appspot.com",
        messagingSenderId: "997469107237",
        appId: "1:997469107237:web:109d6cfa8829f01e547bcc",
        measurementId: "G-7M62EV7KQH"
    });
});

// Serve index.html für alle anderen Routen
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎵 Musik-Plattform Backend läuft auf Port ${PORT}`);
    console.log(`🌐 Frontend verfügbar unter: http://localhost:${PORT}`);
});
EOF
    
    echo "✅ Minimal server.js erstellt"
fi

# Prüfe ob package.json existiert
if [ ! -f "package.json" ]; then
    echo "⚠️ package.json nicht gefunden - erstelle..."
    
    npm init -y
    npm install express cors
    
    echo "✅ Dependencies installiert"
fi

# Starte den Server
echo "🔄 Starte Backend-Server..."
node server.js &

# Speichere PID für später
SERVER_PID=$!
echo $SERVER_PID > .server.pid

echo "✅ Backend gestartet (PID: $SERVER_PID)"
echo "🌐 Öffne http://localhost:3001 im Browser"

# Warte auf Beenden
echo "📝 Drücke Ctrl+C zum Beenden..."
wait $SERVER_PID