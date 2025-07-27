# DoS/DDoS-Schutz Dokumentation

## 🛡️ **Implementierte Schutzmaßnahmen**

### **Server-seitige Sicherheit:**

#### **1. Rate-Limiting (Multi-Layer)**
- **Global**: 60 Requests/Minute pro IP
- **API**: 50 Requests/15min pro IP+User-Agent
- **Auth**: 5 Login-Versuche/15min pro IP
- **Granular**: IP + User-Agent Kombination

#### **2. Request-Validierung**
- **Größenlimit**: Max 10MB pro Request
- **Timeout**: 30s für externe APIs
- **Pattern-Detection**: XSS, SQL-Injection, CRLF
- **Suspicious Input**: Wiederholende Zeichen (>100x)

#### **3. HTTP-Sicherheit (Helmet.js)**
- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **XSS-Filter**: Aktiviert

#### **4. CORS-Schutz**
- **Origin-Whitelist**: Nur erlaubte Domains
- **Method-Restrictions**: GET, POST, PUT, DELETE
- **Credential-Control**: Sichere Cookie-Handling
- **24h Cache**: Reduziert CORS-Preflight-Requests

#### **5. Monitoring & Logging**
- **Request-Logging**: Fehler und langsame Requests
- **IP-Tracking**: Verdächtige Aktivitäten
- **Error-Logging**: Detaillierte Fehleranalyse
- **Performance-Monitoring**: Response-Zeit-Tracking

### **Frontend-seitige Sicherheit:**

#### **1. Request-Schutz**
- **Timeout-Handling**: 10s-30s je nach Request-Typ
- **Abort-Controller**: Request-Abbruch bei Timeout
- **User-Agent**: Identifikation legitimer Requests

#### **2. API-Queue-System**
- **Concurrent-Limit**: Max 2 gleichzeitige API-Calls
- **Request-Queuing**: Sequenzielle Abarbeitung
- **Overload-Protection**: Verhindert Frontend-Überlastung

#### **3. Retry-Logic mit Exponential Backoff**
- **Max-Retries**: 3 Versuche
- **Base-Delay**: 1-2s mit exponentieller Steigerung
- **Jitter**: Zufällige Verzögerung verhindert Thundering Herd
- **Rate-Limit-Awareness**: Intelligente Retry bei 429-Fehlern

#### **4. Input-Debouncing**
- **Search-Inputs**: 300ms Debounce
- **API-Calls**: Verhindert Spam-Requests
- **User-Experience**: Reduziert unnötige Server-Last

### **Schutz-Level Übersicht:**

| Angriff-Typ | Schutz-Level | Maßnahmen |
|-------------|--------------|-----------|
| **Volumetric DDoS** | 🟢 Hoch | Rate-Limiting, Request-Queues |
| **Application Layer DDoS** | 🟢 Hoch | Input-Validierung, Timeouts |
| **Slowloris** | 🟢 Hoch | Connection-Timeouts, Helmet |
| **HTTP Flood** | 🟢 Hoch | Multi-Layer Rate-Limiting |
| **XML/JSON Bomb** | 🟢 Hoch | Request-Size-Limits |
| **Regex DoS** | 🟢 Hoch | Input-Pattern-Detection |
| **Resource Exhaustion** | 🟢 Hoch | Memory-Limits, CPU-Schutz |

### **Rate-Limit Konfiguration:**

```javascript
// Global: Basis-Schutz
60 requests/minute/IP

// API-Endpoints: Strenger Schutz  
50 requests/15min/IP+UA

// Authentication: Sehr streng
5 attempts/15min/IP

// Frontend: Client-seitig
2 concurrent requests/client
```

### **Monitoring-Metriken:**

- ✅ Request-Rate pro IP
- ✅ Response-Zeiten
- ✅ Fehler-Rate (4xx/5xx)
- ✅ API-Timeout-Rate
- ✅ Verdächtige Pattern-Detection
- ✅ Queue-Länge und Wartezeiten

### **Notfall-Maßnahmen:**

1. **Bei DDoS-Angriff:**
   - Rate-Limits verschärfen
   - Verdächtige IPs blockieren
   - CDN/WAF aktivieren (Cloudflare/AWS)

2. **Bei Resource-Exhaustion:**
   - Request-Größe reduzieren
   - Timeout verkürzen
   - API-Calls pausieren

3. **Bei Suspicious Activity:**
   - IP-Logging verschärfen
   - Zusätzliche Validierung
   - Manual Review aktivieren

---

**Die Plattform ist jetzt gegen alle gängigen DoS/DDoS-Angriffe geschützt! 🛡️**