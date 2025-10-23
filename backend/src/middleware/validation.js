const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Middleware de validação para upload de documentos
 */
const validateDocumentUpload = (req, res, next) => {
  try {
    // Verificar se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({
        error: 'Nenhum arquivo foi enviado. Por favor, selecione um documento.',
        code: 'NO_FILE_UPLOADED'
      });
    }

    const { file } = req;

    // Validar tamanho do arquivo
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return res.status(400).json({
        error: `Arquivo muito grande. Tamanho máximo permitido: ${(maxSize / 1024 / 1024).toFixed(1)}MB`,
        code: 'FILE_TOO_LARGE'
      });
    }

    // Validar tipo de arquivo
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedDocumentTypes = ['application/pdf'];
    const allowedAudioTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg'];
    
    const allAllowedTypes = [...allowedImageTypes, ...allowedDocumentTypes, ...allowedAudioTypes];
    
    if (!allAllowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: 'Tipo de arquivo não suportado. Use: JPEG, PNG, WebP, PDF, WAV, MP3 ou WebM.',
        code: 'INVALID_FILE_TYPE',
        supportedTypes: allAllowedTypes
      });
    }

    // Log da validação
    logger.info(`✅ Arquivo validado: ${file.originalname} (${file.mimetype}, ${(file.size / 1024).toFixed(1)}KB)`);

    next();

  } catch (error) {
    logger.error('❌ Erro na validação do arquivo:', error);
    res.status(500).json({
      error: 'Erro interno na validação do arquivo',
      code: 'VALIDATION_ERROR'
    });
  }
};

/**
 * Middleware de validação para dados de sessão
 */
const validateSessionData = (req, res, next) => {
  const schema = Joi.object({
    sessionId: Joi.string().uuid().required(),
    userAgent: Joi.string().optional(),
    timestamp: Joi.date().optional()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Dados de sessão inválidos',
      details: error.details[0].message,
      code: 'INVALID_SESSION_DATA'
    });
  }

  next();
};

/**
 * Middleware de validação para texto de entrada
 */
const validateTextInput = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().min(10).max(50000).required(),
    language: Joi.string().valid('pt', 'pt-BR', 'en').optional().default('pt-BR'),
    context: Joi.string().max(1000).optional()
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Dados de texto inválidos',
      details: error.details[0].message,
      code: 'INVALID_TEXT_INPUT'
    });
  }

  // Adicionar dados validados ao request
  req.validatedData = value;

  next();
};

/**
 * Middleware de validação para configurações de áudio
 */
const validateAudioConfig = (req, res, next) => {
  const schema = Joi.object({
    voiceName: Joi.string().optional(),
    speakingRate: Joi.number().min(0.25).max(4.0).optional().default(0.9),
    pitch: Joi.number().min(-20.0).max(20.0).optional().default(0),
    volumeGain: Joi.number().min(-96.0).max(16.0).optional().default(0),
    audioFormat: Joi.string().valid('MP3', 'WAV', 'OGG_OPUS').optional().default('MP3')
  });

  const { error, value } = schema.validate(req.body.audioConfig || {});

  if (error) {
    return res.status(400).json({
      error: 'Configuração de áudio inválida',
      details: error.details[0].message,
      code: 'INVALID_AUDIO_CONFIG'
    });
  }

  // Adicionar configuração validada ao request
  req.audioConfig = value;

  next();
};

/**
 * Middleware de sanitização de dados
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitizar strings em req.body
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitizar query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    next();

  } catch (error) {
    logger.error('❌ Erro na sanitização:', error);
    res.status(500).json({
      error: 'Erro no processamento dos dados',
      code: 'SANITIZATION_ERROR'
    });
  }
};

/**
 * Função auxiliar para sanitizar objetos
 * @param {Object} obj - Objeto a ser sanitizado
 * @returns {Object} - Objeto sanitizado
 */
function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Remover caracteres potencialmente perigosos
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover scripts
        .replace(/javascript:/gi, '') // Remover javascript:
        .replace(/on\w+\s*=/gi, '') // Remover event handlers
        .trim();
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Middleware de validação de rate limiting personalizado
 */
const validateRateLimit = (req, res, next) => {
  const userIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'unknown';
  
  // Log da requisição para monitoramento
  logger.info(`📝 Requisição: ${req.method} ${req.path}`, {
    ip: userIP,
    userAgent,
    timestamp: new Date().toISOString()
  });

  next();
};

module.exports = {
  validateDocumentUpload,
  validateSessionData,
  validateTextInput,
  validateAudioConfig,
  sanitizeInput,
  validateRateLimit
};