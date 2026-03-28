import { useEffect, useRef, useState, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Forest Mint palette ──
const G = '#9FE870'       // Primary (Forest Mint)
const D = '#163300'       // Secondary (Deep Forest)
const BG = '#FFFFFF'      // Background
const SURFACE = '#F0F7EB' // Surface / light mint
const TEXT2 = '#4B5563'   // Secondary text

// ── Data ──
const COUNTRIES = [
  { name: 'Nepal',       code: 'NPR', iso: 'np' },
  { name: 'India',       code: 'INR', iso: 'in' },
  { name: 'Egypt',       code: 'EGP', iso: 'eg' },
  { name: 'Philippines', code: 'PHP', iso: 'ph' },
  { name: 'Mexico',      code: 'MXN', iso: 'mx' },
  { name: 'Bangladesh',  code: 'BDT', iso: 'bd' },
  { name: 'Pakistan',    code: 'PKR', iso: 'pk' },
  { name: 'Ethiopia',    code: 'ETB', iso: 'et' },
]

const FEATURES = [
  { icon: '📊', title: 'Rate Check',    desc: 'Compares your offered rate against live market data in real time' },
  { icon: '🔍', title: 'Term Scanner',  desc: 'NLP reads fine print to flag hidden fees and exploitative clauses' },
  { icon: '🛡️', title: 'Scam Detector', desc: 'Matches your transfer against 10 known fraud signatures' },
  { icon: '📢', title: 'Smart Alerts',  desc: 'Warns you in your native language before you lose a dollar' },
]

const flag = (iso) => `https://flagcdn.com/w160/${iso}.png`

// ── Hook ──
function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold },
    )
    const el = ref.current
    if (el) obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ── Landing Page ──
