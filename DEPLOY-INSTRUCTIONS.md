# 🐳 Deploy da StoreData-API para Docker/Coolify

## 📋 Instruções para Deploy

### 1. **Preparação**
```bash
# Navegar para o diretório da StoreData-API
cd C:\Projetos\review-analyzer\store-data-api

# Verificar se Docker está rodando
docker --version
docker ps
```

### 2. **Build da Imagem**
```bash
# Parar container existente (se houver)
docker stop store-data-api
docker rm store-data-api

# Remover imagem antiga
docker rmi store-data-api:latest

# Build da nova imagem (usando Dockerfile simplificado)
docker build -t store-data-api:latest .
```

### 3. **Executar Container**
```bash
# Executar container
docker run -d \
  --name store-data-api \
  -p 3001:3001 \
  --restart unless-stopped \
  store-data-api:latest
```

### 4. **Verificar Funcionamento**
```bash
# Aguardar inicialização
sleep 30

# Testar health check
curl http://localhost:3001/api/health

# Testar endpoint de dados básicos
curl "http://localhost:3001/api/app-data/google/br.com.icatuseguros.appicatu?country=br"

# Testar endpoint de reviews
curl "http://localhost:3001/api/reviews/google/br.com.icatuseguros.appicatu?country=br&reviewsCount=10"
```

### 5. **Deploy para Coolify**

#### Opção A: Via Coolify Dashboard
1. Acesse o Coolify Dashboard
2. Vá para o projeto da StoreData-API
3. Clique em "Redeploy" ou "Rebuild"
4. Aguarde o deploy completar

#### Opção B: Via Git Push
```bash
# Fazer commit das alterações
git add .
git commit -m "fix: corrigir parsing de reviews e usar dados reais"
git push origin main

# O Coolify fará deploy automático
```

### 6. **Atualizar Variáveis de Ambiente**

Após o deploy, atualize as variáveis de ambiente do projeto principal:

```bash
# No arquivo .env ou .env.local
STORE_API_BASE_URL=http://uw48kc0gkooggogs480cckcc.148.230.78.115.sslip.io:3001
NEXT_PUBLIC_STORE_API_BASE_URL=http://uw48kc0gkooggogs480cckcc.148.230.78.115.sslip.io:3001
```

### 7. **Testar Integração**

Após o deploy, teste no dashboard:
1. Acesse `http://localhost:3000/dashboard`
2. Clique em "Reviews (300)" para Android
3. Clique em "Reviews (300)" para Apple
4. Verifique se está carregando reviews reais

## 🔧 **Arquivos Criados/Modificados**

- ✅ `Dockerfile` (já existia)
- ✅ `docker-compose.yml` (criado)
- ✅ `deploy-docker.sh` (criado)
- ✅ `deploy.sh` (criado)

## 📊 **Resultado Esperado**

Após o deploy, você deve ver:
- **Android**: ~190 reviews reais carregadas
- **Apple**: ~59 reviews reais carregadas
- **Dados básicos**: Informações reais do app (título, desenvolvedor, score)

## 🚨 **Troubleshooting**

### Se o Docker não estiver funcionando:
1. Instale o Docker Desktop
2. Reinicie o computador
3. Verifique se o Docker está rodando

### Se o deploy falhar:
1. Verifique os logs: `docker logs store-data-api`
2. Verifique se a porta 3001 está livre
3. Teste localmente primeiro: `node server.js`

### Se a API não responder:
1. Verifique se o container está rodando: `docker ps`
2. Teste o health check: `curl http://localhost:3001/api/health`
3. Verifique os logs: `docker logs store-data-api`
