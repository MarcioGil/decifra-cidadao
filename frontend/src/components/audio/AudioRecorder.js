import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Square, Play, Pause, Trash2, Send } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useReactMediaRecorder } from 'react-media-recorder';
import toast from 'react-hot-toast';

const AudioRecorder = ({ onSubmit, isLoading }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const { accessibility } = useAccessibility();

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    onStart: () => {
      setRecordingTime(0);
      intervalRef.current = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
      toast.success('Gravação iniciada! 🎤');
    },
    onStop: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      toast.success('Gravação finalizada! ✅');
    },
    onError: (error) => {
      console.error('Erro na gravação:', error);
      toast.error('Erro ao gravar áudio. Verifique as permissões.');
    }
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      // Verificar se o navegador suporta gravação
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Seu navegador não suporta gravação de áudio');
        return;
      }

      // Solicitar permissão para microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Parar stream temporário
      
      startRecording();
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Permissão negada. Libere o acesso ao microfone.');
      } else if (error.name === 'NotFoundError') {
        toast.error('Microfone não encontrado.');
      } else {
        toast.error('Erro ao acessar microfone.');
      }
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handlePlayPause = () => {
    if (!mediaBlobUrl) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSubmit = async () => {
    if (!mediaBlobUrl) {
      toast.error('Nenhuma gravação encontrada!');
      return;
    }

    try {
      // Converter blob URL para File
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const file = new File([blob], 'audio-recording.webm', { type: blob.type });
      
      onSubmit(file);
    } catch (error) {
      console.error('Erro ao processar áudio:', error);
      toast.error('Erro ao processar gravação');
    }
  };

  const handleDiscard = () => {
    clearBlobUrl();
    setRecordingTime(0);
    setIsPlaying(false);
    toast.success('Gravação removida');
  };

  return (
    <div className={`w-full max-w-md mx-auto ${
      accessibility.highContrast ? 'high-contrast' : ''
    } ${
      accessibility.fontSize === 'large' ? 'text-lg' : accessibility.fontSize === 'xl' ? 'text-xl' : ''
    }`}>
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
        {/* Status da Gravação */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            status === 'recording' 
              ? 'bg-red-100 text-red-700' 
              : mediaBlobUrl 
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {status === 'recording' && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
            )}
            {status === 'recording' 
              ? `Gravando... ${formatTime(recordingTime)}`
              : mediaBlobUrl 
              ? `Gravação pronta (${formatTime(recordingTime)})`
              : 'Pronto para gravar'
            }
          </div>
        </div>

        {/* Controles Principais */}
        <div className="flex justify-center mb-6">
          {!mediaBlobUrl ? (
            /* Botão Gravar/Parar */
            <motion.button
              onClick={status === 'recording' ? handleStopRecording : handleStartRecording}
              disabled={isLoading}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                status === 'recording'
                  ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300'
                  : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={!isLoading ? { scale: 1.1 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
              aria-label={status === 'recording' ? 'Parar gravação' : 'Iniciar gravação'}
            >
              {status === 'recording' ? (
                <Square size={32} fill="currentColor" />
              ) : (
                <Mic size={32} />
              )}
            </motion.button>
          ) : (
            /* Controles de Reprodução */
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handlePlayPause}
                disabled={isLoading}
                className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
                whileHover={!isLoading ? { scale: 1.1 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                aria-label={isPlaying ? 'Pausar reprodução' : 'Reproduzir gravação'}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>

              <motion.button
                onClick={handleDiscard}
                disabled={isLoading}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-2"
                whileHover={!isLoading ? { scale: 1.1 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                aria-label="Descartar gravação"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          )}
        </div>

        {/* Áudio Player (invisível, apenas para controle) */}
        {mediaBlobUrl && (
          <audio
            ref={audioRef}
            src={mediaBlobUrl}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Instruções */}
        <div className="text-center mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              {!mediaBlobUrl && status !== 'recording' && (
                <>
                  <span className="font-medium">🎤 Dica:</span> Fale claramente sobre seu documento ou dúvida. 
                  A Clara vai entender e explicar tudo em linguagem simples!
                </>
              )}
              {status === 'recording' && (
                <>
                  <span className="font-medium">🔴 Gravando:</span> Fale normalmente. 
                  Clique no botão para parar quando terminar.
                </>
              )}
              {mediaBlobUrl && (
                <>
                  <span className="font-medium">✅ Pronto:</span> Ouça sua gravação e envie para a Clara processar, 
                  ou grave novamente se quiser.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Botão Enviar */}
        {mediaBlobUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-center"
          >
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 px-6 py-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Processando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar para Clara
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Informações de Compatibilidade */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 Funciona melhor com fones de ouvido para evitar eco
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;