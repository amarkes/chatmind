import React, { useEffect } from 'react'
import useConfigStore from '../store/useConfigStore'
import useTwitchChat from '../hooks/useTwitchChat'
import useKickChat from '../hooks/useKickChat'
import useAutoScroll from '../hooks/useAutoScroll'

function ChatsPage() {
  const { twitchChannel, kickChannel, isConfigured } = useConfigStore()
  
  // Usar os hooks para conectar aos chats
  const {
    messages: twitchMessages,
    isConnected: twitchConnected,
    connectionStatus: twitchStatus,
    connect: connectTwitch,
    disconnect: disconnectTwitch
  } = useTwitchChat(twitchChannel)

  const {
    messages: kickMessages,
    isConnected: kickConnected,
    connectionStatus: kickStatus,
    connect: connectKick,
    disconnect: disconnectKick
  } = useKickChat(kickChannel)

  // Auto-scroll para o final das mensagens
  const { scrollRef: twitchScrollRef } = useAutoScroll([twitchMessages])
  const { scrollRef: kickScrollRef } = useAutoScroll([kickMessages])


  // Debug: Log das mensagens
  // Debug logs removidos

  // Listener para atalho de teclado do DevTools
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Cmd+Shift+I ou Cmd+Shift+D
      if (event.metaKey && event.shiftKey && (event.key === 'i' || event.key === 'I' || event.key === 'd' || event.key === 'D')) {
        event.preventDefault()
        // Atalho de teclado detectado para DevTools
        
        try {
          if (window.electronAPI && window.electronAPI.openDevTools) {
            window.electronAPI.openDevTools()
          } else if (window.require) {
            const { ipcRenderer } = window.require('electron')
            ipcRenderer.send('open-devtools')
          }
        } catch (error) {
          // Erro ao abrir DevTools via atalho
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])


  if (!isConfigured) {
    return (
      <div className="flex-1 gradient-bg text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold mb-4">💬 Chats dos Canais</h1>
            <p className="text-white/80 mb-6">
              Configure os canais Twitch e Kick primeiro para visualizar os chats
            </p>
            <div className="text-white/60">
              <p>Vá para <strong>Canais</strong> no menu lateral para configurar</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getPlatformColor = (platform) => {
    return platform === 'twitch' ? 'text-purple-400' : 'text-green-400'
  }

  const getPlatformBg = (platform) => {
    return platform === 'twitch' ? 'bg-purple-500/20' : 'bg-green-500/20'
  }

  return (
    <div className="flex flex-col gradient-bg text-white p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">💬 Chats dos Canais</h1>
            <p className="text-white/80">
              Visualize os chats do Twitch e Kick lado a lado
            </p>
          </div>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            title="Abrir DevTools"
          >
            🔧 DevTools
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 gap-4 flex-1" style={{minHeight: '70vh', maxHeight: '70vh'}}>
        {/* Chat do Twitch */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 flex flex-col shadow-2xl h-full">
            <div className="p-4 border-b border-gray-700/50 bg-gray-800/50 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-purple-400">Twitch</h2>
                  <span className="text-sm text-white/60">#{twitchChannel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    twitchConnected ? 'bg-green-500 animate-pulse' : 
                    twitchStatus === 'reconnecting' ? 'bg-yellow-500 animate-pulse' : 
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-white/60">
                    {twitchConnected ? 'Conectado' : 
                     twitchStatus === 'reconnecting' ? 'Reconectando...' : 
                     'Desconectado'}
                  </span>
                  {!twitchConnected && (
                    <button
                      onClick={() => {
                        // Reconectando Twitch manualmente
                        connectTwitch()
                      }}
                      className="ml-2 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                      title="Reconectar"
                    >
                      🔄
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div ref={twitchScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800/30 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 min-h-0">
              {twitchMessages.map((msg, index) => (
                <div key={msg.id + index} className="flex gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${getPlatformBg('twitch')} flex items-center justify-center text-xs font-bold text-white`}>
                    {msg.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{msg.user}</span>
                      <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-gray-100 text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat do Kick */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 flex flex-col shadow-2xl h-full">
            <div className="p-4 border-b border-gray-700/50 bg-gray-800/50 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-green-400">Kick</h2>
                  <span className="text-sm text-white/60">#{kickChannel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    kickConnected ? 'bg-green-500 animate-pulse' : 
                    kickStatus === 'reconnecting' ? 'bg-yellow-500 animate-pulse' : 
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-white/60">
                    {kickConnected ? 'Conectado' : 
                     kickStatus === 'reconnecting' ? 'Reconectando...' : 
                     'Desconectado'}
                  </span>
                  {!kickConnected && (
                    <button
                      onClick={() => {
                        // Reconectando Kick manualmente
                        connectKick()
                      }}
                      className="ml-2 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                      title="Reconectar"
                    >
                      🔄
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div ref={kickScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800/30 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 min-h-0">
              {kickStatus === 'error' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-red-400 text-6xl mb-4">🚫</div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">Kick Indisponível</h3>
                  <p className="text-gray-300 mb-4 max-w-md">
                    Testando nova URL do Kick (ws-us2.pusher.com) - aguarde...
                  </p>
                  <div className="text-sm text-gray-400 space-y-2">
                    <p><strong>Status dos domínios:</strong></p>
                    <ul className="text-left space-y-1">
                      <li>• ws-us2.pusher.com: DNS OK, timeout</li>
                      <li>• ws-us2.pusher.app: DNS falha</li>
                      <li>• Testando nova API do Kick</li>
                      <li>• Aguarde resultado do teste</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    O Twitch está funcionando normalmente.
                  </p>
                </div>
              ) : (
                kickMessages.map((msg, index) => (
                <div key={msg.id + index} className="flex gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${getPlatformBg('kick')} flex items-center justify-center text-xs font-bold text-white`}>
                    {msg.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{msg.user}</span>
                      <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-gray-100 text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </div>

        {/* Status da Conexão */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 shadow-xl mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Twitch: {twitchChannel}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Kick: {kickChannel}</span>
              </div>
            </div>
            <div className="text-sm text-white/60">
              {twitchConnected && kickConnected ? '🟢 Ambos Conectados' : 
               twitchConnected || kickConnected ? '🟡 Parcialmente Conectado' : 
               '🔴 Desconectado'}
            </div>
        </div>
      </div>
    </div>
  )
}

export default ChatsPage
