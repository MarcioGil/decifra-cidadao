import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import './index.css';
import App from './App';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import reportWebVitals from './reportWebVitals';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
    mutations: {
      retry: 1,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AccessibilityProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 6000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                fontSize: '16px',
                padding: '16px 24px',
                borderRadius: '12px',
                maxWidth: '500px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                duration: 8000,
              },
              // Configurações de acessibilidade para toast
              ariaProps: {
                role: 'status',
                'aria-live': 'polite',
              },
            }}
          />
        </AccessibilityProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals(console.log);

// Accessibility: Announce route changes to screen readers
let lastPathname = '';
const announceRouteChange = () => {
  const currentPathname = window.location.pathname;
  if (currentPathname !== lastPathname) {
    lastPathname = currentPathname;
    
    // Create announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    const pageName = getPageName(currentPathname);
    announcement.textContent = `Navegou para ${pageName}`;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
};

function getPageName(pathname) {
  switch (pathname) {
    case '/':
      return 'página inicial';
    case '/result':
      return 'resultado da tradução';
    case '/about':
      return 'sobre o Decifra.Cidadão';
    case '/help':
      return 'ajuda e instruções';
    default:
      return 'nova página';
  }
}

// Monitor route changes
window.addEventListener('popstate', announceRouteChange);

// PWA: Handle install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show custom install button (can be implemented in a component)
  console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', () => {
  console.log('PWA foi instalado');
  deferredPrompt = null;
});

// Export install prompt function for components to use
window.showInstallPrompt = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    deferredPrompt = null;
    return outcome === 'accepted';
  }
  return false;
};