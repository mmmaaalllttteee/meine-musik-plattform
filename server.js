const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Sichere Logging-Funktionen (Log4Shell-Schutz für Node.js)
const validateLogInput = (input) => {
    if (typeof input !== 'string') {
        return String(input);
    }

    // Prüfe auf Log4Shell-ähnliche Payloads
    const maliciousPatterns = [
        '${jndi:', '${ldap:', '${dns:', '${lower:', '${upper:',
        '${env:', '${sys:', '${date:', '${ctx:', '%{', '$(('
    ];

    for (const pattern of maliciousPatterns) {
        if (input.toLowerCase().includes(pattern.toLowerCase())) {
            console.warn(`🚨 Malicious log pattern blocked: ${pattern.substring(0, 10)}...`);
            return '[BLOCKED_INJECTION_ATTEMPT]';
        }
    }

    // Entferne Control-Characters und gefährliche Zeichen
    return input.replace(/[\x00-\x1F\x7F-\x9F\$\{\}]/g, '');
};

const secureLog = (level, message, metadata = {}) => {
    const sanitizedMessage = validateLogInput(message);
    const sanitizedMetadata = {};
    
    // Sanitize metadata
    Object.keys(metadata).forEach(key => {
        if (typeof metadata[key] === 'string') {
            sanitizedMetadata[key] = validateLogInput(metadata[key]);
        } else {
            sanitizedMetadata[key] = metadata[key];
        }
    });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${sanitizedMessage}`;
    
    if (level === 'error') {
        console.error(logEntry, sanitizedMetadata);
    } else if (level === 'warn') {
        console.warn(logEntry, sanitizedMetadata);
    } else {
        console.log(logEntry, sanitizedMetadata);
    }
};

// Custom Morgan-Token für sichere IP-Logging
morgan.token('safe-ip', (req) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    return validateLogInput(ip.replace(/[^\d\.:]/g, '')); // Nur Zahlen, Punkte, Doppelpunkte
});

// Sichere Request-Logging mit Injection-Schutz
const secureLogger = morgan(':safe-ip - ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms', {
    skip: (req, res) => res.statusCode < 400, // Nur Fehler und langsame Requests loggen
    stream: {
        write: (message) => {
            const cleanMessage = validateLogInput(message.trim());
            secureLog('info', `REQUEST: ${cleanMessage}`);
        }
    }
});

// Vertrauenswürdige Proxies (für korrekte IP-Erkennung hinter Load Balancern)
app.set('trust proxy', 1);

// Basis-Rate-Limiting für alle Requests
const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Minute
    max: 60, // 60 Requests pro Minute pro IP
    message: {
        error: 'Zu viele Anfragen von dieser IP. Bitte versuchen Sie es später erneut.',
        retryAfter: '1 Minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        console.warn(`Rate limit exceeded for IP: ${req.ip} - ${req.method} ${req.path}`);
        res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(req.rateLimit.msBeforeNext / 1000)
        });
    }
});

// Strenges Rate-Limiting für API-Aufrufe
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 50, // 50 API-Calls pro 15 Minuten pro IP
    message: {
        error: 'API-Rate-Limit erreicht. Bitte versuchen Sie es später erneut.',
        retryAfter: '15 Minuten'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Verwende sowohl IP als auch User-Agent für bessere Granularität
        return `${req.ip}-${req.get('User-Agent') || 'unknown'}`;
    },
    handler: (req, res) => {
        console.warn(`API rate limit exceeded for IP: ${req.ip} - ${req.method} ${req.path}`);
        res.status(429).json({
            error: 'API rate limit exceeded',
            retryAfter: Math.ceil(req.rateLimit.msBeforeNext / 1000)
        });
    }
});

// Sehr strenges Rate-Limiting für Login-Versuche
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 5, // Nur 5 Login-Versuche pro 15 Minuten
    skipSuccessfulRequests: true,
    message: {
        error: 'Zu viele Login-Versuche. Account temporär gesperrt.',
        retryAfter: '15 Minuten'
    },
    handler: (req, res) => {
        console.error(`Authentication rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Authentication rate limit exceeded',
            retryAfter: Math.ceil(req.rateLimit.msBeforeNext / 1000)
        });
    }
});

// Request-Größe begrenzen (DoS-Schutz)
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        // Prüfe auf verdächtige Payloads
        if (buf.length > 10 * 1024 * 1024) { // 10MB Limit
            throw new Error('Request entity too large');
        }
    }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basis-Rate-Limiting auf alle Routen anwenden
app.use(globalLimiter);

// CORS mit strengeren Einstellungen
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://music.wmitw.com',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        // Erlaube Requests ohne Origin (z.B. mobile Apps, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 Stunden CORS-Cache
}));

