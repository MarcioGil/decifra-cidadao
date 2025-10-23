import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Github, Linkedin, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AboutPage = () => {
  const navigate = useNavigate();
  const { accessibility } = useAccessibility();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 ${
      accessibility.highContrast ? 'high-contrast' : ''
    } ${
      accessibility.fontSize === 'large' ? 'text-lg' : accessibility.fontSize === 'xl' ? 'text-xl' : ''
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
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
            <h1 className="text-3xl font-bold text-gray-800">
              Sobre o Decifra.Cidadão
            </h1>
            <p className="text-gray-600">
              Transformando burocracia em simplicidade
            </p>
          </div>
        </motion.div>

        {/* Missão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            🎯 Nossa Missão
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O <strong>Decifra.Cidadão</strong> nasceu da observação de uma realidade brasileira: 
            milhões de cidadãos enfrentam diariamente documentos e processos burocráticos incompreensíveis. 
            Nossa missão é democratizar o acesso à informação através da Inteligência Artificial.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-blue-800 font-medium">
              "A tecnologia deve servir às pessoas, não o contrário. Cada linha de código é uma 
              oportunidade de fazer a diferença na vida de alguém."
            </p>
          </div>
        </motion.div>

        {/* Como Funciona */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
            ⚙️ Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">👁️</div>
              <h3 className="font-bold text-gray-800 mb-2">Extração</h3>
              <p className="text-gray-600 text-sm">
                Google Vision AI lê qualquer documento ou imagem automaticamente
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🧠</div>
              <h3 className="font-bold text-gray-800 mb-2">Tradução</h3>
              <p className="text-gray-600 text-sm">
                Clara, nossa IA, explica tudo em português brasileiro simples
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🗣️</div>
              <h3 className="font-bold text-gray-800 mb-2">Áudio</h3>
              <p className="text-gray-600 text-sm">
                Google Cloud TTS transforma a explicação em voz humana
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sobre o Autor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            👨‍💻 Sobre o Autor
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Márcio Gil</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  🎓 Embaixador DIO Campus Expert
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  💻 Engenheiro de Software
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  ⚡ Justiça Social
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Estudante apaixonado por tecnologia, educação, inovação e justiça social. 
                Como Embaixador da DIO Campus Expert, dedico-me a democratizar o acesso à 
                informação e tecnologia através de projetos de impacto social.
              </p>
              <p className="text-gray-700 leading-relaxed">
                O Decifra.Cidadão representa minha paixão por justiça social através da 
                inovação - transformando a complexidade burocrática brasileira em simplicidade acessível.
              </p>
            </div>
            <div className="md:w-1/3">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3">Conecte-se:</h4>
                <div className="space-y-2">
                  <a
                    href="https://marciogil.github.io/curriculum-vitae/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Globe size={16} />
                    Portfolio
                  </a>
                  <a
                    href="https://www.linkedin.com/in/márcio-gil-1b7669309"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/MarcioGil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                  <a
                    href="mailto:marciopaivagil@gmail.com"
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tecnologias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
            🛠️ Tecnologias Utilizadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">⚛️</div>
              <div className="font-medium text-gray-800">React 18</div>
              <div className="text-xs text-gray-600">Frontend</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🟢</div>
              <div className="font-medium text-gray-800">Node.js</div>
              <div className="text-xs text-gray-600">Backend</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-medium text-gray-800">OpenAI</div>
              <div className="text-xs text-gray-600">GPT-4</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl mb-2">👁️</div>
              <div className="font-medium text-gray-800">Google AI</div>
              <div className="text-xs text-gray-600">Vision & TTS</div>
            </div>
          </div>
        </motion.div>

        {/* Acessibilidade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            ♿ Compromisso com Acessibilidade
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Decifra.Cidadão foi desenvolvido seguindo as diretrizes <strong>WCAG 2.1 AA</strong>, 
            garantindo que todas as pessoas possam usar nossa ferramenta, independentemente de suas limitações.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-800 mb-2">🎯 Recursos Inclusos:</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Navegação completa por teclado</li>
                <li>• Compatibilidade com leitores de tela</li>
                <li>• Alto contraste configurável</li>
                <li>• Fontes ampliadas</li>
                <li>• Áudio para todas as explicações</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-800 mb-2">📱 Multiplataforma:</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Progressive Web App (PWA)</li>
                <li>• Funciona offline</li>
                <li>• Instalável no celular</li>
                <li>• Responsivo para todos os dispositivos</li>
                <li>• Otimizado para performance</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Impacto Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6 border border-green-200"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
            💚 Impacto Social
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-green-800 mb-2">🎯 Objetivos:</h3>
              <ul className="text-green-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Reduzir a ansiedade causada por documentos complexos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Promover autonomia e dignidade cidadã</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Democratizar o acesso à informação</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Quebrar barreiras da linguagem técnica</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-blue-800 mb-2">🚀 Valores:</h3>
              <ul className="text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>100% gratuito e open source</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Privacidade e segurança em primeiro lugar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Inclusão digital para todos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Educação como ferramenta de transformação</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <Heart className="text-red-500" size={24} />
              Feito com Amor para o Brasil
            </h2>
            <p className="text-gray-600 mb-6">
              Acredito que tecnologia + educação = transformação social
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="btn-primary text-lg px-8 py-3"
              >
                ✨ Experimentar Agora
              </button>
              <a
                href="https://github.com/MarcioGil/decifra-cidadao"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center gap-2"
              >
                <Github size={20} />
                Ver no GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;