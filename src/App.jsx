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
      className={`min-h-screen flex items-center py-20 transition-all duration-700 ${
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
    { id: 1, name: 'Image Carousel', description: 'Pretty images...coming right up!.', link: 'https://nipulrj.github.io/image-carousel/' },
    { id: 2, name: 'Pokédex', description: 'Curious about the many pocket monsters', link: 'https://nipulrj.github.io/pokedex-app/' },
    { id: 3, name: 'Card Game', description: "Ever played Flip7, it's quite fun!", link: 'https://nipulrj.github.io/flip7/' },
  ]

  useEffect(() => {
    const sections = [
      { id: 'about', el: () => aboutRef.current },
      { id: 'projects', el: () => projectsRef.current },
      { id: 'contact', el: () => contactRef.current },
    ]
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const found = sections.find(s => s.el() === e.target)
            if (found) setActiveTab(found.id)
          }
        })
      },
      { threshold: 0.45 }
    )
    sections.forEach(s => { const el = s.el(); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
      <header className="bg-gradient-to-r from-indigo-600 to-rose-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src={profileImg} alt="Profile" className="w-30 h-32 rounded-full shadow-lg ring-4 ring-white/20" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Nipul Jayasekera</h1>
              <p className="mt-2 text-lg opacity-90">Thoughtful website design and elegant digital experiences</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-3" role="tablist" aria-label="Main">
          <button
            className={`px-4 py-2 rounded-md font-medium ${activeTab === 'about' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => scrollTo('about')}
            role="tab"
            aria-selected={activeTab === 'about'}
          >
            About
          </button>

          <button
            className={`px-4 py-2 rounded-md font-medium ${activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => scrollTo('projects')}
            role="tab"
            aria-selected={activeTab === 'projects'}
          >
            Projects
          </button>

          <button
            className={`px-4 py-2 rounded-md font-medium ${activeTab === 'contact' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => scrollTo('contact')}
            role="tab"
            aria-selected={activeTab === 'contact'}
          >
            Contact
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <ForwardedAnimatedSection id="about" ref={aboutRef} innerClass="max-w-3xl mx-auto px-6">
          <h2 id="about-title" className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-lg leading-relaxed mb-4">
            I design and build polished web experiences focused on clarity, performance, and measurable impact.
            I work across design systems, front‑end engineering, and product thinking to ship complete sites.
          </p>
          <p className="text-lg leading-relaxed">
            I enjoy collaborating from discovery to delivery and building products that scale.
          </p>
        </ForwardedAnimatedSection>

        <ForwardedAnimatedSection id="projects" ref={projectsRef} innerClass="px-6">
          <h2 id="projects-title" className="text-2xl font-semibold mb-6">Selected Projects</h2>
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
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
                </div>
                <div className="text-sm font-medium text-indigo-600">View →</div>
              </a>
            ))}
          </div>
        </ForwardedAnimatedSection>

        <ForwardedAnimatedSection id="contact" ref={contactRef} innerClass="max-w-2xl mx-auto px-6">
          <h2 id="contact-title" className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="flex gap-3">
            <a className="text-indigo-600" href="mailto:nipulrj@gmail.com">Email</a>
            <span className="opacity-50">•</span>
            <a className="text-indigo-600" href="https://github.com/nipulrj" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="opacity-50">•</span>
            <a className="text-indigo-600" href="https://www.linkedin.com/in/nipulrj" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="opacity-50">•</span>
            <a className="text-indigo-600" href="/resume.pdf" target="_blank" rel="noopener noreferrer" download="Nipul-Jayasekera-Resume.pdf">Resumé</a>
          </p>
        </ForwardedAnimatedSection>
      </main>
    </div>
  )
}

export default App
