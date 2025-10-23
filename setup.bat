@echo off
REM Script de configuração inicial do Decifra.Cidadão para Windows
REM Execute este script após clonar o repositório

echo 🇧🇷 Configurando Decifra.Cidadão...
echo ==================================

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Por favor, instale Node.js 18+ antes de continuar.
    echo    Download: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado

REM Instalar dependências
echo.
echo 📦 Instalando dependências...
echo ==============================

REM Instalar dependências do root
npm install

REM Instalar dependências do backend
echo 🔧 Instalando dependências do backend...
cd backend
npm install
cd ..

REM Instalar dependências do frontend
echo 🎨 Instalando dependências do frontend...
cd frontend
npm install
cd ..

echo ✅ Dependências instaladas com sucesso!

REM Configurar arquivos de ambiente
echo.
echo ⚙️ Configurando arquivos de ambiente...
echo =======================================

REM Copiar arquivos .env.example
copy backend\.env.example backend\.env >nul
copy frontend\.env.example frontend\.env >nul

echo ✅ Arquivos .env criados!
echo.
echo 🔑 IMPORTANTE: Configure suas chaves de API
echo ===========================================
echo 1. Backend (.env):
echo    - OPENAI_API_KEY: Sua chave da OpenAI
echo    - GOOGLE_CLOUD_PROJECT_ID: ID do projeto Google Cloud
echo    - GOOGLE_APPLICATION_CREDENTIALS: Caminho para credenciais JSON
echo.
echo 2. Frontend (.env):
echo    - REACT_APP_API_URL: URL da API (padrão: http://localhost:5000)
echo.

REM Criar diretórios necessários
echo 📁 Criando diretórios necessários...
if not exist "backend\uploads\audio" mkdir backend\uploads\audio
if not exist "backend\logs" mkdir backend\logs

echo ✅ Diretórios criados!

echo.
echo 🎉 Configuração concluída!
echo ========================
echo.
echo Para executar o projeto:
echo - Desenvolvimento: npm run dev
echo - Produção: npm start
echo.
echo Para mais informações, consulte o README.md
echo.
echo 🚀 Pronto para transformar burocracia em clareza!
echo.
pause