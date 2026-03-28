import { useState } from 'react'

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

function App() {
  const [form, setForm] = useState({
    amount: '500',
    currency: 'NPR',
    service: 'Western Union',
    offeredRate: '',
    fee: '',
    terms: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)

  const selectedCountry = COUNTRIES.find(c => c.code === form.currency)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    setShowTranslation(false)
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
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const riskColor = (score) => {
    if (score <= 3) return 'bg-green-500'
    if (score <= 6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const riskBorder = (score) => {
    if (score <= 3) return 'border-green-500'
    if (score <= 6) return 'border-yellow-500'
    return 'border-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl font-bold text-gray-950">R</div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">RemitSafe</h1>
            <p className="text-xs text-gray-400">Protecting your family's money</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-sm text-gray-400">I'm sending</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input type="number" value={form.amount} onChange={update('amount')} required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition" />
              </div>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm text-gray-400">To</span>
              <select value={form.currency} onChange={update('currency')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition appearance-none">
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm text-gray-400">Service</span>
            <select value={form.service} onChange={update('service')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition appearance-none">
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-sm text-gray-400">They offered (1 USD = ? {form.currency})</span>
              <input type="number" step="any" value={form.offeredRate} onChange={update('offeredRate')} required placeholder="e.g. 131"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm text-gray-400">Fee charged</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input type="number" step="any" value={form.fee} onChange={update('fee')} required placeholder="e.g. 12"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition" />
              </div>
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm text-gray-400">Paste terms & conditions <span className="text-gray-600">(optional)</span></span>
            <textarea value={form.terms} onChange={update('terms')} rows={3} placeholder="Paste any fine print or terms here..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition resize-none" />
          </label>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 font-bold text-lg hover:from-emerald-400 hover:to-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Scanning transfer...
              </span>
            ) : 'Scan This Transfer'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className={`mt-6 bg-gray-900 rounded-2xl border-2 ${riskBorder(result.riskScore)} overflow-hidden`}>
            {/* Risk Header */}
            <div className={`px-6 py-4 ${result.riskScore > 6 ? 'bg-red-900/30' : result.riskScore > 3 ? 'bg-yellow-900/30' : 'bg-green-900/30'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{result.riskScore > 6 ? '⚠️' : result.riskScore > 3 ? '⚡' : '✅'}</span>
                  <div>
                    <div className="text-sm text-gray-400">Risk Score</div>
                    <div className="text-3xl font-bold text-white">{result.riskScore} <span className="text-lg text-gray-400">/ 10</span></div>
                  </div>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${riskColor(result.riskScore)}`}>
                  <span className="text-2xl font-bold text-white">{result.riskScore}</span>
                </div>
              </div>
              <p className="mt-3 text-lg text-white font-medium">{result.summary}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Rate Analysis */}
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Exchange Rate</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Offered</div>
                    <div className="text-xl font-mono text-white">{result.rateAnalysis.offeredRate} <span className="text-sm text-gray-400">{form.currency}/USD</span></div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Real Market Rate</div>
                    <div className="text-xl font-mono text-emerald-400">{result.rateAnalysis.realRate} <span className="text-sm text-gray-400">{form.currency}/USD</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <span className="font-bold">{result.rateAnalysis.markupPercent}% hidden markup</span>
                  <span className="text-gray-600">|</span>
                  <span>You lose <span className="font-bold">${result.rateAnalysis.moneyLost}</span> on the rate</span>
                </div>
              </div>

              {/* Fee Analysis */}
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Transfer Fee</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-mono text-white">${result.feeAnalysis.feeCharged}</span>
                    <span className="text-sm text-gray-400 ml-2">({result.feeAnalysis.feePercent}% of transfer)</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    result.feeAnalysis.verdict === 'fair' ? 'bg-green-900/50 text-green-400' :
                    result.feeAnalysis.verdict === 'high' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>{result.feeAnalysis.verdict}</span>
                </div>
                <div className="text-sm text-gray-400">Industry average for {result.country}: {result.feeAnalysis.industryAverage}</div>
              </div>

              {/* Terms Red Flags */}
              {result.termsRedFlags && result.termsRedFlags.length > 0 && (
                <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Terms Red Flags</h3>
                  <ul className="space-y-1.5">
                    {result.termsRedFlags.map((flag, i) => (
                      <li key={i} className="flex gap-2 text-sm text-yellow-300">
                        <span className="shrink-0">🚩</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Scam Patterns */}
              {result.scamPatterns && result.scamPatterns.length > 0 && (
                <div className="bg-red-900/20 rounded-xl p-4 space-y-2 border border-red-800/50">
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Scam Pattern Alerts</h3>
                  <ul className="space-y-1.5">
                    {result.scamPatterns.map((pattern, i) => (
                      <li key={i} className="flex gap-2 text-sm text-red-300">
                        <span className="shrink-0">🚨</span>
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cheaper Alternatives */}
              {result.alternatives && result.alternatives.length > 0 && (
                <div className="bg-emerald-900/20 rounded-xl p-4 space-y-3 border border-emerald-800/50">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Cheaper Options</h3>
                  {result.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                      <div>
                        <div className="font-medium text-white">{alt.service}</div>
                        <div className="text-xs text-gray-400">{alt.fee} fee &middot; {alt.rateInfo}</div>
                      </div>
                      <div className="text-emerald-400 font-bold text-sm">Save {alt.estimatedSavings}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Translation Toggle */}
              {result.alertInLanguage && (
                <button onClick={() => setShowTranslation(!showTranslation)}
                  className="w-full py-3 rounded-xl bg-gray-800 border border-gray-700 text-white font-medium hover:bg-gray-750 transition flex items-center justify-center gap-2">
                  <span>{selectedCountry?.flag}</span>
                  <span>{showTranslation ? 'Hide' : 'View in'} {result.language}</span>
                </button>
              )}
              {showTranslation && (
                <div className="bg-gray-800/50 rounded-xl p-4 text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {result.alertInLanguage}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-600">
        Built with Amazon Bedrock &middot; Protecting immigrant families worldwide
      </footer>
    </div>
  )
}

export default App
