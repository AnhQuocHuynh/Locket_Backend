@echo off
echo ================================================
echo        DATABASE CONFIGURATION SWITCHER
echo ================================================
echo.
echo Choose database configuration:
echo 1. Local MongoDB (localhost)
echo 2. MongoDB Atlas (cloud/team sharing)
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Switching to Local MongoDB...
    copy .env.local .env >nul 2>&1
    if exist .env.local (
        echo Successfully switched to LOCAL MongoDB
        echo Database: mongodb://localhost:27017/locket_db
        echo Usage: Individual development
    ) else (
        echo .env.local not found! Creating from current .env...
        copy .env .env.local >nul 2>&1
        echo Created backup in .env.local
    )
) else if "%choice%"=="2" (
    echo.
    echo Switching to MongoDB Atlas...
    if exist .env.atlas (
        copy .env.atlas .env >nul 2>&1
        echo Successfully switched to ATLAS MongoDB
        echo Database: MongoDB Atlas (Cloud)
        echo Usage: Team sharing
        echo.
        echo IMPORTANT: Make sure you've updated the connection string
        echo     in .env.atlas with your actual Atlas cluster URL!
    ) else (
        echo .env.atlas not found!
        echo Please setup MongoDB Atlas first and create .env.atlas
        echo See setup-atlas.md for detailed instructions
    )
) else (
    echo.
    echo Invalid choice! Please run again and choose 1 or 2.
)

echo.
echo Current .env configuration:
echo ================================================
type .env | findstr MONGODB_URI
echo ================================================
echo.
pause 