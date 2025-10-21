const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'StoreData API is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Endpoint para dados de apps (simulado)
app.get('/api/app-data/:store/:appId', (req, res) => {
  const { store, appId } = req.params;
  const { country = 'br', limit = 300 } = req.query;
  
  console.log(`📱 Requisição recebida: ${store}/${appId} (${country}, limit: ${limit})`);
  
  // Simular dados de reviews
  const reviews = [];
  const reviewCount = Math.min(parseInt(limit), 300);
  
  for (let i = 1; i <= reviewCount; i++) {
    reviews.push({
      id: `review_${i}`,
      rating: Math.floor(Math.random() * 5) + 1,
      title: `Review ${i}`,
      content: `Conteúdo da review ${i} para o app ${appId}`,
      author: `Usuario${i}`,
      version: '1.0.0',
      reviewedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      developerReply: Math.random() > 0.7 ? `Resposta do desenvolvedor ${i}` : null,
      developerRepliedAt: Math.random() > 0.7 ? new Date().toISOString() : null,
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)]
    });
  }
  
  res.json({
    success: true,
    data: {
      appId,
      store,
      country,
      reviews,
      totalReviews: reviews.length,
      message: `Dados simulados para ${store}/${appId}`
    }
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'StoreData API - Versão Simplificada',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      appData: '/api/app-data/:store/:appId'
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    message: 'Verifique a documentação da API',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 StoreData API (Simplificada) rodando na porta ${PORT}`);
  console.log(`📱 Google Play: http://localhost:${PORT}/api/app-data/google/:appId`);
  console.log(`🍎 App Store: http://localhost:${PORT}/api/app-data/apple/:appId`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
