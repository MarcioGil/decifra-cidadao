import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Mic, Heart, Zap, Shield } from 'lucide-react';

// Components
import DocumentUpload from '../components/document/DocumentUpload';
import AudioRecorder from '../components/audio/AudioRecorder';
import AccessibilityToolbar from '../components/accessibility/AccessibilityToolbar';

// Hooks
import { useAccessibility } from '../contexts/AccessibilityContext';

const HomePage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { announceToScreenReader, reduceMotion } = useAccessibility();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    announceToScreenReader(`Opção selecionada: ${getOptionName(option)}`);
  };

  const getOptionName = (option) => {
    switch (option) {
      case 'camera': return 'Fotografar documento';
      case 'upload': return 'Enviar arquivo PDF';
      case 'audio': return 'Gravar áudio';
      default: return option;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.1 : 0.5,
        staggerChildren: reduceMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.1 : 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8"
      >
        {/* Hero Section */}
        <motion.section 
          variants={itemVariants}
          className="text-center mb-12"
          aria-labelledby="hero-title"
        >
          <motion.div
            className="mb-6"
            whileHover={reduceMotion ? {} : { scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h1 
              id="hero-title"
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
            >
              🇧🇷 <span className="text-blue-600">Decifra.Cidadão</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <strong>O Tradutor de Burocracia</strong> - Transforme documentos complexos em linguagem simples e acessível
            </p>
          </motion.div>

          {/* Features Pills */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <Zap className="w-4 h-4 text-yellow-500" aria-hidden="true" />
              <span className="font-medium text-gray-700">Powered by IA</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <Heart className="w-4 h-4 text-red-500" aria-hidden="true" />
              <span className="font-medium text-gray-700">100% Acessível</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <Shield className="w-4 h-4 text-green-500" aria-hidden="true" />
              <span className="font-medium text-gray-700">Gratuito</span>
            </div>
          </motion.div>
        </motion.section>

        {/* Main Options */}
        {!selectedOption ? (
          <motion.section 
            variants={itemVariants}
            className="max-w-4xl mx-auto"
            aria-labelledby="options-title"
          >
            <h2 
              id="options-title" 
              className="text-3xl font-bold text-center text-gray-900 mb-8"
            >
              Como você quer começar?
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Escolha uma das opções abaixo. Nossa assistente virtual Clara vai explicar seu documento de forma simples e clara.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Câmera */}
              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.02, y: -4 }}
                whileTap={reduceMotion ? {} : { scale: 0.98 }}
                onClick={() => handleOptionSelect('camera')}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 focus:border-blue-500 focus:outline-none"
                aria-describedby="camera-description"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Camera className="w-8 h-8 text-blue-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    📸 Fotografar Documento
                  </h3>
                  <p id="camera-description" className="text-gray-600 leading-relaxed">
                    Tire uma foto de qualquer documento com a câmera do seu celular ou computador. Ideal para exames, receitas, contratos.
                  </p>
                </div>
              </motion.button>

              {/* Upload */}
              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.02, y: -4 }}
                whileTap={reduceMotion ? {} : { scale: 0.98 }}
                onClick={() => handleOptionSelect('upload')}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200 focus:border-green-500 focus:outline-none"
                aria-describedby="upload-description"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Upload className="w-8 h-8 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    📄 Enviar PDF
                  </h3>
                  <p id="upload-description" className="text-gray-600 leading-relaxed">
                    Já tem um arquivo PDF? Envie diretamente para nossa IA analisar e traduzir em linguagem simples.
                  </p>
                </div>
              </motion.button>

              {/* Áudio */}
              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.02, y: -4 }}
                whileTap={reduceMotion ? {} : { scale: 0.98 }}
                onClick={() => handleOptionSelect('audio')}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 focus:border-purple-500 focus:outline-none"
                aria-describedby="audio-description"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Mic className="w-8 h-8 text-purple-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    🎤 Gravar Áudio
                  </h3>
                  <p id="audio-description" className="text-gray-600 leading-relaxed">
                    Fale ou leia em voz alta sua dúvida. Nossa IA vai escutar e responder de forma clara e acessível.
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.section>
        ) : (
          <motion.section
            variants={itemVariants}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <motion.button
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              whileTap={reduceMotion ? {} : { scale: 0.95 }}
              onClick={() => {
                setSelectedOption(null);
                announceToScreenReader('Voltou para as opções principais');
              }}
              className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-3 py-2"
              aria-label="Voltar para as opções principais"
            >
              ← Voltar às opções
            </motion.button>

            {/* Selected Option Component */}
            {selectedOption === 'camera' && (
              <DocumentUpload mode="camera" />
            )}
            {selectedOption === 'upload' && (
              <DocumentUpload mode="upload" />
            )}
            {selectedOption === 'audio' && (
              <AudioRecorder />
            )}
          </motion.section>
        )}

        {/* How it Works Section */}
        {!selectedOption && (
          <motion.section 
            variants={itemVariants}
            className="mt-20 max-w-4xl mx-auto"
            aria-labelledby="how-it-works-title"
          >
            <h2 
              id="how-it-works-title"
              className="text-3xl font-bold text-center text-gray-900 mb-12"
            >
              Como funciona?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Envie seu documento</h3>
                <p className="text-gray-600">Foto, PDF ou áudio - escolha a forma mais fácil para você</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">IA processa</h3>
                <p className="text-gray-600">Nossa Clara analisa e traduz para linguagem simples</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Receba explicação</h3>
                <p className="text-gray-600">Texto simples + áudio para máxima acessibilidade</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Trust Indicators */}
        {!selectedOption && (
          <motion.section 
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border max-w-2xl mx-auto">
              <p className="text-gray-600 mb-4">
                <strong>Privacidade garantida:</strong> Seus documentos são processados de forma segura e não são armazenados em nossos servidores.
              </p>
              <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
                <span>✅ Gratuito</span>
                <span>✅ Sem cadastro</span>
                <span>✅ Privado</span>
                <span>✅ Acessível</span>
              </div>
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;