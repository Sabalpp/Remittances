import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler, Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip)

const COUNTRIES = [
  { code: 'NPR', name: 'Nepal', flag: '🇳🇵' },
  { code: 'INR', name: 'India', flag: '🇮🇳' },
  { code: 'EGP', name: 'Egypt', flag: '🇪🇬' },
  { code: 'PHP', name: 'Philippines', flag: '🇵🇭' },
  { code: 'MXN', name: 'Mexico', flag: '🇲🇽' },
  { code: 'BDT', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'PKR', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'ETB', name: 'Ethiopia', flag: '🇪🇹' },
]

const SERVICES = ['Western Union', 'MoneyGram', 'Ria', 'Remitly', 'Wise', 'WorldRemit', 'Xoom', 'Other']

const AGENTS = [
  { id: 1, name: 'Rate Check' },
  { id: 2, name: 'Terms Scan' },
  { id: 3, name: 'Scam Detect' },
  { id: 4, name: 'Alert Gen' },
]

function App() {
  const [form, setForm] = useState({
    amount: '500', currency: 'NPR', service: 'Western Union',
    offeredRate: '', fee: '', terms: '',
  })
  const [agents, setAgents] = useState({})
  const [compositeRisk, setCompositeRisk] = useState(null)
  const [riskWeights, setRiskWeights] = useState(null)
  const [finalResult, setFinalResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [agentMessages, setAgentMessages] = useState([])
  const liveRef = useRef(null)

  const selectedCountry = COUNTRIES.find(c => c.code === form.currency)

  const addMessage = useCallback((from, to, msg) => {
    setAgentMessages(prev => [...prev, { from, to, msg }])
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null); setAgents({}); setAgentMessages([])
    setCompositeRisk(null); setRiskWeights(null); setFinalResult(null); setShowTranslation(false)
    addMessage('orch', 'all', 'Starting analysis...')
    try {
      const res = await fetch('http://localhost:3001/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount), offeredRate: parseFloat(form.offeredRate), fee: parseFloat(form.fee) }),
      })
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        let currentEvent = null
        for (const line of lines) {
          if (line.startsWith('event: ')) currentEvent = line.slice(7)
          else if (line.startsWith('data: ') && currentEvent) {
            handleSSE(currentEvent, JSON.parse(line.slice(6)))
            currentEvent = null
          }
        }
      }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleSSE = (event, data) => {
    if (event === 'status') addMessage('orch', 'all', `Market rate: ${data.realRate}`)
    else if (event === 'agent-start') {
      setAgents(p => ({ ...p, [data.agent]: { status: 'running' } }))
      addMessage('orch', `ag${data.agent}`, `Deploy ${data.name}`)
    } else if (event === 'agent-result') {
      setAgents(p => ({ ...p, [data.agent]: { status: 'done', data: data.data } }))
      addMessage(`ag${data.agent}`, 'orch', `Risk: ${data.data?.riskScore}/10`)
    } else if (event === 'risk-score') {
      setCompositeRisk(data.composite); setRiskWeights(data.weights)
      addMessage('aggr', 'orch', `Composite: ${data.composite}/10`)
    } else if (event === 'complete') {
      setFinalResult(data); addMessage('orch', 'all', 'Done.')
    } else if (event === 'error') setError(data.error)
  }

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  // Derived data for charts
  const costItems = useMemo(() => {
    if (!finalResult?.agent1 || !finalResult?.agent4?.alternatives) return null
    const cur = { name: form.service, totalCost: finalResult.agent1.feeAnalysis.feeCharged + finalResult.agent1.rateAnalysis.moneyLostOnRate }
    const alts = finalResult.agent4.alternatives.map(alt => {
      const savings = parseFloat(alt.estimatedSavings.replace(/[^0-9.]/g, '')) || 0
      return { name: alt.service, totalCost: Math.max(0, cur.totalCost - savings) }
    })
    return [cur, ...alts]
  }, [finalResult, form.service])

  const rateData = useMemo(() => {
    if (!finalResult?.agent1?.rateAnalysis) return null
    const r = finalResult.agent1.rateAnalysis
    const totalLost = finalResult.agent1.totalMoneyLost || r.moneyLostOnRate
    return { offered: r.offeredRate, market: r.realRate, markup: r.markupPercent, lost: r.moneyLostOnRate, totalLost }
  }, [finalResult])

  return (
    <div className="min-h-screen bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-secondary focus:text-white focus:rounded-lg">Skip to content</a>
      <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-secondary font-black text-sm">R</div>
            <span className="font-bold text-secondary">RemitSafe</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Agent dots */}
            <div className="flex items-center gap-1.5">
              {AGENTS.map(a => {
                const st = agents[a.id]?.status
                return (
                  <div key={a.id} title={`${a.name}: ${st || 'idle'}`}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      st === 'done' ? 'bg-safe' : st === 'running' ? 'bg-primary animate-pulse' : 'bg-neutral-dark'
                    }`} />
                )
              })}
            </div>
            <span className="text-xs text-tertiary/40">{loading ? 'Analyzing...' : 'Ready'}</span>
          </div>
        </div>
      </header>

      <main id="main" className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── LEFT: Form ── */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-22 space-y-5">
              <div>
                <h1 className="text-xl font-bold text-secondary">Check your transfer</h1>
                <p className="text-sm text-tertiary/50 mt-1">Scan for hidden fees & scams</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <InputField label="Amount (USD)" id="amount" type="number" min="1" value={form.amount} onChange={update('amount')} prefix="$" />

                <div className="grid grid-cols-2 gap-2">
                  <SelectField label="Sending to" id="currency" value={form.currency} onChange={update('currency')}
                    options={COUNTRIES.map(c => ({ value: c.code, label: `${c.flag} ${c.name}` }))} />
                  <SelectField label="Provider" id="service" value={form.service} onChange={update('service')}
                    options={SERVICES.map(s => ({ value: s, label: s }))} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <InputField label="Rate offered" id="offeredRate" type="number" step="any" value={form.offeredRate} onChange={update('offeredRate')} placeholder="131" />
                  <InputField label="Fee ($)" id="fee" type="number" step="any" value={form.fee} onChange={update('fee')} prefix="$" placeholder="12" />
                </div>

                <div>
                  <label htmlFor="terms" className="block text-[11px] text-tertiary/50 font-medium mb-1">Terms <span className="text-tertiary/30">(optional)</span></label>
                  <textarea id="terms" value={form.terms} onChange={update('terms')} rows={2} placeholder="Paste fine print..."
                    className="w-full bg-neutral rounded-xl px-3 py-2.5 text-sm text-secondary placeholder-tertiary/30 focus:outline-none resize-none" />
                </div>

                <button type="submit" disabled={loading} aria-busy={loading}
                  className="w-full py-3 rounded-xl bg-primary text-secondary text-sm font-bold hover:bg-primary-dark transition disabled:opacity-40 cursor-pointer">
                  {loading ? 'Scanning...' : 'Scan transfer'}
                </button>
              </form>
            </div>
          </aside>

          {/* ── RIGHT: Dashboard ── */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* Empty state */}
            {!loading && !finalResult && !compositeRisk && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-2xl mb-4">🛡️</div>
                <h2 className="text-lg font-bold text-secondary">Protecting your family's money</h2>
                <p className="text-sm text-tertiary/40 mt-1 max-w-sm">Enter transfer details and our AI agents will detect hidden costs and fraud patterns.</p>
              </div>
            )}

            {/* ── Stat cards row ── */}
            {compositeRisk !== null && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
                {/* Risk score */}
                <div className={`rounded-2xl p-5 ${compositeRisk > 7 ? 'bg-danger/5' : compositeRisk > 4 ? 'bg-warning/5' : 'bg-safe/5'}`}>
                  <div className="text-[11px] text-tertiary/50 font-medium uppercase tracking-wider">Risk Score</div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-4xl font-black tabular-nums ${compositeRisk > 7 ? 'text-danger' : compositeRisk > 4 ? 'text-warning' : 'text-safe'}`}>{compositeRisk}</span>
                    <span className="text-tertiary/25 text-sm">/10</span>
                  </div>
                  <div className={`text-xs font-bold mt-2 ${compositeRisk > 7 ? 'text-danger' : compositeRisk > 4 ? 'text-warning' : 'text-safe'}`}>
                    {compositeRisk > 7 ? 'DO NOT SEND' : compositeRisk > 4 ? 'CAUTION' : 'LOOKS SAFE'}
                  </div>
                </div>

                {/* Rate markup */}
                {rateData && (
                  <div className="rounded-2xl p-5 bg-neutral/60">
                    <div className="text-[11px] text-tertiary/50 font-medium uppercase tracking-wider">Rate Markup</div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-black tabular-nums text-danger">+{rateData.markup}%</span>
                    </div>
                    <div className="text-xs text-tertiary/40 mt-2">{rateData.offered} vs {rateData.market} market</div>
                  </div>
                )}

                {/* Cost delta */}
                {rateData && (
                  <div className="rounded-2xl p-5 bg-neutral/60">
                    <div className="text-[11px] text-tertiary/50 font-medium uppercase tracking-wider">You Overpay</div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-black tabular-nums text-danger">${rateData.totalLost}</span>
                    </div>
                    <div className="text-xs text-tertiary/40 mt-2">${rateData.lost} rate + ${(rateData.totalLost - rateData.lost).toFixed(2)} excess fee</div>
                  </div>
                )}
              </div>
            )}

            {/* ── Robinhood-style rate chart ── */}
            {rateData && (
              <div className="bg-white rounded-2xl border border-neutral p-5 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[11px] text-tertiary/50 font-medium uppercase tracking-wider">Rate Comparison</div>
                    <div className="text-lg font-bold text-danger mt-0.5">+${rateData.totalLost} overpaying</div>
                  </div>
                  <div className="flex gap-4 text-[11px] text-tertiary/40">
                    <span><span className="inline-block w-2 h-2 rounded-full bg-danger/60 mr-1" />Offered</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-safe mr-1" />Market</span>
                  </div>
                </div>
                <div className="h-44">
                  <RateChart offered={rateData.offered} market={rateData.market} amount={parseFloat(form.amount)} />
                </div>
              </div>
            )}

            {/* ── Two-col: Red Flags + Alternatives ── */}
            {finalResult && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up">
                {/* Red flags */}
                <div className="bg-neutral/40 rounded-2xl p-5">
                  <h3 className="text-[11px] text-tertiary/50 font-bold uppercase tracking-wider mb-3">Red Flags</h3>
                  {finalResult.agent2?.redFlags?.length > 0 ? (
                    <ul className="space-y-2.5">
                      {finalResult.agent2.redFlags.slice(0, 5).map((f, i) => (
                        <li key={i} className="flex gap-2">
                          <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${f.risk === 'high' ? 'bg-danger' : 'bg-warning'}`} />
                          <div>
                            <p className="text-sm text-secondary font-medium">{f.clause}</p>
                            <p className="text-xs text-tertiary/40 mt-0.5">{f.explanation}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-tertiary/40">No red flags found in terms.</p>}

                  {finalResult.agent3?.patternsDetected?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-tertiary/10">
                      <h4 className="text-[11px] text-danger font-bold uppercase tracking-wider mb-2">Scam Patterns</h4>
                      <ul className="space-y-2">
                        {finalResult.agent3.patternsDetected.map((p, i) => (
                          <li key={i} className="text-sm">
                            <span className="font-semibold text-secondary">{p.pattern}</span>
                            <span className="text-tertiary/40 text-xs ml-1">({p.confidence})</span>
                            <p className="text-xs text-tertiary/40">{p.evidence}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Alternatives */}
                {finalResult.agent4?.alternatives && (
                  <div className="bg-neutral/40 rounded-2xl p-5">
                    <h3 className="text-[11px] text-tertiary/50 font-bold uppercase tracking-wider mb-3">Better Options</h3>
                    <div className="space-y-2">
                      {finalResult.agent4.alternatives.map((alt, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-secondary">{alt.service}</div>
                            <div className="text-xs text-tertiary/40">Fee: {alt.fee} · Rate: {alt.rate}</div>
                          </div>
                          <span className="text-safe text-sm font-bold">Save {alt.estimatedSavings}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Cost comparison bar chart ── */}
            {costItems && (
              <div className="bg-white rounded-2xl border border-neutral p-5 animate-slide-up">
                <h3 className="text-[11px] text-tertiary/50 font-bold uppercase tracking-wider mb-4">
                  Total Cost on ${form.amount} Transfer
                </h3>
                <div className="h-48">
                  <CostBarChart items={costItems} currentName={form.service} />
                </div>
              </div>
            )}

            {/* ── Alert + Translation ── */}
            {finalResult?.agent4?.alertInLanguage && (
              <div className="bg-neutral/40 rounded-2xl p-5 animate-slide-up">
                {finalResult.agent1 && (
                  <p className="text-base font-medium text-secondary leading-relaxed mb-4">{finalResult.agent1.summary}</p>
                )}
                <button onClick={() => setShowTranslation(!showTranslation)}
                  className="flex items-center gap-2 text-sm text-tertiary/50 hover:text-secondary transition cursor-pointer">
                  <span>{selectedCountry?.flag}</span>
                  <span>{showTranslation ? 'Hide translation' : `View in ${finalResult.agent4.language}`}</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${showTranslation ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showTranslation && (
                  <div className="mt-3 bg-white rounded-xl p-4 text-sm text-tertiary/60 whitespace-pre-wrap leading-relaxed"
                    lang={form.currency === 'NPR' ? 'ne' : form.currency === 'INR' ? 'hi' : form.currency === 'EGP' ? 'ar' : 'en'}>
                    {finalResult.agent4.alertInLanguage}
                  </div>
                )}
              </div>
            )}

            {error && <div role="alert" className="bg-danger/5 border border-danger/15 rounded-xl p-4 text-sm text-danger">{error}</div>}
          </section>
        </div>
      </main>

      {/* ── Collapsible agent log footer ── */}
      {agentMessages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <button onClick={() => setLogOpen(!logOpen)}
            className="w-full bg-secondary text-white/60 text-[11px] font-mono px-6 py-2 flex items-center justify-between cursor-pointer hover:text-white/80 transition">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Agent Log · {agentMessages.length} events
            </div>
            <svg className={`w-3.5 h-3.5 transition-transform ${logOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {logOpen && (
            <div className="bg-secondary max-h-48 overflow-y-auto px-6 py-3 space-y-0.5 font-mono text-[11px]">
              {agentMessages.map((m, i) => (
                <div key={i} className="flex gap-1.5">
                  <span className="text-primary">{m.from}</span>
                  <span className="text-white/20">→</span>
                  <span className="text-white/40">{m.to}</span>
                  <span className="text-white/30">{m.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Form Components ───

function InputField({ label, id, prefix, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] text-tertiary/50 font-medium mb-1">{label}</label>
      <div className="flex items-center bg-neutral rounded-xl px-3">
        {prefix && <span className="text-tertiary/30 text-sm mr-1">{prefix}</span>}
        <input id={id} {...props} required className="w-full bg-transparent py-2.5 text-sm text-secondary font-medium placeholder-tertiary/30 focus:outline-none" />
      </div>
    </div>
  )
}

function SelectField({ label, id, options, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] text-tertiary/50 font-medium mb-1">{label}</label>
      <select id={id} {...props} className="w-full bg-neutral rounded-xl px-3 py-2.5 text-sm text-secondary font-medium focus:outline-none appearance-none cursor-pointer">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ─── Charts ───

function RateChart({ offered, market, amount }) {
  // Show how much USD you lose at each transfer amount step
  const steps = 8
  const labels = []
  const offeredLine = []
  const marketLine = []
  for (let i = 0; i <= steps; i++) {
    const amt = Math.round((amount / steps) * i) || 1
    labels.push(`$${amt}`)
    // What you actually get in USD value (offered rate gives less value)
    const lostAtThisAmt = parseFloat(((market - offered) / market * amt).toFixed(2))
    offeredLine.push(parseFloat((amt - lostAtThisAmt).toFixed(2)))
    marketLine.push(amt)
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Your USD value (offered rate)',
        data: offeredLine,
        borderColor: 'rgba(220, 38, 38, 0.6)',
        backgroundColor: 'rgba(220, 38, 38, 0.05)',
        fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
      },
      {
        label: 'Fair USD value (market rate)',
        data: marketLine,
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.08)',
        fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true, maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      tooltip: {
        backgroundColor: '#163B06', titleColor: '#fff', bodyColor: '#fff',
        padding: 10, cornerRadius: 8, bodyFont: { family: 'system-ui' },
        callbacks: { label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}` },
      },
    },
    scales: {
      x: { display: true, grid: { display: false }, ticks: { color: '#ccc', font: { size: 10 } } },
      y: { display: false, grid: { display: false } },
    },
  }

  return <Line data={data} options={options} />
}

function CostBarChart({ items, currentName }) {
  const cheapest = Math.min(...items.map(i => i.totalCost))
  const data = {
    labels: items.map(i => i.name),
    datasets: [{
      data: items.map(i => parseFloat(i.totalCost.toFixed(2))),
      backgroundColor: items.map(i =>
        i.name === currentName ? 'rgba(220, 38, 38, 0.15)' :
        i.totalCost === cheapest ? 'rgba(159, 232, 112, 0.4)' : 'rgba(240, 240, 240, 0.8)'
      ),
      borderColor: items.map(i =>
        i.name === currentName ? 'rgba(220, 38, 38, 0.4)' :
        i.totalCost === cheapest ? 'rgba(159, 232, 112, 0.8)' : 'rgba(224, 224, 224, 1)'
      ),
      borderWidth: 1, borderRadius: 6, barThickness: 28,
    }],
  }

  const options = {
    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
    plugins: {
      tooltip: {
        backgroundColor: '#163B06', titleColor: '#fff', bodyColor: '#fff',
        padding: 10, cornerRadius: 8,
        callbacks: { label: (ctx) => `Total cost: $${ctx.parsed.x}` },
      },
    },
    scales: {
      x: { display: true, grid: { display: false }, ticks: { color: '#bbb', font: { size: 10 }, callback: v => `$${v}` } },
      y: { display: true, grid: { display: false }, ticks: { color: '#666', font: { size: 11, weight: 'bold' } } },
    },
  }

  return <Bar data={data} options={options} />
}

export default App
