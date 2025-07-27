#!/usr/bin/env node

/**
 * Database Security Monitor für die Musik-Plattform
 * Überwacht und schützt Benutzerdaten vor Hackerangriffen
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class DatabaseSecurityMonitor {
    constructor() {
        this.securityEvents = [];
        this.suspiciousPatterns = [
            // SQL-Injection-Patterns
            /(\bselect\b|\bunion\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b)/gi,
            /(-{2}|\/\*|\*\/)/g,
            /(\bor\b|\band\b)\s+\w+\s*=\s*\w+/gi,
            
            // NoSQL-Injection-Patterns
            /\$where/gi, /\$ne/gi, /\$gt/gi, /\$lt/gi, /\$regex/gi, /\$in/gi,
            
            // XSS-Patterns
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            
            // Command-Injection
            /[;&|`$(){}[\]]/g,
            /\b(eval|exec|system|shell_exec|passthru)\b/gi,
            
            // Sensitive Data Patterns
            /password\s*[:=]\s*\w+/gi,
            /token\s*[:=]\s*\w+/gi,
            /api[_-]?key\s*[:=]\s*\w+/gi,
            /secret\s*[:=]\s*\w+/gi
        ];
        
        this.stats = {
            totalQueries: 0,
            blockedQueries: 0,
            dataLeakAttempts: 0,
            injectionAttempts: 0,
            sensitiveDataExposure: 0,
            unauthorizedAccess: 0
        };
    }

    // Analysiere Datenbankabfrage auf Sicherheitsrisiken
    analyzeQuery(query, userId = 'anonymous', context = {}) {
        this.stats.totalQueries++;
        
        const securityIssues = [];
        const timestamp = new Date().toISOString();
        
        // Prüfe auf Injection-Versuche
        for (const pattern of this.suspiciousPatterns) {
            if (pattern.test(query)) {
                securityIssues.push({
                    type: 'INJECTION_ATTEMPT',
                    pattern: pattern.toString().substring(0, 50),
                    severity: 'HIGH'
                });
                this.stats.injectionAttempts++;
                break;
            }
        }
        
        // Prüfe auf sensible Daten in Query
        const sensitiveFields = ['password', 'passwd', 'pwd', 'token', 'secret', 'key', 'hash'];
        for (const field of sensitiveFields) {
            if (query.toLowerCase().includes(field)) {
                securityIssues.push({
                    type: 'SENSITIVE_DATA_ACCESS',
                    field: field,
                    severity: 'CRITICAL'
                });
                this.stats.sensitiveDataExposure++;
            }
        }
        
        // Prüfe auf Bulk-Data-Zugriff (potentielle Datenextraktion)
        if (/select\s+\*\s+from/gi.test(query) || /limit\s+\d{3,}/gi.test(query)) {
            securityIssues.push({
                type: 'BULK_DATA_ACCESS',
                severity: 'MEDIUM'
            });
        }
        
        // Prüfe auf privilegierte Operationen
        if (/\b(drop|alter|create|grant|revoke)\b/gi.test(query)) {
            securityIssues.push({
                type: 'PRIVILEGED_OPERATION',
                severity: 'HIGH'
            });
        }
        
        // Wenn Sicherheitsprobleme gefunden wurden
        if (securityIssues.length > 0) {
            this.stats.blockedQueries++;
            
            const event = {
                id: this.generateEventId(),
                timestamp,
                userId: this.hashUserId(userId),
                query: this.sanitizeQueryForLog(query),
                issues: securityIssues,
                context: this.sanitizeContext(context),
                blocked: true
            };
            
            this.securityEvents.push(event);
            this.logSecurityEvent(event);
            
            return {
                allowed: false,
                reason: securityIssues[0].type,
                eventId: event.id
            };
        }
        
        return { allowed: true };
    }

    // Überwache Daten-Output auf sensible Informationen
    scanDataOutput(data, context = {}) {
        const issues = [];
        const dataString = JSON.stringify(data).toLowerCase();
        
        // Prüfe auf versehentlich exponierte sensible Daten
        const sensitivePatterns = {
            'passwords': /("password"|"passwd"|"pwd")\s*:\s*"[^"]+"/gi,
            'tokens': /("token"|"jwt"|"auth")\s*:\s*"[^"]+"/gi,
            'apiKeys': /("apikey"|"api_key"|"key")\s*:\s*"[^"]+"/gi,
            'secrets': /("secret"|"private")\s*:\s*"[^"]+"/gi,
            'hashes': /("hash"|"encrypted")\s*:\s*"[^"]+"/gi,
            'emails': /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
            'creditCards': /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/gi,
            'socialSecurity': /\b\d{3}-\d{2}-\d{4}\b/gi
        };
        
        Object.entries(sensitivePatterns).forEach(([type, pattern]) => {
            const matches = dataString.match(pattern);
            if (matches) {
                issues.push({
                    type: 'DATA_LEAK',
                    category: type,
                    count: matches.length,
                    severity: type === 'passwords' || type === 'tokens' ? 'CRITICAL' : 'HIGH'
                });
                this.stats.dataLeakAttempts++;
            }
        });
        
        if (issues.length > 0) {
            const event = {
                id: this.generateEventId(),
                timestamp: new Date().toISOString(),
                type: 'DATA_EXPOSURE',
                issues,
                context: this.sanitizeContext(context),
                dataSize: JSON.stringify(data).length
            };
            
            this.securityEvents.push(event);
            this.logSecurityEvent(event);
            
            return {
                safe: false,
                issues,
                sanitizedData: this.sanitizeOutputData(data)
            };
        }
        
        return { safe: true, data };
    }

    // Validiere Benutzer-Authentifizierung
    validateUserAccess(userId, resource, operation, context = {}) {
        // Prüfe auf verdächtige Zugriffsmuster
        const recentEvents = this.securityEvents
            .filter(event => event.userId === this.hashUserId(userId))
            .filter(event => new Date() - new Date(event.timestamp) < 60000) // Letzte Minute
            .length;
        
        if (recentEvents > 50) { // Mehr als 50 Aktionen pro Minute
            this.stats.unauthorizedAccess++;
            
            const event = {
                id: this.generateEventId(),
                timestamp: new Date().toISOString(),
                type: 'RATE_LIMIT_EXCEEDED',
                userId: this.hashUserId(userId),
                resource,
                operation,
                context: this.sanitizeContext(context),
                recentEvents
            };
            
            this.securityEvents.push(event);
            this.logSecurityEvent(event);
            
            return { allowed: false, reason: 'RATE_LIMIT_EXCEEDED' };
        }
        
        return { allowed: true };
    }

    // Generiere Security-Report
    generateSecurityReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalQueries: this.stats.totalQueries,
                blockedQueries: this.stats.blockedQueries,
                injectionAttempts: this.stats.injectionAttempts,
                dataLeakAttempts: this.stats.dataLeakAttempts,
                sensitiveDataExposure: this.stats.sensitiveDataExposure,
                unauthorizedAccess: this.stats.unauthorizedAccess,
                riskLevel: this.calculateRiskLevel()
            },
            recentEvents: this.securityEvents.slice(-20), // Letzte 20 Events
            recommendations: this.generateRecommendations(),
            compliance: this.checkCompliance()
        };

        return report;
    }

    // Berechne Gesamt-Risiko-Level
    calculateRiskLevel() {
        const totalEvents = this.stats.blockedQueries + this.stats.dataLeakAttempts + this.stats.unauthorizedAccess;
        const riskRatio = totalEvents / Math.max(this.stats.totalQueries, 1);
        
        if (riskRatio > 0.1 || this.stats.sensitiveDataExposure > 0) return 'CRITICAL';
        if (riskRatio > 0.05 || this.stats.injectionAttempts > 10) return 'HIGH';
        if (riskRatio > 0.01 || this.stats.dataLeakAttempts > 0) return 'MEDIUM';
        return 'LOW';
    }

    // Generiere Sicherheitsempfehlungen
    generateRecommendations() {
        const recommendations = [];

        if (this.stats.injectionAttempts > 0) {
            recommendations.push({
                type: 'INJECTION_PROTECTION',
                message: 'Implementieren Sie parameterisierte Queries und Input-Validierung.',
                priority: 'HIGH'
            });
        }

        if (this.stats.sensitiveDataExposure > 0) {
            recommendations.push({
                type: 'DATA_ENCRYPTION',
                message: 'Verschlüsseln Sie sensible Daten und implementieren Sie Daten-Klassifizierung.',
                priority: 'CRITICAL'
            });
        }

        if (this.stats.dataLeakAttempts > 0) {
            recommendations.push({
                type: 'ACCESS_CONTROL',
                message: 'Verstärken Sie Zugriffskontrolle und implementieren Sie DLP (Data Loss Prevention).',
                priority: 'HIGH'
            });
        }

        if (this.stats.unauthorizedAccess > 0) {
            recommendations.push({
                type: 'AUTHENTICATION',
                message: 'Implementieren Sie Multi-Factor-Authentication und Session-Monitoring.',
                priority: 'MEDIUM'
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                type: 'STATUS',
                message: 'Alle Sicherheitschecks bestanden. Überwachung läuft normal.',
                priority: 'INFO'
            });
        }

        return recommendations;
    }

    // Prüfe DSGVO/Privacy-Compliance
    checkCompliance() {
        return {
            gdprCompliant: this.stats.sensitiveDataExposure === 0,
            dataMinimization: this.stats.dataLeakAttempts === 0,
            accessControl: this.stats.unauthorizedAccess === 0,
            auditTrail: this.securityEvents.length > 0,
            recommendations: this.stats.sensitiveDataExposure > 0 ? 
                ['Implement data encryption', 'Review data access policies'] : 
                ['Continue current security practices']
        };
    }

    // Hilfsfunktionen
    generateEventId() {
        return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    hashUserId(userId) {
        return crypto.createHash('sha256').update(userId).digest('hex').substring(0, 16);
    }

    sanitizeQueryForLog(query) {
        // Entferne potentielle sensible Daten aus dem Log
        return query
            .replace(/password\s*=\s*['"][^'"]*['"]/gi, 'password=***')
            .replace(/token\s*=\s*['"][^'"]*['"]/gi, 'token=***')
            .substring(0, 200); // Kürze für Log
    }

    sanitizeContext(context) {
        const sanitized = { ...context };
        delete sanitized.password;
        delete sanitized.token;
        delete sanitized.apiKey;
        return sanitized;
    }

    sanitizeOutputData(data) {
        const sanitized = JSON.parse(JSON.stringify(data));
        
        const removeKeys = (obj) => {
            if (typeof obj === 'object' && obj !== null) {
                Object.keys(obj).forEach(key => {
                    if (['password', 'passwd', 'pwd', 'token', 'secret', 'hash', 'apiKey'].includes(key.toLowerCase())) {
                        obj[key] = '***REDACTED***';
                    } else if (typeof obj[key] === 'object') {
                        removeKeys(obj[key]);
                    }
                });
            }
        };
        
        removeKeys(sanitized);
        return sanitized;
    }

    logSecurityEvent(event) {
        const logEntry = `[${event.timestamp}] SECURITY_EVENT: ${event.type || 'UNKNOWN'}`;
        console.warn(`🚨 ${logEntry}`);
        
        if (event.issues && event.issues.some(issue => issue.severity === 'CRITICAL')) {
            console.error(`🚨 CRITICAL SECURITY ISSUE: ${JSON.stringify(event, null, 2)}`);
        }
    }

    // Exportiere Report
    exportReport(filename = 'database-security-report.json') {
        const report = this.generateSecurityReport();
        const reportPath = path.join(__dirname, 'logs', filename);
        
        // Erstelle logs-Verzeichnis falls nicht vorhanden
        const logsDir = path.dirname(reportPath);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`✅ Database Security Report exportiert: ${reportPath}`);
        
        return report;
    }
}

// CLI-Interface
if (require.main === module) {
    const monitor = new DatabaseSecurityMonitor();
    
    console.log('🛡️ Database Security Monitor - Demo');
    console.log('=====================================\n');
    
    // Simuliere verdächtige Datenbankabfragen
    const testQueries = [
        { query: "SELECT * FROM users WHERE id = 1", userId: "user123", safe: true },
        { query: "SELECT * FROM users WHERE id = 1' OR '1'='1", userId: "hacker1", safe: false },
        { query: "SELECT password FROM users", userId: "insider", safe: false },
        { query: "UPDATE users SET role = 'admin' WHERE id = 1", userId: "user123", safe: true },
        { query: "DROP TABLE users", userId: "hacker2", safe: false },
        { query: "SELECT email FROM users LIMIT 1000", userId: "scraper", safe: false }
    ];

    console.log('🧪 Analysiere Test-Queries...\n');
    
    testQueries.forEach((test, index) => {
        console.log(`Query ${index + 1}: ${test.query.substring(0, 50)}...`);
        const result = monitor.analyzeQuery(test.query, test.userId);
        console.log(`   Ergebnis: ${result.allowed ? '✅ ERLAUBT' : '🚨 BLOCKIERT'}`);
        if (!result.allowed) {
            console.log(`   Grund: ${result.reason}`);
        }
        console.log();
    });

    // Teste Daten-Output-Scanning
    console.log('🔍 Teste Daten-Output-Scanning...\n');
    
    const testData = {
        user: {
            id: 123,
            name: "John Doe",
            email: "john@example.com",
            password: "secret123", // Sollte erkannt werden!
            token: "jwt_abc123", // Sollte erkannt werden!
            profile: {
                bio: "Test user"
            }
        }
    };

    const outputResult = monitor.scanDataOutput(testData);
    console.log(`Daten-Output: ${outputResult.safe ? '✅ SICHER' : '🚨 SENSIBLE DATEN ERKANNT'}`);
    if (!outputResult.safe) {
        console.log('   Gefundene Probleme:', outputResult.issues.map(i => i.category).join(', '));
    }
    console.log();

    // Generiere und exportiere Report
    const report = monitor.exportReport();
    
    console.log('📊 Database Security Report Summary:');
    console.log(`   Risiko-Level: ${report.summary.riskLevel}`);
    console.log(`   Gesamt-Queries: ${report.summary.totalQueries}`);
    console.log(`   Blockierte Queries: ${report.summary.blockedQueries}`);
    console.log(`   Injection-Versuche: ${report.summary.injectionAttempts}`);
    console.log(`   Daten-Leak-Versuche: ${report.summary.dataLeakAttempts}`);
    console.log(`   Sensible Daten exponiert: ${report.summary.sensitiveDataExposure}`);

    if (report.recommendations.length > 0) {
        console.log('\n💡 Sicherheitsempfehlungen:');
        report.recommendations.forEach(rec => {
            console.log(`   [${rec.priority}] ${rec.message}`);
        });
    }

    console.log('\n🔒 DSGVO-Compliance:');
    console.log(`   DSGVO-konform: ${report.compliance.gdprCompliant ? '✅' : '❌'}`);
    console.log(`   Datenminimierung: ${report.compliance.dataMinimization ? '✅' : '❌'}`);
    console.log(`   Zugriffskontrolle: ${report.compliance.accessControl ? '✅' : '❌'}`);
    console.log(`   Audit-Trail: ${report.compliance.auditTrail ? '✅' : '❌'}`);
}

module.exports = DatabaseSecurityMonitor;