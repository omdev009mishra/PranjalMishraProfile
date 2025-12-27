import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import './profile.css'
import profileImg from './assets/profile.jpg'
import simpleNotesImg from './assets/simplenotes.png'
import emailImg from './assets/email.jpg'
import funkymanImg from './assets/funkyman.png'
import dinoImg from './assets/dinogame.avif'

// --- Game State Management ---
const ACHIEVEMENTS = [
  { id: 'first-visit', name: 'Welcome Explorer!', desc: 'Started your journey', icon: '🎮', condition: 'auto' },
  { id: 'about-reader', name: 'Story Reader', desc: 'Read the About section', icon: '📖', condition: 'scroll-about' },
  { id: 'skill-master', name: 'Skill Scout', desc: 'Explored all skills', icon: '⚔️', condition: 'view-skills' },
  { id: 'project-viewer', name: 'Code Explorer', desc: 'Viewed projects', icon: '🚀', condition: 'scroll-projects' },
  { id: 'click-master', name: 'Click Champion', desc: 'Made 50 clicks', icon: '🖱️', condition: 'clicks-50' },
  { id: 'power-collector', name: 'Power Collector', desc: 'Collected 5 power-ups', icon: '⭐', condition: 'powerups-5' },
  { id: 'konami-code', name: 'Classic Gamer', desc: 'Entered the Konami code', icon: '🎯', condition: 'konami' },
  { id: 'completionist', name: 'Completionist', desc: 'Reached the end', icon: '🏆', condition: 'scroll-contact' },
]

