# 📱 StoreData API - Documentação Completa

## 🚀 Endpoints Disponíveis

### **1. Dados Básicos do App (Sem Avaliações)**
```
GET /api/app-data/:store/:appId?country=br
```

**Parâmetros:**
- `store`: `google` ou `apple`
- `appId`: ID do app (string para Google, número para Apple)
- `country`: País (opcional, padrão: `br`)

**Exemplos:**
```bash
# Google Play - Icatu
GET /api/app-data/google/br.com.icatuseguros.appicatu?country=br

# Apple Store - Icatu
GET /api/app-data/apple/1667555669?country=br
```

**Resposta Google Play:**
```json
{
  "success": true,
  "timestamp": "2025-10-19T15:30:00.000Z",
  "store": "google",
  "appId": "br.com.icatuseguros.appicatu",
  "country": "br",
  "data": {
    "id": "br.com.icatuseguros.appicatu",
    "title": "Icatu",
    "developer": "Oficial Icatu Seguros",
    "score": 4.4455447,
    "reviews": 180,
    "histogram": {"1": 16, "2": 3, "3": 3, "4": 18, "5": 140},
    "price": 0,
    "free": true,
    "currency": "BRL",
    "size": "VARY",
    "version": "VARY",
    "genre": "Negócios",
    "genreId": "BUSINESS",
    "contentRating": "Everyone",
    "icon": "https://play-lh.googleusercontent.com/90K6i78PsN0Ziqar-j8FsnQUHasi9bFCCK7vwul0bZQGrkxR25ihPvjnmRmECJEhbE4",
    "url": "https://play.google.com/store/apps/details?id=br.com.icatuseguros.appicatu&hl=pt&gl=br"
  }
}
```

**Resposta Apple Store:**
```json
{
  "success": true,
  "timestamp": "2025-10-19T15:30:00.000Z",
  "store": "apple",
  "appId": 1667555669,
  "country": "br",
  "data": {
    "id": 1667555669,
    "title": "Icatu",
    "developer": "Icatu Seguros",
    "score": 3.47458,
    "reviews": 59,
    "price": 0,
    "free": true,
    "currency": "BRL",
    "size": "91315200",
    "version": "2.7.33",
    "genre": "Finance",
    "genreId": 6015,
    "contentRating": "4+",
    "icon": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f7/37/b7/f737b7cd-6ce5-8dc6-2471-8ee5588c3221/AppIcon-1x_U007epad-0-8-0-85-220-0.png/512x512bb.jpg",
    "url": "https://apps.apple.com/br/app/icatu/id1667555669?uo=4"
  }
}
```

---

### **2. Apenas Avaliações (Sem Dados Básicos)**
```
GET /api/reviews/:store/:appId?country=br&reviewsCount=10
```

**Parâmetros:**
- `store`: `google` ou `apple`
- `appId`: ID do app (string para Google, número para Apple)
- `country`: País (opcional, padrão: `br`)
- `reviewsCount`: Número de avaliações (opcional, padrão: `10`)

**Exemplos:**
```bash
# Google Play - 50 avaliações
GET /api/reviews/google/br.com.icatuseguros.appicatu?country=br&reviewsCount=50

# Apple Store - 5 avaliações (com respostas do desenvolvedor)
GET /api/reviews/apple/1667555669?country=br&reviewsCount=5
```

**Resposta Google Play:**
```json
{
  "success": true,
  "timestamp": "2025-10-19T15:30:00.000Z",
  "store": "google",
  "appId": "br.com.icatuseguros.appicatu",
  "country": "br",
  "reviewsCount": 50,
  "actualCount": 50,
  "data": [
    {
      "id": "6bc2f0fb-bb17-4ac0-a4c2-9b6422aef4d8",
      "userName": "Loja adona cegonha",
      "userImage": "https://play-lh.googleusercontent.com/a-/ALV-UjXSU0jiVrip6cBdDwQcV4WsBD1qjgQEKlcd9lFsFG6N-CTenUk",
      "score": 5,
      "date": "2025-10-17T23:30:04.596Z",
      "text": "ok",
      "title": null,
      "replyText": null,
      "replyDate": null,
      "version": null,
      "thumbsUp": 0
    },
    {
      "id": "16cbd768-a96e-4289-a37f-ca60cb64aa5d",
      "userName": "Bruno França",
      "userImage": "https://play-lh.googleusercontent.com/a-/ALV-UjUDoSOTaBkeXYapDowqhtAYATFkc2J_y4VHKY-tG8eNxwVQD7IW",
      "score": 2,
      "date": "2025-10-17T21:22:28.717Z",
      "text": "muitos erros de login",
      "title": null,
      "replyText": null,
      "replyDate": null,
      "version": "2.7.33",
      "thumbsUp": 0
    }
  ]
}
```

