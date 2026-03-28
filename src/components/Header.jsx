import { Link } from 'react-router-dom';

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
