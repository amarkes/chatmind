# 🚀 Electron + React + Vite + Tailwind

Uma aplicação Electron moderna e elegante construída com React, Vite e Tailwind CSS.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🚀 Como executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento (com hot reload):**
   ```bash
   npm run dev
   ```

3. **Executar apenas o servidor Vite:**
   ```bash
   npm run dev:vite
   ```

4. **Executar apenas o Electron:**
   ```bash
   npm run dev:electron
   ```

5. **Executar em produção:**
   ```bash
   npm start
   ```

## 🛠️ Scripts disponíveis

- `npm run dev` - Executa Vite + Electron em modo desenvolvimento
- `npm run dev:vite` - Executa apenas o servidor Vite
- `npm run dev:electron` - Executa apenas o Electron
- `npm run build` - Constrói a aplicação para distribuição
- `npm run build:vite` - Constrói apenas o frontend
- `npm start` - Executa a aplicação em produção

## 📁 Estrutura do projeto

```
eletron/
├── src/
│   ├── components/     # Componentes React
│   │   ├── Header.jsx
│   │   ├── MainContent.jsx
│   │   └── Footer.jsx
│   ├── styles/
│   │   └── index.css   # Estilos Tailwind CSS
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Ponto de entrada React
├── main.js             # Processo principal do Electron
├── index.html          # Template HTML para Vite
├── vite.config.js      # Configuração do Vite
├── tailwind.config.js  # Configuração do Tailwind
├── postcss.config.js   # Configuração do PostCSS
├── package.json        # Configurações do projeto
└── README.md           # Este arquivo
```

## ✨ Funcionalidades

- **React 18** com componentes modernos e hooks
- **Vite** para desenvolvimento rápido com hot reload
- **Tailwind CSS** para estilização utilitária
- Interface moderna com gradientes e efeitos glassmorphism
- Botões interativos para demonstrar funcionalidades
- Informações do sistema (plataforma, arquitetura, versões)
- Integração com APIs nativas do Electron
- Design responsivo e elegante
- Animações suaves com CSS

## 🎨 Características da interface

- Design moderno com gradientes
- Efeitos de glassmorphism (vidro fosco)
- Animações CSS personalizadas
- Interface responsiva
- Tema escuro elegante
- Componentes React modulares
- Estilos Tailwind CSS

## 🔧 Personalização

Você pode personalizar a aplicação editando:

- `src/components/` - Componentes React
- `src/styles/index.css` - Estilos globais e classes Tailwind customizadas
- `main.js` - Configurações da janela e comportamento da aplicação
- `vite.config.js` - Configurações do Vite
- `tailwind.config.js` - Configurações do Tailwind CSS
- `package.json` - Metadados e scripts do projeto

## 📦 Build para distribuição

Para criar um executável da aplicação:

```bash
npm run forge:make
```

Os arquivos de distribuição serão criados na pasta `dist/`.

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades!

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.
