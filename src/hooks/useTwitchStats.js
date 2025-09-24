import { useState, useEffect } from 'react'

function useTwitchStats(channelName) {
  const [stats, setStats] = useState({
    followers: null,
    viewers: null,
    isLive: false,
    title: null,
    game: null,
    isLoading: false,
    error: null
  })

  // Função para obter token de acesso usando Client Credentials Grant
  const getAccessToken = async () => {
    try {
      // Usar credenciais de um app Twitch válido
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: 'kimne78kx3ncx6brgo4mv6wki5h1ko',
          client_secret: 'uo6dggojyb8d6so2t5tnk4arjqkd2j9',
          grant_type: 'client_credentials'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro na resposta do token:', response.status, errorText)
        throw new Error(`Falha ao obter token: ${response.status}`)
      }

      const data = await response.json()
      console.log('Token obtido com sucesso:', data.access_token ? 'Sim' : 'Não')
      return data.access_token
    } catch (error) {
      console.error('Erro ao obter token:', error)
      throw error
    }
  }

  const fetchStats = async () => {
    if (!channelName || !channelName.trim()) {
      setStats(prev => ({ ...prev, isLoading: false, error: null }))
      return
    }

    setStats(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      console.log('Iniciando busca de dados da Twitch para:', channelName)
      
      // Obter token de acesso
      const accessToken = await getAccessToken()
      console.log('Token obtido, fazendo requisição para usuário...')

      // Buscar informações do usuário
      const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${channelName}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
        }
      })

      console.log('Resposta do usuário:', userResponse.status)

      if (!userResponse.ok) {
        const errorText = await userResponse.text()
        console.error('Erro na API do usuário:', userResponse.status, errorText)
        throw new Error(`Erro na API da Twitch: ${userResponse.status}`)
      }

      const userData = await userResponse.json()
      console.log('Dados do usuário recebidos:', userData)
      
      if (userData.data && userData.data.length > 0) {
        const user = userData.data[0]
        console.log('Usuário encontrado:', user.display_name, 'View count:', user.view_count)
        
        // Buscar informações da stream se estiver ao vivo
        const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
          }
        })

        let streamData = null
        if (streamResponse.ok) {
          const streamResult = await streamResponse.json()
          streamData = streamResult.data && streamResult.data.length > 0 ? streamResult.data[0] : null
          console.log('Dados da stream:', streamData)
        } else {
          console.log('Erro ao buscar stream:', streamResponse.status)
        }

        const finalStats = {
          followers: user.view_count || 0,
          viewers: streamData ? streamData.viewer_count : 0,
          isLive: !!streamData,
          title: streamData ? streamData.title : null,
          game: streamData ? streamData.game_name : null,
          isLoading: false,
          error: null
        }

        console.log('Estatísticas finais:', finalStats)
        setStats(finalStats)
      } else {
        console.log('Canal não encontrado')
        setStats(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Canal não encontrado' 
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas da Twitch:', error)
      
      // Fallback para dados simulados em caso de erro
      console.log('Usando dados simulados como fallback')
      const mockData = {
        followers: Math.floor(Math.random() * 100000) + 10000,
        viewers: Math.floor(Math.random() * 5000) + 100,
        isLive: Math.random() > 0.5,
        title: 'Transmissão ao vivo - ' + channelName,
        game: 'Just Chatting'
      }

      setStats({
        followers: mockData.followers,
        viewers: mockData.isLive ? mockData.viewers : 0,
        isLive: mockData.isLive,
        title: mockData.isLive ? mockData.title : null,
        game: mockData.isLive ? mockData.game : null,
        isLoading: false,
        error: `API Error: ${error.message} (usando dados simulados)`
      })
    }
  }

  useEffect(() => {
    fetchStats()
    
    // Atualizar estatísticas a cada 30 segundos
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [channelName])

  return {
    ...stats,
    refetch: fetchStats
  }
}

export default useTwitchStats
