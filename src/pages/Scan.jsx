import { Link, useNavigate } from 'react-router-dom';
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
