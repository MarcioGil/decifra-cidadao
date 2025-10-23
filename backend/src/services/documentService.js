const pdfParse = require('pdf-parse');
const speech = require('@google-cloud/speech');
const fs = require('fs').promises;
const logger = require('../utils/logger');

class DocumentService {
  constructor() {
    // Inicializar cliente do Google Cloud Speech-to-Text
    this.speechClient = new speech.SpeechClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  /**
   * Extrai texto de um arquivo PDF
   * @param {string} pdfPath - Caminho para o arquivo PDF
   * @returns {Promise<string>} - Texto extraído do PDF
   */
  async extractTextFromPDF(pdfPath) {
    try {
      logger.info(`📄 Extraindo texto do PDF: ${pdfPath}`);

      const dataBuffer = await fs.readFile(pdfPath);
      const data = await pdfParse(dataBuffer);
      
      const extractedText = data.text;
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('PDF não contém texto legível ou está protegido');
      }
      
      logger.info(`✅ Texto extraído do PDF: ${extractedText.length} caracteres`);
      
      return extractedText;

    } catch (error) {
      logger.error('❌ Erro ao extrair texto do PDF:', error);
      
      if (error.message.includes('Invalid PDF')) {
        throw new Error('Arquivo PDF inválido ou corrompido');
      }
      
      if (error.message.includes('password')) {
        throw new Error('PDF protegido por senha não é suportado');
      }
      
      throw new Error('Erro ao processar PDF. Verifique se o arquivo não está corrompido.');
    }
  }

  /**
   * Converte áudio em texto usando Speech-to-Text
   * @param {string} audioPath - Caminho para o arquivo de áudio
   * @returns {Promise<string>} - Transcrição do áudio
   */
  async transcribeAudio(audioPath) {
    try {
      logger.info(`🎤 Transcrevendo áudio: ${audioPath}`);

      // Ler arquivo de áudio
      const audioBytes = await fs.readFile(audioPath);

      // Configuração para português brasileiro
      const request = {
        audio: {
          content: audioBytes.toString('base64')
        },
        config: {
          encoding: 'WEBM_OPUS', // Formato comum para gravações web
          sampleRateHertz: 48000,
          languageCode: 'pt-BR',
          alternativeLanguageCodes: ['pt-PT'], // Fallback para português europeu
          enableAutomaticPunctuation: true,
          enableWordTimeOffsets: false,
          profanityFilter: false,
          useEnhanced: true, // Modelo aprimorado quando disponível
          model: 'latest_long' // Modelo otimizado para áudio longo
        }
      };

      // Fazer transcrição
      const [response] = await this.speechClient.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      if (!transcription || transcription.trim().length === 0) {
        throw new Error('Não foi possível transcrever o áudio');
      }

      logger.info(`✅ Áudio transcrito: ${transcription.length} caracteres`);
      
      return transcription;

    } catch (error) {
      logger.error('❌ Erro na transcrição de áudio:', error);
      
      if (error.code === 'INVALID_ARGUMENT') {
        throw new Error('Formato de áudio não suportado. Use WAV, MP3 ou WebM.');
      }
      
      if (error.code === 'UNAUTHENTICATED') {
        throw new Error('Erro de autenticação com Google Cloud Speech.');
      }
      
      throw new Error('Erro ao processar áudio. Tente gravar novamente em ambiente mais silencioso.');
    }
  }

  /**
   * Detecta o tipo de documento baseado no conteúdo
   * @param {string} text - Texto do documento
   * @returns {Object} - Informações sobre o tipo do documento
   */
  detectDocumentType(text) {
    const lowerText = text.toLowerCase();
    
    const documentTypes = {
      medical: {
        keywords: ['exame', 'resultado', 'hemograma', 'leucócitos', 'hemoglobina', 'glicose', 'colesterol', 'médico', 'hospital', 'laboratório'],
        name: 'Documento Médico',
        icon: '🏥'
      },
      legal: {
        keywords: ['tribunal', 'juiz', 'sentença', 'processo', 'citação', 'intimação', 'advogado', 'réu', 'autor', 'judicial'],
        name: 'Documento Jurídico',
        icon: '⚖️'
      },
      financial: {
        keywords: ['banco', 'conta', 'saldo', 'extrato', 'empréstimo', 'financiamento', 'juros', 'parcela', 'boleto'],
        name: 'Documento Financeiro',
        icon: '💰'
      },
      government: {
        keywords: ['prefeitura', 'governo', 'secretaria', 'certidão', 'licença', 'alvará', 'protocolo', 'benefício'],
        name: 'Documento Governamental',
        icon: '🏛️'
      },
      utility: {
        keywords: ['energia', 'água', 'esgoto', 'telefone', 'internet', 'conta de luz', 'cemig', 'sabesp', 'copasa'],
        name: 'Conta de Serviços',
        icon: '🏠'
      },
      contract: {
        keywords: ['contrato', 'locação', 'aluguel', 'locador', 'locatário', 'cláusula', 'termo', 'acordo'],
        name: 'Contrato',
        icon: '📋'
      }
    };

    let bestMatch = { type: 'unknown', score: 0, name: 'Documento Geral', icon: '📄' };

    for (const [type, config] of Object.entries(documentTypes)) {
      const score = config.keywords.filter(keyword => lowerText.includes(keyword)).length;
      
      if (score > bestMatch.score) {
        bestMatch = {
          type,
          score,
          name: config.name,
          icon: config.icon
        };
      }
    }

    logger.info(`📋 Tipo de documento detectado: ${bestMatch.name} (score: ${bestMatch.score})`);

    return bestMatch;
  }

