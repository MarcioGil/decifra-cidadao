const vision = require('@google-cloud/vision');
const logger = require('../utils/logger');

class OCRService {
  constructor() {
    // Inicializar cliente do Google Vision
    this.client = new vision.ImageAnnotatorClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  /**
   * Extrai texto de uma imagem usando Google Vision API
   * @param {string} imagePath - Caminho para o arquivo de imagem
   * @returns {Promise<string>} - Texto extraído
   */
  async extractTextFromImage(imagePath) {
    try {
      logger.info(`🔍 Iniciando OCR para: ${imagePath}`);

      // Fazer requisição para o Google Vision API
      const [result] = await this.client.textDetection(imagePath);
      const detections = result.textAnnotations;

      if (!detections || detections.length === 0) {
        logger.warn('Nenhum texto detectado na imagem');
        return '';
      }

      // O primeiro elemento contém todo o texto detectado
      const fullText = detections[0].description;
      
      logger.info(`✅ OCR concluído. Texto extraído: ${fullText.length} caracteres`);
      
      return fullText;

    } catch (error) {
      logger.error('❌ Erro no OCR:', error);
      
      // Se for erro de autenticação, dar uma mensagem mais específica
      if (error.code === 'UNAUTHENTICATED') {
        throw new Error('Erro de autenticação com Google Cloud. Verifique as credenciais.');
      }
      
      throw new Error('Erro ao processar a imagem. Tente novamente.');
    }
  }

  /**
   * Detecta o idioma do texto na imagem
   * @param {string} imagePath - Caminho para o arquivo de imagem
   * @returns {Promise<string>} - Código do idioma detectado
   */
  async detectLanguage(imagePath) {
    try {
      const [result] = await this.client.textDetection(imagePath);
      const detections = result.textAnnotations;

      if (!detections || detections.length === 0) {
        return 'pt'; // Assumir português por padrão
      }

      // Tentar detectar o idioma baseado no texto
      const text = detections[0].description;
      
      // Lógica simples de detecção (você pode usar uma biblioteca mais sofisticada)
      const portugueseWords = ['de', 'da', 'do', 'para', 'com', 'em', 'por', 'um', 'uma', 'o', 'a'];
      const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of'];
      
      const words = text.toLowerCase().split(/\s+/);
      const portugueseCount = words.filter(word => portugueseWords.includes(word)).length;
      const englishCount = words.filter(word => englishWords.includes(word)).length;
      
      return portugueseCount > englishCount ? 'pt' : 'en';
      
    } catch (error) {
      logger.error('❌ Erro ao detectar idioma:', error);
      return 'pt'; // Fallback para português
    }
  }

  /**
   * Processa uma imagem com configurações específicas para documentos brasileiros
   * @param {string} imagePath - Caminho para o arquivo de imagem
   * @returns {Promise<Object>} - Resultado detalhado do OCR
   */
  async processDocumentImage(imagePath) {
    try {
      logger.info(`📋 Processando documento brasileiro: ${imagePath}`);

      // Configurações específicas para documentos em português
      const request = {
        image: { source: { filename: imagePath } },
        imageContext: {
          languageHints: ['pt', 'pt-BR'] // Priorizar português brasileiro
        }
      };

      const [result] = await this.client.documentTextDetection(request);
      
      if (!result.fullTextAnnotation) {
        return {
          text: '',
          confidence: 0,
          blocks: []
        };
      }

      const { text, pages } = result.fullTextAnnotation;
      
      // Calcular confiança média
      let totalConfidence = 0;
      let wordCount = 0;
      
      pages.forEach(page => {
        page.blocks.forEach(block => {
          block.paragraphs.forEach(paragraph => {
            paragraph.words.forEach(word => {
              if (word.confidence) {
                totalConfidence += word.confidence;
                wordCount++;
              }
            });
          });
        });
      });

      const averageConfidence = wordCount > 0 ? totalConfidence / wordCount : 0;

      logger.info(`✅ Documento processado. Confiança: ${(averageConfidence * 100).toFixed(2)}%`);

      return {
        text: text || '',
        confidence: averageConfidence,
        blocks: pages[0]?.blocks || [],
        wordCount
      };

    } catch (error) {
      logger.error('❌ Erro ao processar documento:', error);
      throw error;
    }
  }
}

module.exports = new OCRService();