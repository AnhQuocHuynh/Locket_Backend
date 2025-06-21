@echo off
echo ================================================
echo          LOCKET BACKEND SERVER
echo ================================================
echo.
echo Starting Locket Backend Server...
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

REM Check if .env file exists
if not exist ".env" (
    echo [ERROR] File .env not found!
    echo Please create .env file with required environment variables.
    echo.
    echo Example .env content:
    echo PORT=3000
    echo NODE_ENV=development
    echo MONGODB_URI=mongodb://localhost:27017/locket_db
    echo JWT_SECRET=your_secret_key_here
    echo JWT_EXPIRE=7d
    echo CORS_ORIGIN=*
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    "C:\Program Files\nodejs\npm.cmd" install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo [INFO] Starting development server...
echo [INFO] Server will be available at: http://localhost:3000
echo [INFO] For Android Emulator use: http://10.0.2.2:3000
echo [INFO] Press Ctrl+C to stop the server
echo.

"C:\Program Files\nodejs\npm.cmd" run dev

echo.
echo [INFO] Server stopped.
pause 