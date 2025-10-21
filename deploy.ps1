# Script de Deploy da StoreData-API para Docker (Windows PowerShell)
# Autor: Gabriel Tavares
# Data: 2025-01-21

Write-Host "🚀 Iniciando deploy da StoreData-API..." -ForegroundColor Green

# Verificar se Docker está rodando
try {
    docker --version | Out-Null
    Write-Host "✅ Docker encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está instalado ou não está no PATH" -ForegroundColor Red
    Write-Host "Por favor, instale o Docker Desktop e tente novamente" -ForegroundColor Yellow
    exit 1
}

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
try {
    docker stop store-data-api 2>$null
    docker rm store-data-api 2>$null
    Write-Host "✅ Containers antigos removidos" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Nenhum container antigo encontrado" -ForegroundColor Blue
}

# Remover imagem antiga
Write-Host "🗑️ Removendo imagem antiga..." -ForegroundColor Yellow
try {
    docker rmi store-data-api:latest 2>$null
    Write-Host "✅ Imagem antiga removida" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Nenhuma imagem antiga encontrada" -ForegroundColor Blue
}

# Build da nova imagem
Write-Host "🔨 Fazendo build da nova imagem..." -ForegroundColor Yellow
try {
    docker build -t store-data-api:latest .
    Write-Host "✅ Build concluído com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no build da imagem" -ForegroundColor Red
    exit 1
}

# Iniciar container
Write-Host "▶️ Iniciando container..." -ForegroundColor Yellow
try {
    docker run -d --name store-data-api -p 3001:3001 --restart unless-stopped store-data-api:latest
    Write-Host "✅ Container iniciado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao iniciar container" -ForegroundColor Red
    exit 1
}

# Aguardar inicialização
Write-Host "⏳ Aguardando inicialização..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar se está funcionando
Write-Host "🔍 Verificando se a API está funcionando..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ StoreData-API está funcionando!" -ForegroundColor Green
        Write-Host "🌐 URL: http://localhost:3001" -ForegroundColor Cyan
        Write-Host "📚 Health Check: http://localhost:3001/api/health" -ForegroundColor Cyan
        Write-Host "📱 Google Play: http://localhost:3001/api/app-data/google/:appId" -ForegroundColor Cyan
        Write-Host "🍎 App Store: http://localhost:3001/api/app-data/apple/:appId" -ForegroundColor Cyan
        Write-Host "📊 Reviews: http://localhost:3001/api/reviews/google/:appId" -ForegroundColor Cyan
    } else {
        throw "Status code: $($response.StatusCode)"
    }
} catch {
    Write-Host "❌ Erro: StoreData-API não está respondendo" -ForegroundColor Red
    Write-Host "📋 Logs:" -ForegroundColor Yellow
    docker logs store-data-api --tail=20
    exit 1
}

Write-Host "🎉 Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Teste a API: curl http://localhost:3001/api/health" -ForegroundColor White
Write-Host "2. Atualize as variáveis de ambiente do projeto principal" -ForegroundColor White
Write-Host "3. Teste os botões no dashboard" -ForegroundColor White
