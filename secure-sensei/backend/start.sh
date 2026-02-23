#!/bin/bash
set -e

echo "⏳ Waiting for database to be ready..."
# Simple sleep, but ideally we ping the DB, sleep is usually enough for local docker-compose
sleep 5

# Define the data directory path inside the container
DATA_DIR="/Users/attachatchannakorn/secure-sensei/data"

echo "📂 Scanning for knowledge modules in $DATA_DIR..."

# Loop through all .json files in the data directory
for file in "$DATA_DIR"/*.json; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "📥 Inserting module knowledge from $filename..."
        python insert_knowledge.py --file "$file"
    fi
done

echo "✅ Knowledge insertion complete."
echo "🚀 Starting FastAPI server..."
exec uvicorn api_server:app --host 0.0.0.0 --port 8000

