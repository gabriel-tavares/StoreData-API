# 📱 StoreData API

> **🔒 Projeto Privado** - API profissional para coleta de dados das lojas Google Play e Apple App Store

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

## 🎯 Visão Geral

Esta API permite coletar dados completos de aplicativos das principais lojas de apps do mundo:

- 🍎 **Apple App Store** - Dados + avaliações + respostas do desenvolvedor
- 🤖 **Google Play Store** - Dados + avaliações + respostas do desenvolvedor
- 🌍 **Suporte global** - Dados regionais de qualquer país
- ⚡ **Alta performance** - Até 100.000+ avaliações por requisição
- 🔒 **Seguro e confiável** - Rate limiting e validação completa

## 🚀 Funcionalidades Principais

### 📊 **Coleta de Dados**
- ✅ **Dados básicos do app** - Nota, desenvolvedor, preço, versão, etc.
- ✅ **Avaliações completas** - Texto, nota, data, usuário, versão
- ✅ **Respostas do desenvolvedor** - Captura automática via Puppeteer
- ✅ **Histograma de notas** - Distribuição por estrelas (1-5)
- ✅ **Thumbs Up** - Contagem de curtidas (Google Play)
- ✅ **Dados regionais** - Suporte a países específicos

### 🔧 **Recursos Técnicos**
- ✅ **API REST** com Express.js e validação Joi
- ✅ **Endpoints separados** - Flexibilidade total de uso
- ✅ **UTF-8 completo** - Suporte a emojis e acentos
- ✅ **Rate limiting** - Proteção contra spam
- ✅ **CORS + Helmet** - Segurança máxima
- ✅ **Tratamento de erros** - Respostas consistentes

## 📦 Instalação Rápida

```bash
# 1️⃣ Clone o repositório privado
git clone [URL_DO_REPOSITORIO_PRIVADO]
cd StoreData-API

# 2️⃣ Instale as dependências
npm install

# 3️⃣ Configure o ambiente (opcional)
cp .env.example .env

# 4️⃣ Inicie o servidor
npm run dev
```

**🎉 Pronto! API rodando em `http://localhost:3000`**

## ⚙️ Configuração Avançada

### **Variáveis de Ambiente (.env)**
```bash
# Porta do servidor
PORT=3000

# Ambiente
NODE_ENV=development

# Rate limiting (requisições por minuto)
RATE_LIMIT=100

# Timeout das requisições (ms)
REQUEST_TIMEOUT=30000
```

### **Scripts Disponíveis**
```bash
# 🚀 Desenvolvimento (com hot reload)
npm run dev

# 🏭 Produção
npm start

# 🧪 Testes
npm test

# 📊 Teste da API
npm run test:api

# 🔍 Lint do código
npm run lint
```

## 🔗 Endpoints da API

### **1️⃣ Dados Básicos do App** 
*Coleta apenas informações básicas (sem avaliações)*

```bash
# 🍎 Apple App Store
GET /api/app-data/apple/1667555669?country=br

# 🤖 Google Play Store  
GET /api/app-data/google/br.com.icatuseguros.appicatu?country=br
```

**⚡ Performance**: ~1-3 segundos

### **2️⃣ Apenas Avaliações**
*Coleta apenas as avaliações (sem dados básicos)*

```bash
# 🍎 Apple - 5 avaliações (com respostas do dev)
GET /api/reviews/apple/1667555669?country=br&reviewsCount=5

# 🤖 Google - 50 avaliações
GET /api/reviews/google/br.com.icatuseguros.appicatu?country=br&reviewsCount=50
```

**⚡ Performance**: ~2-5 segundos (depende da quantidade)

### **3️⃣ Dados Completos**
*Coleta dados básicos + avaliações em uma única requisição*

```bash
# 🍎 Apple - Dados + avaliações + respostas
GET /api/complete/apple/1667555669?country=br&reviewsCount=50

# 🤖 Google - Dados + avaliações
GET /api/complete/google/br.com.icatuseguros.appicatu?country=br&reviewsCount=100
```

**⚡ Performance**: ~3-8 segundos

### **4️⃣ Métodos Originais (Compatibilidade)**
*Mantidos para compatibilidade com versões anteriores*

```bash
# 🔄 Ambas as lojas
POST /api/scrape
{
  "googleAppId": "br.com.icatuseguros.appicatu",
  "appleAppId": 1667555669,
  "reviewsCount": 10,
  "country": "br"
}

# 🎯 Loja específica
POST /api/scrape/single
{
  "store": "google",
  "appId": "br.com.icatuseguros.appicatu", 
  "reviewsCount": 10,
  "country": "br"
}
```

