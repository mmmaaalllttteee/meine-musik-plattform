#!/bin/bash

# Setze ausführbare Rechte und starte die Plattform
chmod +x /workspaces/meine-musik-plattform/launch-platform.sh
chmod +x /workspaces/meine-musik-plattform/start-backend.sh

cd /workspaces/meine-musik-plattform

echo "🚀 STARTE MUSIK-PLATTFORM..."
echo "================================"

# Führe umfassenden Systemtest und Start aus
./launch-platform.sh