import React, { useState } from 'react';

interface FooterProps {
  onOpenCanonicalLink: (id: string) => void;
  onOpenCharter: (title: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCanonicalLink, onOpenCharter }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="w-full bg-[#f6f3f2] mt-12 border-t border-[#e5e2e1]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#e5e2e1]">
          {/* Col 1 */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl text-[#a43700] font-bold">Swami Vivekananda</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#5a4138] max-w-md leading-relaxed">
              Academic repository and certification initiative dedicated to the systematic study of Swami Vivekananda's Complete Works, Vedantic philosophy, and practical ethics for modern humanity.
            </p>
            <div className="flex flex-col gap-1 pt-1">
              <span className="font-sans text-[11px] uppercase tracking-wider text-[#8f7066] font-bold">
                Academic Reference
              </span>
              <p className="font-sans text-xs text-[#5a4138]">
                In alignment with canonical texts published by Advaita Ashrama and Ramakrishna-Vivekananda Center archives.
              </p>
            </div>
          </div>

          {/* Col 2: Canonical Archives */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-sans text-sm font-bold text-[#1b1b1c] uppercase tracking-wider">
              Canonical Archives
            </h4>
            <ul className="flex flex-col gap-2.5 font-sans text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenCanonicalLink('chicago-1893-opening')}
                  className="flex items-center gap-2 text-[#5a4138] hover:text-[#a43700] transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#a43700]">menu_book</span>
                  <span>Chicago 1893 Addresses</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCanonicalLink('raja-yoga-intro')}
                  className="flex items-center gap-2 text-[#5a4138] hover:text-[#a43700] transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#a43700]">auto_stories</span>
                  <span>Raja Yoga &amp; Jnana Yoga</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCanonicalLink('chicago-1893-paper-hinduism')}
                  className="flex items-center gap-2 text-[#5a4138] hover:text-[#a43700] transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#a43700]">account_balance</span>
                  <span>Vivekananda Rock Memorial Archives</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCanonicalLink('practical-vedanta')}
                  className="flex items-center gap-2 text-[#5a4138] hover:text-[#a43700] transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#a43700]">history_edu</span>
                  <span>Complete Works Compendium</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Daily Thoughts & Dispatch */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="font-sans text-sm font-bold text-[#1b1b1c] uppercase tracking-wider">
              Daily Thoughts &amp; Dispatch
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#5a4138] leading-relaxed">
              Subscribe for morning reflection aphorisms, module release announcements, and examination dates.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#a0f399]/40 border border-[#1b6d24]/30 rounded-lg text-xs font-semibold text-[#1b6d24] flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
                <span>Thank you! You are subscribed to the Academic Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your academic email"
                  required
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-white text-[#1b1b1c] font-sans text-xs outline-none focus:ring-2 focus:ring-[#a43700] border border-[#e5e2e1] shadow-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white font-sans text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Policies */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-[#5a4138] text-center sm:text-left">
            © 2025 Swami Vivekananda Educational &amp; Cultural Studies Initiative. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-sans text-xs text-[#5a4138]">
            <button
              onClick={() => onOpenCharter('Academic Integrity Charter')}
              className="hover:text-[#a43700] transition-colors cursor-pointer"
            >
              Academic Integrity Charter
            </button>
            <button
              onClick={() => onOpenCharter('Terms of Certification')}
              className="hover:text-[#a43700] transition-colors cursor-pointer"
            >
              Terms of Certification
            </button>
            <button
              onClick={() => onOpenCharter('Digital Preservation Policy')}
              className="hover:text-[#a43700] transition-colors cursor-pointer"
            >
              Digital Preservation Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
