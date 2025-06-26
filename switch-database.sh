#!/bin/bash

echo "================================================"
echo "        DATABASE CONFIGURATION SWITCHER"
echo "================================================"
echo
echo "Choose database configuration:"
echo "1. Local MongoDB (localhost)"
echo "2. MongoDB Atlas (cloud/team sharing)"
echo
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo
    echo "Switching to Local MongoDB..."
    if [ -f ".env.local" ]; then
        cp .env.local .env 2>/dev/null
        echo "Successfully switched to LOCAL MongoDB"
        echo "Database: mongodb://localhost:27017/locket_db"
        echo "Usage: Individual development"
    else
        echo ".env.local not found! Creating from current .env..."
        if [ -f ".env" ]; then
            cp .env .env.local 2>/dev/null
            echo "Created backup in .env.local"
        else
            echo "No .env file found to backup!"
        fi
    fi
elif [ "$choice" = "2" ]; then
    echo
    echo "Switching to MongoDB Atlas..."
    if [ -f ".env.atlas" ]; then
        cp .env.atlas .env 2>/dev/null
        echo "Successfully switched to ATLAS MongoDB"
        echo "Database: MongoDB Atlas (Cloud)"
        echo "Usage: Team sharing"
        echo
        echo "IMPORTANT: Make sure you've updated the connection string"
        echo "     in .env.atlas with your actual Atlas cluster URL!"
    else
        echo ".env.atlas not found!"
        echo "Please setup MongoDB Atlas first and create .env.atlas"
        echo "See setup-atlas.md for detailed instructions"
    fi
else
    echo
    echo "Invalid choice! Please run again and choose 1 or 2."
fi

echo
echo "Current .env configuration:"
echo "================================================"
if [ -f ".env" ]; then
    grep "MONGODB_URI" .env 2>/dev/null || echo "MONGODB_URI not found in .env"
else
    echo ".env file not found!"
fi
echo "================================================"
echo
read -p "Press Enter to continue..." 