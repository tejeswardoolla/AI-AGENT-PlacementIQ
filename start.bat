@echo off
echo ============================================
echo    PlacementIQ - Starting Application
echo ============================================
echo.

echo [1/2] Starting Backend (http://localhost:5000)...
start "PlacementIQ Backend" cmd /k "cd /d %~dp0backend && node server.js"

echo [2/2] Starting Frontend (http://localhost:5173)...
timeout /t 2 /nobreak > nul
start "PlacementIQ Frontend" cmd /k "cd /d %~dp0frontend && node node_modules/vite/bin/vite.js"

echo.
echo ============================================
echo Application starting...
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo ============================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul
start http://localhost:5173
