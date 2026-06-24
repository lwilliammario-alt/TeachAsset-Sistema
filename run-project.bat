@echo off
echo =======================================================
echo Iniciando Sistema TechAsset (Backend + Frontend)
echo =======================================================

echo Iniciando Backend (ASP.NET Core)...
start cmd /k "dotnet run --project backend\TechAsset.API"

echo Iniciando Frontend (React + Vite)...
start cmd /k "cd frontend && npm run dev"

echo =======================================================
echo El backend estara en: http://localhost:5020
echo El frontend estara en: http://localhost:5173
echo =======================================================
pause