  /**
   * Extrai informações específicas baseadas no tipo do documento
   * @param {string} text - Texto do documento
   * @param {string} documentType - Tipo do documento
   * @returns {Object} - Informações específicas extraídas
   */
  extractSpecificInfo(text, documentType) {
    const extractors = {
      medical: this.extractMedicalInfo,
      legal: this.extractLegalInfo,
      financial: this.extractFinancialInfo,
      government: this.extractGovernmentInfo,
      utility: this.extractUtilityInfo,
      contract: this.extractContractInfo
    };

    const extractor = extractors[documentType];
    
    if (extractor) {
      return extractor.call(this, text);
    }

    return { generalInfo: 'Documento processado para tradução em linguagem simples' };
  }

  /**
   * Extrai informações médicas específicas
   * @param {string} text - Texto do documento médico
   * @returns {Object} - Informações médicas extraídas
   */
  extractMedicalInfo(text) {
    const info = {
      exams: [],
      values: [],
      recommendations: []
    };

    // Padrões para exames comuns
    const examPatterns = [
      /hemoglobin[ai]?\s*:?\s*([0-9,.]+ ?g?\/?d?L?)/gi,
      /leucócitos?\s*:?\s*([0-9,.]+\/?mm³?)/gi,
      /glicose\s*:?\s*([0-9,.]+ ?mg?\/?d?L?)/gi,
      /colesterol\s*:?\s*([0-9,.]+ ?mg?\/?d?L?)/gi
    ];

    examPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        info.exams.push(...matches);
      }
    });

    return info;
  }

  /**
   * Extrai informações jurídicas específicas
   * @param {string} text - Texto do documento jurídico
   * @returns {Object} - Informações jurídicas extraídas
   */
  extractLegalInfo(text) {
    const info = {
      processNumber: null,
      court: null,
      parties: [],
      deadlines: []
    };

    // Padrão para número de processo
    const processPattern = /(\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4})/g;
    const processMatch = text.match(processPattern);
    if (processMatch) {
      info.processNumber = processMatch[0];
    }

    // Padrões para prazos
    const deadlinePattern = /prazo\s+de\s+(\d+)\s+dias?/gi;
    const deadlineMatches = text.match(deadlinePattern);
    if (deadlineMatches) {
      info.deadlines = deadlineMatches;
    }

    return info;
  }

  /**
   * Extrai informações financeiras específicas
   * @param {string} text - Texto do documento financeiro
   * @returns {Object} - Informações financeiras extraídas
   */
  extractFinancialInfo(text) {
    const info = {
      amounts: [],
      dueDate: null,
      account: null
    };

    // Padrões para valores monetários
    const amountPattern = /R\$\s*([0-9,.]+)/gi;
    const amounts = text.match(amountPattern);
    if (amounts) {
      info.amounts = amounts;
    }

    // Padrão para data de vencimento
    const dueDatePattern = /vencimento:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/gi;
    const dueDateMatch = text.match(dueDatePattern);
    if (dueDateMatch) {
      info.dueDate = dueDateMatch[0];
    }

    return info;
  }

  /**
   * Extrai informações governamentais específicas
   */
  extractGovernmentInfo(text) {
    return { type: 'government', processed: true };
  }

  /**
   * Extrai informações de contas de serviços
   */
  extractUtilityInfo(text) {
    return { type: 'utility', processed: true };
  }

  /**
   * Extrai informações de contratos
   */
  extractContractInfo(text) {
    return { type: 'contract', processed: true };
  }

  /**
   * Valida se o arquivo é processável
   * @param {string} filePath - Caminho do arquivo
   * @param {string} mimeType - Tipo MIME do arquivo
   * @returns {Promise<boolean>} - Se o arquivo é válido
   */
  async validateFile(filePath, mimeType) {
    try {
      const stats = await fs.stat(filePath);
      
      // Verificar tamanho (máximo 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (stats.size > maxSize) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
      }

      // Verificar tipos suportados
      const supportedTypes = [
        'image/jpeg',
        'image/png', 
        'image/webp',
        'application/pdf',
        'audio/webm',
        'audio/wav',
        'audio/mp3'
      ];

      if (!supportedTypes.includes(mimeType)) {
        throw new Error(`Tipo de arquivo não suportado: ${mimeType}`);
      }

      return true;

    } catch (error) {
      logger.error('❌ Erro na validação do arquivo:', error);
      throw error;
    }
  }
}

module.exports = new DocumentService();