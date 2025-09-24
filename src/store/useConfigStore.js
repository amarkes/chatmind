import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useConfigStore = create(
  persist(
    (set, get) => ({
      // Estado inicial - Canais
      twitchChannel: '',
      kickChannel: '',
      isConfigured: false,
      
      // Estado inicial - Configurações de janela
      windowSettings: {
        width: 1024,
        height: 600,
        minWidth: 800,
        minHeight: 500,
        maxWidth: 1920,
        maxHeight: 1080,
        resizable: true,
        alwaysOnTop: false,
        fullscreen: false
      },
      
      // Ações - Canais
      setTwitchChannel: (channel) => 
        set((state) => ({
          twitchChannel: channel,
          isConfigured: !!(channel || state.kickChannel)
        })),
      
      setKickChannel: (channel) => 
        set((state) => ({
          kickChannel: channel,
          isConfigured: !!(state.twitchChannel || channel)
        })),
      
      setChannels: (twitchChannel, kickChannel) => 
        set({
          twitchChannel,
          kickChannel,
          isConfigured: !!(twitchChannel || kickChannel)
        }),
      
      clearChannels: () => 
        set({
          twitchChannel: '',
          kickChannel: '',
          isConfigured: false
        }),
      
      // Ações - Configurações de janela
      setWindowSettings: (settings) => 
        set((state) => ({
          windowSettings: { ...state.windowSettings, ...settings }
        })),
      
      resetWindowSettings: () => 
        set({
          windowSettings: {
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
        }),
      
      // Validação
      isValidTwitchChannel: (channel) => {
        if (!channel) return false
        // Twitch channels são alfanuméricos, underscore, hífen, mínimo 4 caracteres
        return /^[a-zA-Z0-9_-]{4,25}$/.test(channel)
      },
      
      isValidKickChannel: (channel) => {
        if (!channel) return false
        // Kick channels são alfanuméricos, underscore, hífen, mínimo 3 caracteres
        return /^[a-zA-Z0-9_-]{3,25}$/.test(channel)
      }
    }),
    {
      name: 'stream-config', // nome da chave no localStorage
      version: 1
    }
  )
)

export default useConfigStore
