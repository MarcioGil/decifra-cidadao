const winston = require('winston');
const path = require('path');

// Configurações de formato
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Formato específico para console (mais legível)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${message}`;
    
    // Adicionar metadados se existirem
    if (Object.keys(meta).length > 0) {
      logMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return logMessage;
  })
);

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'decifra-cidadao-api',
    version: '1.0.0'
  },
  transports: [
    // Log de erros em arquivo separado
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        logFormat,
        winston.format.uncolorize()
      )
    }),

    // Log completo em arquivo
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      format: winston.format.combine(
        logFormat,
        winston.format.uncolorize()
      )
    })
  ]
});

// Em desenvolvimento, adicionar logs coloridos no console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
} else {
  // Em produção, adicionar console simples
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
    )
  }));
}

// Criar diretório de logs se não existir
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Funções auxiliares de logging

/**
 * Log de início de processamento
 * @param {string} operation - Operação sendo iniciada
 * @param {Object} metadata - Metadados adicionais
 */
logger.startOperation = (operation, metadata = {}) => {
  logger.info(`🚀 Iniciando: ${operation}`, {
    operation,
    status: 'started',
    ...metadata
  });
};

/**
 * Log de sucesso de operação
 * @param {string} operation - Operação concluída
 * @param {Object} metadata - Metadados adicionais
 */
logger.successOperation = (operation, metadata = {}) => {
  logger.info(`✅ Sucesso: ${operation}`, {
    operation,
    status: 'success',
    ...metadata
  });
};

/**
 * Log de erro de operação
 * @param {string} operation - Operação que falhou
 * @param {Error} error - Erro ocorrido
 * @param {Object} metadata - Metadados adicionais
 */
logger.errorOperation = (operation, error, metadata = {}) => {
  logger.error(`❌ Erro: ${operation}`, {
    operation,
    status: 'error',
    error: error.message,
    stack: error.stack,
    ...metadata
  });
};

/**
 * Log de API externa
 * @param {string} service - Nome do serviço (ex: 'Google Vision', 'OpenAI')
 * @param {string} action - Ação realizada
 * @param {Object} metadata - Metadados adicionais
 */
logger.apiCall = (service, action, metadata = {}) => {
  logger.info(`🌐 API ${service}: ${action}`, {
    service,
    action,
    type: 'api_call',
    ...metadata
  });
};

/**
 * Log de performance
 * @param {string} operation - Operação medida
 * @param {number} duration - Duração em millisegundos
 * @param {Object} metadata - Metadados adicionais
 */
logger.performance = (operation, duration, metadata = {}) => {
  const level = duration > 5000 ? 'warn' : 'info'; // Warn se demorar mais de 5s
  
  logger[level](`⏱️ Performance: ${operation} (${duration}ms)`, {
    operation,
    duration,
    type: 'performance',
    ...metadata
  });
};

/**
 * Log de uso de recursos
 * @param {Object} usage - Informações de uso (memória, CPU, etc.)
 */
logger.resourceUsage = (usage = {}) => {
  const memoryUsage = process.memoryUsage();
  
  logger.info('📊 Uso de recursos', {
    type: 'resource_usage',
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)}MB`
    },
    uptime: `${(process.uptime() / 60).toFixed(2)} min`,
    ...usage
  });
};

/**
 * Log de segurança
 * @param {string} event - Evento de segurança
 * @param {Object} metadata - Metadados de segurança
 */
logger.security = (event, metadata = {}) => {
  logger.warn(`🔒 Segurança: ${event}`, {
    type: 'security',
    event,
    ...metadata
  });
};

// Middleware para logging de requisições HTTP
logger.httpMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Log da requisição
  logger.info(`📥 ${req.method} ${req.url}`, {
    type: 'http_request',
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type')
  });

  // Interceptar a resposta
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    logger.info(`📤 ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`, {
      type: 'http_response',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('Content-Length')
    });
    
    return originalSend.call(this, data);
  };

  next();
};

module.exports = logger;