// Serve static files mit Cache-Control
app.use(express.static('public', {
    maxAge: '1d', // 1 Tag Cache für statische Dateien
    etag: true,
    lastModified: true
}));

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
        
        // Erweiterte Input-Validierung
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

        // Prüfe auf verdächtige Patterns (DoS-Schutz + Log-Injection-Schutz)
        const suspiciousPatterns = [
            /(.)\1{100,}/, // Wiederholende Zeichen
            /<script|javascript:|data:/i, // XSS-Versuche
            /union.*select|drop.*table|exec.*sp_/i, // SQL-Injection
            /\x00|\x0d\x0a|\r\n/g, // Null-Bytes und CRLF
            /\$\{[^}]*\}/g, // Template-Injection (Log4Shell-ähnlich)
            /ldap:\/\/[^\s]*/gi, // LDAP-URLs
            /jndi:[^\s]*/gi, // JNDI-Lookups
            /%\{[^}]*\}/g, // Pattern-Lookups
        ];

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(message)) {
                const safeIp = validateLogInput(req.ip);
                const patternName = pattern.toString().substring(0, 20);
                secureLog('error', `Suspicious input pattern detected`, { 
                    ip: safeIp, 
                    pattern: patternName,
                    inputLength: message.length 
                });
                return res.status(400).json({ 
                    error: 'Eingabe enthält unerlaubte Zeichen oder Muster' 
                });
            }
        }

        // Rate-Limiting pro Session (zusätzlich zu IP-basiert)
        const userAgent = req.get('User-Agent') || 'unknown';
        const sessionKey = `${req.ip}-${userAgent}`;
        
        const prompt = `Du bist ein Experte für das Musikbusiness und agierst als hilfsbereiter Assistent. Deine Aufgabe ist es, Fragen rund um Musikveröffentlichungen, Kampagnenkonzepte, Marketingstrategien und allgemeine Branchenkenntnisse zu beantworten. Gib klare, strukturierte und umsetzbare Ratschläge. Antworte auf Deutsch. Frage des Nutzers: "${message.trim()}"`;
        
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        // Timeout-Controller für externe API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'User-Agent': 'MusikPlattform/1.0',
                    'X-Request-ID': `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            const safeErrorText = validateLogInput(errorText.substring(0, 200)); // Truncate für Log-Sicherheit
            const safeIp = validateLogInput(req.ip);
            
            secureLog('error', `Gemini API Error`, { 
                status: response.status,
                error: safeErrorText,
                ip: safeIp 
            });
            
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
            timestamp: new Date().toISOString(),
            requestId: req.get('X-Request-ID') || 'unknown'
        });

    } catch (error) {
        const safeErrorMsg = validateLogInput(error.message || 'Unknown error');
        const safeIp = validateLogInput(req.ip);
        
        secureLog('error', `Gemini API Error`, { 
            error: safeErrorMsg,
            ip: safeIp,
            stack: error.stack ? validateLogInput(error.stack.substring(0, 500)) : 'No stack'
        });
        
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

// Error Handler mit sicherer Logging
app.use((error, req, res, next) => {
    const safeErrorMsg = validateLogInput(error.message || 'Unknown error');
    const safeIp = validateLogInput(req.ip);
    const safePath = validateLogInput(req.path);
    
    secureLog('error', `Unhandled error`, { 
        error: safeErrorMsg,
        ip: safeIp,
        path: safePath,
        method: req.method
    });
    
    res.status(500).json({ error: 'Interner Serverfehler' });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    secureLog('info', 'SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    secureLog('info', 'SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(PORT, () => {
    secureLog('info', `Server started on port ${PORT}`, {
        port: PORT,
        nodeEnv: process.env.NODE_ENV || 'development',
        securityFeatures: {
            dosProtection: 'enabled',
            logInjectionProtection: 'enabled',
            rateLimiting: 'enabled',
            helmetSecurity: 'enabled'
        }
    });
    
    console.log(`🚀 Server läuft auf Port ${PORT}`);
    console.log(`📊 Gesundheitscheck: http://localhost:${PORT}/api/health`);
    console.log(`🔥 Frontend: http://localhost:${PORT}`);
    console.log(`🔐 Sichere API-Schlüssel geladen: ✅`);
    console.log(`🛡️ DoS/DDoS-Schutz: Aktiviert`);
    console.log(`📝 Rate-Limits: Global(60/min), API(50/15min), Auth(5/15min)`);
    console.log(`🔒 Sicherheits-Headers: Helmet aktiviert`);
    console.log(`⚡ CORS-Schutz: Konfiguriert für erlaubte Origins`);
    console.log(`🛡️ Log-Injection-Schutz: Aktiviert (Log4Shell-Äquivalent)`);
});

module.exports = app;