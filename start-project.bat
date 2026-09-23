@echo off

echo ==============================
echo Comprehensive Health Analyzer
echo ==============================
echo.

echo Starting Backend...
start "Health Analyzer Backend" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 3 /nobreak >nul

echo Starting Website...
start "Health Analyzer Website" cmd /k "cd /d "%~dp0backend" && npm run website"

timeout /t 5 /nobreak >nul

echo Opening website...
start "" "http://localhost:5500/index.html"

exit