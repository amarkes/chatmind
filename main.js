const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Mantém uma referência global do objeto window, caso contrário a janela será
// fechada automaticamente quando o objeto JavaScript for coletado pelo garbage collector.
let mainWindow;


function createWindow() {
  // Carregar configurações do localStorage se disponível
  let windowSettings = {
    width: 1024,
    height: 600,
    minWidth: 800,
    minHeight: 500,
    maxWidth: 1920,
    maxHeight: 1080,
    resizable: true,
    alwaysOnTop: false,
    fullscreen: false
  }

  try {
    // Tentar carregar configurações salvas
    const fs = require('fs')
    const os = require('os')
    const configPath = path.join(os.homedir(), '.electron-app-config.json')
    
    if (fs.existsSync(configPath)) {
      const savedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      if (savedConfig.windowSettings) {
        windowSettings = { ...windowSettings, ...savedConfig.windowSettings }
      }
    }
  } catch (error) {
    // Usando configurações padrão
  }

  // Criar a janela do navegador com configurações personalizadas.
  mainWindow = new BrowserWindow({
    width: windowSettings.width,
    height: windowSettings.height,
    minWidth: windowSettings.minWidth,
    minHeight: windowSettings.minHeight,
    maxWidth: windowSettings.maxWidth,
    maxHeight: windowSettings.maxHeight,
    resizable: windowSettings.resizable,
    alwaysOnTop: windowSettings.alwaysOnTop,
    fullscreen: windowSettings.fullscreen,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.png'), // Opcional: ícone da aplicação
    show: false // Não mostrar até estar pronto
  });

  // Carregar a aplicação Vite em desenvolvimento ou arquivo HTML em produção
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // DevTools não abrem automaticamente - use Ctrl+Shift+I ou F12 para abrir
  } else {
    mainWindow.loadFile('dist/index.html');
  }

  // Injetar API diretamente no renderer
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(`
      window.electronAPI = {
        platform: '${process.platform}',
        arch: '${process.arch}',
        nodeVersion: '${process.versions.node}',
        electronVersion: '${process.versions.electron}',
        openDevTools: () => {
          try {
            const { remote } = require('electron');
            remote.getCurrentWindow().webContents.openDevTools();
          } catch (error) {
            // Remote não disponível, usando IPC
            // Fallback via IPC
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('open-devtools');
          }
        },
        closeApp: () => {
          const { ipcRenderer } = require('electron');
          ipcRenderer.send('close-app');
        },
        minimizeApp: () => {
          const { ipcRenderer } = require('electron');
          ipcRenderer.send('minimize-app');
        },
        maximizeApp: () => {
          const { ipcRenderer } = require('electron');
          ipcRenderer.send('maximize-app');
        },
        saveWindowSettings: async (settings) => {
          const fs = require('fs');
          const os = require('os');
          const path = require('path');
          const configPath = path.join(os.homedir(), '.electron-app-config.json');
          
          try {
            // Salvar no arquivo
            fs.writeFileSync(configPath, JSON.stringify({ windowSettings: settings }, null, 2));
            
            // Aplicando configurações
            
            // Usar IPC para comunicar com o processo principal
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('apply-window-settings', settings);
            
            // Configurações enviadas para o processo principal
            return true;
          } catch (error) {
            // Erro ao salvar configurações
            return false;
          }
        }
      };
    `);
  });

  // Listener para aplicar configurações de janela
  ipcMain.on('apply-window-settings', (event, settings) => {
    if (mainWindow) {
      try {
        // Aplicando configurações no processo principal
        
        // Redimensionar a janela
        mainWindow.setSize(settings.width, settings.height);
        
        // Definir limites de redimensionamento
        mainWindow.setMinimumSize(settings.minWidth, settings.minHeight);
        mainWindow.setMaximumSize(settings.maxWidth, settings.maxHeight);
        
        // Configurar opções avançadas
        mainWindow.setResizable(settings.resizable);
        mainWindow.setAlwaysOnTop(settings.alwaysOnTop);
        
        // Centralizar a janela após redimensionar
        mainWindow.center();
        
        // Janela redimensionada com sucesso
      } catch (error) {
        // Erro ao aplicar configurações no processo principal
      }
    }
  });

  // Listeners para controles da janela
  ipcMain.on('close-app', () => {
    if (mainWindow) {
      // Fechando aplicação
      mainWindow.close();
    }
  });

  ipcMain.on('minimize-app', () => {
    if (mainWindow) {
      // Minimizando aplicação
      mainWindow.minimize();
    }
  });

  ipcMain.on('maximize-app', () => {
    if (mainWindow) {
      // Maximizando/restaurando aplicação
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('open-devtools', () => {
    if (mainWindow) {
      // Abrindo DevTools
      mainWindow.webContents.openDevTools();
    }
  });


  // DevTools podem ser abertos manualmente com Ctrl+Shift+I ou F12

  // Mostrar a janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitido quando a janela é fechada.
  mainWindow.on('closed', () => {
    // Desreferencia o objeto window, geralmente você armazenaria janelas
    // em um array se seu app suporta múltiplas janelas, este é o momento
    // quando você deveria deletar o elemento correspondente.
    mainWindow = null;
  });
}

// Este método será chamado quando o Electron tiver terminado
// a inicialização e estiver pronto para criar janelas do navegador.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(() => {
  createWindow();
  
  // Registrar atalho global para DevTools (Cmd+Shift+D no macOS, Ctrl+Shift+D no Windows/Linux)
  globalShortcut.register('CommandOrControl+Shift+D', () => {
    if (mainWindow) {
      mainWindow.webContents.toggleDevTools();
    }
  });
});


// Sair quando todas as janelas estiverem fechadas.
app.on('window-all-closed', () => {
  // Limpar atalhos globais quando a aplicação fechar
  globalShortcut.unregisterAll();
  
  // No macOS é comum para aplicativos e sua barra de menu
  // permanecerem ativos até que o usuário explicitamente encerre com Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // No macOS é comum recriar uma janela no app quando o
  // ícone do dock é clicado e não há outras janelas abertas.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Neste arquivo você pode incluir o resto do código do processo principal
// da sua aplicação. Você também pode colocar eles em arquivos separados e importá-los aqui.
