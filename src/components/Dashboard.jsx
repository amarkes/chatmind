import React, { useState } from 'react'
import useConfigStore from '../store/useConfigStore'

function Dashboard({ systemInfo }) {
  const { twitchChannel, kickChannel, clearChannels } = useConfigStore()


  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏠 Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Bem-vindo à sua aplicação Electron!
          </p>
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

        {/* Cards de Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Status dos Canais */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📺</span>
              <h3 className="text-xl font-semibold text-white">Canais Configurados</h3>
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

          {/* Status da Aplicação */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">⚡</span>
              <h3 className="text-xl font-semibold text-white">Status da Aplicação</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Aplicação rodando
              </div>
              <div className="flex items-center text-blue-400">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Novas funcionalidades viram
              </div>
              <div className="flex items-center text-purple-400">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Novibreves a dades
              </div>
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">💻</span>
              <h3 className="text-xl font-semibold text-white">Sistema</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-white/80">
                Usuários: 99999
              </div>
              <div className="text-white/80">
                Assinantes: 99999
              </div>
              <div className="text-white/80">
                Membros: 99999
              </div>
              <div className="text-white/80">
                Chumbo: 999999
              </div>
            </div>
          </div>
        </div>

        

        {/* Tecnologias */}
        <div className="mt-6 text-center">
          <p className="text-white/70 mb-4">
            ✨ Esta aplicação usa:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">dogs</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">dogs</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">dogs</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">dogs</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">dogs</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
