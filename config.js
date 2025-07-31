// config.js - Sichere Konfigurationsdatei für API-Schlüssel
// WICHTIG: Diese Datei sollte niemals in ein öffentliches Repository committet werden!
// Sie ist bereits in .gitignore aufgeführt, um versehentliche Commits zu verhindern.

window.AppConfig = {
    firebase: {
        apiKey: "AIzaSyDdgu05VJewoLG9-Ad1jdU8ogee2C4_tKs",
        authDomain: "meine-musikplattform.firebaseapp.com",
        projectId: "meine-musikplattform",
        storageBucket: "meine-musikplattform.appspot.com",
        messagingSenderId: "997469107237",
        appId: "1:997469107237:web:109d6cfa8829f01e547bcc",
        measurementId: "G-7M62EV7KQH"
    },
    gemini: {
        apiKey: "AIzaSyBBtfre7TorPTmjIVQhNHVm2Homd5YGPTM"
    }
};

// Hilfsfunktion zum sicheren Zugriff auf die Konfiguration
window.getConfig = () => {
    if (!window.AppConfig) {
        console.error('Konfiguration nicht geladen. Bitte stellen Sie sicher, dass config.js geladen wurde.');
        return null;
    }
    return window.AppConfig;
};