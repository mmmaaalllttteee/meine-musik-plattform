# 🔄 Git Merge Resolution Log

## **Problem:** Divergent Branches
```
hint: You have divergent branches and need to specify how to reconcile them.
fatal: Need to specify how to reconcile divergent branches.
```

## **Lösung:** Merge Strategy

### **Schritt 1: Git Merge-Strategie konfigurieren**
```bash
git config pull.rebase false  # merge strategy
```

### **Schritt 2: Pull mit Merge durchführen**
```bash
git pull origin main
```

### **Schritt 3: Bei Konflikten - Manuelle Resolution**
Falls Merge-Konflikte auftreten:

1. **Konflikte identifizieren:**
   ```bash
   git status
   ```

2. **Konfliktdateien bearbeiten:**
   - Suche nach `<<<<<<<`, `=======`, `>>>>>>>` Markierungen
   - Wähle die gewünschten Änderungen aus
   - Entferne die Konflikt-Markierungen

3. **Resolved Dateien hinzufügen:**
   ```bash
   git add .
   ```

4. **Merge abschließen:**
   ```bash
   git commit -m "Resolve merge conflicts"
   ```

5. **Changes pushen:**
   ```bash
   git push origin main
   ```

### **Alternative Strategien:**

**Rebase (für lineare Historie):**
```bash
git config pull.rebase true
git pull origin main
```

**Fast-Forward Only (nur bei sauberen Updates):**
```bash
git config pull.ff only
git pull origin main
```

## **Empfehlung:**
Für kollaborative Projekte ist **Merge** (false) die sicherste Option, da sie:
- ✅ Beide Entwicklungslinien erhält
- ✅ Konflikt-Resolution ermöglicht  
- ✅ History komplett bewahrt
- ✅ Rollbacks einfacher macht

## **Automatisierung:**
Das `git-merge-resolve.sh` Script automatisiert diesen Prozess und bietet:
- ✅ Automatische Strategie-Konfiguration
- ✅ Konflikt-Erkennung
- ✅ Status-Reporting
- ✅ Hilfreiche Anweisungen bei Problemen