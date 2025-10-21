#!/bin/bash

# Script de Deploy da StoreData-API para Docker/Coolify
# Autor: Gabriel Tavares
# Data: 2025-01-21

echo "🚀 Iniciando deploy da StoreData-API..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover imagens antigas
echo "🗑️ Removendo imagens antigas..."
docker rmi store-data-api_store-data-api 2>/dev/null || true

# Build da nova imagem
echo "🔨 Fazendo build da nova imagem..."
docker-compose build --no-cache

# Iniciar containers
echo "▶️ Iniciando containers..."
docker-compose up -d

# Aguardar health check
echo "⏳ Aguardando health check..."
sleep 30

# Verificar se está funcionando
echo "🔍 Verificando se a API está funcionando..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ StoreData-API está funcionando!"
    echo "🌐 URL: http://localhost:3001"
    echo "📚 Health Check: http://localhost:3001/api/health"
    echo "📱 Google Play: http://localhost:3001/api/app-data/google/:appId"
    echo "🍎 App Store: http://localhost:3001/api/app-data/apple/:appId"
else
    echo "❌ Erro: StoreData-API não está respondendo"
    echo "📋 Logs:"
    docker-compose logs --tail=20
    exit 1
fi

echo "🎉 Deploy concluído com sucesso!"
