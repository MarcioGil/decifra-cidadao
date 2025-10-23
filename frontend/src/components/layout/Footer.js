import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-gray-50 border-t border-gray-200 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
              <Heart className="text-red-500" size={20} fill="currentColor" />
              <span className="text-lg font-bold text-gray-800">Decifra.Cidadão</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Transformando burocracia brasileira em simplicidade através da Inteligência Artificial. 
              Democratizando o acesso à informação para todos os cidadãos.
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-xs">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                100% Gratuito
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Open Source
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                WCAG 2.1 AA
              </span>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Navegação</h3>
            <nav className="space-y-2" role="navigation" aria-label="Links do rodapé">
              <div>
                <a 
                  href="/" 
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm block"
                >
                  🏠 Início
                </a>
              </div>
              <div>
                <a 
                  href="/about" 
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm block"
                >
                  ℹ️ Sobre o Projeto
                </a>
              </div>
              <div>
                <a 
                  href="https://github.com/MarcioGil/decifra-cidadao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm block"
                >
                  💻 Código Fonte
                </a>
              </div>
              <div>
                <a 
                  href="https://github.com/MarcioGil/decifra-cidadao/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm block"
                >
                  🐛 Reportar Bug
                </a>
              </div>
            </nav>
          </div>

          {/* Sobre o Autor */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Autor</h3>
            <div className="mb-3">
              <p className="text-gray-700 font-medium">Márcio Gil</p>
              <p className="text-gray-600 text-xs">Embaixador DIO Campus Expert</p>
              <p className="text-gray-600 text-xs">Engenheiro de Software</p>
            </div>
            <div className="flex justify-center md:justify-end space-x-3 mb-4">
              <motion.a
                href="https://marciogil.github.io/curriculum-vitae/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Portfolio de Márcio Gil"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe size={18} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/márcio-gil-1b7669309"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn de Márcio Gil"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={18} />
              </motion.a>
              <motion.a
                href="https://github.com/MarcioGil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="GitHub de Márcio Gil"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={18} />
              </motion.a>
              <motion.a
                href="mailto:marciopaivagil@gmail.com"
                className="text-gray-600 hover:text-red-600 transition-colors"
                aria-label="Email de Márcio Gil"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={18} />
              </motion.a>
            </div>
            <p className="text-gray-500 text-xs italic">
              "Tecnologia + Educação = Transformação Social"
            </p>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                © {currentYear} Decifra.Cidadão. Desenvolvido com{' '}
                <Heart className="inline text-red-500" size={14} fill="currentColor" />{' '}
                por{' '}
                <a 
                  href="https://github.com/MarcioGil" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  Márcio Gil
                </a>
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Licença MIT • Código aberto • Uso livre
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                ✅ WCAG 2.1 AA
              </span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                🚀 PWA Ready
              </span>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                🤖 IA Powered
              </span>
            </div>
          </div>
        </div>

        {/* Aviso Legal */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-xs leading-relaxed">
            <strong>⚖️ Aviso Legal:</strong> O Decifra.Cidadão oferece explicações educativas baseadas em IA. 
            Para decisões importantes, sempre consulte profissionais especializados. Não nos responsabilizamos 
            por decisões tomadas com base nas explicações fornecidas. Seus documentos não são armazenados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;