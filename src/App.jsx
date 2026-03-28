import { useState, useEffect, useRef, useCallback } from 'react'

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

const AGENT_NAMES = { 1: 'Rate Check', 2: 'Terms Scan', 3: 'Scam Detect', 4: 'Alert' }

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
  const resultRef = useRef(null)
  const liveRegionRef = useRef(null)

  const selectedCountry = COUNTRIES.find(c => c.code === form.currency)

  // Announce to screen readers
  const announce = useCallback((msg) => {
    if (liveRegionRef.current) liveRegionRef.current.textContent = msg
  }, [])

  useEffect(() => {
    if (compositeRisk !== null && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      announce(`Risk score: ${compositeRisk} out of 10. ${compositeRisk > 7 ? 'Danger. Do not send this transfer.' : compositeRisk > 4 ? 'Warning. Proceed with caution.' : 'This transfer looks fair.'}`)
    }
  }, [compositeRisk, announce])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAgents({})
    setCompositeRisk(null)
    setRiskWeights(null)
    setFinalResult(null)
    setShowTranslation(false)
    announce('Scanning transfer. Four AI agents are analyzing your transaction.')

    try {
      const res = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          offeredRate: parseFloat(form.offeredRate),
          fee: parseFloat(form.fee),
        }),
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
    } catch (err) {
      setError(err.message)
      announce(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSSE = (event, data) => {
    if (event === 'agent-start') {
      setAgents(p => ({ ...p, [data.agent]: { status: 'scanning' } }))
    } else if (event === 'agent-result') {
      setAgents(p => ({ ...p, [data.agent]: { status: 'done', data: data.data } }))
    } else if (event === 'risk-score') {
      setCompositeRisk(data.composite)
      setRiskWeights(data.weights)
    } else if (event === 'complete') {
      setFinalResult(data)
      announce('Analysis complete. Scroll down for full results.')
    } else if (event === 'error') {
      setError(data.error)
    }
  }

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  return (
    <div className="min-h-screen bg-black text-gray-300 font-[system-ui]">
      {/* Skip link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:text-sm">
        Skip to main content
      </a>

      {/* Live region for screen reader announcements */}
      <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" className="sr-only" />

      {/* Header */}
      <header role="banner" className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-900">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-sm font-black text-black" aria-hidden="true">R</div>
            <span className="text-sm font-semibold text-white">RemitSafe</span>
          </div>
          {loading && (
            <div className="flex items-center gap-1.5" role="status">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-[11px] text-gray-500">scanning</span>
            </div>
          )}
        </div>
      </header>

      <main id="main-content" role="main" className="max-w-2xl mx-auto px-5 py-8 space-y-10">

        {/* Form */}
        <form onSubmit={handleSubmit} aria-label="Transfer details" className="space-y-6">
          <fieldset className="grid grid-cols-2 gap-6">
            <legend className="sr-only">Transfer amount and destination</legend>
            <div>
              <label htmlFor="amount" className="block text-[11px] text-gray-500 uppercase tracking-wider">Amount (USD)</label>
              <div className="flex items-baseline gap-1">
                <span className="text-gray-500 text-sm" aria-hidden="true">$</span>
                <input id="amount" type="number" min="1" value={form.amount} onChange={update('amount')} required
                  aria-required="true"
                  className="w-full bg-transparent border-b border-gray-700 px-0 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white focus:ring-0 transition text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="currency" className="block text-[11px] text-gray-500 uppercase tracking-wider">To</label>
              <select id="currency" value={form.currency} onChange={update('currency')}
                className="w-full bg-transparent border-b border-gray-700 px-0 py-2 text-white focus:outline-none focus:border-white transition text-sm appearance-none cursor-pointer">
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
          </fieldset>

          <div>
            <label htmlFor="service" className="block text-[11px] text-gray-500 uppercase tracking-wider">Service</label>
            <select id="service" value={form.service} onChange={update('service')}
              className="w-full bg-transparent border-b border-gray-700 px-0 py-2 text-white focus:outline-none focus:border-white transition text-sm appearance-none cursor-pointer">
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <fieldset className="grid grid-cols-2 gap-6">
            <legend className="sr-only">Rate and fee details</legend>
            <div>
              <label htmlFor="offeredRate" className="block text-[11px] text-gray-500 uppercase tracking-wider">
                Offered rate <span className="normal-case">(1 USD = ? {form.currency})</span>
              </label>
              <input id="offeredRate" type="number" step="any" min="0" value={form.offeredRate} onChange={update('offeredRate')} required
                aria-required="true" placeholder="131"
                className="w-full bg-transparent border-b border-gray-700 px-0 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition text-sm" />
            </div>
            <div>
              <label htmlFor="fee" className="block text-[11px] text-gray-500 uppercase tracking-wider">Fee (USD)</label>
              <div className="flex items-baseline gap-1">
                <span className="text-gray-500 text-sm" aria-hidden="true">$</span>
                <input id="fee" type="number" step="any" min="0" value={form.fee} onChange={update('fee')} required
                  aria-required="true" placeholder="12"
                  className="w-full bg-transparent border-b border-gray-700 px-0 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition text-sm" />
              </div>
            </div>
          </fieldset>

          <div>
            <label htmlFor="terms" className="block text-[11px] text-gray-500 uppercase tracking-wider">
              Terms & conditions <span className="text-gray-700 normal-case">(optional)</span>
            </label>
            <textarea id="terms" value={form.terms} onChange={update('terms')} rows={2} placeholder="Paste fine print..."
              className="w-full bg-transparent border border-gray-800 rounded-lg px-3 py-2 mt-1 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition text-sm resize-none" />
          </div>

          <button type="submit" disabled={loading}
            aria-busy={loading}
            className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            {loading ? 'Scanning...' : 'Scan transfer'}
          </button>
        </form>

        {/* Agent status */}
        {Object.keys(agents).length > 0 && (
          <section aria-label="Agent status" className="flex gap-2" role="status">
            {[1, 2, 3, 4].map(id => {
              const a = agents[id]
              const scanning = a?.status === 'scanning'
              const done = a?.status === 'done'
              return (
                <div key={id} className={`flex-1 rounded-lg px-3 py-2 text-[11px] transition-all duration-500 ${
                  done ? 'bg-gray-900 border border-gray-800' :
                  scanning ? 'bg-gray-900 border border-gray-700' :
                  'bg-gray-950 border border-gray-900'
                }`} aria-label={`${AGENT_NAMES[id]}: ${done ? `complete, risk ${a.data?.riskScore} out of 10` : scanning ? 'scanning' : 'waiting'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-500 font-medium">{AGENT_NAMES[id]}</span>
                    {scanning && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />}
                    {done && <span className="text-emerald-500 text-[10px]" aria-hidden="true">done</span>}
                  </div>
                  {done && a.data && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden" role="meter" aria-valuenow={a.data.riskScore} aria-valuemin={0} aria-valuemax={10} aria-label={`Risk: ${a.data.riskScore} out of 10`}>
                        <div className={`h-full rounded-full transition-all duration-700 motion-reduce:transition-none ${
                          a.data.riskScore > 6 ? 'bg-red-500' : a.data.riskScore > 3 ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`} style={{ width: `${a.data.riskScore * 10}%` }} />
                      </div>
                      <span className={`text-[10px] font-mono ${
                        a.data.riskScore > 6 ? 'text-red-400' : a.data.riskScore > 3 ? 'text-yellow-400' : 'text-emerald-400'
                      }`} aria-hidden="true">{a.data.riskScore}</span>
                    </div>
                  )}
                  {scanning && (
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-label={`${AGENT_NAMES[id]} scanning`}>
                      <div className="h-full bg-cyan-800 rounded-full animate-progress motion-reduce:animate-none" />
                    </div>
                  )}
                </div>
              )
            })}
          </section>
        )}

        {/* Risk Score */}
        {compositeRisk !== null && (
          <section ref={resultRef} aria-label="Risk assessment" className="animate-slide-up motion-reduce:animate-none" tabIndex={-1}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Risk Score</h2>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-5xl font-black tabular-nums ${
                    compositeRisk > 7 ? 'text-red-400' : compositeRisk > 4 ? 'text-yellow-400' : 'text-emerald-400'
                  }`} aria-hidden="true">{compositeRisk}</span>
                  <span className="text-lg text-gray-600" aria-hidden="true">/10</span>
                  <span className="sr-only">{compositeRisk} out of 10</span>
                </div>
              </div>
              <div className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                compositeRisk > 7 ? 'bg-red-500/10 text-red-400' :
                compositeRisk > 4 ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-emerald-500/10 text-emerald-400'
              }`} role="alert">
                {compositeRisk > 7 ? 'Do not send' : compositeRisk > 4 ? 'Caution' : 'Looks fair'}
              </div>
            </div>

            {riskWeights && (
              <div className="space-y-2 mb-8" aria-label="Risk breakdown by category">
                {[
                  { label: 'Rate', score: riskWeights.rate },
                  { label: 'Terms', score: riskWeights.language },
                  { label: 'Scam', score: riskWeights.scam },
                ].map(({ label, score }) => (
                  <div key={label} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-gray-500">{label}</span>
                    <div className="flex-1 h-1 bg-gray-900 rounded-full overflow-hidden" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={10} aria-label={`${label} risk: ${score} out of 10`}>
                      <div className={`h-full rounded-full transition-all duration-1000 motion-reduce:transition-none ${
                        score > 6 ? 'bg-red-500' : score > 3 ? 'bg-yellow-500' : 'bg-emerald-500'
                      }`} style={{ width: `${score * 10}%` }} />
                    </div>
                    <span className="text-gray-600 tabular-nums w-14 text-right">{score}/10</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Results */}
        {finalResult && (
          <section aria-label="Detailed analysis" className="space-y-8 animate-slide-up motion-reduce:animate-none">

            {/* Summary */}
            {finalResult.agent1 && (
              <p className="text-white text-lg leading-relaxed" role="alert">
                {finalResult.agent1.summary}
              </p>
            )}

            {/* Rate comparison */}
            {finalResult.agent1?.rateAnalysis && (
              <div className="space-y-3">
                <h3 className="text-[11px] text-gray-500 uppercase tracking-wider">Exchange Rate</h3>
                <div className="grid grid-cols-2 gap-4" role="table" aria-label="Rate comparison">
                  <div role="row">
                    <div className="text-[11px] text-gray-600 mb-0.5" role="columnheader">Offered</div>
                    <div className="text-2xl font-mono text-gray-300" role="cell">{finalResult.agent1.rateAnalysis.offeredRate}
                      <span className="sr-only"> {form.currency} per USD</span>
                    </div>
                  </div>
                  <div role="row">
                    <div className="text-[11px] text-emerald-600 mb-0.5" role="columnheader">Market rate</div>
                    <div className="text-2xl font-mono text-emerald-400" role="cell">{finalResult.agent1.rateAnalysis.realRate}
                      <span className="sr-only"> {form.currency} per USD</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-red-400">{finalResult.agent1.rateAnalysis.markupPercent}% markup</span>
                  {' · '}
                  <span className="text-red-400">${finalResult.agent1.rateAnalysis.moneyLostOnRate} lost</span>
                  {' · '}
                  ${finalResult.agent1.feeAnalysis.feeCharged} fee ({finalResult.agent1.feeAnalysis.feeVerdict})
                </p>
                <hr className="border-gray-900" />
              </div>
            )}

            {/* Terms */}
            {finalResult.agent2?.redFlags?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[11px] text-gray-500 uppercase tracking-wider">Terms red flags</h3>
                <ul className="space-y-3 list-none p-0" role="list">
                  {finalResult.agent2.redFlags.map((flag, i) => (
                    <li key={i} className="space-y-1">
                      <div className="flex items-start gap-2">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                          flag.risk === 'high' ? 'bg-red-500' : flag.risk === 'medium' ? 'bg-yellow-500' : 'bg-gray-600'
                        }`} aria-hidden="true" />
                        <div>
                          <span className="sr-only">{flag.risk} risk: </span>
                          <span className="text-xs text-gray-400 italic">"{flag.clause}"</span>
                          <p className="text-xs text-gray-500 mt-0.5">{flag.explanation}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <hr className="border-gray-900" />
              </div>
            )}

            {/* Scam patterns */}
            {finalResult.agent3?.patternsDetected?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[11px] text-gray-500 uppercase tracking-wider">Scam patterns detected</h3>
                <ul className="space-y-2 list-none p-0" role="list">
                  {finalResult.agent3.patternsDetected.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-red-500 text-xs mt-0.5 shrink-0" aria-hidden="true">!</span>
                      <div>
                        <span className="text-xs text-white font-medium">{p.pattern}</span>
                        <span className="text-xs text-gray-600 ml-2">({p.confidence} confidence)</span>
                        <p className="text-xs text-gray-500 mt-0.5">{p.evidence}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <hr className="border-gray-900" />
              </div>
            )}

            {/* Alternatives */}
            {finalResult.agent4?.alternatives?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[11px] text-gray-500 uppercase tracking-wider">Better options</h3>
                <ul className="list-none p-0 divide-y divide-gray-900" role="list">
                  {finalResult.agent4.alternatives.map((alt, i) => (
                    <li key={i} className="flex items-center justify-between py-2.5">
                      <div>
                        <span className="text-sm text-white">{alt.service}</span>
                        <span className="text-xs text-gray-600 ml-2">{alt.fee} · {alt.rateInfo}</span>
                      </div>
                      <span className="text-emerald-400 text-xs font-medium whitespace-nowrap ml-3">Save {alt.estimatedSavings}</span>
                    </li>
                  ))}
                </ul>
                <hr className="border-gray-900" />
              </div>
            )}

            {/* Translation */}
            {finalResult.agent4?.alertInLanguage && (
              <div>
                <button onClick={() => setShowTranslation(!showTranslation)}
                  aria-expanded={showTranslation}
                  aria-controls="translation-content"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded transition cursor-pointer">
                  <span aria-hidden="true">{selectedCountry?.flag}</span>
                  <span>{showTranslation ? 'Hide translation' : `View in ${finalResult.agent4.language}`}</span>
                  <svg className={`w-3 h-3 transition-transform motion-reduce:transition-none ${showTranslation ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showTranslation && (
                  <div id="translation-content" className="mt-3 text-sm text-gray-400 whitespace-pre-wrap leading-relaxed animate-slide-up motion-reduce:animate-none" lang={form.currency === 'NPR' ? 'ne' : form.currency === 'INR' ? 'hi' : form.currency === 'EGP' ? 'ar' : 'en'}>
                    {finalResult.agent4.alertInLanguage}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {error && (
          <div role="alert" className="text-sm text-red-400 py-2">
            <span className="sr-only">Error: </span>{error}
          </div>
        )}
      </main>

      <footer role="contentinfo" className="max-w-2xl mx-auto px-5 py-6 text-[11px] text-gray-700">
        Powered by Amazon Bedrock · 4 AI Agents
      </footer>
    </div>
  )
}

export default App
