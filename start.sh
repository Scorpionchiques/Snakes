#!/bin/bash
# Run gateway
cd $(dirname "$0")
gnome-terminal -e 'node gateway.js'
# Run services
cd services
gnome-terminal -e 'node authorization_service.js'
gnome-terminal -e 'node moving_service.js'
gnome-terminal -e 'node highscore_service.js'
# Load web-client
python -mwebbrowser http://localhost:8080