**Resposta Apple Store:**
```json
{
  "success": true,
  "timestamp": "2025-10-19T15:30:00.000Z",
  "store": "apple",
  "appId": 1667555669,
  "country": "br",
  "reviewsCount": 5,
  "actualCount": 5,
  "data": [
    {
      "id": "13271143617",
      "userName": "Antonia Carolina",
      "userUrl": "https://itunes.apple.com/br/reviews/id607815979",
      "score": 5,
      "title": "Excelente",
      "text": "Experiência e usabilidade ótimas!",
      "updated": "2025-10-15T13:50:50-07:00",
      "url": "https://itunes.apple.com/br/review?id=1667555669&type=Purple%20Software",
      "version": "2.7.33",
      "replyText": "Olá Antonia Carolina, agradecemos o seu comentário e sua confiança. Seu feedback é muito importante. Conte sempre com a gente!!!",
      "replyDate": null
    },
    {
      "id": "13258916429",
      "userName": "Eder Budô",
      "userUrl": "https://itunes.apple.com/br/reviews/id956802914",
      "score": 5,
      "title": "Melhor aplicativo para investimento",
      "text": "Excelente, fácil o entendimento.",
      "updated": "2025-10-12T16:08:12-07:00",
      "url": "https://itunes.apple.com/br/review?id=1667555669&type=Purple%20Software",
      "version": "2.7.33",
      "replyText": null,
      "replyDate": null
    }
  ]
}
```

---

### **3. Dados Completos (Básicos + Avaliações)**
```
GET /api/complete/:store/:appId?country=br&reviewsCount=10
```

**Parâmetros:**
- `store`: `google` ou `apple`
- `appId`: ID do app (string para Google, número para Apple)
- `country`: País (opcional, padrão: `br`)
- `reviewsCount`: Número de avaliações (opcional, padrão: `10`)

**Exemplos:**
```bash
# Google Play - Dados completos
GET /api/complete/google/br.com.icatuseguros.appicatu?country=br&reviewsCount=100

# Apple Store - Dados completos
GET /api/complete/apple/1667555669?country=br&reviewsCount=50
```

**Resposta Google Play:**
```json
{
  "success": true,
  "timestamp": "2025-10-19T15:30:00.000Z",
  "store": "google",
  "appId": "br.com.icatuseguros.appicatu",
  "country": "br",
  "reviewsCount": 100,
  "data": {
    "app": {
      "id": "br.com.icatuseguros.appicatu",
      "title": "Icatu",
      "developer": "Oficial Icatu Seguros",
      "score": 4.4455447,
      "reviews": 180,
      "histogram": {"1": 16, "2": 3, "3": 3, "4": 18, "5": 140},
      "price": 0,
      "free": true,
      "currency": "BRL",
      "size": "VARY",
      "version": "VARY",
      "genre": "Negócios",
      "genreId": "BUSINESS",
      "contentRating": "Everyone",
      "icon": "https://play-lh.googleusercontent.com/90K6i78PsN0Ziqar-j8FsnQUHasi9bFCCK7vwul0bZQGrkxR25ihPvjnmRmECJEhbE4",
      "url": "https://play.google.com/store/apps/details?id=br.com.icatuseguros.appicatu&hl=pt&gl=br"
    },
    "reviews": [
      {
        "id": "6bc2f0fb-bb17-4ac0-a4c2-9b6422aef4d8",
        "userName": "Loja adona cegonha",
        "userImage": "https://play-lh.googleusercontent.com/a-/ALV-UjXSU0jiVrip6cBdDwQcV4WsBD1qjgQEKlcd9lFsFG6N-CTenUk",
        "score": 5,
        "date": "2025-10-17T23:30:04.596Z",
        "text": "ok",
        "title": null,
        "replyText": null,
        "replyDate": null,
        "version": null,
        "thumbsUp": 0
      }
    ]
  }
}
```

