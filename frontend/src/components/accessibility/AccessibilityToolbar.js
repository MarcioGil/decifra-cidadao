import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Type, Volume2, Pause, Settings } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const AccessibilityToolbar = () => {
  const { 
    accessibility, 
    toggleHighContrast, 
    setFontSize, 
    toggleReducedMotion,
    toggleScreenReader 
  } = useAccessibility();

  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botão Principal */}
      <motion.button
        onClick={handleToggle}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Menu de acessibilidade"
        aria-expanded={isOpen}
      >
        <Settings size={24} />
      </motion.button>

      {/* Painel de Controles */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64"
        >
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-sm border-b border-gray-200 pb-2">
              ♿ Acessibilidade
            </h3>

            {/* Alto Contraste */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Alto Contraste</span>
              <button
                onClick={toggleHighContrast}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                  accessibility.highContrast
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={accessibility.highContrast}
              >
                {accessibility.highContrast ? <Eye size={14} /> : <EyeOff size={14} />}
                {accessibility.highContrast ? 'Ativado' : 'Desativado'}
              </button>
            </div>

            {/* Tamanho da Fonte */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Tamanho da Fonte</label>
              <div className="grid grid-cols-3 gap-1">
                {['normal', 'large', 'xl'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      accessibility.fontSize === size
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-pressed={accessibility.fontSize === size}
                  >
                    {size === 'normal' && 'A'}
                    {size === 'large' && 'A+'}
                    {size === 'xl' && 'A++'}
                  </button>
                ))}
              </div>
            </div>

            {/* Movimento Reduzido */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Reduzir Animações</span>
              <button
                onClick={toggleReducedMotion}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                  accessibility.reducedMotion
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={accessibility.reducedMotion}
              >
                {accessibility.reducedMotion ? <Pause size={14} /> : <Volume2 size={14} />}
                {accessibility.reducedMotion ? 'Ativado' : 'Desativado'}
              </button>
            </div>

            {/* Modo Leitor de Tela */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Modo Leitor de Tela</span>
              <button
                onClick={toggleScreenReader}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                  accessibility.screenReaderMode
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={accessibility.screenReaderMode}
              >
                <Type size={14} />
                {accessibility.screenReaderMode ? 'Ativado' : 'Desativado'}
              </button>
            </div>

            {/* Atalhos do Teclado */}
            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Atalhos do Teclado:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Alt + C: Alto contraste</div>
                <div>Alt + +: Aumentar fonte</div>
                <div>Alt + -: Diminuir fonte</div>
                <div>Tab: Navegar elementos</div>
                <div>Enter/Space: Ativar botões</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AccessibilityToolbar;