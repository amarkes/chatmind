import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useConfigStore = create(
  persist(
    (set, get) => ({
      // Estado inicial - Canais
      twitchChannel: '',
      kickChannel: '',
      youtubeChannel: '',
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
          isConfigured: !!(channel || state.kickChannel || state.youtubeChannel)
        })),
      
      setKickChannel: (channel) => 
        set((state) => ({
          kickChannel: channel,
          isConfigured: !!(state.twitchChannel || channel || state.youtubeChannel)
        })),
      
      setYoutubeChannel: (channel) => 
        set((state) => ({
          youtubeChannel: channel,
          isConfigured: !!(state.twitchChannel || state.kickChannel || channel)
        })),
      
      setChannels: (twitchChannel, kickChannel, youtubeChannel) => 
        set({
          twitchChannel,
          kickChannel,
          youtubeChannel,
          isConfigured: !!(twitchChannel || kickChannel || youtubeChannel)
        }),
      
      clearChannels: () => 
        set({
          twitchChannel: '',
          kickChannel: '',
          youtubeChannel: '',
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
      },
      
      isValidYoutubeChannel: (channel) => {
        if (!channel) return false
        // YouTube channels podem ser @username ou channel ID (UC...)
        // Aceita @username (3-30 caracteres) ou channel ID (24 caracteres começando com UC)
        return /^(@[a-zA-Z0-9_-]{3,30}|UC[a-zA-Z0-9_-]{22})$/.test(channel)
      }
    }),
    {
      name: 'stream-config', // nome da chave no localStorage
      version: 1
    }
  )
)

export default useConfigStore