export default function LandingPage() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [heroRef, heroIn] = useInView(0.05)
  const [flagRef, flagIn] = useInView()
  const [featRef, featIn] = useInView()
  const [snapRef, snapIn] = useInView()
  const [ctaRef, ctaIn]   = useInView()

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const heroOp = Math.max(0, 1 - scrollY / 600)
  const heroTy = scrollY * 0.25

  return (
    <div style={{ background: '#fff', overflowX: 'hidden', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ───── NAV ───── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, background: G,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px clamp(16px, 4vw, 40px)',
        boxShadow: scrollY > 50 ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow .3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, background: D,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: G, fontSize: 16, fontFamily: "'Anton', system-ui",
            }}>R</div>
            <span style={{ fontWeight: 900, fontSize: 17, color: D, fontFamily: "'Anton', system-ui", letterSpacing: '0.04em' }}>REMITSAFE</span>
          </div>
          <div className="hide-mobile" style={{ display: 'flex', gap: 22 }}>
            {['How it works', 'Countries'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                style={{ fontSize: 14, fontWeight: 600, color: D, textDecoration: 'none', opacity: 0.85, transition: 'opacity .2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
              >{l}</a>
            ))}
          </div>
        </div>
        <button onClick={() => navigate('/scan')} style={{
          padding: '10px 26px', borderRadius: 999, background: D, border: 'none',
          color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          transition: 'opacity .2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Scan Transfer</button>
      </nav>

      {/* ───── HERO ───── */}
      <section ref={heroRef} style={{ background: G, padding: '48px 24px 160px', textAlign: 'center', position: 'relative' }}>

        {/* Parallax wrapper */}
        <div style={{ transform: `translateY(${heroTy}px)`, opacity: heroOp, willChange: 'transform, opacity' }}>

          {/* Social proof badges */}
          <div className={`fade-up ${heroIn ? 'visible' : ''}`} style={{
            transitionDelay: '0ms',
            display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 36, flexWrap: 'wrap',
          }}>
            <Pill text="4 AI Agents" sub="real-time protection" />
            <Pill text="8 Countries" sub="worldwide coverage" />
          </div>

          {/* Giant headline — line-by-line stagger */}
          <h1 style={{ margin: '0 auto 28px', maxWidth: 950 }}>
            {['THE SAFE WAY', 'TO SEND MONEY', 'HOME'].map((line, i) => (
              <span key={i} className={`fade-up ${heroIn ? 'visible' : ''}`} style={{
                transitionDelay: `${60 + i * 70}ms`,
                display: 'block',
                fontFamily: "'Anton', Impact, system-ui, sans-serif",
                fontSize: 'clamp(48px, 10vw, 128px)',
                fontWeight: 400,
                lineHeight: 0.95,
                color: D,
                textTransform: 'uppercase',
              }}>{line}</span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className={`fade-up ${heroIn ? 'visible' : ''}`} style={{
            transitionDelay: '300ms',
            fontSize: 'clamp(15px, 2.2vw, 21px)', color: '#2d5a00',
            maxWidth: 560, margin: '0 auto 34px', lineHeight: 1.6,
          }}>
            Send money to family and friends with confidence. AI scans your transfer for fraud, hidden fees, and bad rates. Most scans complete in under 30 seconds.
          </p>

          {/* CTA */}
          <div className={`fade-up ${heroIn ? 'visible' : ''}`} style={{ transitionDelay: '380ms' }}>
            <button onClick={() => navigate('/scan')} className="hero-btn" style={{
              padding: '18px 48px', borderRadius: 999, background: D, border: 'none',
              color: '#fff', fontWeight: 700, fontSize: 18, cursor: 'pointer',
              transition: 'transform .25s, box-shadow .25s',
              boxShadow: '0 4px 24px rgba(22,51,0,0.18)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(22,51,0,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(22,51,0,0.18)' }}
            >Scan Transfer</button>
          </div>
        </div>

        {/* Overlap card — outside parallax wrapper */}
        <div className={`fade-up ${heroIn ? 'visible' : ''}`} style={{
          transitionDelay: '500ms',
          maxWidth: 620, margin: '56px auto -80px', position: 'relative', zIndex: 10,
          background: '#fff', borderRadius: 28, padding: '28px 32px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={flag('us')} alt="US" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: '#4B5563', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>You send</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: D }}>$500.00</div>
              </div>
            </div>

            <div style={{
              width: 46, height: 46, borderRadius: 999, background: D, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: G, fontSize: 20, fontWeight: 700,
            }}>→</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={flag('np')} alt="Nepal" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: '#4B5563', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>They receive</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: D }}>₨67,500</div>
              </div>
            </div>
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 12, color: '#4B5563', textAlign: 'center' }}>
            4 AI agents will scan this transfer for hidden fees & fraud
          </p>
        </div>
      </section>

      {/* ───── FLAGS ───── */}
      <section id="countries" ref={flagRef} style={{ background: '#fff', padding: '120px 24px 70px', textAlign: 'center' }}>
        <p className={`fade-up ${flagIn ? 'visible' : ''}`} style={{
          fontSize: 12, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase',
          letterSpacing: '0.16em', marginBottom: 36,
        }}>Supported Countries</p>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* From: US */}
          <FlagCircle iso="us" name="United States" inView={flagIn} delay={0} />

          {/* Arrow */}
          <div className={`fade-up ${flagIn ? 'visible' : ''}`} style={{
            transitionDelay: '60ms',
            width: 52, height: 52, borderRadius: 999, marginTop: 6,
            background: D, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: G, fontSize: 20, fontWeight: 700, flexShrink: 0,
          }}>→</div>

          {/* To: countries */}
          {COUNTRIES.map((c, i) => (
            <FlagCircle key={c.iso} iso={c.iso} name={c.name} inView={flagIn} delay={120 + i * 50} />
          ))}
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section id="how-it-works" ref={featRef} style={{ background: SURFACE, padding: '80px 24px 100px', textAlign: 'center' }}>
        <h2 className={`fade-up ${featIn ? 'visible' : ''}`} style={{
          fontFamily: "'Anton', Impact, system-ui, sans-serif",
          fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 400,
          color: D, textTransform: 'uppercase', margin: '0 0 12px',
        }}>HOW IT WORKS</h2>
        <p className={`fade-up ${featIn ? 'visible' : ''}`} style={{
          transitionDelay: '80ms', color: '#4B5563', fontSize: 17,
          maxWidth: 460, margin: '0 auto 56px',
        }}>Four AI agents work together to protect every transfer you make</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 980, margin: '0 auto' }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} f={f} inView={featIn} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ───── SCREENSHOT UPLOAD ───── */}
      <ScreenshotSection ref={snapRef} inView={snapIn} navigate={navigate} />

      {/* ───── CTA ───── */}
      <section ref={ctaRef} style={{ background: G, padding: '100px 24px', textAlign: 'center' }}>
        <h2 className={`fade-up ${ctaIn ? 'visible' : ''}`} style={{
          fontFamily: "'Anton', Impact, system-ui, sans-serif",
          fontSize: 'clamp(36px, 8vw, 96px)', fontWeight: 400,
          color: D, textTransform: 'uppercase', margin: '0 auto 20px',
          lineHeight: 0.95, maxWidth: 800,
        }}>YOUR FAMILY DESERVES EVERY DOLLAR</h2>

        <p className={`fade-up ${ctaIn ? 'visible' : ''}`} style={{
          transitionDelay: '80ms', color: '#2d5a00', fontSize: 18,
          maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.55,
        }}>Scan your next transfer for free. No account needed. 30 seconds.</p>

        <div className={`fade-up ${ctaIn ? 'visible' : ''}`} style={{ transitionDelay: '160ms' }}>
          <button onClick={() => navigate('/scan')} style={{
            padding: '18px 52px', borderRadius: 999, background: D, border: 'none',
            color: '#fff', fontWeight: 700, fontSize: 18, cursor: 'pointer',
            transition: 'transform .25s, box-shadow .25s',
            boxShadow: '0 4px 24px rgba(22,51,0,0.18)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(22,51,0,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(22,51,0,0.18)' }}
          >Protect My Transfer →</button>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer style={{
        background: D, padding: '32px clamp(16px, 4vw, 40px)',
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: D, fontSize: 12 }}>R</div>
          <span style={{ fontWeight: 700, fontSize: 14, color: G }}>RemitSafe</span>
        </div>
        <span style={{ fontSize: 11, color: '#5a7a3e' }}>Powered by Amazon Bedrock · 4 AI Agents · Protecting immigrant families worldwide</span>
      </footer>
    </div>
  )
}

