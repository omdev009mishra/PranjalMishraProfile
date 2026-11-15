import { useEffect } from 'react'
import { getZoneForProgress } from '../data/zones'
import { useWorldStore } from '../store/worldStore'

export function useScrollProgress() {
  const setProgress = useWorldStore((state) => state.setProgress)
  const setActiveZone = useWorldStore((state) => state.setActiveZone)

  useEffect(() => {
    let frame = 0

    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
        const normalized = Math.min(1, Math.max(0, progress))
        setProgress(normalized)
        setActiveZone(getZoneForProgress(normalized).id)
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [setActiveZone, setProgress])
}