## 📊 Limites e Performance Detalhados

| 🏪 Loja | 📊 Dados Básicos | 💬 Avaliações | 💭 Respostas Dev | ⚡ Performance | 🌍 Países |
|---------|------------------|----------------|------------------|----------------|-----------|
| **🍎 Apple Store** | ✅ ~2-3s | ✅ Até 500 | ✅ Via Puppeteer | 🐌 Mais lento | ✅ Todos |
| **🤖 Google Play** | ✅ ~1-2s | ✅ Até 100.000+ | ✅ Nativo | ⚡ Muito rápido | ✅ Todos |

### **📈 Escalabilidade**
- **Google Play**: Suporta até 100.000+ avaliações por requisição
- **Apple Store**: Limite de 500 avaliações por sessão (rate limiting)
- **Rate Limiting**: 100 requisições por minuto por IP
- **Timeout**: 30 segundos por requisição

## 🧪 Apps de Teste Recomendados

### **🏢 Apps Corporativos**
- **Icatu Seguros**: `br.com.icatuseguros.appicatu` (Google) / `1667555669` (Apple)
- **Banco do Brasil**: `br.com.bb.android` (Google) / `328651714` (Apple)

### **📱 Apps Populares**
- **WhatsApp**: `com.whatsapp` (Google) / `310633997` (Apple)
- **Instagram**: `com.instagram.android` (Google) / `389801252` (Apple)
- **YouTube**: `com.google.android.youtube` (Google) / `544007664` (Apple)

### **🎮 Apps de Entretenimento**
- **Netflix**: `com.netflix.mediaclient` (Google) / `363590051` (Apple)
- **Spotify**: `com.spotify.music` (Google) / `324684580` (Apple)

## 📁 Estrutura Detalhada do Projeto

```
📦 StoreData-API/
├── 📁 lib/
│   └── 📁 scrapers/
│       └── 📄 index.js              # 🧠 Scrapers principais
├── 📁 routes/
│   └── 📄 scrape.js                 # 🛣️ Rotas da API
├── 📁 test/                         # 🧪 Testes automatizados
│   ├── 📄 test-google.js
│   ├── 📄 test-apple.js
│   └── 📄 test-complete.js
├── 📄 server.js                     # 🚀 Servidor Express
├── 📄 package.json                  # 📦 Dependências
├── 📄 API-DOCUMENTATION.md          # 📚 Documentação completa
├── 📄 README.md                     # 📖 Este arquivo
└── 📄 .env.example                  # ⚙️ Configuração exemplo
```

## 📋 Dados Coletados por Loja

### **🤖 Google Play Store**
```json
{
  "dados_basicos": {
    "nota_geral": "4.4/5.0",
    "total_avaliacoes": 180,
    "histograma": {"1": 16, "2": 3, "3": 3, "4": 18, "5": 140},
    "desenvolvedor": "Oficial Icatu Seguros",
    "preco": 0,
    "gratuito": true,
    "versao": "VARY",
    "genero": "Negócios"
  },
  "avaliacoes": {
    "nome_usuario": "João Silva",
    "nota": 5,
    "data": "2025-10-17T23:30:04.596Z",
    "texto_completo": "App excelente!",
    "resposta_dev": "Obrigado pelo feedback!",
    "thumbs_up": 5,
    "versao_app": "2.7.33"
  }
}
```

### **🍎 Apple App Store**
```json
{
  "dados_basicos": {
    "nota_geral": "3.47/5.0",
    "total_avaliacoes": 59,
    "desenvolvedor": "Icatu Seguros",
    "preco": 0,
    "gratuito": true,
    "versao": "2.7.33",
    "genero": "Finance"
  },
  "avaliacoes": {
    "nome_usuario": "Antonia Carolina",
    "nota": 5,
    "titulo": "Excelente",
    "texto_completo": "Experiência e usabilidade ótimas!",
    "data": "2025-10-15T13:50:50-07:00",
    "resposta_dev": "Olá Antonia Carolina, agradecemos o seu comentário...",
    "versao_app": "2.7.33"
  }
}
```

## 🔧 Exemplos Práticos de Uso

