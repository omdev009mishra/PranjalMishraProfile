import { useWorldStore } from '../store/worldStore'
import { WORLD_ZONES } from '../data/zones'

export function WorldHUD() {
  const progress = useWorldStore((state) => state.progress)
  const activeZoneId = useWorldStore((state) => state.activeZoneId)
  const selectedObject = useWorldStore((state) => state.selectedObject)
  const selectObject = useWorldStore((state) => state.selectObject)
  const activeZone = WORLD_ZONES.find((zone) => zone.id === activeZoneId) ?? WORLD_ZONES[0]

  return (
    <>
      <header className="world-header">
        <a className="wordmark" href="#awakening" aria-label="Neural Wilderness home">NW<span>_</span></a>
        <nav aria-label="World navigation">
          {WORLD_ZONES.map((zone) => (
            <a key={zone.id} className={activeZoneId === zone.id ? 'active' : ''} href={`#${zone.id}`}>
              {zone.index}
            </a>
          ))}
        </nav>
        <span className="header-status"><i /> SYSTEM ONLINE</span>
      </header>

      <div className="world-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <aside className="zone-indicator" aria-live="polite">
        <span>{activeZone.index} / 05</span>
        <strong>{activeZone.name}</strong>
      </aside>

      {selectedObject && (
        <div className="signal-card" role="status">
          <p>{selectedObject}</p>
          <button type="button" onClick={() => selectObject(null)} aria-label="Close signal">×</button>
        </div>
      )}
    </>
  )
}
