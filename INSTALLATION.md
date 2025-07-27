# Installation und Setup - Sichere Musik-Plattform

## 🚀 Schnellstart

### 1. Backend installieren
```bash
# Abhängigkeiten installieren
npm install

# Server starten
npm start
```

### 2. Frontend öffnen
- Öffnen Sie `http://localhost:3001` in Ihrem Browser
- Das Backend serviert automatisch das Frontend

## 🔧 Entwicklungsumgebung

### Backend mit Auto-Reload starten
```bash
npm run dev
```

### Dependencies installieren
```bash
# Haupt-Dependencies
npm install express cors dotenv express-rate-limit helmet morgan node-fetch

# Entwicklungs-Dependencies  
npm install --save-dev nodemon jest supertest eslint
```

## 🔐 Sicherheitsfeatures

### ✅ Implementiert:
- **API-Schlüssel vollständig auf Server**: Keine Schlüssel im Frontend
- **Rate Limiting**: 100 Anfragen pro 15 Minuten pro IP
- **Input-Validierung**: Schutz vor schädlichen Eingaben
- **CORS-Konfiguration**: Kontrollierte Cross-Origin-Requests
- **Error Handling**: Sichere Fehlermeldungen ohne interne Details
- **Request Timeout**: 30 Sekunden Timeout für API-Calls
- **Environment Variables**: Sichere Konfiguration über .env

### 🛡️ Sicherheitsmaßnahmen:
- Keine API-Schlüssel im Frontend-Code
- Server-seitiger Proxy für alle externen APIs
- Validierung aller eingehenden Anfragen
- Logging und Monitoring
- Graceful Shutdown für Produktionsumgebung

## 🌐 API-Endpoints

### Frontend-Konfiguration
- `GET /api/config/firebase` - Sichere Firebase-Konfiguration (ohne API-Key)

### AI-Chat
- `POST /api/gemini/chat` - KI-Assistent über sicheren Proxy

### Monitoring
- `GET /api/health` - Server-Status und Gesundheitscheck

## 📁 Projekt-Struktur
```
meine-musik-plattform/
├── server.js           # Backend-Server
├── package.json        # Dependencies
├── .env               # Sichere API-Schlüssel (nicht in Git!)
├── .env.example       # Beispiel-Konfiguration
├── index.html         # Frontend-Anwendung
├── .gitignore         # Git-Ausschlüsse
└── README.md          # Diese Anleitung
```

## 🚨 Wichtige Sicherheitshinweise

### ⚠️ NIEMALS committen:
- `.env` - Enthält echte API-Schlüssel
- `config.js` - Lokale Konfigurationsdatei  

### ✅ Sicher für Git:
- `.env.example` - Beispiel ohne echte Schlüssel
- Alle anderen Dateien

## 🔧 Problembehandlung

### Backend startet nicht:
1. Prüfen Sie die `.env`-Datei
2. Installieren Sie alle Dependencies: `npm install`
3. Prüfen Sie, ob Port 3001 frei ist

### Frontend kann nicht mit Backend kommunizieren:
1. Backend läuft: `http://localhost:3001/api/health`
2. CORS-Einstellungen prüfen
3. Browser-Konsole auf Fehler prüfen

### Gemini API funktioniert nicht:
1. API-Schlüssel in `.env` prüfen
2. Backend-Logs kontrollieren
3. Rate-Limits prüfen (100 Anfragen/15min)

## 📊 Monitoring

### Logs prüfen:
```bash
# Server-Logs in Echtzeit
tail -f logs/server.log

# API-Aufrufe überwachen
curl http://localhost:3001/api/health
```

### Performance testen:
```bash
# Load Testing (optional)
npm install -g artillery
artillery quick --count 10 --num 5 http://localhost:3001/api/health
```

---

**Ihre Plattform ist jetzt vollständig sicher! 🔐**
Alle API-Schlüssel sind auf dem Server verborgen und können nicht vom Frontend eingesehen werden.