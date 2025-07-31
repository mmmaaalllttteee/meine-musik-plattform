#!/bin/bash

echo "🔧 Stelle ursprüngliche Dateien wieder her und führe Reparatur aus..."

cd /workspaces/meine-musik-plattform

# Stelle package.json wieder her
if [ -f "package-final.json" ]; then
    cp package-final.json package.json
    echo "✅ package.json wiederhergestellt"
fi

# Stelle server.js sicher
if [ ! -f "server.js" ]; then
    echo "❌ server.js fehlt - erstelle neue Version"
    cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://unpkg.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https:", "http:"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"]
        }
    }
}));

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Musik-Plattform Backend is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/config/firebase', (req, res) => {
    res.json({
        apiKey: "demo-api-key",
        authDomain: "meine-musikplattform.firebaseapp.com",
        projectId: "meine-musikplattform"
    });
});

// Serve main app
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
EOF
    echo "✅ server.js erstellt"
fi

# Verwende die reparierte index-final.html als index.html
if [ -f "index-final.html" ]; then
    cp index-final.html index.html
    echo "✅ index.html mit reparierter Version ersetzt"
else
    echo "❌ index-final.html nicht gefunden!"
    exit 1
fi

echo ""
echo "📦 Installiere Dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies erfolgreich installiert!"
    echo ""
    echo "🚀 Starte Server..."
    echo "📍 Frontend: http://localhost:3001"
    echo "⚕️ Health: http://localhost:3001/api/health"
    echo ""
    echo "💡 Öffne http://localhost:3001 im Browser!"
    echo "🛑 Zum Beenden: Ctrl+C"
    
    npm start
else
    echo "❌ Fehler bei der Installation"
    echo "🎭 Verwende Demo-Modus: Öffne index.html direkt im Browser"
fi