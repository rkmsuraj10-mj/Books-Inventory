import React, { useState } from 'react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  onUpdateName: (name: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  initialName,
  onUpdateName
}) => {
  const [scholarName, setScholarName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://vedanta-cert.edu/verify/SV-1893-9021?scholar=${encodeURIComponent(scholarName)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateName(scholarName);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-[#1b1b1c] rounded-2xl w-full max-w-3xl shadow-2xl border border-[#e5e2e1] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#e5e2e1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#a43700] text-[24px]">workspace_premium</span>
            <h3 className="font-serif text-lg sm:text-xl text-[#1b1b1c] font-bold">
              Official Academic Distinction Certificate
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6f3f2] hover:bg-[#f0eded] text-[#5a4138] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Certificate Display Container */}
        <div className="p-4 sm:p-8 bg-[#f6f3f2] overflow-y-auto">
          {/* Controls Bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#e5e2e1]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans text-[#5a4138]">Recipient Scholar:</span>
              {isEditing ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={scholarName}
                    onChange={(e) => setScholarName(e.target.value)}
                    className="border border-[#a43700] rounded px-2 py-0.5 text-xs font-serif font-bold text-[#1b1b1c] outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2 py-0.5 rounded bg-[#a43700] text-white text-xs font-sans font-bold cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm font-bold text-[#1b1b1c]">{scholarName}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-sans text-[#a43700] hover:underline cursor-pointer"
                  >
                    (Edit Name)
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1 rounded-lg bg-[#f0eded] hover:bg-[#eae7e7] text-xs font-sans font-semibold text-[#1b1b1c] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied ? 'check' : 'link'}
                </span>
                <span>{copied ? 'URL Copied!' : 'Copy Verification Link'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-1 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Actual Framed Certificate View */}
          <div className="bg-[#FAF6EE] text-[#1b1b1c] p-6 sm:p-10 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[480px] border-4 border-[#e3bfb2]">
            {/* Double Border Fillet */}
            <div className="absolute inset-2 border border-[#984300]/40 pointer-events-none rounded"></div>
            {/* Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#984300] pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#984300] pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#984300] pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#984300] pointer-events-none"></div>

            {/* Header */}
            <div className="text-center flex flex-col items-center gap-2 relative z-10 pt-2">
              <div className="w-14 h-14 rounded-full bg-[#ffdbcf] text-[#a43700] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[32px]">account_balance</span>
              </div>
              <div className="font-sans text-[11px] sm:text-xs uppercase tracking-widest text-[#a43700] font-bold">
                Swami Vivekananda Studies • Academic Board
              </div>
              <div className="font-serif text-2xl sm:text-3xl text-[#1b1b1c] font-bold">
                Certificate of Academic Distinction
              </div>
              <div className="w-36 h-0.5 bg-[#984300] my-1"></div>
              <p className="font-sans text-xs text-[#5a4138] italic">
                This is to formally certify that
              </p>
            </div>

            {/* Scholar Name & Module */}
            <div className="text-center my-6 flex flex-col gap-2 relative z-10">
              <div className="font-serif text-3xl sm:text-4xl text-[#1b1b1c] font-bold tracking-tight">
                {scholarName}
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#5a4138] max-w-lg mx-auto leading-relaxed">
                has satisfactorily completed the exhaustive canonical assessment for{' '}
                <strong className="text-[#1b1b1c] font-semibold">
                  “Life and Teachings of Swami Vivekananda: Historical &amp; Philosophical Compendium”
                </strong>{' '}
                with an aggregated evaluation of <span className="text-[#a43700] font-bold">90%</span>.
              </p>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 mt-4 border-t border-[#e3bfb2]/70 flex items-end justify-between gap-4 relative z-10">
              {/* Signature 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="font-serif italic text-base sm:text-lg text-[#1b1b1c] font-medium">
                  Swami Shuddhidananda
                </div>
                <div className="w-28 sm:w-36 h-px bg-[#8f7066] mt-1 mb-1"></div>
                <div className="font-sans text-[10px] sm:text-[11px] text-[#5a4138] uppercase font-semibold">
                  Academic Chairperson
                </div>
              </div>

              {/* Metallic Gold Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#FAF6EE] flex flex-col items-center justify-center text-[#984300]">
                    <span className="material-symbols-outlined text-[24px] sm:text-[28px]">verified</span>
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase">HONORS</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#8f7066] mt-1">ID: SV-1893-9021</span>
              </div>

              {/* Signature 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="font-serif italic text-base sm:text-lg text-[#1b1b1c] font-medium">
                  Dr. M. Radhakrishnan
                </div>
                <div className="w-28 sm:w-36 h-px bg-[#8f7066] mt-1 mb-1"></div>
                <div className="font-sans text-[10px] sm:text-[11px] text-[#5a4138] uppercase font-semibold">
                  Director of Examination
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#e5e2e1] flex items-center justify-between">
          <span className="text-xs font-sans text-[#5a4138]">
            Valid across partner educational institutions &amp; archives
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-bold font-sans transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
