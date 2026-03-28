import { Link } from 'react-router-dom';

export default function Report() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <section className="mb-16 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 bg-error/10 blur-3xl rounded-full"></div>
          <div className="relative bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(186,26,26,0.12)] border-2 border-error/20">
            <span className="material-symbols-outlined text-[84px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            <div className="absolute -top-2 -right-2 bg-error text-on-error rounded-full p-2 animate-bounce">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h2 className="font-headline text-display-md text-4xl font-extrabold text-on-surface mb-2 tracking-tight">Risk Report</h2>
          <p className="text-error font-bold text-2xl font-headline leading-tight">
            You are losing $23.92 on this transfer (4.78%)
          </p>
          <p className="text-on-surface-variant mt-4 max-w-xl">
            Our analysis detected predatory pricing hidden within the exchange rate. This transaction is classified as <span className="text-error font-bold">High Risk</span>.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-surface-container-lowest p-8 rounded-3xl border-b-4 border-slate-200">
          <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-4">The Fee You Saw</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-headline font-bold">$12.00</span>
            <span className="text-on-surface-variant pb-1">(Standard)</span>
          </div>
          <p className="text-sm text-on-surface-variant">This is the transparent service charge displayed on the main screen.</p>
        </div>
        
        <div className="bg-surface-container-lowest p-8 rounded-3xl border-b-4 border-error/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">visibility_off</span>
          </div>
          <p className="text-error font-label text-sm uppercase tracking-widest mb-4">The Fee They Hid</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-headline font-bold text-error">$11.92</span>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Exchange Rate Markup: <span className="line-through">134.2</span> vs 131.0</p>
          <div className="mt-4 p-3 bg-error-container rounded-lg">
            <p className="text-xs text-on-error-container font-semibold italic">"This is money they take without telling you."</p>
          </div>
        </div>
        
        <div className="bg-error-container/40 p-8 rounded-3xl border-2 border-error/10 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-error">gavel</span>
            <p className="text-error font-headline font-bold text-lg">Predatory Terms</p>
          </div>
          <h3 className="font-headline font-extrabold text-xl mb-2 text-on-error-container">'Rate may vary at delivery'</h3>
          <p className="text-on-surface leading-relaxed">
            They can change the price <span className="font-bold underline decoration-error">AFTER</span> you pay. If the market shifts, your family gets less, but the company keeps their profit.
          </p>
        </div>
      </div>

      <section className="bg-secondary-container/40 p-1 rounded-3xl overflow-hidden relative shadow-[0_20px_40px_rgba(10,108,68,0.08)]">
        <div className="bg-surface-container-lowest rounded-[1.4rem] p-10 md:p-14 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-1 rounded-full mb-6">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="text-secondary font-bold text-xs uppercase tracking-tighter">Recommended Safe Alternative</span>
              </div>
              <h2 className="font-headline text-3xl font-extrabold text-primary mb-4 leading-tight">Switch to RemitSafe Direct and save $19.45 instantly.</h2>
              <p className="text-on-surface-variant text-lg">We use the real mid-market exchange rate with zero markups. No hidden terms, no bait-and-switch pricing.</p>
              <div className="mt-8 space-y-4">
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-[85%] rounded-full"></div>
                </div>
                <p className="text-sm font-semibold text-secondary">85% of users switched to this route today for better safety.</p>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <Link to="/recommendation" className="pulse-slow w-full md:w-auto px-10 py-5 bg-primary text-on-primary font-headline font-bold text-xl rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl inline-flex">
                <span>Secure My Transfer</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
