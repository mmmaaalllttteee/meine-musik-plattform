// server.js - Beispiel für sicheres Backend
// Dieses Backend fungiert als Proxy für API-Aufrufe und hält die Schlüssel geheim

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API-Schlüssel aus Umgebungsvariabeln laden (nie im Code hardcodieren!)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const FIREBASE_CONFIG = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    // ... weitere Konfiguration
};

// Proxy-Endpoint für Gemini API
app.post('/api/gemini/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Nachricht ist erforderlich' });
        }

        const prompt = `Du bist ein Experte für das Musikbusiness und agierst als hilfsbereiter Assistent. Deine Aufgabe ist es, Fragen rund um Musikveröffentlichungen, Kampagnenkonzepte, Marketingstrategien und allgemeine Branchenkenntnisse zu beantworten. Gib klare, strukturierte und umsetzbare Ratschläge. Antworte auf Deutsch. Frage des Nutzers: "${message}"`;
        
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const result = await response.json();
        const botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Entschuldigung, ich konnte keine Antwort generieren.";
        
        res.json({ response: botResponse });

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// Endpoint für Firebase-Konfiguration (ohne API-Schlüssel!)
app.get('/api/config/firebase', (req, res) => {
    // Nur öffentliche Konfigurationswerte senden
    res.json({
        authDomain: FIREBASE_CONFIG.authDomain,
        projectId: FIREBASE_CONFIG.projectId,
        // API-Schlüssel NICHT senden!
    });
});

// Gesundheitscheck
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
    console.log(`Gesundheitscheck: http://localhost:${PORT}/health`);
});

module.exports = app;