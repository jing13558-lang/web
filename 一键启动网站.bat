@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "SITE_PORT=4173"
set "SITE_PYTHON=C:\Users\26934\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if not exist "%SITE_PYTHON%" (
  where py >nul 2>nul
  if not errorlevel 1 set "SITE_PYTHON=py"
)

if not exist "%SITE_PYTHON%" if not "%SITE_PYTHON%"=="py" (
  where python >nul 2>nul
  if errorlevel 1 (
    echo 未找到 Python，将直接打开静态网页。
    start "" "%~dp0index.html"
    pause
    exit /b
  )
  set "SITE_PYTHON=python"
)

start "Control Lab 本地服务" /min "%SITE_PYTHON%" -m http.server %SITE_PORT% --bind 127.0.0.1
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:%SITE_PORT%"
