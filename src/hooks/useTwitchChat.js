import { useState, useEffect, useRef } from 'react'

function useTwitchChat(channelName) {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const wsRef = useRef(null)
  const connectingRef = useRef(false) // Flag para evitar múltiplas conexões

  const connect = () => {
    if (!channelName || !channelName.trim()) {
      // console.log('Nome do canal Twitch não fornecido')
      return
    }

    // Verificar se já está conectando ou conectado
    if (connectingRef.current) {
      // console.log('Já está tentando conectar ao Twitch, ignorando...')
      return
    }

    if (isConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // console.log('Twitch já está conectado, ignorando nova tentativa...')
      return
    }

    // Marcar como conectando
    connectingRef.current = true
    // console.log('Iniciando conexão com Twitch IRC...')

    // Fechar conexão anterior se existir
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    try {
      // console.log('Iniciando conexão com Twitch IRC...')
      // Conectar ao IRC da Twitch via WebSocket
      const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443')
      wsRef.current = ws

      // Timeout para conexão (10 segundos)
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close()
          setConnectionStatus('error')
          connectingRef.current = false
        }
      }, 10000)

      ws.onopen = () => {
        // console.log('Conectado ao IRC da Twitch')
        clearTimeout(connectionTimeout) // Limpar timeout
        setIsConnected(true)
        setConnectionStatus('connected')
        connectingRef.current = false // Limpar flag de conexão

        // Autenticar (modo anônimo)
        // console.log('Enviando comandos de autenticação...')
        ws.send('PASS SCHMOOPIIE')
        ws.send('NICK justinfan12345')
        ws.send('JOIN #' + channelName.toLowerCase())
        // console.log('Comandos enviados para canal:', channelName.toLowerCase())
      }

      ws.onmessage = (event) => {
        const data = event.data.trim()
        const lines = data.split('\r\n')

        lines.forEach(line => {
          // console.log('Mensagem IRC recebida:', line)
          
          if (line.includes('PRIVMSG')) {
            // console.log('Mensagem de chat detectada:', line)
            // Parse da mensagem do chat
            const message = parseTwitchMessage(line)
            if (message) {
              // console.log('Mensagem parseada:', message)
              // Verificar se a mensagem já existe para evitar duplicatas
              setMessages(prev => {
                const exists = prev.some(msg => 
                  msg.user === message.user && 
                  msg.message === message.message && 
                  Math.abs(new Date(msg.timestamp) - new Date(message.timestamp)) < 2000
                )
                
                if (!exists) {
                  // console.log('Adicionando nova mensagem ao chat')
                  return [...prev.slice(-99), message] // Manter últimas 100 mensagens
                }
                // console.log('Mensagem duplicada, ignorando')
                return prev
              })
            }
          } else if (line.includes('PING')) {
            // Responder ao PING para manter conexão
            // console.log('Respondendo PING')
            ws.send('PONG :tmi.twitch.tv')
          } else if (line.includes('JOIN')) {
            // console.log('Entrou no canal:', channelName)
          } else if (line.includes('001')) {
            // console.log('Autenticação IRC bem-sucedida')
          } else if (line.includes('353')) {
            // console.log('Lista de usuários recebida')
          }
        })
      }

      ws.onclose = () => {
        // console.log('Conexão Twitch fechada')
        clearTimeout(connectionTimeout) // Limpar timeout
        setIsConnected(false)
        setConnectionStatus('disconnected')
        connectingRef.current = false // Limpar flag de conexão
      }

      ws.onerror = (error) => {
        // console.error('Erro na conexão Twitch:', error)
        // console.error('WebSocket readyState:', ws.readyState)
        // console.error('WebSocket URL:', ws.url)
        // console.error('Tipo do erro:', error.type)
        
        // Verificar se é um erro de conexão ou de rede
        if (ws.readyState === WebSocket.CLOSED) {
          // console.error('WebSocket foi fechado durante a conexão')
        } else if (ws.readyState === WebSocket.CONNECTING) {
          // console.error('Erro durante a tentativa de conexão')
        }
        
        clearTimeout(connectionTimeout) // Limpar timeout
        setConnectionStatus('error')
        connectingRef.current = false // Limpar flag de conexão
      }

    } catch (error) {
      // console.error('Erro ao conectar:', error)
      setConnectionStatus('error')
      connectingRef.current = false // Limpar flag de conexão
    }
  }

  const parseTwitchMessage = (line) => {
    try {
      // console.log('Parseando mensagem IRC:', line)
      
      // Parse do formato IRC da Twitch
      const parts = line.split(' ')
      // console.log('Partes da mensagem:', parts)
      
      if (parts.length < 4) {
        // console.log('Mensagem IRC muito curta, ignorando')
        return null
      }
      
      const userInfo = parts[0].substring(1) // Remove o ':'
      const channel = parts[2].substring(1) // Remove o '#'
      const message = line.substring(line.indexOf(':', 1) + 1)

      // console.log('UserInfo:', userInfo, 'Channel:', channel, 'Message:', message)

      // Extrair informações do usuário
      const userParts = userInfo.split('!')
      const username = userParts[0]
      const userInfoPart = userParts[1]?.split('@')[0] || ''

      // console.log('Username extraído:', username)

      // Gerar ID único baseado no conteúdo da mensagem (compatível com Unicode)
      const messageHash = btoa(encodeURIComponent(username + message + Date.now() + Math.random())).substring(0, 20)

      const parsedMessage = {
        id: messageHash,
        user: username,
        message: message,
        timestamp: new Date(),
        platform: 'twitch',
        channel: channel,
        userInfo: userInfoPart
      }
      
      // console.log('Mensagem parseada com sucesso:', parsedMessage)
      return parsedMessage
    } catch (error) {
      // console.error('Erro ao parsear mensagem:', error, 'Line:', line)
      return null
    }
  }

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
    setConnectionStatus('disconnected')
    connectingRef.current = false // Limpar flag de conexão
  }

  const clearMessages = () => {
    setMessages([])
  }

  useEffect(() => {
    if (channelName && channelName.trim()) {
      // console.log('Conectando ao Twitch:', channelName)
      connect()
    }

    return () => {
      disconnect()
    }
  }, [channelName])


  return {
    messages,
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    clearMessages
  }
}

export default useTwitchChat