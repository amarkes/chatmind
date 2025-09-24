import { useState, useEffect, useRef } from 'react'

function useKickChat(channelName) {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const wsRef = useRef(null)
  const connectingRef = useRef(false) // Flag para evitar múltiplas conexões

  const connect = () => {
    if (!channelName || !channelName.trim()) {
      return
    }

    // Verificar se já está conectando ou conectado
    if (connectingRef.current) {
      return
    }

    if (isConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return
    }

    // Marcar como conectando
    connectingRef.current = true

    // Fechar conexão anterior se existir
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    // Obter informações do canal e chatroom_id
    fetch('https://kick.com/api/v2/channels/' + channelName.toLowerCase())
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error(`Canal Kick não encontrado: ${response.status}`)
        }
      })
      .then(data => {
        const chatroomId = data.chatroom?.id
        if (chatroomId) {
          connectWebSocket(chatroomId)
        } else {
          setConnectionStatus('error')
          connectingRef.current = false
        }
      })
      .catch(error => {
        // Mesmo com erro na API, tentar conectar ao WebSocket com ID padrão
        connectWebSocket()
      })
  }

  const connectWebSocket = (chatroomId = null) => {
    try {
      
      // Tentar diferentes URLs do Kick
      const kickUrls = [
        // NOVA URL FUNCIONANDO (domínio .com)
        'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false',
        
        // URLs básicas (domínio antigo - para fallback)
        'wss://ws-us2.pusher.app/app/eb1d5f283081a78b932c',
        'wss://ws-us2.pusher.app/app/eb1d5f283081a78b932c?protocol=7&client=js',
        'wss://ws-us2.pusher.app/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0',
        
        // URLs com parâmetros adicionais
        'wss://ws-us2.pusher.app/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&transport=websocket',
        'wss://ws-us2.pusher.app/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&transport=websocket&encrypted=true',
        
        // URLs alternativas (se o domínio principal não funcionar)
        'wss://ws-us2.pusher.app/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&transport=websocket&encrypted=true&cluster=us2',
        'wss://ws-us2.pusher.app/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&transport=websocket&encrypted=true&cluster=us2&auth_endpoint=https://kick.com/api/v1/chatroom/1/token'
      ]
      
      let currentUrlIndex = 0
      const tryNextUrl = () => {
        if (currentUrlIndex >= kickUrls.length) {
          setConnectionStatus('error')
          connectingRef.current = false
          return
        }
        
        const url = kickUrls[currentUrlIndex]
        
        const ws = new WebSocket(url)
        wsRef.current = ws
        currentUrlIndex++
        
        // Timeout para conexão (10 segundos)
        const connectionTimeout = setTimeout(() => {
          if (ws.readyState === WebSocket.CONNECTING) {
            ws.close()
            tryNextUrl()
          }
        }, 10000)

        ws.onopen = () => {
          clearTimeout(connectionTimeout) // Limpar timeout
          setIsConnected(true)
          setConnectionStatus('connected')
          connectingRef.current = false // Limpar flag de conexão

          // Autenticar no Kick
          const channelToSubscribe = chatroomId ? `chatrooms.${chatroomId}.v2` : `chatrooms.${channelName.toLowerCase()}.v2`
          ws.send(JSON.stringify({
            event: 'pusher:subscribe',
            data: {
              channel: channelToSubscribe
            }
          }))
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            
            if (data.event === 'App\\Events\\ChatMessageEvent') {
              const messageData = JSON.parse(data.data)
              const message = parseKickMessage(messageData)
              if (message) {
                // Verificar se a mensagem já existe para evitar duplicatas
                setMessages(prev => {
                  const exists = prev.some(msg => 
                    msg.user === message.user && 
                    msg.message === message.message && 
                    Math.abs(new Date(msg.timestamp) - new Date(message.timestamp)) < 2000
                  )
                  
                  if (!exists) {
                    return [...prev.slice(-99), message] // Manter últimas 100 mensagens
                  }
                  return prev
                })
              }
            }
          } catch (error) {
            // Erro ao processar mensagem
          }
        }

        ws.onclose = () => {
          clearTimeout(connectionTimeout) // Limpar timeout
          setIsConnected(false)
          setConnectionStatus('disconnected')
          connectingRef.current = false // Limpar flag de conexão
        }

        ws.onerror = (error) => {
          clearTimeout(connectionTimeout) // Limpar timeout
          
          // Se for erro de DNS, tentar próxima URL
          if (error.type === 'error' && ws.url.includes('ws-us2.pusher.app')) {
            tryNextUrl()
            return
          }
          
          setConnectionStatus('error')
          connectingRef.current = false // Limpar flag de conexão
        }
      }
      
      // Iniciar tentativa com primeira URL
      tryNextUrl()

    } catch (error) {
      setConnectionStatus('error')
      connectingRef.current = false // Limpar flag de conexão
    }
  }

  const parseKickMessage = (data) => {
    try {
      return {
        id: data.id || Date.now() + Math.random(),
        user: data.sender?.username || 'unknown',
        message: data.content || '',
        timestamp: new Date(data.created_at || Date.now()),
        platform: 'kick',
        channel: data.chatroom?.slug || 'unknown',
        userInfo: data.sender?.identity?.color || ''
      }
    } catch (error) {
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

export default useKickChat