import { useState, useEffect } from 'react'

function useKickStats(channelName) {
  const [stats, setStats] = useState({
    followers: null,
    viewers: null,
    isLive: false,
    title: null,
    category: null,
    isLoading: false,
    error: null
  })

  const fetchStats = async () => {
    if (!channelName || !channelName.trim()) {
      setStats(prev => ({ ...prev, isLoading: false, error: null }))
      return
    }

    setStats(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Kick API pública - não requer autenticação
      const response = await fetch(`https://kick.com/api/v2/channels/${channelName}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Canal não encontrado')
        }
        throw new Error(`Erro na API do Kick: ${response.status}`)
      }

      const data = await response.json()
      
      setStats({
        followers: data.followers_count || 0,
        viewers: data.livestream ? data.livestream.viewer_count : 0,
        isLive: data.livestream ? data.livestream.is_live : false,
        title: data.livestream ? data.livestream.session_title : null,
        category: data.livestream ? data.livestream.category?.name : null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas do Kick:', error)
      setStats(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }))
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

export default useKickStats
