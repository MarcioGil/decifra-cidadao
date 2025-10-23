#!/bin/bash

# Script de configuração inicial do Decifra.Cidadão
# Execute este script após clonar o repositório

set -e

echo "🇧🇷 Configurando Decifra.Cidadão..."
echo "=================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+ antes de continuar."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js versão $NODE_VERSION encontrada. Versão mínima requerida: $REQUIRED_VERSION"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION encontrado"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
echo "=============================="

# Instalar dependências do root
npm install

# Instalar dependências do backend
echo "🔧 Instalando dependências do backend..."
cd backend
npm install
cd ..

# Instalar dependências do frontend
echo "🎨 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

echo "✅ Dependências instaladas com sucesso!"

# Configurar arquivos de ambiente
echo ""
echo "⚙️ Configurando arquivos de ambiente..."
echo "======================================="

# Copiar arquivos .env.example
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

echo "✅ Arquivos .env criados!"
echo ""
echo "🔑 IMPORTANTE: Configure suas chaves de API"
echo "==========================================="
echo "1. Backend (.env):"
echo "   - OPENAI_API_KEY: Sua chave da OpenAI"
echo "   - GOOGLE_CLOUD_PROJECT_ID: ID do projeto Google Cloud"
echo "   - GOOGLE_APPLICATION_CREDENTIALS: Caminho para credenciais JSON"
echo ""
echo "2. Frontend (.env):"
echo "   - REACT_APP_API_URL: URL da API (padrão: http://localhost:5000)"
echo ""

# Criar diretórios necessários
echo "📁 Criando diretórios necessários..."
mkdir -p backend/uploads/audio
mkdir -p backend/logs

echo "✅ Diretórios criados!"

# Verificar se pode executar health check
echo ""
echo "🏥 Testando configuração..."
echo "=========================="

# Executar health check do backend em background
echo "Iniciando backend para teste..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Aguardar alguns segundos
sleep 5

# Tentar health check
if curl -f http://localhost:5000/api/health &> /dev/null; then
    echo "✅ Backend funcionando corretamente!"
else
    echo "⚠️ Backend pode não estar funcionando. Verifique as configurações."
fi

# Matar processo do backend
kill $BACKEND_PID 2>/dev/null || true

echo ""
echo "🎉 Configuração concluída!"
echo "========================"
echo ""
echo "Para executar o projeto:"
echo "- Desenvolvimento: npm run dev"
echo "- Produção: npm start"
echo ""
echo "Para mais informações, consulte o README.md"
echo ""
echo "🚀 Pronto para transformar burocracia em clareza!"