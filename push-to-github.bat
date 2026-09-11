@echo off
setlocal
echo ============================================
echo   Pushing PlacementIQ to GitHub
echo ============================================
echo.

set "PATH=C:\Users\LAB 02 - SYSTEM 39\flutter\bin\mingit\cmd;%PATH%"

echo Remote configured: https://github.com/tejeswardoolla/AI-AGENT-PlacementIQ.git
echo Branch: main
echo.
echo Executing: git push -u origin main
echo (If prompted, sign in to your GitHub account or enter your Personal Access Token)
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   Successfully pushed to GitHub!
    echo ============================================
) else (
    echo.
    echo --------------------------------------------
    echo Push paused or authentication needed.
    echo If using a Personal Access Token, you can run:
    echo git push https://<TOKEN>@github.com/tejeswardoolla/AI-AGENT-PlacementIQ.git main
    echo --------------------------------------------
)

pause
