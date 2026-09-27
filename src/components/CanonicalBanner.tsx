import React from 'react';

interface CanonicalBannerProps {
  onOpenReader: () => void;
}

export const CanonicalBanner: React.FC<CanonicalBannerProps> = ({ onOpenReader }) => {
  return (
    <section className="w-full bg-[#f0eded] py-8 border-t border-b border-[#e5e2e1]" id="canonical-archive">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white text-[#a43700] flex items-center justify-center shadow-xs shrink-0 border border-[#e5e2e1]">
            <span className="material-symbols-outlined text-[28px]">library_books</span>
          </div>
          <div>
            <div className="font-serif text-lg text-[#1b1b1c] font-bold">
              Complete Works Reference Available
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#5a4138]">
              Access primary cross-references and audio recordings for each assessment question in the digital library.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReader}
          className="px-5 py-2.5 rounded-lg bg-white hover:bg-[#eae7e7] text-[#1b1b1c] font-sans text-xs sm:text-sm font-semibold transition-colors shadow-xs shrink-0 flex items-center gap-1.5 border border-[#e5e2e1] cursor-pointer"
        >
          <span>Open Canonical Reader</span>
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </button>
      </div>
    </section>
  );
};
