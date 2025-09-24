import React from 'react'
import packageJson from '../../package.json'

function Footer() {
  return (
    <footer className="p-4 text-center text-white/60">
      <div className="flex justify-center items-center gap-4 text-sm">
        <span>ChatMind-beta v{packageJson.version}</span>
        <span>•</span>
        <span>Todos os direitos reservados © amarkes-acode</span>
      </div>
    </footer>
  )
}

export default Footer
