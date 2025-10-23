import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import AboutPage from './pages/AboutPage';

// Hooks
import { useAccessibility } from './contexts/AccessibilityContext';

function App() {
  const { highContrast, largeFont } = useAccessibility();

  return (
    <div 
      className={`min-h-screen flex flex-col ${highContrast ? 'high-contrast' : ''} ${largeFont ? 'large-font' : ''}`}
      role="application"
      aria-label="Decifra.Cidadão - Tradutor de Burocracia"
    >
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Pular para o conteúdo principal"
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <main 
        id="main-content"
        className="flex-1 w-full"
        role="main"
        aria-label="Conteúdo principal"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Routes>
            <Route 
              path="/" 
              element={<HomePage />} 
            />
            <Route 
              path="/result" 
              element={<ResultPage />} 
            />
            <Route 
              path="/about" 
              element={<AboutPage />} 
            />
            <Route 
              path="*" 
              element={<HomePage />} 
            />
          </Routes>
        </motion.div>
      </main>

      <Footer />

      {/* Live region for announcements */}
      <div
        id="announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Status region for urgent announcements */}
      <div
        id="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
}

export default App;