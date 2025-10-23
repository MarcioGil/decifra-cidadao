# Contribuindo para o Decifra.Cidadão

Obrigado pelo seu interesse em contribuir para o Decifra.Cidadão! 🇧🇷

Este projeto tem como missão democratizar o acesso à informação e quebrar barreiras burocráticas para todos os cidadãos brasileiros.

## 🎯 Como Contribuir

### 🐛 Reportando Bugs

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/MarcioGil/decifra-cidadao/issues)
2. Se não existe, crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Screenshots se aplicável
   - Informações do ambiente (browser, OS, etc.)

### 💡 Sugerindo Melhorias

1. Verifique se a sugestão já existe nas Issues
2. Crie uma nova issue com a tag "enhancement"
3. Descreva claramente:
   - O problema que resolve
   - A solução proposta
   - Benefícios para os usuários

### 🔧 Contribuindo com Código

1. **Fork** o repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/SEU_USUARIO/decifra-cidadao.git
   ```
3. **Configure** o ambiente:
   ```bash
   cd decifra-cidadao
   ./setup.sh  # Linux/Mac
   # ou
   setup.bat   # Windows
   ```
4. **Crie** uma branch para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```
5. **Desenvolva** suas alterações
6. **Teste** thoroughly
7. **Commit** com mensagens claras:
   ```bash
   git commit -m "feat: adiciona funcionalidade X para melhorar Y"
   ```
8. **Push** para seu fork:
   ```bash
   git push origin feature/minha-feature
   ```
9. **Abra** um Pull Request

## 📋 Diretrizes de Desenvolvimento

### Código

- **Acessibilidade em primeiro lugar**: Sempre considere usuários com deficiências
- **Código limpo**: Use nomes descritivos e mantenha funções pequenas
- **Comentários**: Explique o "porquê", não o "o quê"
- **Testes**: Escreva testes para novas funcionalidades

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para documentação
- `style:` para formatação
- `refactor:` para refatoração
- `test:` para testes
- `chore:` para tarefas de manutenção

### Acessibilidade

- **Sempre** teste com leitores de tela
- **Garanta** navegação por teclado
- **Use** cores com contraste adequado
- **Implemente** ARIA labels quando necessário
- **Teste** com usuários reais quando possível

## 🧪 Testando

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### E2E
```bash
npm run test:e2e
```

## 📁 Estrutura do Projeto

```
decifra-cidadao/
├── backend/           # API Node.js
│   ├── src/
│   │   ├── routes/    # Endpoints da API
│   │   ├── services/  # Lógica de negócio
│   │   └── utils/     # Utilitários
│   └── tests/         # Testes do backend
├── frontend/          # App React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── pages/     # Páginas
│   │   └── contexts/  # Contextos React
│   └── public/        # Arquivos estáticos
└── docs/              # Documentação
```

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
OPENAI_API_KEY=sua_chave_openai
GOOGLE_CLOUD_PROJECT_ID=seu_projeto_id
GOOGLE_APPLICATION_CREDENTIALS=caminho/credentials.json
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Deploy

### Frontend (Vercel)
1. Conecte seu fork ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Backend (Railway)
1. Conecte seu fork ao Railway
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 📖 Recursos Úteis

- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)

## 🤝 Código de Conduta

- **Seja respeitoso** com todos os contribuidores
- **Aceite feedback** construtivo
- **Foque no impacto social** do projeto
- **Mantenha discussões** produtivas e inclusivas

## ❓ Dúvidas?

- **Issues**: Para bugs e sugestões
- **Discussions**: Para perguntas gerais
- **Email**: decifra.cidadao@gmail.com

## 🎉 Reconhecimento

Todos os contribuidores serão reconhecidos no README e releases.

---

**Lembre-se**: Este projeto visa ajudar milhões de brasileiros a entenderem melhor documentos burocráticos. Sua contribuição pode fazer a diferença na vida de muitas pessoas! 🇧🇷❤️