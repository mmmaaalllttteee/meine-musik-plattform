const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

// In-Memory Database (for demo purposes)
let database = {
    projects: [],
    templates: [],
    knowledgeBase: [],
    learningPaths: [],
    users: {},
    analytics: {},
    integrations: {}
};

// Initialize demo data
const initializeDemoData = () => {
    database.projects = [
        {
            id: 'proj_1',
            name: 'Album Release "Neon Dreams"',
            userId: 'demo-user-123',
            files: [],
            moodboards: [{
                id: 'mood_1',
                title: 'Cover Artwork & Visuals',
                items: [
                    { id: 'item_1', type: 'image', content: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Inspiration+1', x: 50, y: 50, w: 250, h: 180 },
                    { id: 'item_2', type: 'text', content: 'Key Words: Retro, 80s, Chrome, Sunset', x: 350, y: 80, w: 200, h: 100 }
                ]
            }],
            taskboards: [{
                id: 'task_1',
                title: 'Marketing & PR Plan',
                sections: [
                    { id: 'sec_1', title: 'To Do', tasks: [
                        { id: 't_1', title: 'Pressemitteilung entwerfen', priority: 'high', assignee: 'Anna', dueDate: '2025-08-15', completed: false }
                    ]},
                    { id: 'sec_2', title: 'In Progress', tasks: [] },
                    { id: 'sec_3', title: 'Done', tasks: [] }
                ]
            }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    database.templates = [
        { id: 1, title: "Bandübernahmevertrag (Standard)", description: "Ein Standardvertrag zur Übertragung der Master-Rechte.", category: "Verträge", files: { docx: "/templates/band-contract.docx", pdf: "/templates/band-contract.pdf" }, tags: ["Recording", "Rechte", "Label"] },
        { id: 2, title: "Booking-Anfrage (Vorlage)", description: "Vorlage für Anfragen an Veranstalter.", category: "Booking", files: { docx: "/templates/booking-request.docx" }, tags: ["Live", "Konzert"] },
        { id: 3, title: "Pressekit-Checkliste", description: "Alle wichtigen Inhalte für ein Pressekit.", category: "Best Practices", files: { pdf: "/templates/pressekit-checklist.pdf" }, tags: ["PR", "Marketing", "EPK"] }
    ];

    database.knowledgeBase = [
        { id: 'kb-1', title: "Wie richte ich mein E-Mail-Konto ein?", category: "Setup", content: "Hier finden Sie eine Schritt-für-Schritt Anleitung...", tags: ["email", "setup"] },
        { id: 'kb-2', title: "Was ist ein AV-Vertrag?", category: "DSGVO", content: "Ein Auftragsverarbeitungsvertrag regelt...", tags: ["datenschutz", "vertrag"] },
        { id: 'kb-3', title: "Wie teile ich ein Moodboard?", category: "Kollaboration", content: "Moodboards können über Share-Links geteilt werden...", tags: ["moodboard", "sharing"] }
    ];

    database.learningPaths = [
        {
            id: 'lp1',
            title: "Onboarding für neue Künstler:innen",
            description: "Alle Grundlagen für einen erfolgreichen Start.",
            targetRole: "Künstler",
            modules: [
                { id: 'm1-1', title: "Willkommen im Team!", type: 'video', content: "Willkommensvideo", completed: false },
                { id: 'm1-2', title: "Unsere Kommunikations-Tools", type: 'text', content: 'Wir nutzen verschiedene Tools...', completed: false }
            ]
        }
    ];
};

// Middleware
app.use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdgu05VJewoLG9-Ad1jdU8ogee2C4_tKs",
    authDomain: "meine-musikplattform.firebaseapp.com",
    projectId: "meine-musikplattform",
    storageBucket: "meine-musikplattform.appspot.com",
    messagingSenderId: "997469107237",
    appId: "1:997469107237:web:109d6cfa8829f01e547bcc",
    measurementId: "G-7M62EV7KQH"
};

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
            database: 'connected',
            firebase: 'configured',
            security: 'active'
        }
    });
});

// Firebase Config
app.get('/api/config/firebase', (req, res) => {
    console.log('🔥 Firebase config requested');
    res.json(firebaseConfig);
});

// Projects API
app.get('/api/projects', (req, res) => {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    const userProjects = database.projects.filter(p => p.userId === userId);
    res.json(userProjects);
});