**Resposta Apple Store:**
```json
{
  "success": true,
  "timestamp": "2025-10-19T15:30:00.000Z",
  "store": "apple",
  "appId": 1667555669,
  "country": "br",
  "reviewsCount": 50,
  "data": {
    "app": {
      "id": 1667555669,
      "title": "Icatu",
      "developer": "Icatu Seguros",
      "score": 3.47458,
      "reviews": 59,
      "price": 0,
      "free": true,
      "currency": "BRL",
      "size": "91315200",
      "version": "2.7.33",
      "genre": "Finance",
      "genreId": 6015,
      "contentRating": "4+",
      "icon": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f7/37/b7/f737b7cd-6ce5-8dc6-2471-8ee5588c3221/AppIcon-1x_U007epad-0-8-0-85-220-0.png/512x512bb.jpg",
      "url": "https://apps.apple.com/br/app/icatu/id1667555669?uo=4"
    },
    "reviews": [
      {
        "id": "13271143617",
        "userName": "Antonia Carolina",
        "userUrl": "https://itunes.apple.com/br/reviews/id607815979",
        "score": 5,
        "title": "Excelente",
        "text": "Experiência e usabilidade ótimas!",
        "updated": "2025-10-15T13:50:50-07:00",
        "url": "https://itunes.apple.com/br/review?id=1667555669&type=Purple%20Software",
        "version": "2.7.33",
        "replyText": "Olá Antonia Carolina, agradecemos o seu comentário e sua confiança. Seu feedback é muito importante. Conte sempre com a gente!!!",
        "replyDate": null
      }
    ]
  }
}
```

---

### **4. Ambas as Lojas (Método Original)**
```
POST /api/scrape
```

**Body:**
```json
{
  "googleAppId": "br.com.icatuseguros.appicatu",
  "appleAppId": 1667555669,
  "reviewsCount": 10,
  "country": "br"
}
```

---

### **5. Loja Específica (Método Original)**
```
POST /api/scrape/single
```

**Body:**
```json
{
  "store": "google",
  "appId": "br.com.icatuseguros.appicatu",
  "reviewsCount": 10,
  "country": "br"
}
```

---

## 📊 Limites por Loja

### **🍎 Apple App Store:**
- ✅ **Dados básicos**: ~2-3 segundos
- ✅ **Avaliações**: Até 500 por sessão (10 páginas × 50)
- ✅ **Respostas do desenvolvedor**: Disponível (método Puppeteer)
- ⚠️ **Rate limiting**: Após 10 páginas

### **🤖 Google Play Store:**
- ✅ **Dados básicos**: ~1-2 segundos
- ✅ **Avaliações**: Até 100.000+ por sessão
- ✅ **Respostas do desenvolvedor**: Disponível
- ⚡ **Muito mais rápido** que Apple

---

## 🎯 Casos de Uso Recomendados

### **Para Apps Pequenos (< 100 avaliações):**
```bash
# Dados básicos apenas
GET /api/app-data/google/br.com.icatuseguros.appicatu

# Todas as avaliações
GET /api/reviews/google/br.com.icatuseguros.appicatu?reviewsCount=100
```

### **Para Apps Médios (100-1000 avaliações):**
```bash
# Dados básicos
GET /api/app-data/google/com.whatsapp

# Amostra de avaliações
GET /api/reviews/google/com.whatsapp?reviewsCount=500
```

### **Para Apps Grandes (> 1000 avaliações):**
```bash
# Dados básicos
GET /api/app-data/google/com.google.android.youtube

# Grande amostra de avaliações
GET /api/reviews/google/com.google.android.youtube?reviewsCount=10000
```

---

## 🔧 Vantagens da Nova Estrutura

### **✅ Flexibilidade:**
- Buscar apenas dados básicos quando necessário
- Buscar apenas avaliações quando necessário
- Buscar tudo junto quando necessário

### **✅ Performance:**
- Dados básicos: ~1-3 segundos
- Avaliações: ~1-5 segundos (depende da quantidade)
- Dados completos: ~2-8 segundos

### **✅ Escalabilidade:**
- Suporte a até 100.000 avaliações (Google Play)
- Suporte a até 500 avaliações (Apple Store)
- Rate limiting controlado

### **✅ Compatibilidade:**
- Endpoints originais mantidos
- Novos endpoints adicionais
- Mesma estrutura de resposta