### **🚀 Teste Rápido**
```bash
# 1️⃣ Iniciar servidor
npm run dev

# 2️⃣ Testar dados básicos (Google)
curl "http://localhost:3000/api/app-data/google/br.com.icatuseguros.appicatu?country=br"

# 3️⃣ Testar avaliações (Apple)
curl "http://localhost:3000/api/reviews/apple/1667555669?country=br&reviewsCount=5"

# 4️⃣ Testar dados completos (Google)
curl "http://localhost:3000/api/complete/google/br.com.icatuseguros.appicatu?country=br&reviewsCount=10"
```

### **💻 Integração em Código**

#### **JavaScript/Node.js**
```javascript
// 📊 Buscar dados básicos
const response = await fetch('/api/app-data/google/br.com.icatuseguros.appicatu?country=br');
const appData = await response.json();

console.log(`📱 App: ${appData.data.title}`);
console.log(`⭐ Nota: ${appData.data.score}/5.0`);
console.log(`📊 Avaliações: ${appData.data.reviews}`);

// 💬 Buscar avaliações
const reviewsResponse = await fetch('/api/reviews/apple/1667555669?country=br&reviewsCount=10');
const reviewsData = await reviewsResponse.json();

reviewsData.data.forEach((review, index) => {
  console.log(`💬 Avaliação ${index + 1}: ${review.userName} - ${review.score}⭐`);
  console.log(`📝 Texto: ${review.text}`);
  if (review.replyText) {
    console.log(`💭 Resposta: ${review.replyText}`);
  }
});
```

#### **Python**
```python
import requests

# 📊 Dados básicos
response = requests.get('http://localhost:3000/api/app-data/google/br.com.icatuseguros.appicatu?country=br')
app_data = response.json()

print(f"📱 App: {app_data['data']['title']}")
print(f"⭐ Nota: {app_data['data']['score']}/5.0")
print(f"📊 Avaliações: {app_data['data']['reviews']}")

# 💬 Avaliações
reviews_response = requests.get('http://localhost:3000/api/reviews/apple/1667555669?country=br&reviewsCount=5')
reviews_data = reviews_response.json()

for i, review in enumerate(reviews_data['data']):
    print(f"💬 Avaliação {i+1}: {review['userName']} - {review['score']}⭐")
    print(f"📝 Texto: {review['text']}")
    if review['replyText']:
        print(f"💭 Resposta: {review['replyText']}")
```

#### **PHP**
```php
<?php
// 📊 Dados básicos
$response = file_get_contents('http://localhost:3000/api/app-data/google/br.com.icatuseguros.appicatu?country=br');
$appData = json_decode($response, true);

echo "📱 App: " . $appData['data']['title'] . "\n";
echo "⭐ Nota: " . $appData['data']['score'] . "/5.0\n";
echo "📊 Avaliações: " . $appData['data']['reviews'] . "\n";

// 💬 Avaliações
$reviewsResponse = file_get_contents('http://localhost:3000/api/reviews/apple/1667555669?country=br&reviewsCount=5');
$reviewsData = json_decode($reviewsResponse, true);

foreach ($reviewsData['data'] as $index => $review) {
    echo "💬 Avaliação " . ($index + 1) . ": " . $review['userName'] . " - " . $review['score'] . "⭐\n";
    echo "📝 Texto: " . $review['text'] . "\n";
    if ($review['replyText']) {
        echo "💭 Resposta: " . $review['replyText'] . "\n";
    }
}
?>
```

## 🎯 Casos de Uso por Tamanho de App

### **📱 Apps Pequenos (< 100 avaliações)**
```bash
# 🎯 Buscar todas as avaliações disponíveis
GET /api/reviews/google/br.com.icatuseguros.appicatu?reviewsCount=100

# 📊 Dados completos em uma requisição
GET /api/complete/google/br.com.icatuseguros.appicatu?reviewsCount=100
```

### **📱 Apps Médios (100-1000 avaliações)**
```bash
# 📈 Amostra representativa
GET /api/reviews/google/com.whatsapp?reviewsCount=500

# 🔍 Análise de tendências
GET /api/reviews/apple/310633997?reviewsCount=200
```

### **📱 Apps Grandes (> 1000 avaliações)**
```bash
# 📊 Grande amostra para análise estatística
GET /api/reviews/google/com.google.android.youtube?reviewsCount=10000

# 🎯 Análise de sentimentos
GET /api/reviews/google/com.netflix.mediaclient?reviewsCount=5000
```

## 🔒 Segurança e Confiabilidade

