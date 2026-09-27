import React, { useState } from 'react';
import { CANONICAL_READINGS, CanonicalReading } from '../data/canonicalReadings';

interface CanonicalReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReadingId?: string;
}

export const CanonicalReaderModal: React.FC<CanonicalReaderModalProps> = ({
  isOpen,
  onClose,
  initialReadingId
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialReadingId || CANONICAL_READINGS[0].id
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const currentReading =
    CANONICAL_READINGS.find((r) => r.id === selectedId) || CANONICAL_READINGS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF6EE] text-[#1b1b1c] rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-[#e3bfb2] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#e5e2e1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ffdbcf] text-[#a43700] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <div>
              <div className="font-sans text-xs uppercase text-[#a43700] font-bold tracking-wider">
                Canonical Digital Library
              </div>
              <h3 className="font-serif text-xl text-[#1b1b1c] font-bold">
                Complete Works of Swami Vivekananda
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f6f3f2] hover:bg-[#f0eded] text-[#5a4138] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body with Left Reading List & Right Reader */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Selection Sidebar */}
          <div className="w-full md:w-72 bg-white border-r border-[#e5e2e1] p-3 overflow-y-auto flex flex-col gap-2 shrink-0 max-h-48 md:max-h-none">
            <div className="text-[11px] font-sans font-bold text-[#8f7066] uppercase px-2 py-1">
              Select Canonical Treatise
            </div>
            {CANONICAL_READINGS.map((reading) => (
              <button
                key={reading.id}
                onClick={() => {
                  setSelectedId(reading.id);
                  setIsPlayingAudio(false);
                }}
                className={`p-3 rounded-xl text-left transition-all flex flex-col gap-1 cursor-pointer ${
                  selectedId === reading.id
                    ? 'bg-[#ffdbcf]/30 border-l-4 border-[#a43700] text-[#1b1b1c] shadow-xs'
                    : 'hover:bg-[#f6f3f2] text-[#5a4138]'
                }`}
              >
                <span className="font-serif text-xs font-bold text-[#1b1b1c] line-clamp-1">
                  {reading.title}
                </span>
                <span className="font-sans text-[11px] text-[#8f7066]">
                  {reading.volume} • {reading.dateOrEpoch}
                </span>
              </button>
            ))}
          </div>

          {/* Right Reader Canvas */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#FAF6EE]">
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
              {/* Meta bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e3bfb2]/70 pb-3">
                <span className="font-sans text-xs text-[#a43700] font-bold uppercase tracking-wider">
                  {currentReading.volume}
                </span>
                <div className="flex items-center gap-2">
                  {currentReading.audioDuration && (
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className={`px-3 py-1 rounded-full text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-[#1b6d24] text-white'
                          : 'bg-white text-[#5a4138] border border-[#e5e2e1] hover:bg-[#f0eded]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isPlayingAudio ? 'volume_up' : 'headphones'}
                      </span>
                      <span>{isPlayingAudio ? 'Audio Playing' : `Listen (${currentReading.audioDuration})`}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1b1b1c] font-bold leading-tight">
                  {currentReading.title}
                </h2>
                <div className="font-serif italic text-sm text-[#5a4138] mt-1">
                  {currentReading.subtitle} • {currentReading.dateOrEpoch}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {currentReading.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-white text-[#5a4138] border border-[#e3bfb2]/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Text Excerpt */}
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#e3bfb2]/60 mt-2">
                <div className="font-serif text-base sm:text-lg text-[#1b1b1c] leading-[1.8] whitespace-pre-line">
                  {currentReading.excerpt}
                </div>
              </div>

              <div className="p-3 bg-[#ffdbcf]/25 rounded-lg border border-[#a43700]/20 text-xs font-sans text-[#5a4138]">
                <strong>Canonical Authority:</strong> Authenticated against the 9-volume Centenary Edition published by Advaita Ashrama, Mayavati, Himalayas.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#e5e2e1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-bold font-sans transition-colors cursor-pointer"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
