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
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Musik-Plattform Backend is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.get('/api/config/firebase', (req, res) => {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY || "demo-api-key",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "meine-musikplattform.firebaseapp.com",
        projectId: process.env.FIREBASE_PROJECT_ID || "meine-musikplattform",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "meine-musikplattform.appspot.com",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "997469107237",
        appId: process.env.FIREBASE_APP_ID || "1:997469107237:web:demo",
        measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-DEMO"
    };
    
    res.json(firebaseConfig);
});

// Demo API endpoints
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

app.get('/api/analytics', (req, res) => {
    res.json({
        success: true,
        data: {
            totalStreams: 125000,
            monthlyListeners: 15600,
            topTrack: "Neon Dreams",
            platforms: ['Spotify', 'Apple Music', 'YouTube Music']
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🎵 Musik-Plattform Backend started successfully`);
    console.log(`📱 Frontend available at: http://localhost:${PORT}`);
    console.log(`⚕️  Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;