### **🛡️ Proteções Implementadas**
- ✅ **Rate Limiting** - 100 requisições/minuto por IP
- ✅ **CORS** - Controle de origem configurado
- ✅ **Helmet** - Headers de segurança HTTP
- ✅ **Validação Joi** - Validação rigorosa de todos os inputs
- ✅ **Tratamento de erros** - Respostas consistentes e informativas
- ✅ **Timeout** - Proteção contra requisições travadas
- ✅ **User-Agent** - Simulação de navegador real

### **🔍 Monitoramento**
- ✅ **Health Check** - `GET /api/health`
- ✅ **Logs detalhados** - Morgan middleware
- ✅ **Métricas de performance** - Tempo de resposta
- ✅ **Contadores de uso** - Requisições por endpoint

## 📚 Documentação Completa

### **📖 Arquivo de Documentação**
Consulte `API-DOCUMENTATION.md` para informações detalhadas:

- 📋 **Exemplos completos de JSON** para Google e Apple
- 🔧 **Todos os endpoints** com parâmetros detalhados
- 📊 **Tabelas de performance** e limites
- 🎯 **Casos de uso específicos** por tipo de app
- ⚠️ **Códigos de erro** e troubleshooting
- 🌍 **Suporte a países** e configurações regionais

### **🔗 Links Úteis**
- 📚 [Documentação Express.js](https://expressjs.com/)
- 🛡️ [Helmet Security](https://helmetjs.github.io/)
- ✅ [Joi Validation](https://joi.dev/)
- 🚀 [Puppeteer](https://pptr.dev/)

## 🚀 Integração em Projetos

### **🔄 Web Scraping**
```javascript
// Coleta automática de dados
const scraper = {
  async collectAppData(appId, store) {
    const response = await fetch(`/api/complete/${store}/${appId}?country=br&reviewsCount=100`);
    return await response.json();
  }
};
```

### **📊 Análise de Dados**
```javascript
// Análise de sentimentos
const analyzeSentiment = (reviews) => {
  const positive = reviews.filter(r => r.score >= 4).length;
  const negative = reviews.filter(r => r.score <= 2).length;
  const neutral = reviews.filter(r => r.score === 3).length;
  
  return {
    positive: (positive / reviews.length * 100).toFixed(1) + '%',
    negative: (negative / reviews.length * 100).toFixed(1) + '%',
    neutral: (neutral / reviews.length * 100).toFixed(1) + '%'
  };
};
```

### **📈 Monitoramento de Apps**
```javascript
// Monitoramento contínuo
const monitorApp = async (appId, store) => {
  setInterval(async () => {
    const data = await fetch(`/api/app-data/${store}/${appId}?country=br`);
    const appData = await data.json();
    
    console.log(`📊 ${appData.data.title}: ${appData.data.score}/5.0 (${appData.data.reviews} avaliações)`);
  }, 60000); // A cada minuto
};
```

## 🆘 Suporte e Troubleshooting

### **❌ Problemas Comuns**

#### **🚫 Rate Limiting**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Too many requests, please try again later"
}
```
**💡 Solução**: Aguarde 1 minuto ou implemente retry com backoff

#### **🔍 App Não Encontrado**
```json
{
  "success": false,
  "error": "App não encontrado",
  "message": "Verifique o ID do app e o país"
}
```
**💡 Solução**: Verifique se o app existe na loja do país especificado

#### **⏱️ Timeout**
```json
{
  "success": false,
  "error": "Request timeout",
  "message": "A requisição demorou mais que 30 segundos"
}
```
**💡 Solução**: Reduza o número de avaliações ou tente novamente

### **📞 Contato**
- 📧 **Email**: [seu-email@exemplo.com]
- 🐛 **Issues**: Use o sistema de issues do GitHub
- 📖 **Documentação**: Consulte `API-DOCUMENTATION.md`

---

## 🎉 Conclusão

Esta API oferece uma solução completa e profissional para coleta de dados das principais lojas de aplicativos do mundo. Com foco em performance, segurança e facilidade de uso, é a ferramenta ideal para:

- 📊 **Análise de mercado** de aplicativos
- 🔍 **Monitoramento** de concorrentes
- 📈 **Pesquisa** de produtos
- 🤖 **Automação** de coleta de dados
- 📱 **Desenvolvimento** de ferramentas de análise

**🚀 Comece agora mesmo e transforme dados de apps em insights valiosos!**

---

**📝 Nota**: Este é um projeto privado desenvolvido com foco em performance, confiabilidade e facilidade de integração. Ideal para uso profissional e comercial.