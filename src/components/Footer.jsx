export default function Footer() {
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
