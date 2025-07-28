/**
 * 🔒 Multi-Character-Sanitization Security Library
 * Verhindert Incomplete Multi-Character Sanitization Vulnerabilities
 * 
 * Schutz gegen:
 * - HTML-Entity-Double-Encoding-Bypass
 * - Unicode-Homograph-Angriffe
 * - Multi-Encoding-JavaScript-Injection
 * - Whitespace-Variant-Bypass
 * - Case-Variation-Bypass
 * - Mixed-Encoding-Bypass
 */

// Multi-Pass-Sanitization-Engine
const multiCharacterSanitizer = {
    
    /**
     * Vollständige Multi-Pass-Sanitization für User-Input
     * @param {string} input - Zu sanitisierender Input
     * @param {Object} options - Sanitization-Optionen
     * @returns {string} - Vollständig sanitisierter Output
     */
    sanitize: function(input, options = {}) {
        if (!input) return '';
        
        const { maxLength = 1000, allowHtml = false, maxPasses = 10 } = options;
        let sanitized = String(input).trim();
        
        // Längenbegrenzung ERSTE Priorität (DoS-Schutz)
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        
        // Multi-Pass-Algorithmus
        let previousLength;
        let passCount = 0;
        
        do {
            previousLength = sanitized.length;
            passCount++;
            
            // Pass 1: Unicode-Normalisierung (verhindert Homograph-Angriffe)
            sanitized = this.normalizeUnicode(sanitized);
            
            // Pass 2: HTML-Entity-Behandlung (verhindert Double-Encoding)
            if (!allowHtml) {
                sanitized = this.sanitizeHtmlEntities(sanitized);
            }
            
            // Pass 3: JavaScript-Injection-Schutz (Multi-Encoding-sicher)
            sanitized = this.blockJavaScriptInjection(sanitized);
            
            // Pass 4: Script-Tag-Erkennung (alle Varianten)
            sanitized = this.blockScriptTags(sanitized);
            
            // Pass 5: Event-Handler-Blockierung (Multi-Character-sicher)
            sanitized = this.blockEventHandlers(sanitized);
            
            // Pass 6: CSS-Injection-Schutz
            sanitized = this.blockCssInjection(sanitized);
            
            // Pass 7: Data-URL-Normalisierung
            sanitized = this.sanitizeDataUrls(sanitized);
            
        } while (sanitized.length !== previousLength && passCount < maxPasses);
        
        // Final cleanup: Entferne doppelte Escapes
        sanitized = this.finalCleanup(sanitized);
        
        return sanitized;
    },
    
    /**
     * Unicode-Normalisierung gegen Homograph-Angriffe
     */
    normalizeUnicode: function(input) {
        return input
            // Whitespace-Varianten normalisieren
            .replace(/[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g, ' ')
            
            // Smart Quotes normalisieren
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            
            // Homograph-Zeichen normalisieren
            .replace(/[\u037E\u061F\u1944\u1945\u2E2E\u2E3A\u2E3B\u3002]/g, '.') // Punkt-Varianten
            .replace(/[\u2044\u2215\uFF0F]/g, '/') // Slash-Varianten
            .replace(/[\u02BC\u02C8\u0301\u2032]/g, "'") // Apostroph-Varianten
            .replace(/[\u02EE\u030B\u030E\u0344]/g, '"') // Anführungszeichen-Varianten
            
            // Fullwidth-Zeichen (gefährlich für Script-Injection)
            .replace(/[\uFF00-\uFFEF]/g, (char) => {
                const code = char.charCodeAt(0);
                if (code >= 0xFF01 && code <= 0xFF5E) {
                    return String.fromCharCode(code - 0xFEE0);
                }
                return char;
            })
            
            // Cyrillic Look-alikes (Homograph-Schutz)
            .replace(/[а-я]/gi, (char) => {
                const cyrillicToLatin = {
                    'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'х': 'x', 'у': 'y'
                };
                return cyrillicToLatin[char.toLowerCase()] || char;
            });
    },
    
    /**
     * Multi-Pass-HTML-Entity-Sanitization
     */
    sanitizeHtmlEntities: function(input) {
        let result = input;
        
        // Basis HTML-Entities (Pass 1)
        result = result
            .replace(/&/g, '&amp;')   // Ampersand ZUERST
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
        
        // Double-Entity-Schutz (Pass 2)
        result = result
            .replace(/&amp;lt;/g, '&amp;amp;lt;')
            .replace(/&amp;gt;/g, '&amp;amp;gt;')
            .replace(/&amp;quot;/g, '&amp;amp;quot;')
            .replace(/&amp;#x27;/g, '&amp;amp;#x27;')
            .replace(/&amp;#x2F;/g, '&amp;amp;#x2F;');
        
        return result;
    },
    
    /**
     * Multi-Encoding-JavaScript-Injection-Schutz
     */
    blockJavaScriptInjection: function(input) {
        return input
            // Standard javascript: (case-insensitive mit Whitespace)
            .replace(/j[\s\u00A0]*a[\s\u00A0]*v[\s\u00A0]*a[\s\u00A0]*s[\s\u00A0]*c[\s\u00A0]*r[\s\u00A0]*i[\s\u00A0]*p[\s\u00A0]*t[\s\u00A0]*:/gi, 'blocked:')
            
            // Hex-encoded javascript:
            .replace(/&#x6A;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3A;/gi, 'blocked:')
            
            // Decimal-encoded javascript:
            .replace(/&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;/gi, 'blocked:')
            
            // Unicode-escape javascript:
            .replace(/\\u006A\\u0061\\u0076\\u0061\\u0073\\u0063\\u0072\\u0069\\u0070\\u0074\\u003A/gi, 'blocked:')
            
            // Mixed-encoding Varianten
            .replace(/j&#97;v&#97;script:/gi, 'blocked:')
            .replace(/java&#115;cript:/gi, 'blocked:')
            .replace(/javascr&#105;pt:/gi, 'blocked:')
            
            // Weitere gefährliche Funktionen
            .replace(/e[\s\u00A0]*v[\s\u00A0]*a[\s\u00A0]*l[\s\u00A0]*\(/gi, 'blocked(')
            .replace(/e[\s\u00A0]*x[\s\u00A0]*p[\s\u00A0]*r[\s\u00A0]*e[\s\u00A0]*s[\s\u00A0]*s[\s\u00A0]*i[\s\u00A0]*o[\s\u00A0]*n[\s\u00A0]*\(/gi, 'blocked(')
            .replace(/F[\s\u00A0]*u[\s\u00A0]*n[\s\u00A0]*c[\s\u00A0]*t[\s\u00A0]*i[\s\u00A0]*o[\s\u00A0]*n[\s\u00A0]*\(/gi, 'blocked(');
    },
    
    /**
     * Multi-Character-Script-Tag-Erkennung
     */
    blockScriptTags: function(input) {
        return input
            // Standard Script-Tags mit Whitespace-Varianten
            .replace(/<[\s\u00A0]*s[\s\u00A0]*c[\s\u00A0]*r[\s\u00A0]*i[\s\u00A0]*p[\s\u00A0]*t[^>]{0,200}>[\s\S]{0,1000}<[\s\u00A0]*\/[\s\u00A0]*s[\s\u00A0]*c[\s\u00A0]*r[\s\u00A0]*i[\s\u00A0]*p[\s\u00A0]*t[\s\u00A0]*>/gi, '&lt;blocked&gt;&lt;/blocked&gt;')
            
            // Entity-encoded Script-Tags
            .replace(/&lt;script[^&]*&gt;.*?&lt;\/script&gt;/gi, '&amp;lt;blocked&amp;gt;&amp;lt;/blocked&amp;gt;')
            
            // Mixed Case Varianten
            .replace(/<\s*S\s*C\s*R\s*I\s*P\s*T[^>]*>.*?<\s*\/\s*S\s*C\s*R\s*I\s*P\s*T\s*>/gi, '&lt;blocked&gt;&lt;/blocked&gt;')
            
            // Partial Script-Tag-Erkennung
            .replace(/<[\s\u00A0]*\/[\s\u00A0]*s[\s\u00A0]*c[\s\u00A0]*r[\s\u00A0]*i[\s\u00A0]*p[\s\u00A0]*t/gi, '&lt;/blocked')
            .replace(/<[\s\u00A0]*s[\s\u00A0]*c[\s\u00A0]*r[\s\u00A0]*i[\s\u00A0]*p[\s\u00A0]*t/gi, '&lt;blocked');
    },
    
    /**
     * Multi-Character-Event-Handler-Blockierung
     */
    blockEventHandlers: function(input) {
        return input
            // Standard Event-Handler mit Whitespace
            .replace(/o[\s\u00A0]*n[\s\u00A0]*[a-z]{1,20}[\s\u00A0]*=/gi, 'blocked=')
            
            // Hex-encoded "on"
            .replace(/&#x6F;&#x6E;[a-z]{1,20}=/gi, 'blocked=')
            
            // Decimal-encoded "on"
            .replace(/&#111;&#110;[a-z]{1,20}=/gi, 'blocked=')
            
            // Unicode-escape "on"
            .replace(/\\u006F\\u006E[a-z]{1,20}=/gi, 'blocked=')
            
            // Case-Variationen
            .replace(/O[\s\u00A0]*N[\s\u00A0]*[A-Z]{1,20}[\s\u00A0]*=/gi, 'blocked=')
            
            // Specific dangerous events
            .replace(/on(click|load|error|focus|blur|change|submit|mouseover)[\s\u00A0]*=/gi, 'blocked=');
    },
    
    /**
     * CSS-Injection-Schutz
     */
    blockCssInjection: function(input) {
        return input
            // CSS expression() mit Varianten
            .replace(/e[\s\u00A0]*x[\s\u00A0]*p[\s\u00A0]*r[\s\u00A0]*e[\s\u00A0]*s[\s\u00A0]*s[\s\u00A0]*i[\s\u00A0]*o[\s\u00A0]*n[\s\u00A0]*\(/gi, 'blocked(')
            
            // CSS mit JavaScript-URLs
            .replace(/style[\s\u00A0]*=[\s\u00A0]*[^>]*javascript/gi, 'style="blocked"')
            .replace(/style[\s\u00A0]*=[\s\u00A0]*[^>]*expression/gi, 'style="blocked"')
            
            // @import mit JavaScript
            .replace(/@import[^;]*javascript/gi, '@import "blocked"');
    },
    
    /**
     * Data-URL-Sanitization
     */
    sanitizeDataUrls: function(input) {
        return input
            // Gefährliche Data-URLs blockieren
            .replace(/data[\s\u00A0]*:[\s\u00A0]*text\/html/gi, 'data:text/plain')
            .replace(/data[\s\u00A0]*:[\s\u00A0]*application\/javascript/gi, 'data:text/plain')
            .replace(/data[\s\u00A0]*:[\s\u00A0]*text\/javascript/gi, 'data:text/plain')
            
            // Base64-encoded gefährliche Inhalte
            .replace(/data[\s\u00A0]*:[\s\u00A0]*[^;]{0,50};[\s\u00A0]*base64[\s\u00A0]*,[\s\S]*?script/gi, 'data:text/plain;base64,blocked');
    },
    
    /**
     * Final Cleanup - Entfernt doppelte Escapes
     */
    finalCleanup: function(input) {
        return input
            .replace(/&amp;amp;/g, '&amp;')
            .replace(/&amp;lt;/g, '&lt;')
            .replace(/&amp;gt;/g, '&gt;')
            .replace(/&amp;quot;/g, '&quot;')
            .replace(/&amp;#x27;/g, '&#x27;')
            .replace(/&amp;#x2F;/g, '&#x2F;');
    },
    
    /**
     * Multi-Character-sichere URL-Validierung
     */
    validateUrl: function(url) {
        // Pre-sanitization für URLs
        let cleanUrl = url
            .replace(/[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g, '') // Alle Whitespace-Varianten
            .replace(/[\u2044\u2215\uFF0F]/g, '/') // Slash-Varianten normalisieren
            .toLowerCase();
        
        // Protokoll-Validierung
        if (!cleanUrl.startsWith('https://') && !cleanUrl.startsWith('http://localhost')) {
            throw new Error('Nur HTTPS oder localhost erlaubt');
        }
        
        // Gefährliche Multi-Character-Sequenzen in URLs
        if (/[<>"'`{}|\\^[\]`\s]/.test(cleanUrl)) {
            throw new Error('URL enthält gefährliche Zeichen');
        }
        
        // Homograph-Domain-Schutz
        const domainPart = cleanUrl.split('/')[2];
        if (/[\u0400-\u04FF\u0370-\u03FF]/.test(domainPart)) { // Cyrillic/Greek
            throw new Error('Potentieller Homograph-Angriff in Domain erkannt');
        }
        
        // JavaScript-URLs blockieren
        if (/javascript[\s\u00A0]*:/i.test(cleanUrl)) {
            throw new Error('JavaScript-URLs sind nicht erlaubt');
        }
        
        try {
            return new URL(cleanUrl);
        } catch {
            throw new Error('Ungültige URL-Struktur');
        }
    },
    
    /**
     * Multi-Character-sichere E-Mail-Validierung
     */
    validateEmail: function(email) {
        // Multi-Pass-Sanitization
        const cleanEmail = this.sanitize(email, { allowHtml: false, maxLength: 254 });
        
        // Basis E-Mail-Struktur prüfen
        const emailParts = cleanEmail.split('@');
        if (emailParts.length !== 2 || 
            emailParts[0].length === 0 || 
            emailParts[1].length === 0 ||
            !emailParts[1].includes('.')) {
            throw new Error('Ungültige E-Mail-Struktur');
        }
        
        // Gefährliche Zeichen in E-Mail-Adressen
        if (/[<>'";&(){}[\]\\]/.test(cleanEmail)) {
            throw new Error('E-Mail enthält gefährliche Zeichen');
        }
        
        // Homograph-Schutz für Domain
        const domain = emailParts[1];
        if (/[\u0400-\u04FF\u0370-\u03FF]/.test(domain)) {
            throw new Error('Potentieller Homograph-Angriff in E-Mail-Domain');
        }
        
        return cleanEmail;
    }
};

// Export für Node.js/Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = multiCharacterSanitizer;
}

// Global verfügbar machen im Browser
if (typeof window !== 'undefined') {
    window.multiCharacterSanitizer = multiCharacterSanitizer;
}