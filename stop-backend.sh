#!/bin/bash

# Stoppe Backend-Server
echo "🛑 Stoppe Musik-Plattform Backend..."

if [ -f ".server.pid" ]; then
    SERVER_PID=$(cat .server.pid)
    
    if kill -0 $SERVER_PID 2>/dev/null; then
        kill $SERVER_PID
        echo "✅ Backend gestoppt (PID: $SERVER_PID)"
    else
        echo "⚠️ Backend war bereits gestoppt"
    fi
    
    rm .server.pid
else
    echo "⚠️ Keine Server-PID gefunden"
    
    # Versuche alle Node-Prozesse zu finden und zu stoppen
    pkill -f "node server.js" && echo "✅ Node-Server gestoppt"
fi

echo "🏁 Backend-Shutdown abgeschlossen"