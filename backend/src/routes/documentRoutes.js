const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const documentService = require('../services/documentService');
const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');
const ttsService = require('../services/ttsService');
const logger = require('../utils/logger');
const { validateDocumentUpload } = require('../middleware/validation');

const router = express.Router();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use: JPEG, PNG, WebP ou PDF'));
    }
  }
});

/**
 * POST /api/documents/process-image
 * Processa uma imagem de documento
 */
router.post('/process-image', upload.single('document'), validateDocumentUpload, async (req, res) => {
  try {
    const { file } = req;
    const sessionId = uuidv4();
    
    logger.info(`📸 Processando imagem: ${file.originalname}`, { sessionId });

    // Etapa 1: Extrair texto da imagem usando OCR
    const extractedText = await ocrService.extractTextFromImage(file.path);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        error: 'Não foi possível extrair texto da imagem. Verifique se o documento está legível.',
        code: 'NO_TEXT_EXTRACTED'
      });
    }

    // Etapa 2: Traduzir para linguagem simples usando IA
    const translation = await aiService.translateToSimpleLanguage(extractedText);

    // Etapa 3: Gerar áudio da explicação
    const audioPath = await ttsService.generateAudio(translation.explanation, sessionId);

    // Limpar arquivo temporário
    await fs.unlink(file.path);

    // Resposta
    res.json({
      sessionId,
      originalText: extractedText,
      translation: {
        explanation: translation.explanation,
        summary: translation.summary,
        actionItems: translation.actionItems
      },
      audioUrl: `/audio/${path.basename(audioPath)}`,
      processedAt: new Date().toISOString()
    });

    logger.info(`✅ Documento processado com sucesso`, { sessionId });

  } catch (error) {
    logger.error('❌ Erro ao processar imagem:', error);
    
    // Limpar arquivo se existir
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        logger.error('Erro ao limpar arquivo:', cleanupError);
      }
    }

    res.status(500).json({
      error: 'Erro interno do servidor. Tente novamente em alguns instantes.',
      code: 'PROCESSING_ERROR'
    });
  }
});

/**
 * POST /api/documents/process-pdf
 * Processa um arquivo PDF
 */
router.post('/process-pdf', upload.single('document'), validateDocumentUpload, async (req, res) => {
  try {
    const { file } = req;
    const sessionId = uuidv4();
    
    logger.info(`📄 Processando PDF: ${file.originalname}`, { sessionId });

    // Etapa 1: Extrair texto do PDF
    const extractedText = await documentService.extractTextFromPDF(file.path);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        error: 'Não foi possível extrair texto do PDF. Verifique se o documento não está protegido.',
        code: 'NO_TEXT_EXTRACTED'
      });
    }

    // Etapa 2: Traduzir para linguagem simples
    const translation = await aiService.translateToSimpleLanguage(extractedText);

    // Etapa 3: Gerar áudio
    const audioPath = await ttsService.generateAudio(translation.explanation, sessionId);

    // Limpar arquivo temporário
    await fs.unlink(file.path);

    res.json({
      sessionId,
      originalText: extractedText,
      translation: {
        explanation: translation.explanation,
        summary: translation.summary,
        actionItems: translation.actionItems
      },
      audioUrl: `/audio/${path.basename(audioPath)}`,
      processedAt: new Date().toISOString()
    });

    logger.info(`✅ PDF processado com sucesso`, { sessionId });

  } catch (error) {
    logger.error('❌ Erro ao processar PDF:', error);
    
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        logger.error('Erro ao limpar arquivo:', cleanupError);
      }
    }

    res.status(500).json({
      error: 'Erro interno do servidor. Tente novamente em alguns instantes.',
      code: 'PROCESSING_ERROR'
    });
  }
});

/**
 * POST /api/documents/process-audio
 * Processa um áudio com dúvida do usuário
 */
router.post('/process-audio', upload.single('audio'), async (req, res) => {
  try {
    const { file } = req;
    const sessionId = uuidv4();
    
    logger.info(`🎤 Processando áudio: ${file.originalname}`, { sessionId });

    // Etapa 1: Converter áudio para texto (Speech-to-Text)
    const transcription = await documentService.transcribeAudio(file.path);
    
    if (!transcription || transcription.trim().length === 0) {
      return res.status(400).json({
        error: 'Não foi possível entender o áudio. Tente gravar novamente em ambiente mais silencioso.',
        code: 'NO_TRANSCRIPTION'
      });
    }

    // Etapa 2: Processar a dúvida com IA
    const response = await aiService.answerQuestion(transcription);

    // Etapa 3: Gerar áudio da resposta
    const audioPath = await ttsService.generateAudio(response.explanation, sessionId);

    // Limpar arquivo temporário
    await fs.unlink(file.path);

    res.json({
      sessionId,
      userQuestion: transcription,
      response: {
        explanation: response.explanation,
        suggestions: response.suggestions
      },
      audioUrl: `/audio/${path.basename(audioPath)}`,
      processedAt: new Date().toISOString()
    });

    logger.info(`✅ Áudio processado com sucesso`, { sessionId });

  } catch (error) {
    logger.error('❌ Erro ao processar áudio:', error);
    
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        logger.error('Erro ao limpar arquivo:', cleanupError);
      }
    }

    res.status(500).json({
      error: 'Erro interno do servidor. Tente novamente em alguns instantes.',
      code: 'PROCESSING_ERROR'
    });
  }
});

/**
 * GET /api/documents/session/:sessionId
 * Recupera informações de uma sessão
 */
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Aqui você poderia implementar um sistema de cache/database
    // Por simplicidade, retornamos apenas o status
    
    res.json({
      sessionId,
      status: 'active',
      message: 'Sessão encontrada'
    });
    
  } catch (error) {
    logger.error('❌ Erro ao buscar sessão:', error);
    res.status(500).json({
      error: 'Erro ao buscar sessão',
      code: 'SESSION_ERROR'
    });
  }
});

module.exports = router;