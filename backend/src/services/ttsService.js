const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class TTSService {
  constructor() {
    // Inicializar cliente do Google Cloud TTS
    this.client = new textToSpeech.TextToSpeechClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  /**
   * Gera arquivo de áudio a partir de texto
   * @param {string} text - Texto para converter em áudio
   * @param {string} sessionId - ID da sessão para nomenclatura do arquivo
   * @returns {Promise<string>} - Caminho do arquivo de áudio gerado
   */
  async generateAudio(text, sessionId) {
    try {
      logger.info(`🗣️ Gerando áudio TTS. Texto: ${text.length} caracteres`);

      // Preparar diretório de áudio
      const audioDir = path.join(__dirname, '../../uploads/audio');
      await fs.mkdir(audioDir, { recursive: true });

      // Configurações do TTS otimizadas para português brasileiro
      const request = {
        input: { text: this.prepareTextForTTS(text) },
        voice: {
          languageCode: process.env.TTS_LANGUAGE_CODE || 'pt-BR',
          name: process.env.TTS_VOICE_NAME || 'pt-BR-Wavenet-A',
          ssmlGender: 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.9, // Falar um pouco mais devagar para melhor compreensão
          pitch: 0, // Tom neutro
          volumeGainDb: 0,
          effectsProfileId: ['headphone-class-device'] // Otimizado para fones
        }
      };

      // Fazer requisição para Google Cloud TTS
      const [response] = await this.client.synthesizeSpeech(request);

      // Salvar arquivo de áudio
      const audioFileName = `${sessionId}-${Date.now()}.mp3`;
      const audioPath = path.join(audioDir, audioFileName);
      
      await fs.writeFile(audioPath, response.audioContent, 'binary');
      
      logger.info(`✅ Áudio gerado: ${audioFileName}`);
      
      return audioPath;

    } catch (error) {
      logger.error('❌ Erro na geração de áudio:', error);
      
      if (error.code === 'UNAUTHENTICATED') {
        throw new Error('Erro de autenticação com Google Cloud TTS. Verifique as credenciais.');
      }
      
      throw new Error('Erro ao gerar áudio. Tente novamente.');
    }
  }

  /**
   * Prepara o texto para síntese de voz com melhor naturalidade
   * @param {string} text - Texto original
   * @returns {string} - Texto otimizado para TTS
   */
  prepareTextForTTS(text) {
    let processedText = text;

    // Substituições para melhorar pronúncia
    const replacements = {
      // Números por extenso para melhor pronúncia
      '1°': 'primeiro',
      '2°': 'segundo', 
      '3°': 'terceiro',
      '1ª': 'primeira',
      '2ª': 'segunda',
      '3ª': 'terceira',
      
      // Abreviações comuns
      'Dr.': 'Doutor',
      'Dra.': 'Doutora',
      'Sr.': 'Senhor',
      'Sra.': 'Senhora',
      'Prof.': 'Professor',
      'Profa.': 'Professora',
      
      // Unidades médicas
      'mg/dL': 'miligramas por decilitro',
      'mm³': 'milímetros cúbicos',
      'g/L': 'gramas por litro',
      
      // Siglas médicas comuns
      'RBC': 'hemácias',
      'WBC': 'leucócitos',
      'RG': 'documento de identidade',
      'CPF': 'ce pê efe',
      'CNPJ': 'ce ene pê jota',
      
      // Melhorar pausas
      '.': '. <break time="0.5s"/>',
      '!': '! <break time="0.5s"/>',
      '?': '? <break time="0.5s"/>',
      ':': ': <break time="0.3s"/>',
      ';': '; <break time="0.3s"/>',
      ',': ', <break time="0.2s"/>'
    };

    // Aplicar substituições
    for (const [original, replacement] of Object.entries(replacements)) {
      processedText = processedText.replace(new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
    }

    // Adicionar ênfase em palavras importantes
    processedText = processedText.replace(
      /\b(importante|atenção|cuidado|urgente|emergência)\b/gi,
      '<emphasis level="strong">$1</emphasis>'
    );

    // Adicionar pausas maiores entre parágrafos
    processedText = processedText.replace(/\n\n/g, '\n<break time="1s"/>\n');

    // Envolver em SSML para controle avançado
    const ssmlText = `
      <speak>
        <prosody rate="0.9" pitch="0">
          ${processedText}
        </prosody>
      </speak>
    `;

    return ssmlText;
  }

  /**
   * Gera áudio com configurações específicas para diferentes tipos de conteúdo
   * @param {string} text - Texto para converter
   * @param {string} sessionId - ID da sessão
   * @param {string} type - Tipo de conteúdo ('explanation', 'summary', 'urgent')
   * @returns {Promise<string>} - Caminho do arquivo de áudio
   */
  async generateAudioByType(text, sessionId, type = 'explanation') {
    try {
      const audioDir = path.join(__dirname, '../../uploads/audio');
      await fs.mkdir(audioDir, { recursive: true });

      // Configurações específicas por tipo
      const configs = {
        explanation: {
          voice: { name: 'pt-BR-Wavenet-A', ssmlGender: 'FEMALE' },
          audioConfig: { speakingRate: 0.9, pitch: 0 }
        },
        summary: {
          voice: { name: 'pt-BR-Wavenet-B', ssmlGender: 'MALE' },
          audioConfig: { speakingRate: 1.0, pitch: -2 }
        },
        urgent: {
          voice: { name: 'pt-BR-Wavenet-A', ssmlGender: 'FEMALE' },
          audioConfig: { speakingRate: 0.8, pitch: 2, volumeGainDb: 3 }
        }
      };

      const config = configs[type] || configs.explanation;

      const request = {
        input: { text: this.prepareTextForTTS(text) },
        voice: {
          languageCode: 'pt-BR',
          ...config.voice
        },
        audioConfig: {
          audioEncoding: 'MP3',
          effectsProfileId: ['headphone-class-device'],
          ...config.audioConfig
        }
      };

      const [response] = await this.client.synthesizeSpeech(request);
      
      const audioFileName = `${sessionId}-${type}-${Date.now()}.mp3`;
      const audioPath = path.join(audioDir, audioFileName);
      
      await fs.writeFile(audioPath, response.audioContent, 'binary');
      
      logger.info(`✅ Áudio ${type} gerado: ${audioFileName}`);
      
      return audioPath;

    } catch (error) {
      logger.error(`❌ Erro ao gerar áudio ${type}:`, error);
      throw error;
    }
  }

  /**
   * Lista as vozes disponíveis para português brasileiro
   * @returns {Promise<Array>} - Lista de vozes disponíveis
   */
  async getAvailableVoices() {
    try {
      const [result] = await this.client.listVoices({
        languageCode: 'pt-BR'
      });

      const voices = result.voices.map(voice => ({
        name: voice.name,
        gender: voice.ssmlGender,
        naturalSampleRateHertz: voice.naturalSampleRateHertz
      }));

      logger.info(`📋 Vozes disponíveis: ${voices.length}`);
      
      return voices;

    } catch (error) {
      logger.error('❌ Erro ao listar vozes:', error);
      throw error;
    }
  }

  /**
   * Remove arquivos de áudio antigos para economizar espaço
   * @param {number} maxAgeHours - Idade máxima dos arquivos em horas
   */
  async cleanupOldAudioFiles(maxAgeHours = 24) {
    try {
      const audioDir = path.join(__dirname, '../../uploads/audio');
      const files = await fs.readdir(audioDir);
      
      const now = Date.now();
      const maxAge = maxAgeHours * 60 * 60 * 1000; // Converter para millisegundos
      
      let deletedCount = 0;
      
      for (const file of files) {
        const filePath = path.join(audioDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }
      
      logger.info(`🧹 Limpeza concluída: ${deletedCount} arquivos removidos`);
      
    } catch (error) {
      logger.error('❌ Erro na limpeza de arquivos:', error);
    }
  }
}

module.exports = new TTSService();