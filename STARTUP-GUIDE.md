# 🚀 Musik-Plattform Startup Guide

## **Backend starten:**

### **Option 1: Automatisches Script**
```bash
chmod +x start-app.sh
./start-app.sh
```

### **Option 2: Manuelle Ausführung**
```bash
# Dependencies installieren
npm install

# Backend starten
npm start
```

## **Nach dem Start:**

### **✅ Verfügbare Endpoints:**
- **🌐 Frontend:** http://localhost:3001
- **⚕️ Health Check:** http://localhost:3001/api/health
- **🔥 Firebase Config:** http://localhost:3001/api/config/firebase
- **📁 Projekte API:** http://localhost:3001/api/projects

### **✅ Features verfügbar:**
- **🔐 Sichere Authentifizierung** mit Firebase
- **📊 Analytics Dashboard** mit Mock-Daten
- **🎯 Projektmanagement** mit Moodboards & Tasks
- **📚 Smart Library** mit Vorlagen
- **🤖 KI-Assistent** für Musikbusiness-Fragen
- **🔒 Vollständige Security-Features:**
  - Multi-Character-Sanitization aktiv
  - Bad HTML filtering regexp fixes implementiert
  - Incomplete URL scheme check fixes aktiv
  - Sichere Input-Validation
  - Authentifizierter Zugang

### **🎭 Demo-Modus Fallback:**
Falls das Backend nicht startet:
- Öffne `index.html` direkt im Browser
- Klicke auf "🎭 Im Demo-Modus fortfahren"
- Alle Features funktionieren (ohne persistente Speicherung)

### **🔧 Debugging in VS Code:**
1. **F5** drücken für Debug-Modus
2. Oder: Debug-Panel → "🎵 Debug Musik-Plattform Server"
3. Breakpoints im `server.js` setzen

### **🛑 Backend stoppen:**
```bash
# Im Terminal: Ctrl+C
# Oder:
chmod +x stop-backend.sh
./stop-backend.sh
```

## **🎵 Ready to Rock!**

**Die Musik-Plattform ist bereit für den Einsatz mit allen Security-Features und vollständiger Funktionalität! 🚀**