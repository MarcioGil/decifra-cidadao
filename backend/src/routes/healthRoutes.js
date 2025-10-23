const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '🇧🇷 Decifra.Cidadão API funcionando!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    services: {
      ocr: 'Google Vision API',
      ai: 'OpenAI GPT-4',
      tts: 'Google Cloud TTS'
    }
  });
});

/**
 * GET /api/health/detailed
 * Detailed health check with service status
 */
router.get('/detailed', async (req, res) => {
  const healthStatus = {
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    services: {}
  };

  // Verificar serviços externos (você pode implementar checks reais aqui)
  try {
    // Mock check - em produção, você faria requisições reais
    healthStatus.services = {
      openai: { status: 'online', message: 'OpenAI API disponível' },
      googleVision: { status: 'online', message: 'Google Vision API disponível' },
      googleTTS: { status: 'online', message: 'Google TTS API disponível' }
    };
    
    res.json(healthStatus);
  } catch (error) {
    healthStatus.status = 'degraded';
    healthStatus.error = error.message;
    res.status(503).json(healthStatus);
  }
});

module.exports = router;