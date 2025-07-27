# Sicherheitsrichtlinien für API-Schlüssel

## Übersicht
Diese Datei dokumentiert die Sicherheitsmaßnahmen für die Verwaltung von API-Schlüsseln in der Musikplattform.

## Aktuelle Implementierung
- API-Schlüssel sind in der separaten Datei `config.js` gespeichert
- `config.js` ist in `.gitignore` enthalten und wird nicht in das Repository committet
- Die Hauptanwendung lädt die Konfiguration dynamisch über `window.getConfig()`

## Sicherheitshinweise

### ⚠️ WICHTIG: Aktuelle Einschränkungen
Die derzeitige Implementierung ist **nur für Entwicklungs- und Testzwecke geeignet**. Die API-Schlüssel sind immer noch im Frontend sichtbar und können von jedem Benutzer eingesehen werden.

### 🔒 Für Produktionsumgebung empfohlen:

1. **Backend-Proxy implementieren**
   - Erstellen Sie einen Server (z.B. Node.js/Express)
   - API-Schlüssel nur auf dem Server speichern
   - Frontend sendet Anfragen an Ihren Server
   - Server leitet Anfragen an Firebase/Gemini weiter

2. **Umgebungsvariablen verwenden**
   ```bash
   FIREBASE_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   ```

3. **Firebase Security Rules**
   - Implementieren Sie strikte Firestore/Database-Regeln
   - Verwenden Sie Firebase Authentication für Zugriffskontrolle

4. **API-Rate-Limiting**
   - Implementieren Sie Rate-Limiting auf Server-Seite
   - Überwachen Sie API-Nutzung

## Nächste Schritte für Produktionsbereitschaft

1. Backend-Service erstellen
2. API-Schlüssel auf Server migrieren
3. Frontend auf Server-Kommunikation umstellen
4. SSL/HTTPS implementieren
5. Monitoring und Logging einrichten

## Notfallmaßnahmen
Bei Kompromittierung der Schlüssel:
1. Sofort neue API-Schlüssel in Firebase/Google Cloud generieren
2. Alte Schlüssel deaktivieren
3. `config.js` mit neuen Schlüsseln aktualisieren
4. Alle Instanzen der Anwendung neu deployen