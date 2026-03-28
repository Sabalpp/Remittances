import { Link } from 'react-router-dom';

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
