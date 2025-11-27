import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './profile.css'
import profileImg from './assets/profile.jpg'
import simpleNotesImg from './assets/simplenotes.png'
import emailImg from './assets/email.jpg'
import funkymanImg from './assets/funkyman.png'
import dinoImg from './assets/dinogame.avif'

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
function TiltCard({ children, className = "" }) {
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

  return (
    <div 
      ref={cardRef} 
      className={`tilt-card ${className}`} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
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
        }
      })
    }, { threshold: 0.1 })

    revealRefs.current.forEach(el => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  return (
    <main>
      <CustomCursor />
      <header className="hero">
        <div className="hero-content">
          <div className="pixel-avatar"></div>
          <div className="glitch-wrapper">
            <h1 className="name glitch" data-text="Pranjal Mishra">Pranjal Mishra</h1>
          </div>
          <p className="tagline" ref={taglineRef}>Crafting worlds, one pixel at a time.</p>
        </div>
      </header>

      <section id="about" className="container reveal" ref={addToRefs}>
        <SectionTitle title="01. ABOUT ME" />
        <div className="about-content" onMouseMove={handleSpotlightMove}>
          <TiltCard className="profile-tilt">
            <img 
              src={profileImg} 
              alt="Pranjal Mishra" 
              className="profile-pic"
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
        
        <h3 className="skill-category-title">Programming & Web</h3>
        <div className="skills-grid">
          <TiltCard className="skill-card"><i className="fa-brands fa-java"></i><span>Java</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-solid fa-code"></i><span>C / C++</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-brands fa-html5"></i><span>HTML5</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-brands fa-css3-alt"></i><span>CSS3</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-brands fa-js"></i><span>JavaScript</span></TiltCard>
        </div>

        <h3 className="skill-category-title">Game Dev & Creative</h3>
        <div className="skills-grid">
          <TiltCard className="skill-card"><i className="fa-brands fa-unreal"></i><span>Unreal Engine 5</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-solid fa-cube"></i><span>Blender</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-solid fa-wand-magic-sparkles"></i><span>After Effects</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-solid fa-film"></i><span>DaVinci Resolve</span></TiltCard>
        </div>

        <h3 className="skill-category-title">Tools & Databases</h3>
        <div className="skills-grid">
          <TiltCard className="skill-card"><i className="fa-brands fa-git-alt"></i><span>Git</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-brands fa-github"></i><span>GitHub</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-solid fa-database"></i><span>MongoDB</span></TiltCard>
          <TiltCard className="skill-card"><i className="fa-solid fa-server"></i><span>MySQL</span></TiltCard>
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


