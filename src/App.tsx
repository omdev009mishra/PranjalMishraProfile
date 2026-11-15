import { useScrollProgress } from './hooks/useScrollProgress'
import { WorldCanvas } from './world/WorldCanvas'
import { WorldHUD } from './components/WorldHUD'
import { WORLD_ZONES } from './data/zones'
import './styles/world.css'
import './styles/zones.css'

function App() {
  useScrollProgress()

  return (
    <main className="world-shell">
      <WorldCanvas />
      <WorldHUD />

      <div className="world-content">
        <section id="awakening" className="world-section hero-section">
          <div className="eyebrow"><span /> AN INTERACTIVE DIGITAL ECOSYSTEM</div>
          <p className="hero-kicker">WELCOME TO THE WILD</p>
          <h1>PRANJAL<br /><em>MISHRA</em></h1>
          <p className="hero-tagline">Building Intelligence. Engineering Possibilities.</p>
          <p className="hero-description">Software engineer · AI/ML explorer · Product builder</p>
          <a className="explore-link" href="#living-network">ENTER THE ECOSYSTEM <span>↓</span></a>
          <span className="scroll-cue">SCROLL TO EXPLORE</span>
        </section>

        {WORLD_ZONES.slice(1).map((zone, index) => (
          <section id={zone.id} className={`world-section content-section zone-${zone.id}`} key={zone.id}>
            <div className="section-index">ZONE {zone.index} <span>— {zone.subtitle}</span></div>
            <h2>{zone.name}</h2>
            <p>{zone.description}</p>
            {index === 0 && (
              <div className="content-panel">
                <span className="panel-label">THE BUILDER</span>
                <h3>Curiosity is the root system.</h3>
                <p>I'm pursuing a B.Tech in Computer Science at Galgotias University, exploring the intersection of software engineering, AI and creative technology.</p>
              </div>
            )}
            {index === 1 && (
              <div className="content-panel">
                <span className="panel-label">SELECTED EXPERIMENTS</span>
                <h3>Research. Prototype. Build.</h3>
                <p>Project details will be migrated from the existing portfolio and verified repositories before this showcase goes live.</p>
              </div>
            )}
            {index === 2 && (
              <div className="content-panel">
                <span className="panel-label">ENGINEERING TOOLKIT</span>
                <h3>Connected disciplines.</h3>
                <p>AI and machine learning · Computer vision · Web engineering · Mobile development · Backend systems.</p>
              </div>
            )}
            {index === 3 && (
              <div className="content-panel">
                <span className="panel-label">OPEN A CHANNEL</span>
                <h3>Let's build something meaningful.</h3>
                <div className="contact-links">
                  <a href="mailto:omdev009mishra@gmail.com">Email</a>
                  <a href="https://github.com/omdev009mishra" target="_blank" rel="noreferrer">GitHub ↗</a>
                  <a href="https://www.linkedin.com/in/pranjal-mishra777/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
      <footer className="world-footer">NEURAL WILDERNESS <span>© 2026 · DESIGNED & BUILT BY PRANJAL MISHRA</span></footer>
    </main>
  )
}

export default App
