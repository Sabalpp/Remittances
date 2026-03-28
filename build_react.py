import os

components_dir = "src/components"
pages_dir = "src/pages"

os.makedirs(components_dir, exist_ok=True)
os.makedirs(pages_dir, exist_ok=True)

header_code = """import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-surface-container-highest">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            <span className="text-xl font-extrabold text-primary tracking-tight font-headline">RemitSafe</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/scan" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">How it Works</Link>
            <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Supported Corridors</a>
            <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">About</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-slate-500 font-medium text-sm">
            <span className="material-symbols-outlined text-lg">language</span>
            English
          </div>
          <Link to="/scan" className="bg-primary text-on-primary px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-sm">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
"""

bottom_nav_code = """import { Link } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white z-50 rounded-t-3xl border-t border-surface-container shadow-[0_-10px_40px_rgba(0,32,69,0.08)]">
      <Link to="/" className="flex flex-col items-center justify-center text-primary px-6 py-2">
        <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
        <span className="font-manrope font-bold text-[10px] uppercase">Home</span>
      </Link>
      <Link to="/scan" className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2">
        <span className="material-symbols-outlined mb-1">account_balance_wallet</span>
        <span className="font-manrope font-bold text-[10px] uppercase">History</span>
      </Link>
      <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2">
        <span className="material-symbols-outlined mb-1">contact_support</span>
        <span className="font-manrope font-bold text-[10px] uppercase">Support</span>
      </a>
    </nav>
  );
}
"""

footer_code = """export default function Footer() {
  return (
    <footer className="w-full py-16 border-t border-surface-container-highest bg-white hidden md:block">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-left">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            <span className="text-lg font-extrabold text-primary tracking-tight font-headline">RemitSafe</span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">Protecting your hard-earned money and ensuring it reaches the ones you love, safely and quickly.</p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-headline font-bold text-primary mb-2">Company</p>
          <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">How it works</a>
          <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">About Us</a>
          <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Careers</a>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-headline font-bold text-primary mb-2">Legal</p>
          <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Licenses</a>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-headline font-bold text-primary mb-2">Support</p>
          <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Help Center</a>
          <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Support</a>
          <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Status</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-surface-container-low flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 text-xs">© 2024 RemitSafe Financial. All rights reserved.</p>
        <p className="text-slate-400 text-[10px] uppercase tracking-widest max-w-lg md:text-right">RemitSafe Financial is a licensed Money Services Business (MSB). Regulated by central banks in supported regions for your peace of mind.</p>
      </div>
    </footer>
  );
}
"""

landing_code = """import { Link } from 'react-router-dom';

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
"""

scan_code = """import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Scan() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleScan = () => {
    navigate('/report');
  };

  return (
    <main className="flex-grow max-w-2xl mx-auto w-full px-6 py-12 pb-32">
      <section className="mb-12">
        <h2 className="text-4xl font-extrabold font-headline text-primary tracking-tight leading-tight mb-4">
          Scan your transaction
        </h2>
        <p className="text-lg text-on-surface-variant font-medium">
          Let's make sure you're getting the best deal today.
        </p>
      </section>

      <div className="space-y-8">
        <div className="bg-surface-container-low p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0 bg-primary-container p-6 asymmetric-shape shadow-lg">
            <span className="material-symbols-outlined text-on-primary text-4xl">add_a_photo</span>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl font-bold font-headline text-primary mb-2">Upload Screenshot</h3>
            <p className="text-sm text-on-surface-variant mb-4">Pick a screenshot from your gallery. We'll read the numbers for you.</p>
            <button onClick={handleScan} className="bg-primary text-on-primary font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 w-full md:w-auto">
              <span className="material-symbols-outlined text-sm">upload_file</span>
              Upload Screenshot
            </button>
          </div>
        </div>

        <div className="bg-surface-container p-8 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary">edit_note</span>
            <h3 className="text-xl font-bold font-headline text-primary">Paste Transaction Details</h3>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface placeholder:text-outline/50 min-h-[160px] resize-none font-body" 
              placeholder="e.g., 'I'm sending $500 to Nepal, Western Union offered me 131 NPR/USD, $12 fee'"></textarea>
          </div>
          <div className="mt-6 flex gap-4 items-start p-4 bg-secondary-container rounded-xl">
            <span className="material-symbols-outlined text-on-secondary-container mt-0.5">lightbulb</span>
            <p className="text-sm text-on-secondary-container font-medium leading-relaxed">
              Just copy what the other app says. We'll handle the math and find the hidden fees for you.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="text-xs font-bold text-on-surface-variant tracking-wide uppercase">Privacy Guarantee: We don't save your personal data. Only the math.</span>
          </div>
        </div>

        <div className="pt-4">
          <button onClick={handleScan} className="w-full bg-primary py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,32,69,0.12)] hover:shadow-xl transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            <span className="text-on-primary font-bold text-xl font-headline tracking-tight">Compare &amp; Shield</span>
          </button>
        </div>
      </div>
    </main>
  );
}
"""

report_code = """import { Link } from 'react-router-dom';

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
"""

recommendation_code = """import { Link } from 'react-router-dom';

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
"""

app_code = """import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Landing from './pages/Landing';
import Scan from './pages/Scan';
import Report from './pages/Report';
import Recommendation from './pages/Recommendation';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-surface font-body text-on-surface">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/report" element={<Report />} />
            <Route path="/recommendation" element={<Recommendation />} />
          </Routes>
        </div>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
}
"""

with open(f"{components_dir}/Header.jsx", 'w', encoding='utf-8') as f:
    f.write(header_code)
with open(f"{components_dir}/BottomNav.jsx", 'w', encoding='utf-8') as f:
    f.write(bottom_nav_code)
with open(f"{components_dir}/Footer.jsx", 'w', encoding='utf-8') as f:
    f.write(footer_code)

with open(f"{pages_dir}/Landing.jsx", 'w', encoding='utf-8') as f:
    f.write(landing_code)
with open(f"{pages_dir}/Scan.jsx", 'w', encoding='utf-8') as f:
    f.write(scan_code)
with open(f"{pages_dir}/Report.jsx", 'w', encoding='utf-8') as f:
    f.write(report_code)
with open(f"{pages_dir}/Recommendation.jsx", 'w', encoding='utf-8') as f:
    f.write(recommendation_code)

with open("src/App.jsx", 'w', encoding='utf-8') as f:
    f.write(app_code)

print("Scaffolded all files successfully.")
