import React, { useState } from 'react'
import useConfigStore from '../store/useConfigStore'

function ConfigForm() {
  const {
    twitchChannel,
    kickChannel,
    youtubeChannel,
    setTwitchChannel,
    setKickChannel,
    setYoutubeChannel,
    setChannels,
    clearChannels,
    isValidTwitchChannel,
    isValidKickChannel,
    isValidYoutubeChannel
  } = useConfigStore()

  const [formData, setFormData] = useState({
    twitch: twitchChannel,
    kick: kickChannel,
    youtube: youtubeChannel || '@'
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let processedValue = value.trim()
    
    // Processar valor baseado no campo
    if (name === 'youtube') {
      // Para YouTube, sempre garantir que tenha @ (exceto se for Channel ID UC)
      if (processedValue && !processedValue.startsWith('UC')) {
        // Se não começar com @, adicionar
        if (!processedValue.startsWith('@')) {
          processedValue = '@' + processedValue
        }
      }
      // Se o campo estiver vazio ou só com @, manter apenas @
      if (!processedValue || processedValue === '@') {
        processedValue = '@'
      }
    } else {
      // Para Twitch e Kick, converter para lowercase
      processedValue = processedValue.toLowerCase()
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (formData.twitch && !isValidTwitchChannel(formData.twitch)) {
      newErrors.twitch = 'Canal Twitch inválido (4-25 caracteres, apenas letras, números, _ e -)'
    }
    
    if (formData.kick && !isValidKickChannel(formData.kick)) {
      newErrors.kick = 'Canal Kick inválido (3-25 caracteres, apenas letras, números, _ e -)'
    }
    
    if (formData.youtube && !isValidYoutubeChannel(formData.youtube)) {
      newErrors.youtube = 'Canal YouTube inválido (use @username ou Channel ID começando com UC)'
    }
    
    if (!formData.twitch && !formData.kick && !formData.youtube) {
      newErrors.general = 'Configure pelo menos um canal'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setChannels(formData.twitch, formData.kick, formData.youtube)
      
      // Mostrar feedback de sucesso
      alert('Configurações salvas com sucesso! 🎉')
    } catch (error) {
      alert('Erro ao salvar configurações')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as configurações?')) {
      clearChannels()
      setFormData({ twitch: '', kick: '', youtube: '@' })
      setErrors({})
    }
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white mb-2">
              ⚙️ Configuração de Canais
            </h2>
            <p className="text-white/80">
              Configure os canais do Twitch e Kick para monitorar
            </p>
          </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Canal Twitch */}
        <div>
          <label htmlFor="twitch" className="block text-sm font-medium text-white mb-2">
            📺 Canal Twitch
          </label>
          <div className="relative">
            <input
              type="text"
              id="twitch"
              name="twitch"
              value={formData.twitch}
              onChange={handleInputChange}
              placeholder="exemplo: ninja"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                errors.twitch ? 'border-red-400' : 'border-white/30'
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {formData.twitch && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-green-400 text-sm">✓</span>
              </div>
            )}
          </div>
          {errors.twitch && (
            <p className="text-red-400 text-sm mt-1">{errors.twitch}</p>
          )}
        </div>

        {/* Canal Kick */}
        <div>
          <label htmlFor="kick" className="block text-sm font-medium text-white mb-2">
            🥊 Canal Kick
          </label>
          <div className="relative">
            <input
              type="text"
              id="kick"
              name="kick"
              value={formData.kick}
              onChange={handleInputChange}
              placeholder="exemplo: xqc"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                errors.kick ? 'border-red-400' : 'border-white/30'
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {formData.kick && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-green-400 text-sm">✓</span>
              </div>
            )}
          </div>
          {errors.kick && (
            <p className="text-red-400 text-sm mt-1">{errors.kick}</p>
          )}
        </div>

        {/* Canal YouTube */}
        <div>
          <label htmlFor="youtube" className="block text-sm font-medium text-white mb-2">
            📺 Canal YouTube
          </label>
          <div className="relative">
            <input
              type="text"
              id="youtube"
              name="youtube"
              value={formData.youtube}
              onChange={handleInputChange}
              placeholder="exemplo: pewdiepie ou UC-lHJZR3Gqxm24VdAA"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                errors.youtube ? 'border-red-400' : 'border-white/30'
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {formData.youtube && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-green-400 text-sm">✓</span>
              </div>
            )}
          </div>
          {errors.youtube && (
            <p className="text-red-400 text-sm mt-1">{errors.youtube}</p>
          )}
        </div>

        {/* Erro geral */}
        {errors.general && (
          <div className="bg-red-500/20 border border-red-400 rounded-xl p-4">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
              isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 hover:scale-105'
            } text-white shadow-lg`}
          >
            {isSubmitting ? 'Salvando...' : '💾 Salvar Configurações'}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all hover:scale-105 shadow-lg"
          >
            🗑️ Limpar
          </button>
        </div>
      </form>

      {/* Status atual */}
      {(twitchChannel || kickChannel || youtubeChannel) && (
        <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
          <h3 className="text-white font-medium mb-2">📋 Configuração Atual:</h3>
          <div className="space-y-1 text-sm text-white/80">
            {twitchChannel && (
              <p>📺 Twitch: <span className="text-green-400">{twitchChannel}</span></p>
            )}
            {kickChannel && (
              <p>🥊 Kick: <span className="text-green-400">{kickChannel}</span></p>
            )}
            {youtubeChannel && (
              <p>📺 YouTube: <span className="text-green-400">{youtubeChannel}</span></p>
            )}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  )
}

export default ConfigForm
