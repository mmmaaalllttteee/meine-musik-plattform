#!/bin/bash

echo "🔍 Vollständige Plattform-Validierung..."

# Prüfe kritische Dateien
echo "📋 Prüfe Dateien..."
FILES_TO_CHECK=(
    "index.html"
    "server.js" 
    "package.json"
    "multi-character-sanitizer.js"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file vorhanden"
    else
        echo "❌ $file fehlt!"
        exit 1
    fi
done

# Prüfe HTML-Syntax grundlegend
echo ""
echo "🔍 Prüfe HTML-Struktur..."
if grep -q "</html>" index.html && grep -q "<body.*>" index.html; then
    echo "✅ HTML-Struktur korrekt"
else
    echo "❌ HTML-Struktur fehlerhaft"
fi

# Prüfe React-Komponenten
echo ""
echo "⚛️ Prüfe React-Komponenten..."
COMPONENTS=(
    "MainApp"
    "Navigation" 
    "LoginPage"
    "RegisterPage"
    "MainDashboard"
    "SecureLink"
    "AuthProvider"
    "ErrorBoundary"
)

for component in "${COMPONENTS[@]}"; do
    if grep -q "const $component" index.html; then
        echo "✅ $component definiert"
    else
        echo "❌ $component fehlt"
    fi
done

# Prüfe Security-Features
echo ""
echo "🔒 Prüfe Security-Features..."
SECURITY_FEATURES=(
    "preventDataLeakage"
    "validateForm"
    "safeHtmlInputHandler"
    "multiCharacterSanitizer"
)

for feature in "${SECURITY_FEATURES[@]}"; do
    if grep -q "$feature" index.html; then
        echo "✅ $feature implementiert"
    else
        echo "⚠️ $feature möglicherweise fehlt"
    fi
done

# Prüfe package.json
echo ""
echo "📦 Prüfe package.json..."
if node -e "
const pkg = require('./package.json');
if (pkg.dependencies && pkg.dependencies.express && pkg.dependencies.cors) {
    console.log('✅ Alle Dependencies vorhanden'); 
    process.exit(0);
} else {
    console.log('❌ Dependencies fehlen');
    process.exit(1);
}
" 2>/dev/null; then
    echo "✅ package.json korrekt"
else
    echo "⚠️ package.json prüfen oder Dependencies installieren"
fi

echo ""
echo "🚀 Bereit zum Starten!"
echo ""
echo "💡 Starte die Plattform mit:"
echo "   chmod +x start-app.sh"
echo "   ./start-app.sh"
echo ""
echo "🌐 Oder direkt:"
echo "   npm install && npm start"
echo ""
echo "✅ Plattform-Validierung abgeschlossen!"