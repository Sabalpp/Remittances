import { Link } from 'react-router-dom';

export default function Recommendation() {
  return (
    <main className="max-w-xl mx-auto px-6 pt-12 pb-32">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-secondary/10 rounded-full blur-2xl transform scale-150"></div>
          <div className="relative bg-secondary-container p-6 rounded-3xl shadow-[0_10px_30px_rgba(10,108,68,0.15)]">
            <span className="material-symbols-outlined text-secondary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>
        </div>
        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-primary mb-3">Your Safe Choice</h2>
        <p className="text-on-surface-variant text-lg max-w-sm">We've identified a secure path to save your hard-earned money from hidden fees.</p>
      </div>

      <section className="bg-surface-container-lowest rounded-[2rem] p-8 mb-8 shadow-[0_20px_40px_rgba(0,32,69,0.06)] relative overflow-hidden border border-white/50">
        <div className="absolute top-0 right-0 p-4">
          <span className="bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-3 py-1 rounded-full tracking-wide">RECOMMENDED</span>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-3xl">account_balance</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-headline text-primary">Wise</h3>
            <p className="text-secondary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Verified Rate
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div className="flex justify-between items-end">
            <span className="text-on-surface-variant">Transfer Fee</span>
            <span className="text-xl font-bold text-primary font-headline">$4.50</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-on-surface-variant">Exchange Rate</span>
            <div className="text-right">
              <span className="text-sm block text-on-surface-variant line-through">1 USD = 0.91 EUR</span>
              <span className="text-xl font-bold text-primary font-headline">1 USD = 0.93 EUR</span>
            </div>
          </div>
          <div className="bg-secondary-container/30 rounded-2xl p-6 border border-secondary-container">
            <div className="flex items-center justify-between">
              <span className="text-on-secondary-container font-medium">Total Savings Today</span>
              <span className="text-3xl font-extrabold text-on-secondary-container font-headline">$19.42</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-primary py-5 rounded-2xl text-on-primary font-bold text-lg shadow-lg hover:bg-primary-container transition-all active:scale-95 animate-pulse-slow">
          Send with Wise
        </button>
      </section>

      <div className="grid grid-cols-1 gap-4 mb-12">
        <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest px-2 mb-2">Why it's safe</h4>
        <div className="bg-surface-container-low rounded-2xl p-5 flex items-center gap-4 group hover:bg-surface-container transition-colors">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <div>
            <p className="font-bold text-primary font-headline">Guaranteed rate</p>
            <p className="text-sm text-on-surface-variant">The rate you see is the rate you get.</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 flex items-center gap-4 group hover:bg-surface-container transition-colors">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
            <span className="material-symbols-outlined">visibility</span>
          </div>
          <div>
            <p className="font-bold text-primary font-headline">Transparent fees</p>
            <p className="text-sm text-on-surface-variant">No hidden margin in the exchange rate.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
