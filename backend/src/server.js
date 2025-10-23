const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const documentRoutes = require('./routes/documentRoutes');
const healthRoutes = require('./routes/healthRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de segurança
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Muitas tentativas. Tente novamente em alguns minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});
app.use('/api/', limiter);

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (áudios gerados)
app.use('/audio', express.static(path.join(__dirname, '../uploads/audio')));

// Rotas
app.use('/api/health', healthRoutes);
app.use('/api/documents', documentRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🇧🇷 Decifra.Cidadão API - Traduzindo burocracia para o povo brasileiro!',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      documents: '/api/documents'
    }
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor Decifra.Cidadão rodando na porta ${PORT}`);
  logger.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🎯 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;