// --- Game HUD Component ---
function GameHUD({ score, level, xp, maxXp, achievements, quests, combo, visible }) {
  const [showAchievements, setShowAchievements] = useState(false)
  const [showQuests, setShowQuests] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const xpPercentage = (xp / maxXp) * 100

  if (!visible) return null

  return (
    <div className={`game-hud-circular ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Main Circular Orb */}
      <div className="hud-orb" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="orb-content">
          <div className="orb-level">{level}</div>
          <div className="orb-score">{score}</div>
          <div className="orb-xp-ring" style={{ background: `conic-gradient(var(--gold) 0deg ${(xpPercentage / 100) * 360}deg, rgba(255,215,0,0.2) ${(xpPercentage / 100) * 360}deg)` }}></div>
        </div>
      </div>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="hud-expanded-panel">
          <div className="panel-header">
            <h3>GAME STATUS</h3>
            <button className="close-btn" onClick={() => setIsExpanded(false)}>✕</button>
          </div>

          <div className="panel-stats">
            <div className="stat-row">
              <span>LEVEL</span>
              <span className="value">{level}</span>
            </div>
            <div className="stat-row">
              <span>SCORE</span>
              <span className="value">{score}</span>
            </div>
            <div className="stat-row">
              <span>XP</span>
              <span className="value">{xp}/{maxXp}</span>
            </div>
            {combo > 1 && (
              <div className="stat-row combo">
                <span>COMBO</span>
                <span className="value combo-val">{combo}x</span>
              </div>
            )}
          </div>

          <div className="xp-bar-full">
            <div className="xp-fill" style={{ width: `${xpPercentage}%` }}></div>
            <span className="xp-label">{Math.round(xpPercentage)}%</span>
          </div>

          <div className="panel-buttons">
            <button className="panel-btn quests-btn" onClick={() => setShowQuests(!showQuests)}>
              📜 QUESTS ({quests.filter(q => !q.completed).length})
            </button>
            <button className="panel-btn achievements-btn" onClick={() => setShowAchievements(!showAchievements)}>
              🏆 ACHIEVEMENTS ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </button>
          </div>

          {showQuests && (
            <div className="panel-content quests-list">
              <h4>Active Quests</h4>
              {quests.map((quest, i) => (
                <div key={i} className={`quest-item ${quest.completed ? 'completed' : ''}`}>
                  <span>{quest.completed ? '✅' : '⏳'}</span>
                  <span className="quest-name">{quest.name}</span>
                  <span className="quest-xp">+{quest.xp}</span>
                </div>
              ))}
            </div>
          )}

          {showAchievements && (
            <div className="panel-content achievements-list">
              <h4>Achievements</h4>
              <div className="achievement-grid-small">
                {achievements.map((ach, i) => (
                  <div key={i} className={`ach-badge ${ach.unlocked ? 'unlocked' : 'locked'}`} title={ach.desc}>
                    {ach.unlocked ? ach.icon : '🔒'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// --- Achievement Notification Component ---
function AchievementNotification({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="achievement-notification">
      <div className="achievement-popup">
        <div className="ach-header">🎉 Achievement Unlocked!</div>
        <div className="ach-content">
          <div className="ach-icon-large">{achievement.icon}</div>
          <div>
            <div className="ach-title">{achievement.name}</div>
            <div className="ach-desc">{achievement.desc}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Floating Power-Up Component ---
function PowerUp({ x, y, type, onCollect, cursed }) {
  const icons = {
    star: '⭐',
    gem: '💎',
    coin: '🪙',
    heart: '❤️',
    bolt: '⚡',
    cursed: '💀'
  }

  return (
    <div 
      className={`power-up ${cursed ? 'cursed-powerup' : ''}`} 
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onCollect}
      title={cursed ? 'Cursed! Lose XP!' : 'Collect me!'}
    >
      <div className="power-up-icon">{icons[type] || icons.cursed}</div>
    </div>
  )
}

// --- Click Particle Effect Component ---
function ClickParticle({ x, y, id, text = "+10" }) {
  return (
    <div 
      className="click-particle" 
      style={{ left: x, top: y }}
    >
      {text}
    </div>
  )
}

// --- Custom Cursor Component ---
function CustomCursor() {
  const dotRef = useRef(null)
  const outlineRef = useRef(null)

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e
      
      // Move dot immediately
      if (dotRef.current) {
        dotRef.current.style.left = `${clientX}px`
        dotRef.current.style.top = `${clientY}px`
      }

      // Move outline with slight delay/smoothing
      if (outlineRef.current) {
        outlineRef.current.animate({
          left: `${clientX}px`,
          top: `${clientY}px`
        }, { duration: 500, fill: "forwards" })
      }
    }

    const addHoverClass = () => document.body.classList.add('hovering')
    const removeHoverClass = () => document.body.classList.remove('hovering')

    window.addEventListener('mousemove', moveCursor)
    
    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addHoverClass)
      el.addEventListener('mouseleave', removeHoverClass)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addHoverClass)
        el.removeEventListener('mouseleave', removeHoverClass)
      })
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-outline" ref={outlineRef}></div>
    </>
  )
}

// --- 3D Tilt Card Component ---
function TiltCard({ children, className = "", onDoubleClick }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -10 // Max rotation deg
    const rotateY = ((x - centerX) / centerX) * 10

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  }

  const handleDoubleClickEvent = () => {
    if (cardRef.current) {
      cardRef.current.classList.add('card-explode')
      setTimeout(() => {
        cardRef.current?.classList.remove('card-explode')
      }, 600)
    }
    if (onDoubleClick) onDoubleClick()
  }

  return (
    <div 
      ref={cardRef} 
      className={`tilt-card ${className}`} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClickEvent}
      style={{ transition: 'transform 0.1s ease-out' }}
    >
      {children}
    </div>
  )
}

// --- Hacker Text Effect Component for Headings ---
function SectionTitle({ title }) {
  const [displayText, setDisplayText] = useState(title)
  const intervalRef = useRef(null)
  
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%"

  const handleMouseEnter = () => {
    let iteration = 0
    clearInterval(intervalRef.current)
    
    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        title.split("").map((letter, index) => {
          if(index < iteration) {
            return title[index]
          }
          if (title[index] === ' ') return ' '
          return chars[Math.floor(Math.random() * chars.length)]
        }).join("")
      )
      
      if(iteration >= title.length){ 
        clearInterval(intervalRef.current)
      }
      
      iteration += 1 / 3
    }, 30)
  }

  return (
    <h2 className="section-title" onMouseEnter={handleMouseEnter} style={{cursor: 'default'}}>
      {displayText}
    </h2>
  )
}

// --- Pixel Particles Component ---
function PixelParticles() {
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * 360
    const distance = 100 + Math.random() * 30
    const x = Math.cos(angle * Math.PI / 180) * distance
    const y = Math.sin(angle * Math.PI / 180) * distance
    const size = 6 + Math.random() * 6
    const color = Math.random() > 0.5 ? 'var(--accent-color)' : '#fff'
    const delay = Math.random() * 0.2
    
    return { x, y, size, color, delay }
  })

  return (
    <div className="pixel-particles">
      {particles.map((p, i) => (
        <div 
          key={i} 
          className="pixel-particle"
          style={{
            '--x': `${p.x}px`,
            '--y': `${p.y}px`,
            '--size': `${p.size}px`,
            '--color': p.color,
            '--delay': `${p.delay}s`
          }}
        />
      ))}
    </div>
  )
}

// --- Interactive Text Component ---
function InteractiveText({ content }) {
  const keywords = [
    "Computer Science", "B.Tech", "Galgotias University", "C", "C++", "Java", "Python", 
    "Unreal Engine 5", "Blender", "DaVinci Resolve", "Game Development", "Video Editing",
    "Procedural Generation", "AI Implementation", "Physics Simulations", "Color Grading",
    "Motion Graphics", "Sound Design"
  ]

  // Helper to escape regex special characters
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  
  // Create a regex pattern that matches any of the keywords (case insensitive)
  const pattern = new RegExp(`(${keywords.map(escapeRegExp).join('|')})`, 'gi')
  
  const parts = content.split(pattern)

  return (
    <p>
      {parts.map((part, index) => {
        // Check if this part matches a keyword (case insensitive check)
        const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase())
        
        if (isKeyword) {
          return (
            <span key={index} className="highlight-word" data-text={part}>
              {part}
            </span>
          )
        }
        return part
      })}
    </p>
  )
}

// --- Expandable Experience Card Component (Modal Version) ---
function ExperienceCard({ role, company, type, date, location, description, skills, website, industry, companySize }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {/* Trigger Card */}
      <div 
        className="experience-content" 
        onClick={() => setShowModal(true)}
      >
        <div className="experience-header">
          <h3>{role}</h3>
          <h4>{company} · {type}</h4>
          <span className="experience-location">{location}</span>
        </div>
        <div className="click-hint">Click for details <i className="fa-solid fa-arrow-up-right-from-square"></i></div>
      </div>

      {/* Modal Popup - Rendered via Portal to escape parent transforms */}
      {showModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="modal-header">
              <h3>{role}</h3>
              <h4>{company}</h4>
              <span className="experience-location">{location} | {date}</span>
            </div>
            
            <div className="modal-body">
              <p>{description}</p>

              {/* Company Overview Section */}
              {(website || industry || companySize) && (
                <div style={{
                  marginBottom: '1.5rem', 
                  padding: '1rem', 
                  background: '#f9f9f9', 
                  border: '2px solid var(--border-color)',
                  fontSize: '0.9rem'
                }}>
                  <h5 style={{
                    marginBottom: '0.8rem', 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: '0.85rem', 
                    color: 'var(--heading-color)',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '0.5rem'
                  }}>
                    Company Overview
                  </h5>
                  {website && (
                    <p style={{marginBottom: '0.5rem'}}>
                      <strong>Website:</strong> <a href={website} target="_blank" rel="noreferrer" style={{color: 'var(--accent-color)', textDecoration: 'none'}}>{website}</a>
                    </p>
                  )}
                  {industry && <p style={{marginBottom: '0.5rem'}}><strong>Industry:</strong> {industry}</p>}
                  {companySize && <p style={{marginBottom: '0.5rem'}}><strong>Company size:</strong> {companySize}</p>}
                </div>
              )}
              
              <h5 style={{marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontSize: '0.9rem'}}>Skills Used:</h5>
              <div className="experience-tags">
                {skills.map((skill, index) => (
                  <span key={index} className="experience-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default function Profile() {
  const taglineRef = useRef(null)
  const revealRefs = useRef([])
  const konamiCode = useRef([])
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

  // Game State
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    xp: 0,
    maxXp: 100,
    clicks: 0,
    powerupsCollected: 0,
    skillDoubleClicks: 0,
    achievements: ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })),
    quests: [
      { name: 'Read About Me', completed: false, xp: 50 },
      { name: 'View All Skills', completed: false, xp: 75 },
      { name: 'Check Out Projects', completed: false, xp: 100 },
      { name: 'Collect 5 Power-ups', completed: false, xp: 150 },
      { name: 'Reach Contact Section', completed: false, xp: 200 },
    ],
    sectionsVisited: new Set(),
  })

  const [recentAchievement, setRecentAchievement] = useState(null)
  const [clickParticles, setClickParticles] = useState([])
  const [powerUps, setPowerUps] = useState([])
  const [skillLevels, setSkillLevels] = useState({})
  const [combo, setCombo] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const comboTimeout = useRef(null)
  const [profileClicks, setProfileClicks] = useState(0)
  const [titleClicks, setTitleClicks] = useState(0)
  const profileClickTimeout = useRef(null)
  const titleClickTimeout = useRef(null)
  const [showHUD, setShowHUD] = useState(false)

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId) => {
    setGameState(prev => {
      const achievement = prev.achievements.find(a => a.id === achievementId)
      if (!achievement || achievement.unlocked) return prev

      setRecentAchievement(achievement)
      
      return {
        ...prev,
        achievements: prev.achievements.map(a => 
          a.id === achievementId ? { ...a, unlocked: true } : a
        ),
        score: prev.score + 100,
        xp: prev.xp + 50,
      }
    })
  }, [])

  // Add XP and handle level up
  const addXP = useCallback((amount) => {
    setGameState(prev => {
      let newXP = prev.xp + amount
      let newLevel = prev.level
      let newMaxXP = prev.maxXp

      while (newXP >= newMaxXP) {
        newXP -= newMaxXP
        newLevel++
        newMaxXP = Math.floor(newMaxXP * 1.5)
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        maxXp: newMaxXP,
        score: prev.score + (newLevel > prev.level ? 500 : 0),
      }
    })
  }, [])

  // Handle skill card double click
  const handleSkillDoubleClick = useCallback((skillName) => {
    setSkillLevels(prev => ({
      ...prev,
      [skillName]: (prev[skillName] || 1) + 1
    }))
    setGameState(prev => ({ 
      ...prev, 
      skillDoubleClicks: prev.skillDoubleClicks + 1,
      score: prev.score + 25 
    }))
    addXP(15)
  }, [addXP])

  // Complete quest
  const completeQuest = useCallback((questName) => {
    setGameState(prev => {
      const quest = prev.quests.find(q => q.name === questName)
      if (!quest || quest.completed) return prev

      addXP(quest.xp)

      return {
        ...prev,
        quests: prev.quests.map(q => 
          q.name === questName ? { ...q, completed: true } : q
        ),
      }
    })
  }, [addXP])

  // Track clicks with combo system
  const handleGlobalClick = useCallback((e) => {
    const now = Date.now()
    const timeDiff = now - lastClickTime
    
    // If clicked within 1 second, increase combo
    let newCombo = combo
    if (timeDiff < 1000) {
      newCombo = combo + 1
    } else {
      newCombo = 1
    }
    
    setCombo(newCombo)
    setLastClickTime(now)
    
    // Clear existing timeout
    if (comboTimeout.current) {
      clearTimeout(comboTimeout.current)
    }
    
    // Reset combo after 1.5 seconds of no clicks
    comboTimeout.current = setTimeout(() => {
      setCombo(0)
    }, 1500)
    
    const basePoints = 10
    const comboBonus = newCombo > 1 ? (newCombo - 1) * 5 : 0
    const totalPoints = basePoints + comboBonus
    
    setGameState(prev => ({ 
      ...prev, 
      clicks: prev.clicks + 1, 
      score: prev.score + totalPoints 
    }))
    
    // Add click particle with combo text
    const id = Date.now()
    const text = newCombo > 1 ? `+${totalPoints} (x${newCombo})` : `+${totalPoints}`
    setClickParticles(prev => [...prev, { id, x: e.clientX, y: e.clientY, text }])
    setTimeout(() => {
      setClickParticles(prev => prev.filter(p => p.id !== id))
    }, 1000)

    addXP(5 + comboBonus)
  }, [addXP, combo, lastClickTime])

  // Power-up collection
  const collectPowerUp = useCallback((id, cursed = false) => {
    setPowerUps(prev => prev.filter(p => p.id !== id))
    
    if (cursed) {
      // Cursed power-up - drains XP!
      setGameState(prev => ({ 
        ...prev, 
        powerupsCollected: prev.powerupsCollected + 1,
        score: Math.max(0, prev.score - 75),
        xp: Math.max(0, prev.xp - 40)
      }))
      setRecentAchievement({
        name: '☠️ Cursed!',
        desc: 'You collected a cursed power-up and lost XP!',
        icon: '💀',
        unlocked: true
      })
    } else {
      // Normal power-up
      setGameState(prev => ({ 
        ...prev, 
        powerupsCollected: prev.powerupsCollected + 1,
        score: prev.score + 50 
      }))
      addXP(25)
    }
  }, [addXP])

  // Easter egg: Spam click profile image
  const handleProfileImageClick = useCallback(() => {
    setProfileClicks(prev => prev + 1)
    
    if (profileClickTimeout.current) clearTimeout(profileClickTimeout.current)
    
    if (profileClicks + 1 >= 10) {
      // Oops easter egg - XP penalty
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 100),
        xp: Math.max(0, prev.xp - 25)
      }))
      setRecentAchievement({
        name: '💥 Oops!',
        desc: 'You clicked too hard and broke the profile pic!',
        icon: '😱',
        unlocked: true
      })
      setProfileClicks(0)
    } else {
      profileClickTimeout.current = setTimeout(() => {
        setProfileClicks(0)
      }, 2000)
    }
  }, [profileClicks])

  // Easter egg: Spam click title
  const handleTitleClick = useCallback(() => {
    setTitleClicks(prev => prev + 1)
    
    if (titleClickTimeout.current) clearTimeout(titleClickTimeout.current)
    
    if (titleClicks + 1 >= 7) {
      // Glitch penalty - lose XP
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 150),
        xp: Math.max(0, prev.xp - 50),
        level: Math.max(1, prev.level - 1)
      }))
      setRecentAchievement({
        name: '⚠️ Glitch!',
        desc: 'Too many glitches! XP drained by the system error.',
        icon: '🔴',
        unlocked: true
      })
      setTitleClicks(0)
    } else {
      titleClickTimeout.current = setTimeout(() => {
        setTitleClicks(0)
      }, 3000)
    }
  }, [titleClicks])

  // Generate random power-ups
  useEffect(() => {
    const generatePowerUp = () => {
      const types = ['star', 'gem', 'coin', 'heart', 'bolt']
      const isCursed = Math.random() < 0.15 // 15% chance for cursed power-up
      const newPowerUp = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        type: isCursed ? 'cursed' : types[Math.floor(Math.random() * types.length)],
        cursed: isCursed
      }
      setPowerUps(prev => [...prev, newPowerUp])
    }

    const interval = setInterval(generatePowerUp, 8000)
    generatePowerUp() // Initial power-up
    
    return () => clearInterval(interval)
  }, [])

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e) => {
      konamiCode.current.push(e.key)
      if (konamiCode.current.length > konamiSequence.length) {
        konamiCode.current.shift()
      }
      
      if (konamiCode.current.join(',') === konamiSequence.join(',')) {
        unlockAchievement('konami-code')
        document.body.style.animation = 'rainbow 2s infinite'
        setTimeout(() => {
          document.body.style.animation = ''
        }, 5000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [unlockAchievement])

  // Track achievements based on game state
  useEffect(() => {
    if (gameState.clicks >= 50) unlockAchievement('click-master')
    if (gameState.powerupsCollected >= 5) {
      unlockAchievement('power-collector')
      completeQuest('Collect 5 Power-ups')
    }
  }, [gameState.clicks, gameState.powerupsCollected, unlockAchievement, completeQuest])

  // Auto-unlock first achievement
  useEffect(() => {
    setTimeout(() => unlockAchievement('first-visit'), 1000)
  }, [unlockAchievement])

  // Add global click listener
  useEffect(() => {
    document.addEventListener('click', handleGlobalClick)
    return () => document.removeEventListener('click', handleGlobalClick)
  }, [handleGlobalClick])

  // Scroll listener to show HUD after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      // Show circular HUD after scrolling down 300px
      if (window.scrollY > 300) {
        setShowHUD(true)
      } else {
        setShowHUD(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Spotlight effect handler
  const handleSpotlightMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  // Typing effect
  useEffect(() => {
    const typeSequence = async () => {
      if (!taglineRef.current) return

      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      
      const glitchText = "Crraaffttiinngg wwoorrllddss,, oonnee ppiixxeell aatt aa ttiimmee.."
      const apology = " ...Oops, sorry for the typing mistake!"
      const correctText = "Crafting worlds, one pixel at a time."

      // 1. Type glitch text
      taglineRef.current.innerText = ""
      for (let i = 0; i < glitchText.length; i++) {
        if (!taglineRef.current) return
        taglineRef.current.innerText = glitchText.substring(0, i + 1)
        await wait(50)
      }
      
      await wait(1000)

      // 2. Type apology
      for (let i = 0; i < apology.length; i++) {
        if (!taglineRef.current) return
        taglineRef.current.innerText = glitchText + apology.substring(0, i + 1)
        await wait(50)
      }

      await wait(1500)

      // 3. Backspace everything
      let fullText = glitchText + apology
      while (fullText.length > 0) {
        if (!taglineRef.current) return
        fullText = fullText.slice(0, -1)
        taglineRef.current.innerText = fullText
        await wait(20)
      }

      await wait(500)

      // 4. Type correct text
      for (let i = 0; i < correctText.length; i++) {
        if (!taglineRef.current) return
        taglineRef.current.innerText = correctText.substring(0, i + 1)
        await wait(75)
      }
    }

    typeSequence()
  }, [])

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          
          // Track section visits and unlock achievements
          const sectionId = entry.target.id
          if (sectionId) {
            setGameState(prev => {
              const newVisited = new Set(prev.sectionsVisited)
              newVisited.add(sectionId)
              return { ...prev, sectionsVisited: newVisited }
            })

            // Unlock achievements and complete quests based on sections
            if (sectionId === 'about') {
              unlockAchievement('about-reader')
              completeQuest('Read About Me')
            }
            if (sectionId === 'skills') {
              unlockAchievement('skill-master')
              completeQuest('View All Skills')
            }
            if (sectionId === 'projects') {
              unlockAchievement('project-viewer')
              completeQuest('Check Out Projects')
            }
            if (sectionId === 'contact') {
              unlockAchievement('completionist')
              completeQuest('Reach Contact Section')
            }
          }
        }
      })
    }, { threshold: 0.1 })

    revealRefs.current.forEach(el => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [unlockAchievement, completeQuest])

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  return (
    <main>
      <CustomCursor />
      
      {/* Bar HUD - Top (shows when scrollY < 300) */}
      {!showHUD && (
        <div className="game-hud">
          <div className="hud-top">
            <div className="hud-stats">
              <div className="stat-item">
                <span className="stat-label">LVL</span>
                <span className="stat-value">{gameState.level}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">SCORE</span>
                <span className="stat-value">{gameState.score}</span>
              </div>
              {combo > 1 && (
                <div className="stat-item combo-display">
                  <span className="stat-label">COMBO</span>
                  <span className="stat-value combo-value">{combo}x</span>
                </div>
              )}
            </div>
            
            <div className="xp-bar-container" title={`${gameState.xp}/${gameState.maxXp} XP`}>
              <div className="xp-bar" style={{ width: `${(gameState.xp / gameState.maxXp) * 100}%` }}></div>
              <span className="xp-text">{gameState.xp}/{gameState.maxXp} XP</span>
            </div>

            <div className="hud-buttons">
              <button className="hud-btn" title="Quests">
                📜 {gameState.quests.filter(q => !q.completed).length}
              </button>
              <button className="hud-btn" title="Achievements">
                🏆 {gameState.achievements.filter(a => a.unlocked).length}/{gameState.achievements.length}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Circular HUD - Bottom Left (shows when scrollY > 300) */}
      <GameHUD 
        score={gameState.score}
        level={gameState.level}
        xp={gameState.xp}
        maxXp={gameState.maxXp}
        achievements={gameState.achievements}
        quests={gameState.quests}
        combo={combo}
        visible={showHUD}
      />
      
      {recentAchievement && (
        <AchievementNotification 
          achievement={recentAchievement}
          onClose={() => setRecentAchievement(null)}
        />
      )}

      {clickParticles.map(particle => (
        <ClickParticle key={particle.id} x={particle.x} y={particle.y} id={particle.id} text={particle.text} />
      ))}

      {powerUps.map(powerUp => (
        <PowerUp 
          key={powerUp.id}
          x={powerUp.x}
          y={powerUp.y}
          type={powerUp.type}
          cursed={powerUp.cursed}
          onCollect={() => collectPowerUp(powerUp.id, powerUp.cursed)}
        />
      ))}

      <header className="hero">
        <div className="hero-content">
          <div className="pixel-avatar"></div>
          <div className="glitch-wrapper">
            <h1 className="name glitch" data-text="Pranjal Mishra" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>Pranjal Mishra</h1>
          </div>
          <p className="tagline" ref={taglineRef}>Crafting worlds, one pixel at a time.</p>
        </div>
      </header>

      <section id="about" className="container reveal" ref={addToRefs}>
        <SectionTitle title="01. ABOUT ME" />
        <div className="about-content" onMouseMove={handleSpotlightMove}>
          <TiltCard className="profile-tilt" onClick={handleProfileImageClick}>
            <img 
              src={profileImg} 
              alt="Pranjal Mishra" 
              className="profile-pic"
              style={{ cursor: 'pointer' }}
            />
            <PixelParticles />
          </TiltCard>
          <div className="about-text">
            <InteractiveText content="I'm a lifelong learner with a passion for Computer Science, and I am currently pursuing my B.Tech at Galgotias University. My journey began at David Model Senior Secondary School, and I'm now expanding my skills in C, C++, Java, and Python. Beyond academics, I'm captivated by Game Development in Unreal Engine 5 and Blender, and Video Editing with DaVinci Resolve. I believe in continuous improvement and am always seeking new opportunities to learn and contribute to the ever-evolving world of technology. I'm particularly interested in the intersection of software development and creative applications, which is why I'm drawn to Game Development and Video Editing. These fields allow me to combine my technical skills with my artistic vision, resulting in unique and engaging experiences. I'm always looking for new challenges and opportunities to expand my knowledge and expertise in these areas. Specifically, within Game Development, I'm exploring advanced techniques in Procedural Generation, AI Implementation, and Physics Simulations, aiming to create immersive and dynamic virtual worlds. In Video Editing, I'm delving into Color Grading, Motion Graphics, and Sound Design, striving to produce compelling visual narratives. I'm eager to collaborate with fellow enthusiasts and professionals to push the boundaries of what's possible in these exciting fields." />
          </div>
        </div>
      </section>

      <section id="skills" className="container reveal" ref={addToRefs}>
        <SectionTitle title="02. SKILLS" />
        <p className="game-hint">💡 Double-click skills to level them up!</p>
        
        <h3 className="skill-category-title">Programming & Web</h3>
        <div className="skills-grid">
          {['Java', 'C / C++', 'HTML5', 'CSS3', 'JavaScript'].map((skill, i) => (
            <TiltCard key={skill} className="skill-card" onDoubleClick={() => handleSkillDoubleClick(skill)}>
              <i className={['fa-brands fa-java', 'fa-solid fa-code', 'fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-js'][i]}></i>
              <span>{skill}</span>
              {skillLevels[skill] > 1 && <span className="skill-level">Lv. {skillLevels[skill]}</span>}
            </TiltCard>
          ))}
        </div>

        <h3 className="skill-category-title">Game Dev & Creative</h3>
        <div className="skills-grid">
          {['Unreal Engine 5', 'Blender', 'After Effects', 'DaVinci Resolve'].map((skill, i) => (
            <TiltCard key={skill} className="skill-card" onDoubleClick={() => handleSkillDoubleClick(skill)}>
              <i className={['fa-brands fa-unreal', 'fa-solid fa-cube', 'fa-solid fa-wand-magic-sparkles', 'fa-solid fa-film'][i]}></i>
              <span>{skill}</span>
              {skillLevels[skill] > 1 && <span className="skill-level">Lv. {skillLevels[skill]}</span>}
            </TiltCard>
          ))}
        </div>

        <h3 className="skill-category-title">Tools & Databases</h3>
        <div className="skills-grid">
          {['Git', 'GitHub', 'MongoDB', 'MySQL'].map((skill, i) => (
            <TiltCard key={skill} className="skill-card" onDoubleClick={() => handleSkillDoubleClick(skill)}>
              <i className={['fa-brands fa-git-alt', 'fa-brands fa-github', 'fa-solid fa-database', 'fa-solid fa-server'][i]}></i>
              <span>{skill}</span>
              {skillLevels[skill] > 1 && <span className="skill-level">Lv. {skillLevels[skill]}</span>}
            </TiltCard>
          ))}
        </div>
      </section>

      <section id="experience" className="container reveal" ref={addToRefs}>
        <SectionTitle title="03. EXPERIENCE" />
        <div className="experience-timeline">
          <div className="experience-item">
            <div className="experience-date">Nov 2025 - Present</div>
            <ExperienceCard 
              role="3D Animator"
              company="cvnt"
              type="Internship"
              date="Nov 2025 - Present"
              location="Greater Noida · Remote"
              description="Leading creative studio focused on next-generation visual experiences and 3D animation production."
              website="https://wearcvnt.com"
              industry="Retail Apparel and Fashion"
              companySize="2-10 employees"
              skills={[
                "Blender", "Computer Animation", "Unreal Engine 5", "Videography", 
                "Adobe Premiere Pro", "Adobe Illustrator", "CAD/CAM", "Photoshop", "After Effects"
              ]}
            />
          </div>
        </div>
      </section>

      <section id="projects" className="container reveal" ref={addToRefs}>
        <SectionTitle title="04. PROJECTS" />
        <div className="project-grid">
          {[
            {
              title: "SimpleNotes",
              desc: "This is my Simple Notes app built with Java.",
              link: "https://github.com/omdev009mishra/SimpleNotes",
              tech: "Java",
              image: simpleNotesImg
            },
            {
              title: "Dino Game",
              desc: "A browser-based clone of the famous Chrome Dino game.",
              link: "https://github.com/omdev009mishra/dino-game",
              tech: "JavaScript",
              image: dinoImg
            },
            {
              title: "Email Management System",
              desc: "First year college project for managing emails efficiently.",
              link: "https://github.com/omdev009mishra/1styearProject_EmailManagementSystem",
              tech: "Java",
              image: emailImg
            },
            {
              title: "Funkyman",
              desc: "A creative project repository.",
              link: "https://github.com/omdev009mishra/funkyman",
              tech: "Public Repo",
              image: funkymanImg
            }
          ].map((project, index) => (
            <TiltCard key={index} className="project-card">
              <div className="project-image" style={{
                backgroundImage: project.image ? `url(${project.image})` : `linear-gradient(135deg, ${index % 2 === 0 ? '#1e293b, #0f172a' : '#2d1b4e, #1a103c'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div className="project-info">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                  <h3 style={{margin: 0}}>{project.title}</h3>
                  <span style={{fontSize: '0.7rem', background: 'var(--accent-color)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'}}>{project.tech}</span>
                </div>
                <p>{project.desc}</p>
                <div className="project-links">
                  <a href={project.link} className="btn" target="_blank" rel="noreferrer">View Project</a>
                  <a href={project.link} className="btn-secondary" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i> Code</a>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section id="contact" className="container reveal" ref={addToRefs}>
        <SectionTitle title="05. CONTACT" />
        <p className="contact-message"><br/> Let's build something amazing together.</p>
        <a href="mailto:omdev009mishra@gmail.com" className="btn btn-large">Say Hello!</a>
        <div className="social-links">
          <a href="https://github.com/omdev009mishra" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
          <a href="https://www.linkedin.com/in/pranjal-mishra777/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i></a>
        </div>
      </section>

      <footer>
        <p>Designed & Built by Pranjal Mishra &copy; 2025</p>
      </footer>
    </main>
  )
}


