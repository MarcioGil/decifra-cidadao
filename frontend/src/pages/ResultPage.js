import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Volume2, Copy, CheckCircle } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessibility } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = location.state?.result;

  if (!result) {
    navigate('/');
    return null;
  }

  const handlePlayAudio = async () => {
    if (result.audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(result.audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error('Erro ao reproduzir áudio');
      };
      await audio.play();
    } else {
      // Usar Web Speech API se não houver URL de áudio
      if ('speechSynthesis' in window) {
        setIsPlaying(true);
        const utterance = new SpeechSynthesisUtterance(result.explanation);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
      } else {
        toast.error('Áudio não disponível neste navegador');
      }
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(result.explanation);
      setCopied(true);
      toast.success('Texto copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar texto');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `DECIFRA.CIDADÃO - EXPLICAÇÃO SIMPLIFICADA\n\n` +
      `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n` +
      `TEXTO ORIGINAL:\n${result.originalText || 'Não disponível'}\n\n` +
      `EXPLICAÇÃO CLARA:\n${result.explanation}\n\n` +
      `---\nProcessado com ❤️ pelo Decifra.Cidadão\nhttps://decifra-cidadao.vercel.app`
    ], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    element.download = `decifra-cidadao-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Arquivo baixado!');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 ${
      accessibility.highContrast ? 'high-contrast' : ''
    } ${
      accessibility.fontSize === 'large' ? 'text-lg' : accessibility.fontSize === 'xl' ? 'text-xl' : ''
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center gap-2"
            aria-label="Voltar à página inicial"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Explicação Simplificada
            </h1>
            <p className="text-gray-600">
              Clara traduziu seu documento para você
            </p>
          </div>
        </motion.div>

        {/* Resultado Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          {/* Texto Original (se disponível) */}
          {result.originalText && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                📄 Texto Extraído
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {result.originalText}
                </p>
              </div>
            </div>
          )}

          {/* Explicação Clara */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
              🤖 Clara Explica
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {result.explanation}
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className="btn-primary flex items-center gap-2"
              aria-label="Ouvir explicação em áudio"
            >
              <Volume2 size={20} />
              {isPlaying ? 'Reproduzindo...' : 'Ouvir Explicação'}
            </button>

            <button
              onClick={handleCopyText}
              className="btn-secondary flex items-center gap-2"
              aria-label="Copiar texto da explicação"
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>

            <button
              onClick={handleDownload}
              className="btn-secondary flex items-center gap-2"
              aria-label="Baixar explicação como arquivo"
            >
              <Download size={20} />
              Baixar Arquivo
            </button>
          </div>
        </motion.div>

        {/* Informações Adicionais */}
        {(result.confidence || result.processingTime) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-50 rounded-lg p-4 border border-green-200"
          >
            <h3 className="font-semibold text-green-800 mb-2">
              ℹ️ Informações do Processamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              {result.confidence && (
                <div>
                  <strong>Confiança da IA:</strong> {(result.confidence * 100).toFixed(1)}%
                </div>
              )}
              {result.processingTime && (
                <div>
                  <strong>Tempo de processamento:</strong> {result.processingTime}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Dicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mt-4"
        >
          <h3 className="font-semibold text-yellow-800 mb-2">
            💡 Dicas Importantes
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Esta explicação é uma interpretação educativa da Clara</li>
            <li>• Para decisões importantes, sempre consulte um profissional especializado</li>
            <li>• Seus documentos não são armazenados em nossos servidores</li>
            <li>• Use o áudio para melhor compreensão se tiver dificuldades de leitura</li>
          </ul>
        </motion.div>

        {/* Botão Nova Consulta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-primary text-lg px-8 py-3"
          >
            ✨ Nova Consulta
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;