const OpenAI = require('openai');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Traduz texto técnico/jurídico/médico para linguagem simples
   * @param {string} technicalText - Texto técnico a ser traduzido
   * @returns {Promise<Object>} - Tradução em linguagem simples
   */
  async translateToSimpleLanguage(technicalText) {
    try {
      logger.info(`🧠 Iniciando tradução IA. Texto: ${technicalText.length} caracteres`);

      const prompt = this.buildTranslationPrompt(technicalText);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Você é "Clara", uma assistente social brasileira especializada em traduzir linguagem técnica, jurídica e médica para português brasileiro simples e acessível.

PERSONALIDADE:
- Calorosa, empática e paciente
- Fala como uma amiga especialista que quer genuinamente ajudar
- Usa linguagem do dia a dia, sem perder a precisão
- Sempre tranquiliza antes de explicar

REGRAS IMPORTANTES:
1. NUNCA dê conselhos médicos ou jurídicos específicos
2. SEMPRE explique o que o documento DIZ, não o que a pessoa deve fazer
3. Use analogias simples e familiares
4. Termine sempre com orientações gerais sobre próximos passos
5. Mantenha tom respeitoso e acolhedor

ESTRUTURA DA RESPOSTA:
1. Cumprimento acolhedor
2. Explicação em linguagem simples
3. Resumo em 3 pontos principais
4. Orientações gerais sobre próximos passos`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const response = completion.choices[0].message.content;
      
      // Estruturar a resposta
      const structuredResponse = this.parseAIResponse(response);
      
      logger.info(`✅ Tradução IA concluída. Resposta: ${response.length} caracteres`);
      
      return structuredResponse;

    } catch (error) {
      logger.error('❌ Erro na tradução IA:', error);
      
      if (error.code === 'insufficient_quota') {
        throw new Error('Limite de uso da IA excedido. Tente novamente mais tarde.');
      }
      
      throw new Error('Erro ao processar com IA. Tente novamente.');
    }
  }

  /**
   * Responde a uma pergunta específica do usuário
   * @param {string} question - Pergunta do usuário
   * @returns {Promise<Object>} - Resposta estruturada
   */
  async answerQuestion(question) {
    try {
      logger.info(`❓ Respondendo pergunta: ${question}`);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Você é "Clara", uma assistente social brasileira especializada em esclarecer dúvidas sobre documentos e processos burocráticos.

MISSÃO: Responder dúvidas específicas sobre documentos, processos ou termos que as pessoas não entendem.

REGRAS:
1. Seja empática e acolhedora
2. Explique em linguagem simples
3. Use analogias familiares
4. NUNCA dê conselhos médicos ou jurídicos específicos
5. Sempre sugira procurar profissionais qualificados quando necessário
6. Mantenha foco educativo, não prescritivo

FORMATO DA RESPOSTA:
- Cumprimento caloroso
- Explicação clara da dúvida
- Sugestões de próximos passos (se aplicável)`
          },
          {
            role: "user",
            content: `A pessoa me fez esta pergunta sobre um documento ou processo: "${question}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const response = completion.choices[0].message.content;
      
      logger.info(`✅ Pergunta respondida. Resposta: ${response.length} caracteres`);
      
      return {
        explanation: response,
        suggestions: this.extractSuggestions(response)
      };

    } catch (error) {
      logger.error('❌ Erro ao responder pergunta:', error);
      throw new Error('Erro ao processar sua pergunta. Tente novamente.');
    }
  }

  /**
   * Constrói o prompt para tradução
   * @param {string} text - Texto a ser traduzido
   * @returns {string} - Prompt estruturado
   */
  buildTranslationPrompt(text) {
    return `Preciso que você traduza este documento para linguagem simples:

DOCUMENTO:
"""
${text}
"""

Por favor, explique o que este documento significa usando:
- Palavras simples e familiares
- Analogias do dia a dia
- Tom acolhedor e tranquilizador
- Linguagem brasileira coloquial mas respeitosa

Inclua no final um resumo com os 3 pontos mais importantes e sugestões gerais de próximos passos.`;
  }

  /**
   * Analisa e estrutura a resposta da IA
   * @param {string} response - Resposta bruta da IA
   * @returns {Object} - Resposta estruturada
   */
  parseAIResponse(response) {
    // Extrair seções da resposta
    const lines = response.split('\n').filter(line => line.trim());
    
    let explanation = '';
    let summary = [];
    let actionItems = [];
    
    let currentSection = 'explanation';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Detectar início de seções
      if (trimmedLine.toLowerCase().includes('resumo') || 
          trimmedLine.toLowerCase().includes('pontos principais') ||
          trimmedLine.match(/^\d+\./)) {
        currentSection = 'summary';
        continue;
      }
      
      if (trimmedLine.toLowerCase().includes('próximos passos') ||
          trimmedLine.toLowerCase().includes('o que fazer')) {
        currentSection = 'actions';
        continue;
      }
      
      // Adicionar conteúdo à seção apropriada
      if (currentSection === 'explanation' && trimmedLine) {
        explanation += (explanation ? ' ' : '') + trimmedLine;
      } else if (currentSection === 'summary' && trimmedLine) {
        if (trimmedLine.match(/^\d+\./) || trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
          summary.push(trimmedLine.replace(/^\d+\.\s*|^[•-]\s*/, ''));
        }
      } else if (currentSection === 'actions' && trimmedLine) {
        if (trimmedLine.match(/^\d+\./) || trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
          actionItems.push(trimmedLine.replace(/^\d+\.\s*|^[•-]\s*/, ''));
        }
      }
    }
    
    // Se não conseguiu extrair seções específicas, usar a resposta completa
    if (!explanation || explanation.length < 50) {
      explanation = response;
    }
    
    if (summary.length === 0) {
      summary = ['Documento analisado com explicação detalhada acima'];
    }
    
    if (actionItems.length === 0) {
      actionItems = ['Procure orientação profissional adequada se necessário'];
    }
    
    return {
      explanation: explanation.trim(),
      summary: summary.slice(0, 3), // Máximo 3 itens
      actionItems: actionItems.slice(0, 3) // Máximo 3 itens
    };
  }

  /**
   * Extrai sugestões de uma resposta
   * @param {string} response - Resposta da IA
   * @returns {Array} - Lista de sugestões
   */
  extractSuggestions(response) {
    const suggestions = [];
    
    // Procurar por padrões de sugestões
    const suggestionPatterns = [
      /(?:sugiro|recomendo|seria bom|você pode|experimente)([^.!?]+[.!?])/gi,
      /(?:próximo passo|você deve|é importante)([^.!?]+[.!?])/gi
    ];
    
    suggestionPatterns.forEach(pattern => {
      const matches = response.match(pattern);
      if (matches) {
        matches.forEach(match => {
          suggestions.push(match.trim());
        });
      }
    });
    
    // Se não encontrou sugestões específicas, adicionar sugestão padrão
    if (suggestions.length === 0) {
      suggestions.push('Se precisar de mais esclarecimentos, procure ajuda profissional especializada.');
    }
    
    return suggestions.slice(0, 3); // Máximo 3 sugestões
  }
}

module.exports = new AIService();