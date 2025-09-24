const fs = require('fs');
const path = require('path');

console.log('🚀 Criando pacote de distribuição...');

// Criar pasta de distribuição
const distDir = 'distribution';
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

// Copiar arquivos necessários
const filesToCopy = [
  'main.js',
  'package.json',
  'dist'
];

filesToCopy.forEach(file => {
  const srcPath = file;
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    if (fs.statSync(srcPath).isDirectory()) {
      // Copiar diretório recursivamente
      fs.cpSync(srcPath, destPath, { recursive: true });
      console.log(`✅ Copiado: ${file}/`);
    } else {
      // Copiar arquivo
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copiado: ${file}`);
    }
  } else {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
  }
});

// Criar README para usuários
const readmeContent = `# ChatMind - Aplicação de Monitoramento de Chat

## 📋 Como usar:

1. **Instalar Node.js** (se não tiver):
   - Baixe em: https://nodejs.org/
   - Instale a versão LTS

2. **Instalar dependências**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Executar a aplicação**:
   \`\`\`bash
   npm start
   \`\`\`

## 🎯 Funcionalidades:

- ✅ Monitoramento de chat em tempo real
- ✅ Suporte a Twitch e Kick
- ✅ Interface moderna e intuitiva
- ✅ Estatísticas do Kick
- ✅ Auto-scroll nas mensagens

## ⚙️ Configuração:

1. Abra a aplicação
2. Vá para a aba "Canais"
3. Configure os canais desejados
4. Salve as configurações

## 🆘 Suporte:

Se tiver problemas, verifique se:
- Node.js está instalado
- Todas as dependências foram instaladas
- Os canais estão configurados corretamente

---
Versão: 1.0.1
Desenvolvido por: Antonio Ma Neto
`;

fs.writeFileSync(path.join(distDir, 'README.md'), readmeContent);
console.log('✅ Criado: README.md');

// Criar script de instalação para Windows
const installScript = `@echo off
echo 🚀 Instalando ChatMind...
echo.

echo 📦 Instalando dependências...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências!
    echo 💡 Certifique-se de que o Node.js está instalado.
    pause
    exit /b 1
)

echo ✅ Instalação concluída!
echo.
echo 🎉 Para executar o app, use: npm start
echo.
pause
`;

fs.writeFileSync(path.join(distDir, 'install.bat'), installScript);
console.log('✅ Criado: install.bat');

// Criar script de execução
const runScript = `@echo off
echo 🚀 Iniciando ChatMind...
echo.
call npm start
pause
`;

fs.writeFileSync(path.join(distDir, 'run.bat'), runScript);
console.log('✅ Criado: run.bat');

// Criar package.json simplificado para distribuição
const distPackageJson = {
  "name": "chatmind",
  "version": "1.0.1",
  "description": "Aplicação para monitorar canais de streaming",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "install-deps": "npm install"
  },
  "dependencies": {
    "electron": "38.1.2"
  },
  "keywords": ["twitch", "kick", "chat", "streaming"],
  "author": "Antonio Ma Neto",
  "license": "MIT"
};

fs.writeFileSync(
  path.join(distDir, 'package.json'), 
  JSON.stringify(distPackageJson, null, 2)
);
console.log('✅ Criado: package.json simplificado');

console.log('\n🎉 Pacote de distribuição criado com sucesso!');
console.log(`📁 Localização: ${path.resolve(distDir)}`);
console.log('\n📋 Instruções para usuários:');
console.log('1. Baixar e extrair o pacote');
console.log('2. Executar install.bat (Windows) ou npm install');
console.log('3. Executar run.bat (Windows) ou npm start');
console.log('\n💡 O pacote contém tudo necessário para executar o app!');
