import React from 'react';

interface StudyModeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'EN' | 'HI' | 'MR';
}

export const StudyModeDrawer: React.FC<StudyModeDrawerProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const tenets = [
    {
      title: "Potential Divinity of the Soul",
      sanskrit: "प्रत्यगात्मन् (Pratyagatman)",
      body: "Each soul is potentially divine. The goal is to manifest this Divinity within by controlling nature, external and internal."
    },
    {
      title: "The Four Yogas",
      sanskrit: "कर्म, ज्ञान, भक्ति, राज योग",
      body: "Karma Yoga (Selfless Action), Jnana Yoga (Discrimination & Knowledge), Bhakti Yoga (Devotion), and Raja Yoga (Meditation). Synthesize all four for holistic human excellence."
    },
    {
      title: "Harmony of All Faiths",
      sanskrit: "रुचीनां वैचित्र्यादृजुकुटिलनानापथजुषाम्",
      body: "All religions are different paths leading to the same infinite ocean of truth. Mutual respect, not mere tolerance, is the bedrock of world peace."
    },
    {
      title: "Service to Humanity (Daridra Narayana)",
      sanskrit: "आत्मनो मोक्षार्थं जगद्धिताय च",
      body: "For one's own spiritual liberation and for the welfare of the world. Worship God in the living human beings around you."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF6EE] w-full max-w-md h-full shadow-2xl border-l border-[#e3bfb2] flex flex-col justify-between overflow-hidden">
        {/* Top */}
        <div className="p-5 bg-white border-b border-[#e5e2e1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#1b6d24] text-[24px]">spa</span>
            <div>
              <div className="text-[10px] font-sans uppercase font-bold text-[#1b6d24] tracking-wider">
                Reflective Contemplation
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1b1b1c]">
                Study Mode &amp; Core Tenets
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6f3f2] hover:bg-[#f0eded] text-[#5a4138] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4 flex-1">
          <div className="p-4 rounded-xl bg-[#ffdbcf]/30 border border-[#a43700]/30 text-xs font-serif italic text-[#1b1b1c] leading-relaxed">
            “You have to grow from the inside out. None can teach you, none can make you spiritual. There is no other teacher but your own soul.”
          </div>

          <div className="text-xs font-sans font-bold uppercase text-[#8f7066] tracking-wider">
            Canonical Foundations
          </div>

          {tenets.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-[#e3bfb2]/70 shadow-xs flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-bold text-[#1b1b1c]">{t.title}</span>
                <span className="text-[11px] font-serif text-[#a43700] italic">{t.sanskrit}</span>
              </div>
              <p className="font-sans text-xs text-[#5a4138] leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#e5e2e1] flex justify-between items-center">
          <span className="text-[11px] font-sans text-[#5a4138]">Mindful Study Deck</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-bold font-sans transition-colors cursor-pointer"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
