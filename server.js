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
    res.json({ 
        status: 'OK', 
        message: 'Musik-Plattform Backend läuft', 
        timestamp: new Date(),
        version: '1.0.0'
    });
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

// API für Projekte
app.get('/api/projects', (req, res) => {
    // Demo-Projekte zurückgeben
    res.json([
        {
            id: 'proj_demo_1',
            name: 'Demo Album Release',
            status: 'active',
            created: new Date().toISOString()
        }
    ]);
});

// Serve index.html für alle anderen Routen
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Server starten
app.listen(PORT, () => {
    console.log(`🎵 Musik-Plattform Backend läuft auf Port ${PORT}`);
    console.log(`🌐 Frontend verfügbar unter: http://localhost:${PORT}`);
    console.log(`💡 Demo-Modus: Öffne http://localhost:${PORT} im Browser`);
    console.log(`🔧 Health Check: http://localhost:${PORT}/api/health`);
});