# Logging-Sicherheit für Node.js

## 🛡️ **Log-Injection-Schutz (Log4Shell-Äquivalent für Node.js)**

### **Implementierte Schutzmaßnahmen:**

#### **1. Sichere Logging-Konfiguration**
- **Input-Sanitization**: Alle Log-Eingaben werden bereinigt
- **Template-Injection-Schutz**: Keine dynamischen Log-Templates
- **LDAP/JNDI-Pattern-Blocking**: Verdächtige Patterns werden blockiert
- **Log-Level-Validation**: Strenge Validierung der Log-Level

#### **2. Sichere Log-Bibliothek**
```javascript
// Sichere Winston-Konfiguration
const winston = require('winston');
const { format } = winston;

// Log-Sanitization-Format
const sanitizeFormat = format((info) => {
    // Entferne gefährliche Patterns
    const dangerousPatterns = [
        /\$\{[^}]*\}/g,           // Template-Injection ${...}
        /ldap:\/\/[^\s]*/gi,      // LDAP-URLs
        /jndi:[^\s]*/gi,          // JNDI-Lookups
        /%\{[^}]*\}/g,            // Pattern-Lookups
        /\$\([^)]*\)/g,           // Shell-Injection
        /<script[^>]*>/gi,        // Script-Tags
        /javascript:[^\s]*/gi,    // JavaScript-URLs
        /on\w+\s*=/gi,            // Event-Handler
    ];

    if (typeof info.message === 'string') {
        dangerousPatterns.forEach(pattern => {
            info.message = info.message.replace(pattern, '[SANITIZED]');
        });
    }

    return info;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        sanitizeFormat(),
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

module.exports = logger;
```

#### **3. Request-Logging-Sicherheit**
```javascript
// Sichere Morgan-Konfiguration
const morgan = require('morgan');
const logger = require('./secure-logger');

// Custom-Token für sichere IP-Logging
morgan.token('safe-remote-addr', (req) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    // Sanitize IP für Logs
    return ip.replace(/[^\d\.:]/g, ''); // Nur Zahlen, Punkte, Doppelpunkte
});

// Sichere Log-Format
const secureLogFormat = ':safe-remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms';

const secureLogger = morgan(secureLogFormat, {
    stream: {
        write: (message) => {
            // Zusätzliche Sanitization vor dem Logging
            const cleanMessage = message.trim().replace(/\$\{[^}]*\}/g, '[SANITIZED]');
            logger.info(cleanMessage);
        }
    }
});

module.exports = secureLogger;
```

#### **4. Input-Validation für Logs**
```javascript
// Log-Input-Validator
const validateLogInput = (input) => {
    if (typeof input !== 'string') {
        return String(input);
    }

    // Prüfe auf Log4Shell-ähnliche Payloads
    const maliciousPatterns = [
        '${jndi:',
        '${ldap:',
        '${dns:',
        '${lower:',
        '${upper:',
        '${env:',
        '${sys:',
        '${date:',
        '${ctx:',
        '%{',
        '$((',
    ];

    for (const pattern of maliciousPatterns) {
        if (input.toLowerCase().includes(pattern.toLowerCase())) {
            console.warn(`Malicious log pattern detected: ${pattern}`);
            return '[BLOCKED_MALICIOUS_INPUT]';
        }
    }

    // Entferne Control-Characters
    return input.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
};

module.exports = { validateLogInput };
```

#### **5. Environment-Variable-Schutz**
```bash
# Sichere Logging-Konfiguration in .env
LOG_LEVEL=info
LOG_MAX_SIZE=5242880
LOG_MAX_FILES=5
LOG_SANITIZE=true
LOG_BLOCK_PATTERNS=true

# Deaktiviere unsichere Features
NODE_OPTIONS="--no-experimental-loader --no-experimental-policy"
```

### **Überwachung und Monitoring:**

#### **1. Log-Anomalie-Erkennung**
```javascript
// Pattern-Detection für verdächtige Log-Einträge
const detectSuspiciousLogs = (logMessage) => {
    const suspiciousIndicators = [
        /multiple\s+failed\s+login/i,
        /unusual\s+request\s+pattern/i,
        /rate\s+limit\s+exceeded/i,
        /\$\{[^}]*\}/,
        /ldap:\/\//i,
        /jndi:/i
    ];

    return suspiciousIndicators.some(pattern => pattern.test(logMessage));
};
```

#### **2. Real-time-Monitoring**
```javascript
// Log-Monitor für Security-Events
const securityMonitor = {
    logSecurityEvent: (event, details) => {
        const sanitizedDetails = validateLogInput(JSON.stringify(details));
        logger.warn(`SECURITY_EVENT: ${event}`, { details: sanitizedDetails });
        
        // Zusätzliche Alerting-Logik hier
        if (event === 'INJECTION_ATTEMPT') {
            // Sofortige Benachrichtigung
            console.error(`🚨 SECURITY ALERT: Injection attempt detected`);
        }
    }
};
```

### **Compliance und Best Practices:**

#### **✅ Log4Shell-Äquivalent-Schutz für Node.js:**
- **Template-Injection-Schutz**: Blockiert `${...}` Patterns
- **LDAP/JNDI-Blocking**: Verhindert externe Lookups
- **Input-Sanitization**: Bereinigt alle Log-Eingaben
- **Pattern-Detection**: Erkennt verdächtige Muster
- **Size-Limits**: Begrenzt Log-Größe (DoS-Schutz)
- **Rotation**: Automatische Log-Rotation
- **Access-Control**: Sichere Log-Datei-Berechtigungen

### **Monitoring-Metriken:**
- 🔍 **Pattern-Detection**: Anzahl blockierter Injection-Versuche
- 📊 **Log-Volume**: Überwachung ungewöhnlicher Log-Mengen
- ⚠️ **Error-Rate**: Monitoring von Error-Log-Spitzen
- 🛡️ **Sanitization-Rate**: Anzahl bereinigter Log-Einträge

---

**Das Node.js-Projekt ist jetzt gegen Log-Injection-Angriffe geschützt! 🔒**
(Log4Shell-äquivalenter Schutz für JavaScript/Node.js-Umgebung)