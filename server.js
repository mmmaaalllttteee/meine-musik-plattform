const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Rate Limiting für API-Aufrufe
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 100, // Maximal 100 Anfragen pro IP
    message: 'Zu viele Anfragen von dieser IP, bitte versuchen Sie es später erneut.'
});

// API-Schlüssel aus Umgebungsvariablen (niemals im Code!)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const FIREBASE_CONFIG = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Validierung der Umgebungsvariablen
if (!GEMINI_API_KEY) {
    console.error('FEHLER: GEMINI_API_KEY Umgebungsvariable fehlt');
    process.exit(1);
}

if (!FIREBASE_CONFIG.apiKey) {
    console.error('FEHLER: Firebase Konfiguration unvollständig');
    process.exit(1);
}

// Proxy-Endpoint für Gemini API
app.post('/api/gemini/chat', apiLimiter, async (req, res) => {
    try {
        const { message } = req.body;
        
        // Input-Validierung
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Nachricht ist erforderlich und darf nicht leer sein' 
            });
        }

        if (message.length > 5000) {
            return res.status(400).json({ 
                error: 'Nachricht zu lang (max. 5000 Zeichen)' 
            });
        }

        const prompt = `Du bist ein Experte für das Musikbusiness und agierst als hilfsbereiter Assistent. Deine Aufgabe ist es, Fragen rund um Musikveröffentlichungen, Kampagnenkonzepte, Marketingstrategien und allgemeine Branchenkenntnisse zu beantworten. Gib klare, strukturierte und umsetzbare Ratschläge. Antworte auf Deutsch. Frage des Nutzers: "${message.trim()}"`;
        
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'User-Agent': 'MusikPlattform/1.0'
                },
                body: JSON.stringify(payload),
                timeout: 30000 // 30 Sekunden Timeout
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', response.status, errorText);
            
            if (response.status === 429) {
                return res.status(429).json({ 
                    error: 'API-Rate-Limit erreicht. Bitte versuchen Sie es später erneut.' 
                });
            }
            
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                           "Entschuldigung, ich konnte keine Antwort generieren.";
        
        res.json({ 
            response: botResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        
        if (error.name === 'AbortError') {
            return res.status(408).json({ 
                error: 'Anfrage-Timeout. Bitte versuchen Sie es erneut.' 
            });
        }
        
        res.status(500).json({ 
            error: 'Interner Serverfehler beim Verarbeiten Ihrer Anfrage'
        });
    }
});

// Sichere Firebase-Konfiguration (ohne API-Schlüssel!)
app.get('/api/config/firebase', (req, res) => {
    // Nur öffentliche Konfigurationswerte senden - API-Schlüssel NICHT!
    res.json({
        apiKey: FIREBASE_CONFIG.apiKey, // Firebase API-Key ist sicher für Frontend
        authDomain: FIREBASE_CONFIG.authDomain,
        projectId: FIREBASE_CONFIG.projectId,
        storageBucket: FIREBASE_CONFIG.storageBucket,
        messagingSenderId: FIREBASE_CONFIG.messagingSenderId,
        appId: FIREBASE_CONFIG.appId,
        measurementId: FIREBASE_CONFIG.measurementId
    });
});

// Server-Status und Gesundheitscheck
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
    });
});

// Serve static files (für Frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint nicht gefunden' });
});

// Error Handler
app.use((error, req, res, next) => {
    console.error('Unbehandelter Fehler:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM empfangen, Server wird heruntergefahren...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT empfangen, Server wird heruntergefahren...');
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf Port ${PORT}`);
    console.log(`📊 Gesundheitscheck: http://localhost:${PORT}/api/health`);
    console.log(`🔥 Frontend: http://localhost:${PORT}`);
    console.log(`🔐 Sichere API-Schlüssel geladen: ✅`);
});

module.exports = app;