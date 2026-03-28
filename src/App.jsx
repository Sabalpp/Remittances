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

const AGENTS = {
  1: { name: 'Rate Anomaly Detector', icon: '📊', color: 'cyan', desc: 'Comparing offered rate vs live market data' },
  2: { name: 'Predatory Language Scanner', icon: '🔍', color: 'amber', desc: 'NLP scanning terms for hidden traps' },
  3: { name: 'Scam Pattern Classifier', icon: '🛡️', color: 'rose', desc: 'Matching against 10 fraud signatures' },
  4: { name: 'Alert Generator', icon: '📢', color: 'emerald', desc: 'Synthesizing findings into multilingual alert' },
}

function App() {
  const [form, setForm] = useState({
    amount: '500', currency: 'NPR', service: 'Western Union',
    offeredRate: '', fee: '', terms: '',
  })
  const [agents, setAgents] = useState({})
  const [agentMessages, setAgentMessages] = useState([])
  const [compositeRisk, setCompositeRisk] = useState(null)
  const [riskWeights, setRiskWeights] = useState(null)
  const [finalResult, setFinalResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const resultRef = useRef(null)
  const liveRef = useRef(null)

  const selectedCountry = COUNTRIES.find(c => c.code === form.currency)

  const announce = useCallback((msg) => {
    if (liveRef.current) liveRef.current.textContent = msg
  }, [])

  // Add agent interaction messages
  const addMessage = useCallback((from, to, msg) => {
    setAgentMessages(prev => [...prev, { from, to, msg, time: Date.now() }])
  }, [])

  useEffect(() => {
    if (compositeRisk !== null && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
      announce(`Risk score: ${compositeRisk} out of 10`)
    }
  }, [compositeRisk, announce])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAgents({})
    setAgentMessages([])
    setCompositeRisk(null)
    setRiskWeights(null)
    setFinalResult(null)
    setShowTranslation(false)
    announce('Scanning transfer.')

    addMessage('orchestrator', 'all', 'Initializing agent swarm...')

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
    } finally {
      setLoading(false)
    }
  }

  const handleSSE = (event, data) => {
    if (event === 'status') {
      addMessage('orchestrator', 'all', `Live market rate fetched: ${data.realRate} ${form.currency}/USD`)
    } else if (event === 'agent-start') {
      setAgents(p => ({ ...p, [data.agent]: { status: 'scanning' } }))
      addMessage('orchestrator', `agent${data.agent}`, `Deploy Agent ${data.agent}: ${data.name}`)
      if (data.agent <= 3) {
        setTimeout(() => addMessage(`agent${data.agent}`, 'orchestrator', `${AGENTS[data.agent].icon} Scanning...`), 400)
      }
    } else if (event === 'agent-result') {
      setAgents(p => ({ ...p, [data.agent]: { status: 'done', data: data.data } }))
      const score = data.data?.riskScore
      addMessage(`agent${data.agent}`, 'orchestrator', `Analysis complete. Risk: ${score}/10`)
      if (data.agent === 3) {
        setTimeout(() => addMessage('orchestrator', 'aggregator', 'All agents reported. Computing composite risk...'), 300)
      }
      if (data.agent === 4) {
        addMessage(`agent4`, 'orchestrator', `Alert generated in ${data.data.language}`)
      }
    } else if (event === 'risk-score') {
      setCompositeRisk(data.composite)
      setRiskWeights(data.weights)
      addMessage('aggregator', 'orchestrator', `Composite risk: ${data.composite}/10 [Rate×0.35 + Terms×0.35 + Scam×0.30]`)
      setTimeout(() => addMessage('orchestrator', 'agent4', 'Deploying Alert Generator with all findings...'), 200)
    } else if (event === 'complete') {
      setFinalResult(data)
      addMessage('orchestrator', 'all', 'Analysis complete.')
    } else if (event === 'error') {
      setError(data.error)
    }
  }

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  return (
    <div className="min-h-screen bg-[#08090c] text-gray-300 font-[system-ui]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:text-sm">Skip to main content</a>
      <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#08090c]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-sm font-black text-black">R</div>
            <div>
              <span className="text-sm font-semibold text-white">RemitSafe</span>
              <span className="text-[10px] text-gray-600 ml-2 hidden sm:inline">AI Fraud Shield</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            <span className="text-[11px] text-gray-600">{loading ? '4 agents active' : '4 agents ready'}</span>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-5xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} aria-label="Transfer details" className="space-y-5">
              <div>
                <label htmlFor="amount" className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1">Amount</label>
                <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3">
                  <span className="text-gray-500">$</span>
                  <input id="amount" type="number" min="1" value={form.amount} onChange={update('amount')} required
                    className="w-full bg-transparent py-2.5 text-white focus:outline-none text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="currency" className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1">To</label>
                  <select id="currency" value={form.currency} onChange={update('currency')}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none appearance-none cursor-pointer">
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="service" className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1">Service</label>
                  <select id="service" value={form.service} onChange={update('service')}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none appearance-none cursor-pointer">
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="offeredRate" className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1">Rate offered</label>
                  <input id="offeredRate" type="number" step="any" value={form.offeredRate} onChange={update('offeredRate')} required placeholder="131"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-white placeholder-gray-700 text-sm focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="fee" className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1">Fee</label>
                  <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3">
                    <span className="text-gray-500">$</span>
                    <input id="fee" type="number" step="any" value={form.fee} onChange={update('fee')} required placeholder="12"
                      className="w-full bg-transparent py-2.5 text-white placeholder-gray-700 text-sm focus:outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="terms" className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1">Terms <span className="text-gray-700">(optional)</span></label>
                <textarea id="terms" value={form.terms} onChange={update('terms')} rows={2} placeholder="Paste fine print..."
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-white placeholder-gray-700 text-sm focus:outline-none resize-none" />
              </div>

              <button type="submit" disabled={loading} aria-busy={loading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-semibold hover:from-emerald-400 hover:to-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                {loading ? 'Agents scanning...' : 'Scan transfer'}
              </button>
            </form>

            {/* Agent Cards */}
            {Object.keys(agents).length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(id => <AgentCard key={id} id={id} agent={agents[id]} />)}
              </div>
            )}
          </div>

          {/* Right column: Agent Activity + Results */}
          <div className="lg:col-span-3 space-y-6">

            {/* Agent Interaction Log */}
            {agentMessages.length > 0 && (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Agent Activity</span>
                </div>
                <div className="max-h-64 overflow-y-auto p-3 space-y-1 font-mono text-[11px]">
                  {agentMessages.map((m, i) => (
                    <AgentMessage key={i} msg={m} />
                  ))}
                </div>
              </div>
            )}

            {/* Risk Score + Bar Chart */}
            {compositeRisk !== null && (
              <div ref={resultRef} className="animate-slide-up space-y-6" tabIndex={-1}>
                {/* Score */}
                <div className={`rounded-xl p-5 border ${
                  compositeRisk > 7 ? 'border-red-500/20 bg-red-500/[0.04]' :
                  compositeRisk > 4 ? 'border-yellow-500/20 bg-yellow-500/[0.04]' :
                  'border-emerald-500/20 bg-emerald-500/[0.04]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-gray-500 uppercase tracking-wider">Composite Risk</div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-4xl font-black tabular-nums ${
                          compositeRisk > 7 ? 'text-red-400' : compositeRisk > 4 ? 'text-yellow-400' : 'text-emerald-400'
                        }`}>{compositeRisk}</span>
                        <span className="text-gray-600">/10</span>
                      </div>
                    </div>
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      compositeRisk > 7 ? 'bg-red-500/15 text-red-400' :
                      compositeRisk > 4 ? 'bg-yellow-500/15 text-yellow-400' :
                      'bg-emerald-500/15 text-emerald-400'
                    }`} role="alert">
                      {compositeRisk > 7 ? 'DANGER' : compositeRisk > 4 ? 'CAUTION' : 'SAFE'}
                    </div>
                  </div>

                  {/* Risk breakdown bars */}
                  {riskWeights && (
                    <div className="mt-4 pt-4 border-t border-white/[0.05] grid grid-cols-3 gap-3">
                      {[
                        { label: 'Rate', score: riskWeights.rate, color: 'bg-cyan-500' },
                        { label: 'Terms', score: riskWeights.language, color: 'bg-amber-500' },
                        { label: 'Scam', score: riskWeights.scam, color: 'bg-rose-500' },
                      ].map(({ label, score, color }) => (
                        <div key={label} className="text-center">
                          <div className="h-24 flex items-end justify-center mb-1.5">
                            <div className={`w-10 ${color} rounded-t-md transition-all duration-1000 motion-reduce:transition-none`}
                              style={{ height: `${Math.max(4, score * 10)}%` }}
                              role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={10} aria-label={`${label}: ${score}/10`} />
                          </div>
                          <div className="text-[11px] text-gray-500">{label}</div>
                          <div className={`text-xs font-bold ${score > 6 ? 'text-red-400' : score > 3 ? 'text-yellow-400' : 'text-emerald-400'}`}>{score}/10</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cost Comparison Bar Chart */}
                {finalResult?.agent1 && finalResult?.agent4?.alternatives && (
                  <CostChart
                    current={{ name: form.service, fee: finalResult.agent1.feeAnalysis.feeCharged, rateLoss: finalResult.agent1.rateAnalysis.moneyLostOnRate }}
                    alternatives={finalResult.agent4.alternatives}
                    amount={parseFloat(form.amount)}
                  />
                )}
              </div>
            )}

            {/* Detailed findings */}
            {finalResult && (
              <div className="space-y-5 animate-slide-up">
                {/* Summary */}
                {finalResult.agent1 && (
                  <p className="text-white text-base leading-relaxed" role="alert">
                    {finalResult.agent1.summary}
                  </p>
                )}

                {/* Rate comparison */}
                {finalResult.agent1?.rateAnalysis && (
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-3">
                    <h3 className="text-[11px] text-gray-500 uppercase tracking-wider">Exchange Rate</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[0.02] rounded-lg p-3">
                        <div className="text-[10px] text-gray-600 mb-0.5">Offered</div>
                        <div className="text-xl font-mono text-gray-300">{finalResult.agent1.rateAnalysis.offeredRate}</div>
                        <div className="text-[10px] text-gray-700">{form.currency}/USD</div>
                      </div>
                      <div className="bg-emerald-500/[0.04] rounded-lg p-3 border border-emerald-500/10">
                        <div className="text-[10px] text-emerald-600 mb-0.5">Market</div>
                        <div className="text-xl font-mono text-emerald-400">{finalResult.agent1.rateAnalysis.realRate}</div>
                        <div className="text-[10px] text-emerald-700">{form.currency}/USD</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Tag color="red">{finalResult.agent1.rateAnalysis.markupPercent}% markup</Tag>
                      <Tag color="red">${finalResult.agent1.rateAnalysis.moneyLostOnRate} lost</Tag>
                      <Tag color={finalResult.agent1.feeAnalysis.feeVerdict === 'fair' ? 'green' : 'red'}>
                        ${finalResult.agent1.feeAnalysis.feeCharged} fee
                      </Tag>
                    </div>
                  </div>
                )}

                {/* Terms */}
                {finalResult.agent2?.redFlags?.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-3">
                    <h3 className="text-[11px] text-gray-500 uppercase tracking-wider">Terms Red Flags</h3>
                    <ul className="space-y-2.5 list-none p-0">
                      {finalResult.agent2.redFlags.map((flag, i) => (
                        <li key={i} className="flex gap-2">
                          <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                            flag.risk === 'high' ? 'bg-red-500' : flag.risk === 'medium' ? 'bg-yellow-500' : 'bg-gray-600'
                          }`} />
                          <div>
                            <p className="text-xs text-gray-300 italic leading-relaxed">"{flag.clause}"</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">{flag.explanation}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scam patterns */}
                {finalResult.agent3?.patternsDetected?.length > 0 && (
                  <div className="bg-red-500/[0.03] border border-red-500/10 rounded-xl p-4 space-y-3">
                    <h3 className="text-[11px] text-red-400 uppercase tracking-wider">Scam Patterns</h3>
                    <ul className="space-y-2 list-none p-0">
                      {finalResult.agent3.patternsDetected.map((p, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-500 text-[10px] mt-0.5 shrink-0 font-bold">!</span>
                          <div>
                            <span className="text-xs text-white font-medium">{p.pattern}</span>
                            <span className="text-[10px] text-gray-600 ml-1.5">({p.confidence})</span>
                            <p className="text-[11px] text-gray-500 mt-0.5">{p.evidence}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Translation */}
                {finalResult.agent4?.alertInLanguage && (
                  <button onClick={() => setShowTranslation(!showTranslation)}
                    aria-expanded={showTranslation}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded">
                    <span>{selectedCountry?.flag}</span>
                    <span>{showTranslation ? 'Hide' : `View in ${finalResult.agent4.language}`}</span>
                    <svg className={`w-3 h-3 transition-transform ${showTranslation ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                )}
                {showTranslation && (
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-sm text-gray-400 whitespace-pre-wrap leading-relaxed animate-slide-up"
                    lang={form.currency === 'NPR' ? 'ne' : form.currency === 'INR' ? 'hi' : form.currency === 'EGP' ? 'ar' : 'en'}>
                    {finalResult.agent4.alertInLanguage}
                  </div>
                )}
              </div>
            )}

            {error && <div role="alert" className="text-sm text-red-400">{error}</div>}
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-5 py-6 text-[10px] text-gray-700 border-t border-white/[0.03]">
        Powered by Amazon Bedrock · 4 AI Agents · Protecting immigrant families worldwide
      </footer>
    </div>
  )
}

// ─── Agent Card ───
function AgentCard({ id, agent }) {
  const meta = AGENTS[id]
  const scanning = agent?.status === 'scanning'
  const done = agent?.status === 'done'

  const colorMap = {
    cyan: { border: 'border-cyan-500/20', bg: 'bg-cyan-500/[0.04]', text: 'text-cyan-400', bar: 'bg-cyan-500' },
    amber: { border: 'border-amber-500/20', bg: 'bg-amber-500/[0.04]', text: 'text-amber-400', bar: 'bg-amber-500' },
    rose: { border: 'border-rose-500/20', bg: 'bg-rose-500/[0.04]', text: 'text-rose-400', bar: 'bg-rose-500' },
    emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.04]', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  }
  const c = colorMap[meta.color]

  return (
    <div className={`rounded-lg border p-3 transition-all duration-500 ${
      done ? `${c.border} ${c.bg}` : scanning ? 'border-white/[0.08] bg-white/[0.02]' : 'border-white/[0.04] bg-white/[0.01]'
    }`} aria-label={`Agent ${id}: ${done ? 'complete' : scanning ? 'scanning' : 'waiting'}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-base">{meta.icon}</span>
        {scanning && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
        {done && <span className="text-emerald-400 text-[10px]">✓</span>}
      </div>
      <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Agent {id}</div>
      <div className="text-[11px] text-gray-300 font-medium mt-0.5 leading-snug">{meta.name}</div>

      {scanning && (
        <div className="mt-2">
          <div className="text-[10px] text-gray-600 mb-1">{meta.desc}</div>
          <div className="h-0.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div className={`h-full ${c.bar} rounded-full animate-progress`} />
          </div>
        </div>
      )}

      {done && agent.data && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden" role="meter" aria-valuenow={agent.data.riskScore} aria-valuemin={0} aria-valuemax={10}>
            <div className={`h-full rounded-full transition-all duration-700 ${
              agent.data.riskScore > 6 ? 'bg-red-500' : agent.data.riskScore > 3 ? 'bg-yellow-500' : 'bg-emerald-500'
            }`} style={{ width: `${agent.data.riskScore * 10}%` }} />
          </div>
          <span className={`text-[10px] font-mono font-bold ${
            agent.data.riskScore > 6 ? 'text-red-400' : agent.data.riskScore > 3 ? 'text-yellow-400' : 'text-emerald-400'
          }`}>{agent.data.riskScore}</span>
        </div>
      )}
    </div>
  )
}

// ─── Agent Message (interaction log) ───
function AgentMessage({ msg }) {
  const actors = {
    orchestrator: { label: 'ORCH', color: 'text-gray-400' },
    aggregator: { label: 'AGGR', color: 'text-purple-400' },
    agent1: { label: 'AG-1', color: 'text-cyan-400' },
    agent2: { label: 'AG-2', color: 'text-amber-400' },
    agent3: { label: 'AG-3', color: 'text-rose-400' },
    agent4: { label: 'AG-4', color: 'text-emerald-400' },
    all: { label: 'ALL', color: 'text-gray-500' },
  }
  const from = actors[msg.from] || actors.orchestrator
  const to = actors[msg.to] || actors.all

  return (
    <div className="flex gap-1.5 leading-relaxed">
      <span className={`${from.color} shrink-0`}>{from.label}</span>
      <span className="text-gray-700">→</span>
      <span className={`${to.color} shrink-0`}>{to.label}</span>
      <span className="text-gray-500">{msg.msg}</span>
    </div>
  )
}

// ─── Cost Comparison Bar Chart ───
function CostChart({ current, alternatives, amount }) {
  // Build comparison data
  const items = [
    {
      name: current.name,
      totalCost: current.fee + current.rateLoss,
      fee: current.fee,
      rateLoss: current.rateLoss,
      isCurrent: true,
    },
    ...alternatives.map(alt => {
      const feeNum = parseFloat(alt.fee.replace(/[^0-9.]/g, '')) || 0
      const savingsNum = parseFloat(alt.estimatedSavings.replace(/[^0-9.]/g, '')) || 0
      return {
        name: alt.service,
        totalCost: Math.max(0, current.fee + current.rateLoss - savingsNum),
        fee: feeNum,
        rateLoss: Math.max(0, current.fee + current.rateLoss - savingsNum - feeNum),
        isCurrent: false,
      }
    }),
  ]

  const maxCost = Math.max(...items.map(i => i.totalCost))

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-3">
      <h3 className="text-[11px] text-gray-500 uppercase tracking-wider">Total Cost Comparison</h3>
      <div className="text-[10px] text-gray-600 mb-2">Fee + rate markup loss on ${amount} transfer</div>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={`w-24 text-xs truncate shrink-0 ${item.isCurrent ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
              {item.name}
            </span>
            <div className="flex-1 h-6 bg-white/[0.02] rounded overflow-hidden flex items-center">
              <div
                className={`h-full rounded transition-all duration-1000 flex items-center px-2 ${
                  item.isCurrent ? 'bg-red-500/30' : 'bg-emerald-500/20'
                }`}
                style={{ width: `${Math.max(8, (item.totalCost / maxCost) * 100)}%` }}
                role="meter" aria-valuenow={item.totalCost} aria-valuemin={0} aria-valuemax={maxCost}
              >
                <span className={`text-[10px] font-mono font-bold whitespace-nowrap ${item.isCurrent ? 'text-red-300' : 'text-emerald-300'}`}>
                  ${item.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
            {!item.isCurrent && (
              <span className="text-emerald-400 text-[10px] font-bold shrink-0 w-14 text-right">
                -{((current.fee + current.rateLoss) - item.totalCost).toFixed(0)} saved
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tag ───
function Tag({ color, children }) {
  const colors = {
    red: 'bg-red-500/10 text-red-400 border-red-500/15',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15',
    gray: 'bg-white/[0.03] text-gray-400 border-white/[0.06]',
  }
  return <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded border ${colors[color]}`}>{children}</span>
}

export default App
