import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="pt-2">
      <section className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-6">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            First AI-Powered Remittance
          </div>
          <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-primary leading-tight mb-6">
            The Financial <span className="text-secondary">Shield</span> for Your Family.
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-lg leading-relaxed mb-10">
            Every bank has an AI protecting them. We're building the first AI that protects you and your hard-earned money during every transfer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/scan" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center">Send Money Now</Link>
            <button className="bg-white border-2 border-primary/10 text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-low transition-colors">See Our Rates</button>
          </div>
          
          <div className="bg-surface-container rounded-2xl p-6 flex gap-4 items-center max-w-md border border-outline-variant/30">
            <div className="bg-on-secondary-container/10 p-3 rounded-full shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
            <div>
              <p className="font-headline font-bold text-primary">The RemitSafe Promise</p>
              <p className="text-sm text-on-surface-variant">Simple, honest transfers for your family back home. No hidden math.</p>
            </div>
          </div>
        </div>
        
        <div className="order-1 lg:order-2 relative">
          <div className="w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative">
            <img alt="Modern architecture glass reflections" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"/>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
          </div>
          
          <div className="absolute -bottom-8 -left-8 bg-glass p-6 rounded-2xl text-white max-w-[280px] shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#9ff5c1]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Guardian AI Active</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">Scanning 42 data points to ensure your recipient is verified and secure.</p>
          </div>
          
          <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-surface-container-highest hidden md:block">
            <p className="text-primary font-headline font-extrabold text-3xl">$0.00</p>
            <p className="text-on-surface-variant text-xs font-bold uppercase">Hidden Fees</p>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-24 border-y border-surface-container-highest">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-xl">
              <h2 className="font-headline text-4xl text-primary font-extrabold mb-4">Support in your language</h2>
              <p className="text-on-surface-variant text-lg">We believe clear communication is the foundation of trust. Choose your preferred language for a personalized experience.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['EN', 'NP', 'IN', 'AR'].map((lang, idx) => {
              const info = [
                { title: 'English', desc: 'International Standard' },
                { title: 'नेपाली', desc: 'Nepal Region' },
                { title: 'हिन्दी', desc: 'India Region' },
                { title: 'العربية', desc: 'MENA Region' }
              ][idx];
              return (
                <button key={lang} className="group flex flex-col justify-between p-10 bg-surface-container-lowest rounded-3xl text-left border-2 border-transparent hover:border-primary hover:shadow-xl transition-all duration-300">
                  <span className="text-slate-400 text-xs font-black mb-10 uppercase tracking-widest">{lang}</span>
                  <div>
                    <p className="text-2xl font-headline font-extrabold text-primary mb-1">{info.title}</p>
                    <p className="text-on-surface-variant text-sm">{info.desc}</p>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <span className="material-symbols-outlined text-primary translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">arrow_forward</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>
      
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-primary text-on-primary p-12 lg:p-16 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-headline text-4xl font-bold mb-6 max-w-md leading-tight">No hidden math. <br/>Just more money home.</h3>
              <p className="text-white/70 text-lg mb-10 max-w-md">We use plain talk to explain fees, exchange rates, and delivery times. You'll never have to guess again.</p>
              <button className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-full font-bold inline-flex items-center gap-3 hover:bg-secondary-container/90 transition-all">
                Learn about our rates
                <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
              </button>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/10 transition-all duration-700"></div>
          </div>
          <div className="bg-surface-container p-12 rounded-[2.5rem] flex flex-col items-center text-center justify-center border border-surface-container-highest">
            <div className="bg-primary p-5 rounded-2xl mb-8 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-4xl text-white">support_agent</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-primary mb-4">24/7 Human Help</h3>
            <p className="text-on-surface-variant leading-relaxed">Talk to a real person in your language, any time of day or night. We're here for you.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
