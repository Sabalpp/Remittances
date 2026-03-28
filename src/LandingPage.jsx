import { useEffect, useRef, useState } from 'react'

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
export default function LandingPage({ onStart }) {
  const [scrollY, setScrollY] = useState(0)
  const [heroRef, heroIn] = useInView(0.05)
  const [flagRef, flagIn] = useInView()
  const [featRef, featIn] = useInView()
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
        <button onClick={onStart} style={{
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
            <button onClick={onStart} className="hero-btn" style={{
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
          <button onClick={onStart} style={{
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
