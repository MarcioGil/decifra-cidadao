const logger = require('../utils/logger');

/**
 * Middleware global de tratamento de erros
 */
const errorHandler = (err, req, res, next) => {
  // Log do erro
  logger.error('❌ Erro na aplicação:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Erros de validação do Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Dados inválidos enviados',
      details: err.details[0].message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Erros do Multer (upload de arquivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'Arquivo muito grande. Tamanho máximo permitido: 10MB',
      code: 'FILE_TOO_LARGE'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Campo de arquivo inválido ou múltiplos arquivos não permitidos',
      code: 'INVALID_FILE_FIELD'
    });
  }

  // Erros de tipos de arquivo não suportados
  if (err.message && err.message.includes('não suportado')) {
    return res.status(400).json({
      error: err.message,
      code: 'UNSUPPORTED_FILE_TYPE'
    });
  }

  // Erros de autenticação de APIs externas
  if (err.code === 'UNAUTHENTICATED' || err.message.includes('authentication')) {
    return res.status(503).json({
      error: 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.',
      code: 'SERVICE_UNAVAILABLE',
      technical: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erros de quota de APIs externas
  if (err.code === 'insufficient_quota' || err.message.includes('quota')) {
    return res.status(503).json({
      error: 'Limite de uso temporariamente excedido. Tente novamente em alguns minutos.',
      code: 'QUOTA_EXCEEDED'
    });
  }

  // Erros de rede/timeout
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({
      error: 'Serviço temporariamente indisponível. Verifique sua conexão e tente novamente.',
      code: 'NETWORK_ERROR'
    });
  }

  // Erros de parsing JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Dados JSON inválidos enviados',
      code: 'INVALID_JSON'
    });
  }

  // Erros de arquivo não encontrado
  if (err.code === 'ENOENT') {
    return res.status(404).json({
      error: 'Arquivo não encontrado',
      code: 'FILE_NOT_FOUND'
    });
  }

  // Erros de permissão de arquivo
  if (err.code === 'EACCES') {
    return res.status(500).json({
      error: 'Erro de permissão no servidor. Tente novamente.',
      code: 'PERMISSION_ERROR'
    });
  }

  // Erros de espaço em disco
  if (err.code === 'ENOSPC') {
    return res.status(507).json({
      error: 'Espaço insuficiente no servidor. Tente novamente mais tarde.',
      code: 'INSUFFICIENT_STORAGE'
    });
  }

  // Erro padrão do servidor
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 
    ? 'Erro interno do servidor. Nosso time foi notificado.' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

/**
 * Middleware para capturar rotas não encontradas
 */
const notFoundHandler = (req, res) => {
  logger.warn(`🔍 Rota não encontrada: ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    error: 'Endpoint não encontrado',
    message: `A rota ${req.method} ${req.url} não existe`,
    code: 'NOT_FOUND',
    suggestions: [
      'Verifique se a URL está correta',
      'Consulte a documentação da API',
      'Use GET /api/health para verificar se a API está funcionando'
    ],
    availableEndpoints: {
      health: 'GET /api/health',
      processImage: 'POST /api/documents/process-image',
      processPDF: 'POST /api/documents/process-pdf',
      processAudio: 'POST /api/documents/process-audio'
    }
  });
};

/**
 * Middleware para capturar erros async/await não tratados
 */
const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handler para erros não capturados do processo
 */
const setupGlobalErrorHandlers = () => {
  // Capturar exceções não tratadas
  process.on('uncaughtException', (err) => {
    logger.error('💥 Exceção não capturada:', err);
    
    // Dar tempo para logs serem escritos antes de sair
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  // Capturar promises rejeitadas não tratadas
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 Promise rejeitada não tratada:', {
      reason,
      promise
    });
    
    // Em produção, você pode querer sair do processo
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  });

  // Capturar sinais de término
  process.on('SIGTERM', () => {
    logger.info('🛑 SIGTERM recebido. Encerrando aplicação...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('🛑 SIGINT recebido. Encerrando aplicação...');
    process.exit(0);
  });
};

module.exports = {
  errorHandler,
  notFoundHandler, 
  asyncErrorHandler,
  setupGlobalErrorHandlers
};