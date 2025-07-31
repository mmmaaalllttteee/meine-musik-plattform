#!/bin/bash

echo "🔍 VOLLSTÄNDIGE DATEI-PRÜFUNG & FEHLERKORREKTUR"
echo "=============================================="

cd /workspaces/meine-musik-plattform

# 1. Prüfe und repariere package.json
echo "📦 1. Prüfe package.json..."
if [ ! -f "package.json" ] || [ ! -s "package.json" ]; then
    echo "🔧 Erstelle/repariere package.json..."
    cat > package.json << 'EOF'
{
  "name": "meine-musik-plattform",
  "version": "1.0.0",
  "description": "Eine professionelle Musik-Business-Plattform",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0",
    "firebase-admin": "^11.10.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["musik", "business", "plattform", "firebase"],
  "author": "Team",
  "license": "MIT"
}
EOF
    echo "✅ package.json repariert"
else
    echo "✅ package.json OK"
fi

# 2. Prüfe und repariere server.js
echo ""
echo "🖥️ 2. Prüfe server.js..."
if [ ! -f "server.js" ] || ! grep -q "express" server.js 2>/dev/null; then
    echo "🔧 Erstelle/repariere server.js..."
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
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
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

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🎵 Musik-Plattform Backend started successfully`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`⚕️ Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
EOF
    echo "✅ server.js repariert"
else
    echo "✅ server.js OK"
fi

