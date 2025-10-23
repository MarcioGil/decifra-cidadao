import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Menu, X, Settings, Info } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const { accessibility, toggleHighContrast, setFontSize } = useAccessibility();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isAccessibilityMenuOpen) setIsAccessibilityMenuOpen(false);
  };

  const handleAccessibilityToggle = () => {
    setIsAccessibilityMenuOpen(!isAccessibilityMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <header 
      className="bg-white shadow-sm border-b-2 border-blue-100 sticky top-0 z-50"
      role="banner"
    >
      <nav 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" 
        role="navigation"
        aria-label="Navegação principal"
      >
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
            aria-label="Decifra.Cidadão - Página inicial"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <Heart className="text-red-500" size={24} fill="currentColor" />
              <span className="text-xl font-bold">Decifra.Cidadão</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Início
            </Link>
            
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive('/about') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              aria-current={isActive('/about') ? 'page' : undefined}
            >
              <Info size={16} className="inline mr-1" />
              Sobre
            </Link>

            {/* Accessibility Menu */}
            <div className="relative">
              <button
                onClick={handleAccessibilityToggle}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Menu de acessibilidade"
                aria-expanded={isAccessibilityMenuOpen}
                aria-haspopup="true"
              >
                <Settings size={20} />
              </button>

              {isAccessibilityMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  role="menu"
                  aria-label="Opções de acessibilidade"
                >
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                    ♿ Acessibilidade
                  </div>
                  
                  <button
                    onClick={() => {
                      toggleHighContrast();
                      setIsAccessibilityMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center justify-between"
                    role="menuitem"
                  >
                    <span>Alto Contraste</span>
                    <span className={`w-4 h-4 rounded ${accessibility.highContrast ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  </button>
                  
                  <div className="px-4 py-2">
                    <label className="block text-sm text-gray-700 mb-1">Tamanho da Fonte:</label>
                    <select
                      value={accessibility.fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="large">Grande</option>
                      <option value="xl">Extra Grande</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 pt-4 pb-4"
          >
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Início
              </Link>
              
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/about') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-current={isActive('/about') ? 'page' : undefined}
              >
                <Info size={16} className="inline mr-1" />
                Sobre
              </Link>

              {/* Mobile Accessibility Controls */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-700">
                  ♿ Acessibilidade
                </div>
                
                <button
                  onClick={toggleHighContrast}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center justify-between"
                >
                  <span>Alto Contraste</span>
                  <span className={`w-4 h-4 rounded ${accessibility.highContrast ? 'bg-blue-500' : 'bg-gray-300'}`} />
                </button>
                
                <div className="px-3 py-2">
                  <label className="block text-sm text-gray-700 mb-1">Tamanho da Fonte:</label>
                  <select
                    value={accessibility.fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="large">Grande</option>
                    <option value="xl">Extra Grande</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Header;