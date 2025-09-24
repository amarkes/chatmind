import React from 'react'

function Header() {
  const handleCloseApp = () => {
    // Tentando fechar aplicação
    
    if (window.electronAPI && window.electronAPI.closeApp) {
      // Chamando closeApp
      window.electronAPI.closeApp()
    } else {
      // API não disponível, usando fallback
      // Fallback para desenvolvimento
      if (window.confirm('Deseja fechar a aplicação?')) {
        window.close()
      }
    }
  }

  const handleMinimizeApp = () => {
    // Tentando minimizar aplicação
    if (window.electronAPI && window.electronAPI.minimizeApp) {
      // Chamando minimizeApp
      window.electronAPI.minimizeApp()
    }
  }

  const handleMaximizeApp = () => {
    // Tentando maximizar aplicação
    if (window.electronAPI && window.electronAPI.maximizeApp) {
      // Chamando maximizeApp
      window.electronAPI.maximizeApp()
    }
  }

  return (
    <header className="p-6 text-center relative">
      {/* Controles da janela */}
      <div className="absolute top-4 right-4 flex gap-2">
        
        {/* Botão de fechar */}
        <button
          onClick={handleCloseApp}
          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg border border-red-400"
          title="Fechar aplicação"
        >
          ✕
        </button>
      </div>
      

    </header>
  )
}

export default Header
