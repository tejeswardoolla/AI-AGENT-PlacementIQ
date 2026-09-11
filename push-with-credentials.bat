@echo off
setlocal
cls
echo =======================================================
echo   PlacementIQ - GitHub Push Authentication Prompt
echo =======================================================
echo.
echo Remote: https://github.com/tejeswardoolla/AI-AGENT-PlacementIQ.git
echo Branch: main
echo.
echo GITHUB AUTHENTICATION INSTRUCTIONS:
echo - Username: tejeswardoolla (or your GitHub username)
echo - Password: Paste your GitHub Personal Access Token (PAT)
echo   (Tokens are hidden while typing/pasting)
echo.
echo Starting push...
echo -------------------------------------------------------

set "PATH=C:\Users\LAB 02 - SYSTEM 39\flutter\bin\mingit\cmd;C:\Users\LAB 02 - SYSTEM 39\flutter\bin\mingit\mingw64\libexec\git-core;%PATH%"

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo =======================================================
    echo [SUCCESS] PlacementIQ pushed to GitHub successfully!
    echo =======================================================
) else (
    echo =======================================================
    echo [NOTICE] Push exited with code %ERRORLEVEL%.
    echo If authentication failed, ensure your PAT has 'repo' scope.
    echo =======================================================
)
echo.
pause