app.post('/api/projects', (req, res) => {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    const newProject = {
        id: `proj_${Date.now()}`,
        userId,
        name: req.body.name,
        files: [],
        moodboards: [{ id: `mood_${Date.now()}`, title: 'Hauptmoodboard', items: [] }],
        taskboards: [{ 
            id: `task_${Date.now()}`, 
            title: 'Projekt Tasks', 
            sections: [
                { id: 'sec_todo', title: 'To Do', tasks: [] },
                { id: 'sec_progress', title: 'In Progress', tasks: [] },
                { id: 'sec_done', title: 'Done', tasks: [] }
            ] 
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    database.projects.push(newProject);
    res.json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
    const projectIndex = database.projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    database.projects[projectIndex] = {
        ...database.projects[projectIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    
    res.json(database.projects[projectIndex]);
});

app.delete('/api/projects/:id', (req, res) => {
    const projectIndex = database.projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    database.projects.splice(projectIndex, 1);
    res.json({ message: 'Project deleted successfully' });
});

// Templates API
app.get('/api/templates', (req, res) => {
    const { category, search } = req.query;
    let filteredTemplates = database.templates;
    
    if (category && category !== 'Alle') {
        filteredTemplates = filteredTemplates.filter(t => t.category === category);
    }
    
    if (search) {
        filteredTemplates = filteredTemplates.filter(t => 
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    res.json(filteredTemplates);
});

app.post('/api/templates', (req, res) => {
    const newTemplate = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    database.templates.push(newTemplate);
    res.json(newTemplate);
});

// Knowledge Base API
app.get('/api/knowledge', (req, res) => {
    const { search, category } = req.query;
    let filteredKnowledge = database.knowledgeBase;
    
    if (search) {
        filteredKnowledge = filteredKnowledge.filter(k =>
            k.title.toLowerCase().includes(search.toLowerCase()) ||
            k.content.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    if (category) {
        filteredKnowledge = filteredKnowledge.filter(k => k.category === category);
    }
    
    res.json(filteredKnowledge);
});

app.get('/api/knowledge/:id', (req, res) => {
    const article = database.knowledgeBase.find(k => k.id === req.params.id);
    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
});

// Learning Paths API
app.get('/api/learning-paths', (req, res) => {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    // Add user progress to learning paths
    const pathsWithProgress = database.learningPaths.map(path => ({
        ...path,
        progress: calculateProgress(path, userId)
    }));
    
    res.json(pathsWithProgress);
});

app.get('/api/learning-paths/:id', (req, res) => {
    const path = database.learningPaths.find(p => p.id === req.params.id);
    if (!path) {
        return res.status(404).json({ error: 'Learning path not found' });
    }
    res.json(path);
});

app.post('/api/learning-paths/:pathId/modules/:moduleId/complete', (req, res) => {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    // Mark module as completed for user (in real app, this would be in user progress table)
    res.json({ success: true, message: 'Module completed' });
});

// Analytics API
app.get('/api/analytics/dashboard', (req, res) => {
    const mockAnalytics = {
        keyKpis: [
            { platform: 'Instagram', kpi: 'Follower insgesamt', value: '48.152', change: 1.2 },
            { platform: 'Spotify', kpi: 'Monatliche Hörer', value: '1.2M', change: 5.3 },
            { platform: 'Google Analytics 4', kpi: 'Nutzer (letzte 7 Tage)', value: '12.830', change: -2.1 }
        ],
        activities: [
            { id: 'act_1', type: 'task_completed', text: 'Pressemitteilung fertiggestellt', project: 'Album Release', time: 'vor 2 Stunden' },
            { id: 'act_2', type: 'file_uploaded', text: 'Cover-Artwork hochgeladen', project: 'Album Release', time: 'vor 4 Stunden' }
        ],
        learningProgress: { pathTitle: 'Onboarding für neue Künstler:innen', progress: 75 }
    };
    
    res.json(mockAnalytics);
});

// Chat/Support API
app.post('/api/chat/message', (req, res) => {
    const { message } = req.body;
    
    // Mock AI responses based on message content
    const responses = {
        default: "Das ist eine interessante Frage! Für Musikmarketing empfehle ich: 1) Zielgruppe definieren, 2) Social Media nutzen, 3) Collaborations eingehen.",
        streaming: "Streaming-Plattformen sind wichtig für die Reichweite. Spotify, Apple Music und YouTube Music sollten Priorität haben.",
        release: "Für erfolgreiche Veröffentlichungen: Plane mindestens 6-8 Wochen im Voraus und erstelle einen detaillierten Marketing-Plan.",
        live: "Bei Live-Auftritten ist die Setlist entscheidend. Mixe bekannte Songs mit neuen Tracks für die beste Audience-Response."
    };
    
    let response = responses.default;
    
    if (message.toLowerCase().includes('streaming') || message.toLowerCase().includes('spotify')) {
        response = responses.streaming;
    } else if (message.toLowerCase().includes('release') || message.toLowerCase().includes('veröffentlich')) {
        response = responses.release;
    } else if (message.toLowerCase().includes('live') || message.toLowerCase().includes('konzert')) {
        response = responses.live;
    }
    
    // Simulate processing delay
    setTimeout(() => {
        res.json({ 
            response,
            timestamp: new Date().toISOString()
        });
    }, 1000);
});

// File Upload API (simplified)
app.post('/api/upload', (req, res) => {
    // In a real application, this would handle actual file uploads
    const mockFile = {
        id: `file_${Date.now()}`,
        name: req.body.fileName || 'uploaded-file.pdf',
        type: 'file',
        fileType: req.body.fileType || 'application/pdf',
        size: req.body.size || 1024000,
        url: `/uploads/${req.body.fileName}`,
        uploadedAt: new Date().toISOString()
    };
    
    res.json(mockFile);
});

// User Profile API
app.get('/api/user/profile', (req, res) => {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    const user = database.users[userId] || {
        id: userId,
        displayName: 'Demo Benutzer',
        email: 'demo@example.com',
        preferences: {
            theme: 'dark',
            notifications: true
        }
    };
    
    res.json(user);
});

app.put('/api/user/profile', (req, res) => {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    database.users[userId] = {
        ...database.users[userId],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    
    res.json(database.users[userId]);
});

// Helper Functions
function calculateProgress(path, userId) {
    // Mock progress calculation
    return Math.floor(Math.random() * 100);
}

// Initialize demo data
initializeDemoData();

// Catch all - serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔥 Firebase configured and ready`);
    console.log(`🔒 Security headers active`);
    console.log(`� In-memory database initialized`);
    console.log(`💡 API endpoints:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - GET  /api/config/firebase`);
    console.log(`   - CRUD /api/projects`);
    console.log(`   - CRUD /api/templates`);
    console.log(`   - CRUD /api/knowledge`);
    console.log(`   - CRUD /api/learning-paths`);
    console.log(`   - POST /api/chat/message`);
    console.log(`   - GET  /api/analytics/dashboard`);
});

module.exports = app;