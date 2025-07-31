require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Basis-Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Vereinfacht für bessere Kompatibilität
    crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Musik-Plattform läuft erfolgreich!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/config/firebase', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY || "demo-key",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
        projectId: process.env.FIREBASE_PROJECT_ID || "demo-project",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "demo-bucket",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
        appId: process.env.FIREBASE_APP_ID || "demo-app-id"
    });
});

app.get('/api/analytics', (req, res) => {
    res.json({
        success: true,
        data: {
            keyKpis: [
                { platform: 'Instagram', kpi: 'Follower', value: '48.152', change: 1.2 },
                { platform: 'Spotify', kpi: 'Hörer', value: '1.2M', change: 5.3 },
                { platform: 'YouTube', kpi: 'Views', value: '500K', change: -1.1 }
            ]
        }
    });
});

app.get('/api/projects', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 'proj_1',
                name: 'Album Release "Neon Dreams"',
                status: 'active',
                created: new Date().toISOString()
            }
        ]
    });
});

app.get('/api/library', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                title: "Bandvertrag Vorlage",
                category: "Verträge",
                description: "Standard Bandvertrag"
            }
        ]
    });
});

// Catch all für SPA
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
});

// Server starten
app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    console.log(`🎵 Musik-Plattform bereit!`);
    console.log(`⚕️ Health: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;