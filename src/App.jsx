import { useState, useRef, useEffect, forwardRef } from 'react'

function AnimatedSection({ id, children, innerClass }, forwardedRef) {
  const localRef = useRef(null)
  const elRef = forwardedRef || localRef
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setInView(true)
        })
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [elRef])

  return (
    <section
      id={id}
      ref={elRef}
      aria-labelledby={`${id}-title`}
      role="region"
      className={`min-h-screen w-full flex items-center py-20 transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } bg-white dark:bg-slate-900`}
    >
      <div className={innerClass || 'max-w-5xl mx-auto px-6'}>
        {children}
      </div>
    </section>
  )
}
const ForwardedAnimatedSection = forwardRef(AnimatedSection)

function App() {
  const [activeTab, setActiveTab] = useState('about')
  const profileImg = '/profile.jpg'

  const aboutRef = useRef(null)
  const projectsRef = useRef(null)
  const contactRef = useRef(null)

  const scrollTo = (id) => {
    setActiveTab(id)
    const map = { about: aboutRef, projects: projectsRef, contact: contactRef }
    const ref = map[id]
    const el = ref && ref.current ? ref.current : document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const projects = [
    { id: 1, name: 'Image Carousel', description: 'Pretty images...coming right up!', link: 'https://nipulrj.github.io/image-carousel/' },
    { id: 2, name: 'Pokédex', description: 'Curious about the many pocket monsters', link: 'https://nipulrj.github.io/pokedex-app/' },
    { id: 3, name: 'Card Game', description: "Ever played Flip7, it's quite fun!", link: 'https://nipulrj.github.io/flip7/' },
  ]

  useEffect(() => {
    const sections = [
      { id: 'about', el: () => aboutRef.current },
      { id: 'projects', el: () => projectsRef.current },
      { id: 'contact', el: () => contactRef.current },
    ]
  
    function updateActiveTab() {
      const mid = window.innerHeight / 2
      let bestId = null
      let bestDist = Infinity
      sections.forEach(s => {
        const el = s.el()
        if (!el) return
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const dist = Math.abs(center - mid)
        if (dist < bestDist) {
          bestDist = dist
          bestId = s.id
        }
      })
      if (bestId && bestId !== activeTab) {
        setActiveTab(bestId)
      }
    }

    updateActiveTab()
    window.addEventListener('scroll', updateActiveTab, { passive: true })
    window.addEventListener('resize', updateActiveTab)
    return () => {
      window.removeEventListener('scroll', updateActiveTab)
      window.removeEventListener('resize', updateActiveTab)
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-10 dark:bg-slate-800/80">
        <div className="flex justify-center" role="tablist" aria-label="Main">
          <div className="flex gap-8 px-6 py-3">
            <button
              className={`font-semibold tracking-wider uppercase text-sm transition-all ${
                activeTab === 'about'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-b-indigo-600 dark:border-b-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 border-b-2 border-b-transparent hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              onClick={() => scrollTo('about')}
              role="tab"
              aria-selected={activeTab === 'about'}
            >
              About
            </button>

            <button
              className={`font-semibold tracking-wider uppercase text-sm transition-all ${
                activeTab === 'projects'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-b-indigo-600 dark:border-b-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 border-b-2 border-b-transparent hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              onClick={() => scrollTo('projects')}
              role="tab"
              aria-selected={activeTab === 'projects'}
            >
              Projects
            </button>

            <button
              className={`font-semibold tracking-wider uppercase text-sm transition-all ${
                activeTab === 'contact'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-b-indigo-600 dark:border-b-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 border-b-2 border-b-transparent hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              onClick={() => scrollTo('contact')}
              role="tab"
              aria-selected={activeTab === 'contact'}
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src={profileImg} alt="Profile" className="w-28 h-30 rounded-full shadow-lg ring-4 ring-white/20" />
            <div className="flex-1">
              <h1 className="text-3xl font-semibold tracking-wider uppercase md:text-4xl tracking-tight">Nipul Jayasekera</h1>
              <p className="mt-2 text-lg tracking-wider leading-relaxed opacity-90">Clean design. Seamless experience.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w mx-auto">
        <ForwardedAnimatedSection id="about" ref={aboutRef} innerClass="max-w-3xl mx-auto px-6">
          <h2 id="about-title" className="text-2xl font-semibold tracking-wider uppercase mb-4">About</h2>
          <p className="text-lg leading-relaxed tracking-wider mb-4">
            I’m a UCLA graduate in Linguistics and Computer Science with experience spanning from larger tech organizations and startups. Most recently, I worked at Ordr Inc. as a Senior Software Engineer, where I focused on frontend development, automation, and integrations. I also previously interned at Niara Inc. and Aruba Networks at Hewlett Packard Enterprise, establishing a solid base in software engineering and programming practices.
          </p>
          <p className="text-lg tracking-wider leading-relaxed mb-4">
            I design and build web experiences centered on impact. My work emcompasses modern front-end engineering & I enjoy collaborating closely with teams to create products that scale and deliver meaningful value.
          </p>

          <p className="text-lg tracking-wider leading-relaxed">
            I’m eager to tackle new challenges and continue developing solutions in any area of Computer Science.
          </p>
        </ForwardedAnimatedSection>

        <div aria-hidden className="flex justify-center">
          <div className="w-3/4 h-2 bg-white rounded-full shadow-md my-10 dark:bg-white" />
        </div>

        <ForwardedAnimatedSection id="projects" ref={projectsRef} innerClass="max-w-3x1 mx-auto px-6">
          <h2 id="projects-title" className="text-2xl font-semibold tracking-wider uppercase mb-6">Selected Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold tracking-wider uppercase">{project.name}</h3>
                  <p className="mt-2 text-sm tracking-wider text-slate-600 dark:text-slate-300">{project.description}</p>
                </div>
                <div className="text-sm font-medium tracking-wider text-indigo-600">View →</div>
              </a>
            ))}
          </div>
        </ForwardedAnimatedSection>

        <div aria-hidden className="flex justify-center">
          <div className="w-3/4 h-2 bg-white rounded-full shadow-md my-10 dark:bg-white" />
        </div>

        <ForwardedAnimatedSection id="contact" ref={contactRef} innerClass="max-w-3xl mx-auto px-6">
          <h2 id="contact-title" className="text-2xl font-semibold tracking-wider uppercase mb-4">Get in Touch</h2>
          <p className="flex gap-5 items-center">
            <a className="flex items-center text-indigo-600" href="mailto:nipulrj@gmail.com">Email</a>
            <span className="opacity-50">•</span>
            <a className="flex items-center text-indigo-600" href="https://www.linkedin.com/in/nipulrj" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="opacity-50">•</span>
            <a className="flex items-center text-indigo-600" href="https://github.com/nipulrj" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="opacity-50">•</span>
            <a className="flex items-center text-indigo-600" href="/resume.pdf" target="_blank" rel="noopener noreferrer" download="Nipul-Jayasekera-Resume.pdf">Resume</a>
          </p>
        </ForwardedAnimatedSection>
      </main>
    </div>
  )
}

export default App
