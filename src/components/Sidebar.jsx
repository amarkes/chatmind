import React, { useState } from 'react'
import useConfigStore from '../store/useConfigStore'
import packageJson from '../../package.json'

function Sidebar({ onMenuSelect, activeMenu }) {
  const { twitchChannel, kickChannel, isConfigured } = useConfigStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      description: 'Página principal'
    },
    {
      id: 'chats',
      label: 'Chats',
      icon: '💬',
      description: 'Visualizar chats dos canais'
    },
    {
      id: 'channels',
      label: 'Canais',
      icon: '📺',
      description: 'Configurar canais Twitch e Kick'
    },
    {
      id: 'window',
      label: 'Janela',
      icon: '⚙️',
      description: 'Configurações de tamanho e comportamento'
    }
  ]

  return (
    <div className={`gradient-bg text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header do Sidebar */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-white">
              🚀 ChatMind-beta
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title={isCollapsed ? 'Expandir' : 'Recolher'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        {!isCollapsed && (
          <p className="text-sm text-gray-400 mt-1">
            
          </p>
        )}
      </div>

      {/* Status dos Canais */}
      {!isCollapsed && (
        <div className="p-4 bg-white/10 border-b border-white/20">
          <h3 className="text-sm font-medium text-white/90 mb-2">📺 Status dos Canais</h3>
          <div className="text-xs text-white/70">
            Twitch: {twitchChannel}<br />
            Kick: {kickChannel}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onMenuSelect(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                  activeMenu === item.id
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
                title={isCollapsed ? item.description : ''}
              >
                <span className="text-xl mr-3">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-white/60">
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer do Sidebar */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/20">
          <div className="text-xs text-white/50">
            <div>ChatMind-beta</div>
            <div>V{packageJson.version}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
