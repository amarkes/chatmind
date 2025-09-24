import React, { useState } from 'react'
import useConfigStore from '../store/useConfigStore'
import AdvancedSettings from './AdvancedSettings'

function MainContent({ systemInfo }) {
  const { twitchChannel, kickChannel, clearChannels } = useConfigStore()
  const [info, setInfo] = useState('Clique nos botões acima para interagir com a aplicação.')
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  const showAlert = () => {
    alert('Olá! Esta é uma aplicação Electron com React funcionando! 🎉')
  }

  const openDevTools = () => {
    if (window.electronAPI) {
      window.electronAPI.openDevTools()
    } else {
      // DevTools seria aberto aqui em produção
    }
  }

  const getSystemInfo = () => {
    if (systemInfo) {
      setInfo(`
        Informações do Sistema:
        Plataforma: ${systemInfo.platform}
        Arquitetura: ${systemInfo.arch}
        Node.js: ${systemInfo.nodeVersion}
        Electron: ${systemInfo.electronVersion}
      `)
    } else {
      setInfo('Informações do sistema não disponíveis')
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6">
        <div className="glass-card p-8 max-w-2xl w-full text-center animate-slide-up">
        <h2 className="text-3xl font-semibold text-white mb-6">
          Bem-vindo à sua aplicação moderna!
        </h2>
        
        {/* Status dos canais configurados */}
        <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/20">
          <h3 className="text-white font-medium mb-2">📺 Canais Configurados:</h3>
          <div className="space-y-1 text-sm text-white/80">
            {twitchChannel && (
              <p>📺 Twitch: <span className="text-purple-400 font-medium">{twitchChannel}</span></p>
            )}
            {kickChannel && (
              <p>🥊 Kick: <span className="text-green-400 font-medium">{kickChannel}</span></p>
            )}
            {!twitchChannel && !kickChannel && (
              <p className="text-yellow-400">Nenhum canal configurado</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button 
            onClick={showAlert}
            className="btn-primary"
          >
            Mostrar Alerta
          </button>
          
          <button 
            onClick={openDevTools}
            className="btn-primary"
          >
            Abrir DevTools
          </button>
          
          <button 
            onClick={getSystemInfo}
            className="btn-primary"
          >
            Info do Sistema
          </button>
          
          <button 
            onClick={() => {
              if (window.confirm('Tem certeza que deseja reconfigurar os canais?')) {
                clearChannels()
              }
            }}
            className="btn-primary bg-orange-600 hover:bg-orange-700"
          >
            ⚙️ Reconfigurar
          </button>
          
          <button 
            onClick={() => setShowAdvancedSettings(true)}
            className="btn-primary bg-purple-600 hover:bg-purple-700"
          >
            🔧 Configurações Avançadas
          </button>
        </div>

        <div className="glass-card p-4 text-left">
          <pre className="text-white/80 text-sm whitespace-pre-wrap">
            {info}
          </pre>
        </div>

        <div className="mt-6 text-white/70">
          <p className="text-sm">
            ✨ Esta aplicação usa as melhores tecnologias:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Electron</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">React</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Vite</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Tailwind CSS</span>
          </div>
        </div>
      </div>
      
      {/* Modal de Configurações Avançadas */}
      {showAdvancedSettings && (
        <AdvancedSettings onClose={() => setShowAdvancedSettings(false)} />
      )}
    </main>
  )
}

export default MainContent
