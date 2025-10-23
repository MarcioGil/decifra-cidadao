import React, { createContext, useContext, useState, useEffect } from 'react';

// Context para gerenciar configurações de acessibilidade
const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  // Estados de acessibilidade
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

  // Carregar preferências salvas
  useEffect(() => {
    const savedPreferences = localStorage.getItem('accessibility-preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setHighContrast(preferences.highContrast || false);
        setLargeFont(preferences.largeFont || false);
        setReduceMotion(preferences.reduceMotion || false);
        setScreenReaderMode(preferences.screenReaderMode || false);
      } catch (error) {
        console.error('Erro ao carregar preferências de acessibilidade:', error);
      }
    }

    // Detectar preferências do sistema
    detectSystemPreferences();
    
    // Detectar navegação por teclado
    detectKeyboardNavigation();
  }, []);

  // Detectar preferências do sistema
  const detectSystemPreferences = () => {
    // Alto contraste
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setHighContrast(true);
    }

    // Movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduceMotion(true);
    }

    // Detectar se está usando leitor de tela
    if (navigator.userAgent.includes('NVDA') || 
        navigator.userAgent.includes('JAWS') || 
        navigator.userAgent.includes('VoiceOver')) {
      setScreenReaderMode(true);
    }
  };

  // Detectar navegação por teclado
  const detectKeyboardNavigation = () => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true);
        document.removeEventListener('keydown', handleKeyDown);
      }
    };

    const handleMouseDown = () => {
      setKeyboardNavigation(false);
      document.addEventListener('keydown', handleKeyDown);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  };

  // Salvar preferências
  const savePreferences = (preferences) => {
    try {
      localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Erro ao salvar preferências de acessibilidade:', error);
    }
  };

  // Funcões para alterar configurações
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    savePreferences({ highContrast: newValue, largeFont, reduceMotion, screenReaderMode });
    
    // Aplicar/remover classe no documento
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Anunciar mudança para leitores de tela
    announceToScreenReader(
      newValue 
        ? 'Alto contraste ativado' 
        : 'Alto contraste desativado'
    );
  };

  const toggleLargeFont = () => {
    const newValue = !largeFont;
    setLargeFont(newValue);
    savePreferences({ highContrast, largeFont: newValue, reduceMotion, screenReaderMode });
    
    // Aplicar/remover classe no documento
    if (newValue) {
      document.documentElement.classList.add('large-font');
    } else {
      document.documentElement.classList.remove('large-font');
    }

    announceToScreenReader(
      newValue 
        ? 'Fonte ampliada ativada' 
        : 'Fonte ampliada desativada'
    );
  };

  const toggleReduceMotion = () => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    savePreferences({ highContrast, largeFont, reduceMotion: newValue, screenReaderMode });
    
    // Aplicar/remover classe no documento
    if (newValue) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    announceToScreenReader(
      newValue 
        ? 'Animações reduzidas ativadas' 
        : 'Animações reduzidas desativadas'
    );
  };

  const toggleScreenReaderMode = () => {
    const newValue = !screenReaderMode;
    setScreenReaderMode(newValue);
    savePreferences({ highContrast, largeFont, reduceMotion, screenReaderMode: newValue });
    
    // Aplicar/remover classe no documento
    if (newValue) {
      document.documentElement.classList.add('screen-reader-mode');
    } else {
      document.documentElement.classList.remove('screen-reader-mode');
    }

    announceToScreenReader(
      newValue 
        ? 'Modo leitor de tela ativado' 
        : 'Modo leitor de tela desativado'
    );
  };

  // Função para anunciar mudanças para leitores de tela
  const announceToScreenReader = (message) => {
    const announcer = document.getElementById('announcements');
    if (announcer) {
      announcer.textContent = message;
      
      // Limpar depois de um tempo
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  };

  // Função para anunciar status urgente
  const announceUrgent = (message) => {
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = message;
      
      setTimeout(() => {
        statusElement.textContent = '';
      }, 3000);
    }
  };

  // Função para foco programático em elemento
  const focusElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
      
      // Se o elemento não é naturalmente focável, torná-lo focável
      if (!element.hasAttribute('tabindex') && 
          !['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'A'].includes(element.tagName)) {
        element.setAttribute('tabindex', '-1');
      }
    }
  };

  // Função para melhor navegação por teclado em listas
  const handleArrowNavigation = (event, items, currentIndex, setCurrentIndex) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    setCurrentIndex(newIndex);
    
    // Focar no novo item
    if (items[newIndex]) {
      items[newIndex].focus();
    }
  };

  // Aplicar classes no documento quando o contexto é carregado
  useEffect(() => {
    if (highContrast) document.documentElement.classList.add('high-contrast');
    if (largeFont) document.documentElement.classList.add('large-font');
    if (reduceMotion) document.documentElement.classList.add('reduce-motion');
    if (screenReaderMode) document.documentElement.classList.add('screen-reader-mode');
    if (keyboardNavigation) document.documentElement.classList.add('keyboard-navigation');

    return () => {
      document.documentElement.classList.remove(
        'high-contrast', 
        'large-font', 
        'reduce-motion', 
        'screen-reader-mode',
        'keyboard-navigation'
      );
    };
  }, [highContrast, largeFont, reduceMotion, screenReaderMode, keyboardNavigation]);

  const value = {
    // Estados
    highContrast,
    largeFont,
    reduceMotion,
    screenReaderMode,
    keyboardNavigation,
    
    // Funções de toggle
    toggleHighContrast,
    toggleLargeFont,
    toggleReduceMotion,
    toggleScreenReaderMode,
    
    // Funções utilitárias
    announceToScreenReader,
    announceUrgent,
    focusElement,
    handleArrowNavigation,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};