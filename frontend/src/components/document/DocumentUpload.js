import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Camera, FileImage, FileText, X, AlertCircle } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import toast from 'react-hot-toast';

const DocumentUpload = ({ onUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { accessibility } = useAccessibility();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(error => error.code === 'file-too-large')) {
        toast.error('Arquivo muito grande! Máximo 10MB.');
      } else if (rejection.errors.some(error => error.code === 'file-invalid-type')) {
        toast.error('Tipo de arquivo não suportado!');
      } else {
        toast.error('Erro ao processar arquivo');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      
      // Criar preview para imagens
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
      
      toast.success('Arquivo selecionado!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isLoading
  });

  const handleCameraCapture = () => {
    // Criar input file invisível para câmera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onDrop([file], []);
      }
    };
    input.click();
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo primeiro!');
      return;
    }
    
    onUpload(selectedFile);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${
      accessibility.highContrast ? 'high-contrast' : ''
    } ${
      accessibility.fontSize === 'large' ? 'text-lg' : accessibility.fontSize === 'xl' ? 'text-xl' : ''
    }`}>
      {!selectedFile ? (
        <div className="space-y-6">
          {/* Área de Drop */}
          <motion.div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            <input {...getInputProps()} aria-label="Selecionar arquivo para upload" />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                {isDragActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Upload size={48} className="text-blue-500" />
                  </motion.div>
                ) : (
                  <Upload size={48} className="text-gray-400" />
                )}
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Solte o arquivo aqui...' : 'Arraste e solte seu arquivo aqui'}
                </p>
                <p className="text-gray-500 mt-2">
                  ou clique para selecionar
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FileImage size={16} />
                  <span>Imagens: PNG, JPG, JPEG</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText size={16} />
                  <span>PDF</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                Máximo 10MB por arquivo
              </p>
            </div>
          </motion.div>

          {/* Botão Câmera */}
          <div className="text-center">
            <button
              onClick={handleCameraCapture}
              disabled={isLoading}
              className="btn-secondary flex items-center gap-2 mx-auto"
              aria-label="Usar câmera para capturar documento"
            >
              <Camera size={20} />
              Usar Câmera
            </button>
            <p className="text-xs text-gray-500 mt-2">
              📱 Funciona melhor em dispositivos móveis
            </p>
          </div>
        </div>
      ) : (
        /* Arquivo Selecionado */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border-2 border-green-200 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {selectedFile.type.startsWith('image/') ? (
                <FileImage size={24} className="text-blue-500" />
              ) : (
                <FileText size={24} className="text-red-500" />
              )}
              <div>
                <p className="font-medium text-gray-800 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              disabled={isLoading}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Remover arquivo"
            >
              <X size={20} />
            </button>
          </div>

          {/* Preview da Imagem */}
          {previewUrl && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Preview do documento"
                className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200 mx-auto"
              />
            </div>
          )}

          {/* Informações do Arquivo */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Arquivo pronto para processamento:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Clara vai extrair e explicar o texto</li>
                  <li>Processamento leva alguns segundos</li>
                  <li>Você receberá explicação em texto e áudio</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-center">
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
                  <Upload size={20} />
                  Processar Documento
                </>
              )}
            </button>
            
            <button
              onClick={handleRemoveFile}
              disabled={isLoading}
              className="btn-secondary px-6 py-3"
            >
              Trocar Arquivo
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentUpload;