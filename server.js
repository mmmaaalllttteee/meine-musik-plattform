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
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 
                "https://cdn.tailwindcss.com", 
                "https://unpkg.com",
                "https://www.gstatic.com",
                "https://generativelanguage.googleapis.com"
            ],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
            connectSrc: ["'self'", "https:", "http:", 
                "https://generativelanguage.googleapis.com",
                "https://www.gstatic.com",
                "https://identitytoolkit.googleapis.com",
                "https://securetoken.googleapis.com"
            ],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "blob:", "data:"],
            frameSrc: ["'self'"],
            workerSrc: ["'self'", "blob:"],
            manifestSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.API_RATE_LIMIT_MAX) || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Musik-Plattform Backend is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
    });
});

app.get('/api/config/firebase', (req, res) => {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDdgu05VJewoLG9-Ad1jdU8ogee2C4_tKs",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "meine-musikplattform.firebaseapp.com",
        projectId: process.env.FIREBASE_PROJECT_ID || "meine-musikplattform",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "meine-musikplattform.appspot.com",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "997469107237",
        appId: process.env.FIREBASE_APP_ID || "1:997469107237:web:109d6cfa8829f01e547bcc",
        measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-7M62EV7KQH"
    };
    res.json(firebaseConfig);
});

// Projects API
app.get('/api/projects', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 'proj_1',
                name: 'Album Release "Neon Dreams"',
                status: 'active',
                created: new Date().toISOString(),
                files: [],
                moodboards: [{
                    id: 'mood_1',
                    title: 'Cover Artwork & Visuals',
                    items: []
                }],
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
        ]
    });
});

app.post('/api/projects', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }
    
    const newProject = {
        id: `proj_${Date.now()}`,
        name,
        status: 'active',
        created: new Date().toISOString(),
        files: [],
        moodboards: [{
            id: `mood_${Date.now()}`,
            title: 'Neues Moodboard',
            items: []
        }],
        taskboards: [{
            id: `task_${Date.now()}`,
            title: 'Neues Taskboard',
            sections: [
                { id: 'sec_1', title: 'To Do', tasks: [] },
                { id: 'sec_2', title: 'In Progress', tasks: [] },
                { id: 'sec_3', title: 'Done', tasks: [] }
            ]
        }]
    };
    
    res.json({ success: true, data: newProject });
});

// Analytics API
app.get('/api/analytics', (req, res) => {
    res.json({
        success: true,
        data: {
            totalStreams: 125000,
            monthlyListeners: 15600,
            topTrack: "Neon Dreams",
            platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
            keyKpis: [
                { platform: 'Instagram', kpi: 'Follower insgesamt', value: '48.152', change: 1.2 },
                { platform: 'Spotify', kpi: 'Monatliche Hörer', value: '1.2M', change: 5.3 },
                { platform: 'Google Analytics 4', kpi: 'Nutzer (letzte 7 Tage)', value: '12.830', change: -2.1 }
            ]
        }
    });
});

// Library/CMS API
app.get('/api/library', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                title: "Bandübernahmevertrag (Standard)",
                description: "Ein Standardvertrag zur Übertragung der Master-Rechte.",
                category: "Verträge",
                files: { docx: "/templates/band-contract.docx", pdf: "/templates/band-contract.pdf" },
                tags: ["Recording", "Rechte", "Label"]
            },
            {
                id: 2,
                title: "Booking-Anfrage (Vorlage)",
                description: "Vorlage für Anfragen an Veranstalter.",
                category: "Booking",
                files: { docx: "/templates/booking-request.docx" },
                tags: ["Live", "Konzert"]
            }
        ]
    });
});

// Knowledge Base API
app.get('/api/knowledge-base', (req, res) => {
    const { search } = req.query;
    let data = [
        { id: 'kb-1', title: "Wie richte ich mein E-Mail-Konto ein?", category: "Setup", tags: ["email", "mdm"] },
        { id: 'kb-2', title: "Was ist ein AV-Vertrag?", category: "DSGVO", tags: ["datenschutz", "vertrag"] },
        { id: 'kb-3', title: "Wie teile ich ein Moodboard?", category: "Kollaboration", tags: ["moodboard", "sharing"] }
    ];
    
    if (search) {
        data = data.filter(item => 
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    res.json({ success: true, data });
});

// Learning Paths API
app.get('/api/learning-paths', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 'lp1',
                title: "Onboarding für neue Künstler:innen",
                description: "Alle Grundlagen für einen erfolgreichen Start.",
                targetRole: "Künstler",
                modules: [
                    { id: 'm1-1', title: "Willkommen im Team!", type: 'video' },
                    { id: 'm1-2', title: "Unsere Kommunikations-Tools", type: 'text' }
                ]
            }
        ]
    });
});

// DSGVO Compliance API
app.get('/api/compliance/questions', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 'q1', text: "Führst du ein Verzeichnis von Verarbeitungstätigkeiten (VVT)?" },
            { id: 'q2', text: "Hast du eine Datenschutzerklärung auf deiner Webseite?" },
            { id: 'q3', text: "Schließt du Auftragsverarbeitungs-Verträge (AVV) mit Dienstleistern ab?" }
        ]
    });
});

app.post('/api/compliance/test', (req, res) => {
    const { answers } = req.body;
    const score = Object.values(answers).filter(Boolean).length;
    const total = 3;
    
    res.json({
        success: true,
        data: {
            score,
            total,
            percentage: Math.round((score / total) * 100),
            result: `${score} / ${total}`
        }
    });
});

// AI Assistant API (mit Gemini)
app.post('/api/assistant/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Verwende Gemini API wenn verfügbar
        if (process.env.GEMINI_API_KEY) {
            const prompt = `Du bist ein Experte für das Musikbusiness und agierst als hilfsbereiter Assistent. Deine Aufgabe ist es, Fragen rund um Musikveröffentlichungen, Kampagnenkonzepte, Marketingstrategien und allgemeine Branchenkenntnisse zu beantworten. Gib klare, strukturierte und umsetzbare Ratschläge. Antworte auf Deutsch. Frage des Nutzers: "${message}"`;
            
            // Hier würde die Gemini API-Integration stehen
            // Für Demo-Zwecke simulieren wir eine Antwort
            res.json({
                success: true,
                data: {
                    response: "Das ist eine sehr interessante Frage zum Musikbusiness. Hier sind einige praktische Tipps, die dir helfen können..."
                }
            });
        } else {
            res.json({
                success: true,
                data: {
                    response: "Hallo! Ich bin dein KI-Assistent für das Musikbusiness. Wie kann ich dir heute helfen?"
                }
            });
        }
    } catch (error) {
        console.error('Assistant API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// File Upload API
app.post('/api/files/upload', (req, res) => {
    res.json({
        success: true,
        data: {
            id: `file_${Date.now()}`,
            name: 'uploaded-file.pdf',
            type: 'application/pdf',
            size: 1024000,
            url: '/uploads/uploaded-file.pdf'
        }
    });
});

// Catch all handler for SPA
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🎵 Musik-Plattform Backend started successfully`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`⚕️ Health: http://localhost:${PORT}/api/health`);
    console.log(`🔥 Firebase: http://localhost:${PORT}/api/config/firebase`);
    console.log(`🛡️ Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;