// ───── Sub-components ─────

function Pill({ text, sub }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(22,51,0,0.07)', borderRadius: 999, padding: '7px 16px',
    }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: D }}>{text}</span>
      <span style={{ fontSize: 12, color: '#3d6b12' }}>{sub}</span>
    </div>
  )
}

function FlagCircle({ iso, name, inView, delay }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className={`fade-up ${inView ? 'visible' : ''}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        transitionDelay: `${delay}ms`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        cursor: 'default', padding: '4px 6px',
      }}
    >
      <div style={{
        width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
        border: `3px solid ${hov ? G : '#e5e7eb'}`,
        transition: 'all .3s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hov ? 'scale(1.12) translateY(-6px)' : 'scale(1)',
        boxShadow: hov ? '0 10px 28px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <img src={`https://flagcdn.com/w160/${iso}.png`} alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', transition: 'color .2s', ...(hov ? { color: D } : {}) }}>{name}</span>
    </div>
  )
}

function FeatureCard({ f, inView, delay }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className={`fade-up ${inView ? 'visible' : ''}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        transitionDelay: `${delay}ms`,
        background: '#fff', borderRadius: 24, padding: '32px 24px',
        border: `2px solid ${hov ? G : '#e5e7eb'}`,
        transition: 'transform .3s, box-shadow .3s, border-color .3s',
        transform: hov ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hov ? '0 16px 48px rgba(0,0,0,0.08)' : '0 2px 10px rgba(0,0,0,0.02)',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: hov ? '#ddf5c0' : SURFACE,
        margin: '0 auto 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, transition: 'background .3s, transform .3s',
        transform: hov ? 'scale(1.08)' : 'scale(1)',
      }}>{f.icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: D, marginBottom: 10 }}>{f.title}</h3>
      <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
    </div>
  )
}

// ─── Screenshot Upload Section ───
const ScreenshotSection = forwardRef(function ScreenshotSection({ inView, navigate }, ref) {
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setFileName(file.name)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const onInputChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  const clear = () => {
    setPreview(null)
    setFileName('')
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const analyzeReceipt = async () => {
    if (!preview) return
    setAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:3001/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      navigate('/scan', { state: { fromScreenshot: true, extracted: data } })
    } catch (err) {
      setError(err.message || 'Failed to analyze screenshot')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <section ref={ref} style={{ background: '#fff', padding: '80px 24px 100px', textAlign: 'center' }}>
      <h2 className={`fade-up ${inView ? 'visible' : ''}`} style={{
        fontFamily: "'Anton', Impact, system-ui, sans-serif",
        fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 400,
        color: D, textTransform: 'uppercase', margin: '0 0 12px',
      }}>SCAN YOUR RECEIPT</h2>
      <p className={`fade-up ${inView ? 'visible' : ''}`} style={{
        transitionDelay: '80ms', color: '#4B5563', fontSize: 17,
        maxWidth: 480, margin: '0 auto 48px',
      }}>Upload a screenshot of your transfer receipt or financial record and let our AI agents analyze it</p>

      <div className={`fade-up ${inView ? 'visible' : ''}`} style={{ transitionDelay: '160ms', maxWidth: 560, margin: '0 auto' }}>

        {/* Drop zone */}
        {!preview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? G : 'rgba(22,51,0,0.15)'}`,
              borderRadius: 28,
              padding: '48px 32px',
              cursor: 'pointer',
              background: dragOver ? 'rgba(159,232,112,0.08)' : '#F0F7EB',
              transition: 'all .3s',
            }}
          >
            <div style={{
              width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
              background: dragOver ? G : 'rgba(22,51,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .3s',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={dragOver ? D : '#4B5563'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke .3s' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <p style={{ fontSize: 16, fontWeight: 600, color: D, marginBottom: 6 }}>
              {dragOver ? 'Drop your screenshot here' : 'Upload your financial record'}
            </p>
            <p style={{ fontSize: 13, color: '#4B5563', marginBottom: 20 }}>
              Drag & drop or click to browse
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <label style={{
                padding: '10px 24px', borderRadius: 999,
                background: D, color: '#fff', fontWeight: 600, fontSize: 14,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'opacity .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Upload Screenshot
              </label>

              <label style={{
                padding: '10px 24px', borderRadius: 999,
                background: '#fff', border: `2px solid ${D}`, color: D,
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = D; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = D }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                Take Photo
                <input type="file" accept="image/*" capture="environment" onChange={onInputChange} ref={fileRef} style={{ display: 'none' }} />
              </label>
            </div>

            <input type="file" accept="image/*" onChange={onInputChange} ref={fileRef} style={{ display: 'none' }} />

            <p style={{ fontSize: 11, color: '#4B5563', marginTop: 20, opacity: 0.6 }}>
              PNG, JPG, or HEIC up to 10MB
            </p>
          </div>
        ) : (
          /* Preview + Analyze */
          <div style={{
            borderRadius: 28, overflow: 'hidden',
            border: `2px solid ${analyzing ? G : G}`,
            background: '#F0F7EB',
          }}>
            <div style={{ position: 'relative' }}>
              <img src={preview} alt="Uploaded receipt"
                style={{
                  width: '100%', maxHeight: 360, objectFit: 'contain', display: 'block', background: '#fff',
                  filter: analyzing ? 'brightness(0.7)' : 'none', transition: 'filter .3s',
                }} />

              {/* Scanning overlay */}
              {analyzing && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(22,51,0,0.5)', backdropFilter: 'blur(2px)',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    border: '3px solid rgba(159,232,112,0.3)', borderTopColor: G,
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginTop: 14 }}>
                    AI is reading your receipt...
                  </p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              )}

              {/* Remove button */}
              {!analyzing && (
                <button onClick={clear} style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(22,51,0,0.8)', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >×</button>
              )}
            </div>

            <div style={{ padding: '20px 24px' }}>
              {error && (
                <div style={{
                  background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)',
                  borderRadius: 12, padding: '10px 16px', marginBottom: 12,
                  color: '#ba1a1a', fontSize: 13, textAlign: 'left',
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', background: G,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>{analyzing ? '⏳' : '✓'}</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: D }}>{fileName}</div>
                    <div style={{ fontSize: 12, color: '#4B5563' }}>
                      {analyzing ? 'Extracting transfer details...' : 'Ready to scan'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={analyzeReceipt}
                  disabled={analyzing}
                  style={{
                    padding: '12px 32px', borderRadius: 999,
                    background: analyzing ? '#8a8a8a' : D, border: 'none', color: '#fff',
                    fontWeight: 700, fontSize: 15, cursor: analyzing ? 'not-allowed' : 'pointer',
                    transition: 'transform .25s, box-shadow .25s',
                    boxShadow: '0 4px 20px rgba(22,51,0,0.18)',
                    opacity: analyzing ? 0.7 : 1,
                  }}
                  onMouseEnter={e => { if (!analyzing) { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(22,51,0,0.25)' }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(22,51,0,0.18)' }}
                >{analyzing ? 'Analyzing...' : 'Analyze Receipt →'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ fontSize: 12, color: '#4B5563' }}>Your screenshot is analyzed securely and never stored</span>
        </div>
      </div>
    </section>
  )
})
