const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Security & Performance Middleware
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
            frameSrc: ["'none'"],
        },
    },
}));

app.use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID']
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Musik-Plattform Backend',
        version: '1.0.0'
    });
});

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

// Mock API Endpoints
app.get('/api/analytics/dashboard', (req, res) => {
    res.json({
        keyKpis: [
            { platform: 'Instagram', kpi: 'Follower insgesamt', value: '48.152', change: 1.2 },
            { platform: 'Spotify', kpi: 'Monatliche Hörer', value: '1.2M', change: 5.3 },
            { platform: 'Google Analytics 4', kpi: 'Nutzer (letzte 7 Tage)', value: '12.830', change: -2.1 }
        ],
        activities: [
            { id: 'act_1', type: 'task_completed', text: 'Pressemitteilung fertiggestellt', project: 'Album Release', time: 'vor 2 Stunden' }
        ],
        learningProgress: { pathTitle: 'Onboarding für neue Künstler:innen', progress: 75 }
    });
});

app.get('/api/projects', (req, res) => {
    res.json([
        { 
            id: 'proj_1', 
            name: 'Album Release "Neon Dreams"', 
            files: [], 
            moodboards: [{ id: 'mood_1', title: 'Cover Artwork & Visuals', items: [] }], 
            taskboards: [{ 
                id: 'task_1', 
                title: 'Marketing & PR Plan', 
                sections: [
                    { id: 'sec_1', title: 'To Do', tasks: [] },
                    { id: 'sec_2', title: 'In Progress', tasks: [] },
                    { id: 'sec_3', title: 'Done', tasks: [] }
                ] 
            }] 
        }
    ]);
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Musik-Plattform Backend started successfully!`);
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`⚕️ Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔥 Firebase Config: http://localhost:${PORT}/api/config/firebase`);
    console.log(`🎵 Ready to serve your music platform!`);
});

module.exports = app;