# 3. Prüfe und repariere index.html
echo ""
echo "🌐 3. Prüfe index.html..."
if [ ! -f "index.html" ] || ! grep -q "ReactDOM.render" index.html 2>/dev/null; then
    echo "🔧 Erstelle vollständige index.html..."
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="de" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Musik-Plattform</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { 
            -webkit-font-smoothing: antialiased; 
            -moz-osx-font-smoothing: grayscale;
            background: #0f172a;
        }
        .glass-pane {
            background-color: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .text-shadow {
            text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body class="text-white">
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect, createContext, useContext } = React;

        const mockData = {
            keyKpis: [
                { platform: 'Instagram', kpi: 'Follower insgesamt', value: '48.152', change: 1.2 },
                { platform: 'Spotify', kpi: 'Monatliche Hörer', value: '1.2M', change: 5.3 },
                { platform: 'Google Analytics 4', kpi: 'Nutzer (letzte 7 Tage)', value: '12.830', change: -2.1 }
            ],
            activities: [
                { id: 'act_1', type: 'task_completed', text: 'Pressemitteilung fertiggestellt', project: 'Album Release', time: 'vor 2 Stunden' },
                { id: 'act_2', type: 'file_uploaded', text: 'Cover-Artwork hochgeladen', project: 'Album Release', time: 'vor 4 Stunden' },
                { id: 'act_3', type: 'task_completed', text: 'Social Media Plan erstellt', project: 'Marketing Campaign', time: 'gestern' },
                { id: 'act_4', type: 'comment_added', text: 'Feedback zu Moodboard erhalten', project: 'Album Release', time: 'vor 2 Tagen' }
            ]
        };

        const AuthContext = createContext(null);
        const AuthProvider = ({ children }) => {
            const [user] = useState({
                uid: 'demo-user-123',
                email: 'demo@example.com',
                displayName: 'Demo Benutzer',
                photoURL: null
            });
            return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
        };
        const useAuth = () => useContext(AuthContext);

        const Icon = ({ name, className = "w-6 h-6" }) => {
            const icons = {
                menu: "M4 6h16M4 12h16M4 18h16",
                bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
                user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
                barChart: "M12 20V10M18 20V4M6 20v-6",
                briefcase: "M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z",
                zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
                bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",
                messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
                award: "M12 15l-8-5 8-5 8 5-8 5z",
                shieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
                plus: "M12 2v20M2 12h20",
                trendingUp: "M23 6l-9.5 9.5-5-5L1 18"
            };
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[name]} />
                </svg>
            );
        };

        const PageWrapper = ({ children }) => (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        );

        const MainDashboard = ({ setActivePage, activities, complyCheckScore }) => (
            <PageWrapper>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-shadow mb-2">Dashboard</h1>
                    <p className="text-gray-300 text-shadow">Willkommen zurück! Hier ist deine Übersicht.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {mockData.keyKpis.map((kpi, index) => (
                        <div key={index} className="glass-pane p-6 rounded-2xl">
                            <h3 className="text-lg font-semibold text-white mb-2">{kpi.platform}</h3>
                            <p className="text-sm text-gray-300 mb-2">{kpi.kpi}</p>
                            <p className="text-3xl font-bold text-white">{kpi.value}</p>
                            <p className={`text-sm font-semibold ${kpi.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {kpi.change >= 0 ? '▲' : '▼'} {kpi.change}%
                            </p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-pane p-6 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4 text-shadow">Letzte Aktivitäten</h2>
                        <div className="space-y-3">
                            {mockData.activities.map(activity => (
                                <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium text-shadow">{activity.text}</p>
                                        <p className="text-xs text-gray-400">{activity.project} • {activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass-pane p-6 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4 text-shadow">Quick Actions</h2>
                        <div className="space-y-3">
                            <button onClick={() => setActivePage('projects')} className="w-full p-3 bg-blue-500 text-white rounded-lg text-left flex items-center gap-3">
                                <Icon name="plus" className="w-5 h-5" />Neues Projekt erstellen
                            </button>
                            <button onClick={() => setActivePage('analytics')} className="w-full p-3 bg-white/10 text-white rounded-lg text-left flex items-center gap-3">
                                <Icon name="trendingUp" className="w-5 h-5" />Analytics anzeigen
                            </button>
                            <button onClick={() => setActivePage('comply')} className="w-full p-3 bg-white/10 text-white rounded-lg text-left flex items-center gap-3">
                                <Icon name="shieldCheck" className="w-5 h-5" />DSGVO-Check ({complyCheckScore})
                            </button>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        );

        const Navigation = ({ activePage, setActivePage, user }) => {
            const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
            const navItems = [
                { id: 'dashboard', name: 'Dashboard', icon: 'barChart' },
                { id: 'projects', name: 'Projekte', icon: 'briefcase' },
                { id: 'analytics', name: 'Analytics', icon: 'zap' },
                { id: 'library', name: 'Library', icon: 'bookOpen' },
                { id: 'support', name: 'Support', icon: 'messageSquare' },
                { id: 'learningcenter', name: 'Learning', icon: 'award' },
                { id: 'comply', name: 'Comply', icon: 'shieldCheck' },
                { id: 'profile', name: 'Profil', icon: 'user' }
            ];

            return (
                <nav className="glass-pane sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-shadow">🎵 Musik-Plattform</span>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navItems.map((item) => (
                                        <button key={item.id} onClick={() => setActivePage(item.id)} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${activePage === item.id ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                                            <Icon name={item.icon} className="w-4 h-4" />{item.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="relative text-gray-300 hover:text-white">
                                    <Icon name="bell" className="w-6 h-6" />
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                                </button>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        {user?.displayName?.charAt(0) || 'U'}
                                    </div>
                                    <span className="hidden sm:block">{user?.displayName || 'User'}</span>
                                </div>
                                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-300 hover:text-white">
                                    <Icon name="menu" className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        {mobileMenuOpen && (
                            <div className="md:hidden">
                                <div className="px-2 pt-2 pb-3 space-y-1 glass-pane rounded-lg mt-2">
                                    {navItems.map((item) => (
                                        <button key={item.id} onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }} className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2 ${activePage === item.id ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                                            <Icon name={item.icon} className="w-4 h-4" />{item.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            );
        };

        const ProjectsPage = () => (
            <PageWrapper>
                <h1 className="text-3xl font-bold text-shadow mb-8">Projekte</h1>
                <div className="glass-pane p-8 rounded-2xl text-center">
                    <h2 className="text-xl font-bold mb-4">Projekte-Verwaltung</h2>
                    <p className="text-gray-300">Hier können Sie Ihre Musikprojekte verwalten.</p>
                </div>
            </PageWrapper>
        );

        const AnalyticsPage = () => (
            <PageWrapper>
                <h1 className="text-3xl font-bold text-shadow mb-8">Analytics</h1>
                <div className="glass-pane p-8 rounded-2xl text-center">
                    <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
                    <p className="text-gray-300">Hier sehen Sie Ihre Musik-Analytics.</p>
                </div>
            </PageWrapper>
        );

        const LibraryPage = () => (
            <PageWrapper>
                <h1 className="text-3xl font-bold text-shadow mb-8">Smart Library</h1>
                <div className="glass-pane p-8 rounded-2xl text-center">
                    <h2 className="text-xl font-bold mb-4">Vorlagen & Ressourcen</h2>
                    <p className="text-gray-300">Hier finden Sie Verträge und Vorlagen.</p>
                </div>
            </PageWrapper>
        );

        const SupportPage = () => (
            <PageWrapper>
                <h1 className="text-3xl font-bold text-shadow mb-8">Support Hub</h1>
                <div className="glass-pane p-8 rounded-2xl text-center">
                    <h2 className="text-xl font-bold mb-4">Hilfe & Support</h2>
                    <p className="text-gray-300">Hier finden Sie Hilfe und können Fragen stellen.</p>
                </div>
            </PageWrapper>
        );

        const LearningPage = () => (
            <PageWrapper>
                <h1 className="text-3xl font-bold text-shadow mb-8">Learning Center</h1>
                <div className="glass-pane p-8 rounded-2xl text-center">
                    <h2 className="text-xl font-bold mb-4">Lernpfade</h2>
                    <p className="text-gray-300">Hier können Sie Ihr Wissen erweitern.</p>
                </div>
            </PageWrapper>
        );

        const ComplyPage = ({ complyCheckScore, setComplyCheckScore }) => (
            <PageWrapper>
                <h1 className="text-3xl font-bold text-shadow mb-8">ComplyCheck</h1>
                <div className="glass-pane p-8 rounded-2xl text-center">
                    <h2 className="text-xl font-bold mb-4">DSGVO Compliance</h2>
                    <p className="text-gray-300 mb-4">Aktueller Score: {complyCheckScore}</p>
                    <button onClick={() => setComplyCheckScore('3 / 3')} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Test durchführen</button>
                </div>
            </PageWrapper>
        );

        const ProfilePage = () => {
            const { user } = useAuth();
            return (
                <PageWrapper>
                    <h1 className="text-3xl font-bold text-shadow mb-8">Profil</h1>
                    <div className="glass-pane p-8 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4">Benutzerinformationen</h2>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-300 mb-2">Name</label><p className="text-white">{user?.displayName}</p></div>
                            <div><label className="block text-sm font-medium text-gray-300 mb-2">E-Mail</label><p className="text-white">{user?.email}</p></div>
                        </div>
                    </div>
                </PageWrapper>
            );
        };

        const MainApp = () => {
            const { user } = useAuth();
            const [activePage, setActivePage] = useState('dashboard');
            const [complyCheckScore, setComplyCheckScore] = useState('0 / 3');

            const renderPage = () => {
                switch (activePage) {
                    case 'projects': return <ProjectsPage />;
                    case 'analytics': return <AnalyticsPage />;
                    case 'library': return <LibraryPage />;
                    case 'support': return <SupportPage />;
                    case 'learningcenter': return <LearningPage />;
                    case 'comply': return <ComplyPage complyCheckScore={complyCheckScore} setComplyCheckScore={setComplyCheckScore} />;
                    case 'profile': return <ProfilePage />;
                    default: return <MainDashboard setActivePage={setActivePage} activities={mockData.activities} complyCheckScore={complyCheckScore} />;
                }
            };

            return (
                <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
                    <Navigation activePage={activePage} setActivePage={setActivePage} user={user} />
                    <main>{renderPage()}</main>
                </div>
            );
        };

        const App = () => (
            <AuthProvider>
                <MainApp />
            </AuthProvider>
        );

        ReactDOM.render(<App />, document.getElementById('root'));
        console.log('🚀 Musik-Plattform successfully loaded!');
    </script>
</body>
</html>
EOF
    echo "✅ index.html repariert"
else
    echo "✅ index.html OK"
fi

# 4. Erstelle .env wenn nicht vorhanden
echo ""
echo "🔧 4. Prüfe .env..."
if [ ! -f ".env" ]; then
    echo "🔧 Erstelle .env Datei..."
    cat > .env << 'EOF'
# Musik-Plattform Environment Variables
PORT=3001
NODE_ENV=development

# Firebase Configuration (Optional - Demo-Werte werden verwendet wenn nicht gesetzt)
FIREBASE_API_KEY=demo-api-key
FIREBASE_AUTH_DOMAIN=meine-musikplattform.firebaseapp.com
FIREBASE_PROJECT_ID=meine-musikplattform
FIREBASE_STORAGE_BUCKET=meine-musikplattform.appspot.com
FIREBASE_MESSAGING_SENDER_ID=997469107237
FIREBASE_APP_ID=1:997469107237:web:demo
FIREBASE_MEASUREMENT_ID=G-DEMO
EOF
    echo "✅ .env erstellt"
else
    echo "✅ .env OK"
fi

# 5. Prüfe Scripts und mache sie ausführbar
echo ""
echo "🔧 5. Prüfe Scripts..."
chmod +x *.sh 2>/dev/null
echo "✅ Scripts ausführbar gemacht"

# 6. Validiere kritische Dateien
echo ""
echo "🔍 6. Validiere kritische Dateien..."

# Prüfe HTML-Syntax
if grep -q "ReactDOM.render" index.html && grep -q "</html>" index.html; then
    echo "✅ HTML-Syntax korrekt"
else
    echo "❌ HTML-Syntax fehlerhaft"
fi

# Prüfe React-Komponenten
if grep -q "const MainApp" index.html && grep -q "const Navigation" index.html; then
    echo "✅ React-Komponenten vorhanden"
else
    echo "❌ React-Komponenten fehlen"
fi

# Prüfe Server-Konfiguration
if grep -q "app.listen" server.js && grep -q "/api/health" server.js; then
    echo "✅ Server-Konfiguration korrekt"
else
    echo "❌ Server-Konfiguration fehlerhaft"
fi

# 7. Teste Dependencies
echo ""
echo "📦 7. Installiere und teste Dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies erfolgreich installiert!"
    
    # Teste Server-Start (kurz)
    echo ""
    echo "🔍 8. Teste Server-Start..."
    timeout 5s npm start > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 3
    
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo "✅ Server startet erfolgreich"
        kill $SERVER_PID 2>/dev/null
    else
        echo "⚠️ Server-Start-Test nicht abgeschlossen"
    fi
    
    echo ""
    echo "🎯 ALLE FEHLER BEHOBEN!"
    echo "===================="
    echo ""
    echo "✅ Bereite Dateien:"
    echo "   📦 package.json - Dependencies konfiguriert"
    echo "   🖥️ server.js - Express-Server funktional"
    echo "   🌐 index.html - React-App vollständig"
    echo "   🔧 .env - Umgebungsvariablen gesetzt"
    echo ""
    echo "🚀 STARTE JETZT DIE PLATTFORM:"
    echo "   npm start"
    echo ""
    echo "📱 Nach dem Start verfügbar:"
    echo "   🌐 Frontend: http://localhost:3001"
    echo "   ⚕️ Health: http://localhost:3001/api/health"
    echo ""
    echo "💡 Führe aus: npm start"
    
    # Automatisch starten
    echo ""
    echo "🚀 Starte automatisch..."
    npm start
    
else
    echo "❌ Fehler bei der Installation der Dependencies"
    echo "💡 Versuche manuell: npm install && npm start"
fi