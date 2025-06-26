#!/bin/bash

echo "================================================"
echo "          LOCKET BACKEND SERVER"
echo "================================================"
echo
echo "Starting Locket Backend Server..."
echo "Using MongoDB Atlas (Cloud Database)"
echo

# Change to the directory where this script is located
cd "$(dirname "$0")"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "[ERROR] File .env not found!"
    echo "Please create .env file with required environment variables."
    echo
    echo "Example .env content for MongoDB Atlas:"
    echo "PORT=3000"
    echo "NODE_ENV=development"
    echo "MONGODB_URI=mongodb+srv://locket_user:PASSWORD@locket-cluster.xxxxx.mongodb.net/locket_db?retryWrites=true&w=majority&appName=Locket-Cluster"
    echo "JWT_SECRET=your_secret_key_here"
    echo "JWT_EXPIRE=7d"
    echo "CORS_ORIGIN=*"
    echo
    echo "NOTE: Replace PASSWORD and xxxxx with your actual Atlas credentials"
    echo "See team-share-info.md for complete connection string"
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies!"
        read -p "Press Enter to exit..."
        exit 1
    fi
fi

# Check internet connection (required for MongoDB Atlas)
echo "[INFO] Checking internet connection for MongoDB Atlas..."
ping -c 1 google.com >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "[WARNING] No internet connection detected!"
    echo "MongoDB Atlas requires internet connection to work."
    echo "Please check your network and try again."
    echo
    read -p "Press Enter to continue anyway..."
fi

echo "[INFO] Starting development server with MongoDB Atlas..."
echo "[INFO] Server will be available at: http://localhost:3000"
echo "[INFO] For Android Emulator use: http://10.0.2.2:3000"
echo "[INFO] Database: MongoDB Atlas (Cloud)"
echo "[INFO] Press Ctrl+C to stop the server"
echo

npm run dev

echo
echo "[INFO] Server stopped."
read -p "Press Enter to exit..." 