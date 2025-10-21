const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rotas
const healthRoutes = require('./routes/health');
const scrapeRoutes = require('./routes/scrape');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // máximo 100 requisições por minuto por IP
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests, please try again later'
  }
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas
app.use('/api/health', healthRoutes);
app.use('/api', scrapeRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'StoreData API - API profissional para coleta de dados das lojas Google Play e Apple App Store',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      appData: '/api/app-data/:store/:appId',
      reviews: '/api/reviews/:store/:appId',
      complete: '/api/complete/:store/:appId'
    },
    documentation: 'https://github.com/gabriel-tavares/StoreData-API'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    timestamp: new Date().toISOString()
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
app.listen(PORT, () => {
  console.log(`🚀 StoreData API rodando na porta ${PORT}`);
  console.log(`📱 Google Play: http://localhost:${PORT}/api/app-data/google/:appId`);
  console.log(`🍎 App Store: http://localhost:${PORT}/api/app-data/apple/:appId`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Documentação: https://github.com/gabriel-tavares/StoreData-API`);
});

module.exports = app;