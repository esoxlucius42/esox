#!/bin/bash

# Esox Application Deploy Script
# Builds the latest JAR and restarts the systemd service.
# Set SKIP_BUILD=true to skip the Maven build and restart with the existing JAR.
#
# Prerequisites (one-time setup by root):
#   sudo cp /tmp/esox-app.service /etc/systemd/system/esox-app.service
#   sudo cp /tmp/esox-app-sudoers /etc/sudoers.d/esox-app && sudo chmod 440 /etc/sudoers.d/esox-app
#   sudo systemctl daemon-reload && sudo systemctl enable esox-app

APP_DIR="/home/esox/dev/java/esox"
JAR_FILE="$APP_DIR/target/esox-app-0.1.0.jar"
SKIP_BUILD="${SKIP_BUILD:-false}"

set -e

echo "=== Esox Deploy ==="

# Ensure PostgreSQL container is running
if ! podman ps --format '{{.Names}}' | grep -q '^esox-postgres$'; then
    if podman ps -a --format '{{.Names}}' | grep -q '^esox-postgres$'; then
        # Only start the container if port 5432 is not already in use
        if ss -tlnp 2>/dev/null | grep -q ':5432 ' || pg_isready -h localhost -p 5432 -U esox 2>/dev/null; then
            echo "Port 5432 already in use, skipping container start..."
        else
            echo "Starting existing postgres container..."
            podman start esox-postgres
            echo "Waiting for postgres to be ready..."
            for i in $(seq 1 15); do
                podman exec esox-postgres pg_isready -U esox -d esox_db 2>/dev/null && break
                sleep 2
            done
        fi
    else
        echo "Creating postgres container..."
        podman run -d \
            --name esox-postgres \
            -e POSTGRES_USER=esox \
            -e POSTGRES_PASSWORD=esox \
            -e POSTGRES_DB=esox_db \
            -p 5432:5432 \
            docker.io/library/postgres:15
        echo "Waiting for postgres to be ready..."
        for i in $(seq 1 15); do
            podman exec esox-postgres pg_isready -U esox -d esox_db 2>/dev/null && break
            sleep 2
        done
    fi
fi
echo "✓ PostgreSQL ready"

# Build
if [ "$SKIP_BUILD" = "true" ]; then
    echo "Skipping build (SKIP_BUILD=true)"
    if [ ! -f "$JAR_FILE" ]; then
        echo "✗ JAR not found at $JAR_FILE"
        exit 1
    fi
    echo "✓ Using existing JAR: $JAR_FILE"
else
    echo "Building..."
    cd "$APP_DIR"
    mvn clean install -q
    echo "✓ Build successful"
fi

# Restart service (passwordless sudo configured in /etc/sudoers.d/esox-app)
echo "Restarting service..."
sudo systemctl restart esox-app

sleep 3
if sudo systemctl is-active --quiet esox-app; then
    echo "✓ esox-app service is running"
    echo "  Logs: journalctl -u esox-app -f"
else
    echo "✗ Service failed to start. Last log lines:"
    sudo systemctl status esox-app --no-pager | tail -20
    exit 1
fi
