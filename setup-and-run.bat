@echo off
chcp 65001 >nul
echo ==========================================
echo    Web Tools Collection - 本地运行脚本
echo ==========================================
echo.

:: 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js！
    echo.
    echo 请先安装 Node.js:
    echo 1. 访问 https://nodejs.org/
    echo 2. 下载 LTS 版本 (推荐 20.x)
    echo 3. 运行安装程序，保持默认设置
    echo 4. 安装完成后重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js 已安装
node --version
echo.

:: 设置项目列表
set PROJECTS=privacy-toolbox ai-tools-nav markdown-editor batch-image-processor dev-toolkit
set PORTS=5173 5174 5175 5176 5177

:: 询问用户要运行哪个项目
echo 请选择要运行的项目：
echo 1. privacy-toolbox    (隐私工具箱)      - 端口 5173
echo 2. ai-tools-nav       (AI工具导航)      - 端口 5174
echo 3. markdown-editor   (Markdown编辑器)  - 端口 5175
echo 4. batch-image-processor (批量图片处理) - 端口 5176
echo 5. dev-toolkit       (开发者工具)      - 端口 5177
echo 6. 全部运行 (将打开5个窗口)
echo.
set /p choice="请输入选项 (1-6): "

if "%choice%"=="1" goto run_single
if "%choice%"=="2" goto run_single
if "%choice%"=="3" goto run_single
if "%choice%"=="4" goto run_single
if "%choice%"=="5" goto run_single
if "%choice%"=="6" goto run_all
goto invalid_choice

:run_single
set index=%choice%
setlocal enabledelayedexpansion
set i=1
for %%p in (%PROJECTS%) do (
    if "!i!"=="%index%" (
        set PROJECT=%%p
        for /f "tokens=!i!" %%a in ("%PORTS%") do set PORT=%%a
    )
    set /a i+=1
)
echo.
echo 正在启动 %PROJECT% ...
cd /d "%~dp0\%PROJECT%"

:: 检查 node_modules 是否存在
if not exist "node_modules" (
    echo 首次运行，正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo [错误] 依赖安装失败！
        pause
        exit /b 1
    )
)

echo.
echo ==========================================
echo  项目: %PROJECT%
echo  地址: http://localhost:%PORT%
echo ==========================================
echo.
npm run dev
pause
exit /b 0

:run_all
echo.
echo 正在启动所有项目...
setlocal enabledelayedexpansion
set i=1
for %%p in (%PROJECTS%) do (
    for /f "tokens=!i!" %%a in ("%PORTS%") do (
        echo 启动 %%p (端口 %%a)...
        start "%%p - 端口 %%a" cmd /c "cd /d "%~dp0\%%p" && if not exist node_modules npm install && npm run dev"
        timeout /t 2 >nul
    )
    set /a i+=1
)
echo.
echo ==========================================
echo  所有项目已启动！
echo  隐私工具箱:     http://localhost:5173
echo  AI工具导航:     http://localhost:5174
echo  Markdown编辑器: http://localhost:5175
echo  批量图片处理:   http://localhost:5176
echo  开发者工具:     http://localhost:5177
echo ==========================================
pause
exit /b 0

:invalid_choice
echo [错误] 无效的选择！
pause
exit /b 1
