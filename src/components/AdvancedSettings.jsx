import React, { useState } from 'react'
import useConfigStore from '../store/useConfigStore'

function AdvancedSettings({ onClose }) {
  const { windowSettings, setWindowSettings, resetWindowSettings } = useConfigStore()
  
  const [formData, setFormData] = useState({
    width: windowSettings.width,
    height: windowSettings.height,
    minWidth: windowSettings.minWidth,
    minHeight: windowSettings.minHeight,
    maxWidth: windowSettings.maxWidth,
    maxHeight: windowSettings.maxHeight,
    resizable: windowSettings.resizable,
    alwaysOnTop: windowSettings.alwaysOnTop,
    fullscreen: windowSettings.fullscreen
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : parseInt(value) || 0
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
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
    
    // Validações de tamanho
    if (formData.width < formData.minWidth) {
      newErrors.width = `Largura deve ser maior ou igual a ${formData.minWidth}px`
    }
    if (formData.width > formData.maxWidth) {
      newErrors.width = `Largura deve ser menor ou igual a ${formData.maxWidth}px`
    }
    if (formData.height < formData.minHeight) {
      newErrors.height = `Altura deve ser maior ou igual a ${formData.minHeight}px`
    }
    if (formData.height > formData.maxHeight) {
      newErrors.height = `Altura deve ser menor ou igual a ${formData.maxHeight}px`
    }
    
    // Validações de limites
    if (formData.minWidth > formData.maxWidth) {
      newErrors.minWidth = 'Largura mínima não pode ser maior que a máxima'
    }
    if (formData.minHeight > formData.maxHeight) {
      newErrors.minHeight = 'Altura mínima não pode ser maior que a máxima'
    }
    
    // Validações de valores mínimos
    if (formData.width < 400) {
      newErrors.width = 'Largura mínima é 400px'
    }
    if (formData.height < 300) {
      newErrors.height = 'Altura mínima é 300px'
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
      
      // Salvar no store
      setWindowSettings(formData)
      
      // Salvar no arquivo de configuração do Electron
      // Tentando salvar configurações
      
      if (window.electronAPI && window.electronAPI.saveWindowSettings) {
        try {
          const success = await window.electronAPI.saveWindowSettings(formData)
          // Resultado do salvamento
          
          if (success) {
            alert('Configurações de janela salvas e aplicadas! ✅\nA janela foi redimensionada automaticamente.')
            onClose() // Fechar o modal após salvar
          } else {
            alert('Configurações salvas no app, mas houve erro ao aplicar na janela.')
          }
        } catch (error) {
          // Erro ao chamar saveWindowSettings
          alert('Erro ao salvar configurações: ' + error.message)
        }
      } else {
        // API do Electron não disponível
        alert('Configurações salvas! Reinicie a aplicação para aplicar as mudanças. 🔄')
      }
    } catch (error) {
      alert('Erro ao salvar configurações')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      resetWindowSettings()
      setFormData({
        width: 1024,
        height: 600,
        minWidth: 800,
        minHeight: 500,
        maxWidth: 1920,
        maxHeight: 1080,
        resizable: true,
        alwaysOnTop: false,
        fullscreen: false
      })
      setErrors({})
    }
  }

  const presets = [
    { name: 'Pequeno', width: 800, height: 500 },
    { name: 'Médio', width: 1024, height: 600 },
    { name: 'Grande', width: 1280, height: 720 },
    { name: 'HD', width: 1920, height: 1080 }
  ]

  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      width: preset.width,
      height: preset.height
    }))
  }

  const applyPresetImmediately = async (preset, event) => {
    const newFormData = {
      ...formData,
      width: preset.width,
      height: preset.height
    }
    
    setFormData(newFormData)
    
    // Aplicar imediatamente se a API estiver disponível
    // Aplicando preset
    
    if (window.electronAPI && window.electronAPI.saveWindowSettings) {
      try {
        const success = await window.electronAPI.saveWindowSettings(newFormData)
        // Preset aplicado com sucesso
        
        if (success) {
          // Feedback visual sutil
          const button = event.target
          const originalText = button.textContent
          button.textContent = '✓ Aplicado!'
          button.className += ' bg-green-600'
          setTimeout(() => {
            button.textContent = originalText
            button.className = button.className.replace(' bg-green-600', '')
          }, 1500)
        }
      } catch (error) {
        // Erro ao aplicar preset
      }
    } else {
      // API do Electron não disponível para preset
    }
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-white">
            ⚙️ Configurações Avançadas
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Presets rápidos */}
          <div>
            <h3 className="text-xl font-medium text-white mb-4">📐 Presets Rápidos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={(e) => applyPresetImmediately(preset, e)}
                  className="p-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white transition-all hover:scale-105"
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm text-white/70">{preset.width}×{preset.height}</div>
                </button>
              ))}
            </div>
            <p className="text-sm text-white/60 mt-2">
              💡 Clique em um preset para aplicar imediatamente
            </p>
          </div>

          {/* Configurações de tamanho */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Largura */}
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-white mb-2">
                📏 Largura (px)
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                min="400"
                max="3840"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                  errors.width ? 'border-red-400' : 'border-white/30'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.width && (
                <p className="text-red-400 text-sm mt-1">{errors.width}</p>
              )}
            </div>

            {/* Altura */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-white mb-2">
                📐 Altura (px)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                min="300"
                max="2160"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                  errors.height ? 'border-red-400' : 'border-white/30'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.height && (
                <p className="text-red-400 text-sm mt-1">{errors.height}</p>
              )}
            </div>

            {/* Largura mínima */}
            <div>
              <label htmlFor="minWidth" className="block text-sm font-medium text-white mb-2">
                📏 Largura Mínima (px)
              </label>
              <input
                type="number"
                id="minWidth"
                name="minWidth"
                value={formData.minWidth}
                onChange={handleInputChange}
                min="400"
                max="3840"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                  errors.minWidth ? 'border-red-400' : 'border-white/30'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.minWidth && (
                <p className="text-red-400 text-sm mt-1">{errors.minWidth}</p>
              )}
            </div>

            {/* Altura mínima */}
            <div>
              <label htmlFor="minHeight" className="block text-sm font-medium text-white mb-2">
                📐 Altura Mínima (px)
              </label>
              <input
                type="number"
                id="minHeight"
                name="minHeight"
                value={formData.minHeight}
                onChange={handleInputChange}
                min="300"
                max="2160"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                  errors.minHeight ? 'border-red-400' : 'border-white/30'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.minHeight && (
                <p className="text-red-400 text-sm mt-1">{errors.minHeight}</p>
              )}
            </div>

            {/* Largura máxima */}
            <div>
              <label htmlFor="maxWidth" className="block text-sm font-medium text-white mb-2">
                📏 Largura Máxima (px)
              </label>
              <input
                type="number"
                id="maxWidth"
                name="maxWidth"
                value={formData.maxWidth}
                onChange={handleInputChange}
                min="400"
                max="3840"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Altura máxima */}
            <div>
              <label htmlFor="maxHeight" className="block text-sm font-medium text-white mb-2">
                📐 Altura Máxima (px)
              </label>
              <input
                type="number"
                id="maxHeight"
                name="maxHeight"
                value={formData.maxHeight}
                onChange={handleInputChange}
                min="300"
                max="2160"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Opções avançadas */}
          <div>
            <h3 className="text-xl font-medium text-white mb-4">🔧 Opções Avançadas</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="resizable"
                  checked={formData.resizable}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-white">Permitir redimensionamento da janela</span>
              </label>

            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6">
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
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all hover:scale-105 shadow-lg"
            >
              🔄 Restaurar Padrão
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-medium transition-all hover:scale-105 shadow-lg"
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default AdvancedSettings
