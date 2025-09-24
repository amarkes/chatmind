import React, { useState } from 'react'
import useConfigStore from '../store/useConfigStore'
import useTwitchStats from '../hooks/useTwitchStats'
import useKickStats from '../hooks/useKickStats'

function Dashboard({ systemInfo }) {
  const { twitchChannel, kickChannel, clearChannels } = useConfigStore()
  
  // Hooks para estatísticas das APIs
  const twitchStats = useTwitchStats(twitchChannel)
  const kickStats = useKickStats(kickChannel)

  // Função para formatar números
  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }


  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 w-full">
      <div className="w-full max-w-none">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            🏠 Dashboard
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            Bem-vindo à sua aplicação Electron!
          </p>
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => {
                // Botão DevTools clicado
                // window.electronAPI disponível
                
                // Tentar múltiplas formas
                try {
                  // Método 1: electronAPI
                  if (window.electronAPI && window.electronAPI.openDevTools) {
                    // Chamando openDevTools via electronAPI
                    window.electronAPI.openDevTools()
                    return
                  }
                  
                  // Método 2: IPC direto
                  if (window.require) {
                    // Tentando IPC direto
                    const { ipcRenderer } = window.require('electron')
                    ipcRenderer.send('open-devtools')
                    return
                  }
                  
                  // Método 3: Atalho de teclado simulado
                  // Tentando simular atalho de teclado
                  const event = new KeyboardEvent('keydown', {
                    key: 'i',
                    code: 'KeyI',
                    ctrlKey: true,
                    shiftKey: true,
                    metaKey: true // Cmd no Mac
                  })
                  document.dispatchEvent(event)
                  
                } catch (error) {
                  // Erro ao abrir DevTools
                  alert('Erro ao abrir DevTools. Tente usar Cmd+Shift+I')
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base mt-3"
              title="Abrir DevTools"
            >
              🔧 DevTools
            </button>
          )}
        </div>

        {/* Cards de Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Status dos Canais */}
          <div className="glass-card p-4 md:p-6">
            <div className="flex items-center mb-3 md:mb-4">
              <span className="text-2xl md:text-3xl mr-2 md:mr-3">📺</span>
              <h3 className="text-lg md:text-xl font-semibold text-white">Canais Configurados</h3>
            </div>
            <div className="space-y-2">
              {twitchChannel && (
                <div className="flex items-center text-purple-400">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Twitch: {twitchChannel}
                </div>
              )}
              {kickChannel && (
                <div className="flex items-center text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Kick: {kickChannel}
                </div>
              )}
              {!twitchChannel && !kickChannel && (
                <div className="text-yellow-400">
                  Nenhum canal configurado
                </div>
              )}
            </div>
          </div>


          {/* Estatísticas Twitch */}
          {twitchChannel && (
            <div className="glass-card p-4 md:p-6">
              <div className="flex items-center mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl mr-2 md:mr-3">🟣</span>
                <h3 className="text-lg md:text-xl font-semibold text-white">Twitch Stats</h3>
              </div>
              {twitchStats.error && twitchStats.error.includes('usando dados simulados') && (
                <div className="text-xs text-yellow-400 mb-2">
                  ⚠️ {twitchStats.error}
                </div>
              )}
              <div className="space-y-2 text-sm">
                {twitchStats.isLoading ? (
                  <div className="text-blue-400">Carregando...</div>
                ) : twitchStats.error ? (
                  <div className="text-red-400">Erro: {twitchStats.error}</div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Seguidores:</span>
                      <span className="text-purple-400 font-medium">{formatNumber(twitchStats.followers)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Status:</span>
                      <span className={`font-medium ${twitchStats.isLive ? 'text-green-400' : 'text-gray-400'}`}>
                        {twitchStats.isLive ? '🔴 Ao Vivo' : '⚫ Offline'}
                      </span>
                    </div>
                    {twitchStats.isLive && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Viewers:</span>
                          <span className="text-green-400 font-medium">{formatNumber(twitchStats.viewers)}</span>
                        </div>
                        {twitchStats.title && (
                          <div className="text-xs text-white/60 truncate" title={twitchStats.title}>
                            📺 {twitchStats.title}
                          </div>
                        )}
                        {twitchStats.game && (
                          <div className="text-xs text-white/60">
                            🎮 {twitchStats.game}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Estatísticas Kick */}
          {kickChannel && (
            <div className="glass-card p-4 md:p-6">
              <div className="flex items-center mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl mr-2 md:mr-3">🟢</span>
                <h3 className="text-lg md:text-xl font-semibold text-white">Kick Stats</h3>
              </div>
              <div className="space-y-2 text-sm">
                {kickStats.isLoading ? (
                  <div className="text-blue-400">Carregando...</div>
                ) : kickStats.error ? (
                  <div className="text-red-400">Erro: {kickStats.error}</div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Seguidores:</span>
                      <span className="text-green-400 font-medium">{formatNumber(kickStats.followers)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Status:</span>
                      <span className={`font-medium ${kickStats.isLive ? 'text-green-400' : 'text-gray-400'}`}>
                        {kickStats.isLive ? '🔴 Ao Vivo' : '⚫ Offline'}
                      </span>
                    </div>
                    {kickStats.isLive && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Viewers:</span>
                          <span className="text-green-400 font-medium">{formatNumber(kickStats.viewers)}</span>
                        </div>
                        {kickStats.title && (
                          <div className="text-xs text-white/60 truncate" title={kickStats.title}>
                            📺 {kickStats.title}
                          </div>
                        )}
                        {kickStats.category && (
                          <div className="text-xs text-white/60">
                            🎮 {kickStats.category}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        

        {/* Dicas de Uso */}
        <div className="mt-4 md:mt-6 text-center">
          <p className="text-white/70 mb-3 md:mb-4 text-sm md:text-base">
            💡 Dicas para usar o chat:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-2 py-1 md:px-3 md:py-1 bg-white/20 rounded-full text-xs md:text-xs">Configure os canais na aba "Canais"</span>
            <span className="px-2 py-1 md:px-3 md:py-1 bg-white/20 rounded-full text-xs md:text-xs">Veja os chats em tempo real</span>
            <span className="px-2 py-1 md:px-3 md:py-1 bg-white/20 rounded-full text-xs md:text-xs">Suporte a Twitch e Kick</span>
            <span className="px-2 py-1 md:px-3 md:py-1 bg-white/20 rounded-full text-xs md:text-xs">Interface moderna e intuitiva</span>
            <span className="px-2 py-1 md:px-3 md:py-1 bg-white/20 rounded-full text-xs md:text-xs">Auto-scroll nas mensagens</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
