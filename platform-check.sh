#!/bin/bash

echo "=============================================="
echo "        LOCKET BACKEND - PLATFORM CHECK"
echo "=============================================="
echo

# Detect operating system
OS=$(uname -s)
case "$OS" in
    Darwin)
        PLATFORM="macOS"
        ;;
    Linux)
        PLATFORM="Linux"
        ;;
    CYGWIN*|MINGW*|MSYS*)
        PLATFORM="Windows (Git Bash)"
        ;;
    *)
        PLATFORM="Unknown ($OS)"
        ;;
esac

echo "🖥️  Detected Platform: $PLATFORM"
echo

# Check Node.js installation
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js: Not installed"
fi

# Check npm installation
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm: Not installed"
fi

# Check MongoDB installation (local)
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB: Installed locally"
else
    echo "ℹ️  MongoDB: Not installed locally (Atlas recommended)"
fi

echo
echo "=============================================="
echo "           RECOMMENDED COMMANDS"
echo "=============================================="

if [[ "$OS" == "Darwin" || "$OS" == "Linux" || "$OS" == CYGWIN* || "$OS" == MINGW* ]]; then
    echo "🚀 Start server:"
    echo "   ./start.sh"
    echo
    echo "🔄 Switch database:"
    echo "   ./switch-database.sh"
    echo
    echo "🧪 Test API:"
    echo "   npm run test-api"
    echo
    echo "📝 Make scripts executable:"
    echo "   chmod +x *.sh"
else
    echo "⚠️  This script is for Unix-like systems"
    echo "   For Windows, use the .bat files instead"
fi

echo
echo "=============================================="
echo "             ENVIRONMENT STATUS"
echo "=============================================="

# Check .env file
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "MONGODB_URI" .env; then
        MONGO_URI=$(grep "MONGODB_URI" .env | cut -d'=' -f2)
        if [[ "$MONGO_URI" == *"mongodb://localhost"* ]]; then
            echo "📍 Database: Local MongoDB"
        elif [[ "$MONGO_URI" == *"mongodb+srv"* ]]; then
            echo "☁️  Database: MongoDB Atlas"
        else
            echo "❓ Database: Unknown configuration"
        fi
    fi
else
    echo "❌ .env file not found"
    echo "   Create .env file with required environment variables"
fi

# Check package.json and node_modules
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json not found"
fi

if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "⚠️  node_modules not found - run 'npm install'"
fi

echo
echo "For more information, see:"
echo "📚 CROSS_PLATFORM_GUIDE.md"
echo "🔧 API_TESTING_GUIDE.md"
echo