import { useEffect, useRef } from 'react'

function useAutoScroll(dependencies = []) {
  const scrollRef = useRef(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    // Scroll para o final sempre que as dependências mudarem
    scrollToBottom()
  }, dependencies)

  return { scrollRef, scrollToBottom }
}

export default useAutoScroll
