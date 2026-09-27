import React, { useState } from 'react';
import { LEADERBOARD_DATA } from '../data/curriculumData';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudentName: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentStudentName
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = LEADERBOARD_DATA.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.institution.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-[#1b1b1c] rounded-2xl w-full max-w-2xl shadow-2xl border border-[#e5e2e1] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#e5e2e1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#a0f399]/40 text-[#1b6d24] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">leaderboard</span>
            </div>
            <div>
              <div className="font-sans text-xs uppercase text-[#a43700] font-bold tracking-wider">
                Scholarly Rankings
              </div>
              <h3 className="font-serif text-xl text-[#1b1b1c] font-bold">
                Academic Distinction Leaderboard
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

        {/* Search & Meta */}
        <div className="p-4 bg-[#f6f3f2] border-b border-[#e5e2e1] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-2.5 material-symbols-outlined text-[18px] text-[#8f7066]">
              search
            </span>
            <input
              type="text"
              placeholder="Search scholar or institution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-[#e5e2e1] text-xs font-sans text-[#1b1b1c] outline-none focus:ring-2 focus:ring-[#a43700]"
            />
          </div>
          <div className="text-xs font-sans text-[#5a4138]">
            Benchmarked across 42 accredited institutions
          </div>
        </div>

        {/* Table List */}
        <div className="p-4 overflow-y-auto max-h-[420px] flex flex-col gap-2">
          {filtered.map((scholar) => {
            const isSelf = scholar.name.toLowerCase() === currentStudentName.toLowerCase();

            return (
              <div
                key={scholar.rank}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isSelf
                    ? 'bg-[#ffdbcf]/30 border-[#a43700] ring-1 ring-[#a43700]'
                    : 'bg-white border-[#e5e2e1] hover:bg-[#f6f3f2]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-bold shrink-0 ${
                      scholar.rank === 1
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : scholar.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : scholar.rank === 3
                        ? 'bg-amber-600/30 text-amber-900'
                        : 'bg-[#f0eded] text-[#5a4138]'
                    }`}
                  >
                    {scholar.rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-bold text-[#1b1b1c]">
                        {scholar.name}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] font-sans font-bold bg-[#a43700] text-white px-2 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-sans text-[#5a4138]">{scholar.institution}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-serif text-base font-bold text-[#a43700]">
                    {scholar.score}%
                  </div>
                  <div className="text-[11px] font-sans text-[#1b6d24] font-semibold">
                    {scholar.badge}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f6f3f2] border-t border-[#e5e2e1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-bold font-sans transition-colors cursor-pointer"
          >
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
