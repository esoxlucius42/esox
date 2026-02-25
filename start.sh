#!/bin/bash

# Esox Application Startup Script

APP_DIR="/home/esox/dev/java/esox"
JAR_FILE="$APP_DIR/target/esox-app-0.1.0.jar"
LOG_DIR="/var/log/esox"
LOG_FILE="$LOG_DIR/esox-app.log"
PID_FILE="/var/run/esox-app.pid"
PORT=8081

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"

# Check if JAR exists
if [ ! -f "$JAR_FILE" ]; then
    echo "ERROR: JAR file not found at $JAR_FILE"
    echo "Please run: cd $APP_DIR && mvn clean install"
    exit 1
fi

# Check if already running
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "Application is already running with PID $OLD_PID"
        exit 0
    fi
fi

# Start the application
echo "Starting Esox Application..."
nohup java -jar "$JAR_FILE" \
    --server.port=$PORT \
    --spring.application.name=esox-app \
    > "$LOG_FILE" 2>&1 &

NEW_PID=$!
echo $NEW_PID > "$PID_FILE"

echo "Application started with PID $NEW_PID"
echo "Listening on port $PORT"
echo "Logs available at: $LOG_FILE"

# Wait a moment and check if process is still running
sleep 2
if kill -0 $NEW_PID 2>/dev/null; then
    echo "✓ Application is running successfully"
    exit 0
else
    echo "✗ Application failed to start. Check logs:"
    tail -20 "$LOG_FILE"
    exit 1
fi
