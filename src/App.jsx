import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ChatsPage from './components/ChatsPage'
import ConfigForm from './components/ConfigForm'
import AdvancedSettings from './components/AdvancedSettings'
import Footer from './components/Footer'
import useConfigStore from './store/useConfigStore'

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const { isConfigured } = useConfigStore()

  // Se não estiver configurado, mostrar apenas o formulário de configuração
  if (!isConfigured) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <ConfigForm />
      </div>
    )
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />
      case 'chats':
        return <ChatsPage />
      case 'channels':
        return <ConfigForm />
      case 'window':
        return <AdvancedSettings onClose={() => setActiveMenu('dashboard')} />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex">
      <Sidebar onMenuSelect={setActiveMenu} activeMenu={activeMenu} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
