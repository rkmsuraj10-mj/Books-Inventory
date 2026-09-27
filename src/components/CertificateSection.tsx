import React from 'react';

interface CertificateSectionProps {
  studentName: string;
  onDownloadCertificate: () => void;
  onReviewSolutions: () => void;
}

export const CertificateSection: React.FC<CertificateSectionProps> = ({
  studentName,
  onDownloadCertificate,
  onReviewSolutions
}) => {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16" id="distinction-certificate">
      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center gap-1.5 text-[#a43700] font-sans text-xs uppercase font-bold tracking-wider">
          <span className="material-symbols-outlined text-[18px]">military_tech</span>
          <span>Honors &amp; Credentials</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#1b1b1c] font-bold">
          Academic Performance &amp; Certificate Readiness
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#5a4138] max-w-2xl leading-relaxed">
          Review your cumulative scorecard across completed assessments. High honors are conferred when maintaining greater than 85% aggregate across historical, philosophical, and textual disciplines.
        </p>
      </div>

      {/* Dual Layout: Scorecard & Certificate Graphic Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Performance Scorecard (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#e5e2e1] flex flex-col gap-6">
          <div className="flex items-center justify-between border-b pb-4 border-[#e5e2e1]">
            <div>
              <span className="font-sans text-[11px] uppercase text-[#8f7066] font-bold tracking-wider">
                Module Certification Status
              </span>
              <div className="font-serif text-lg sm:text-xl text-[#1b1b1c] font-bold">
                Passed with Distinction
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#a0f399]/40 text-[#1b6d24] flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>
          </div>

          {/* Prominent Score Badge */}
          <div className="bg-[#f6f3f2] p-5 rounded-xl flex items-center justify-between border border-[#e5e2e1]">
            <div>
              <div className="font-sans text-[11px] uppercase text-[#5a4138] font-bold tracking-wider">
                Aggregate Assessment
              </div>
              <div className="font-serif text-3xl sm:text-4xl text-[#a43700] font-bold">
                18<span className="text-lg text-[#5a4138] font-normal font-sans">/20</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-[#a0f399]/40 text-[#1b6d24] font-sans text-xs font-bold border border-[#1b6d24]/20">
                90% • Distinction
              </span>
              <div className="font-sans text-xs text-[#5a4138] mt-1">Passing mark: 70%</div>
            </div>
          </div>

          {/* Performance Breakdown by Topic (Skill Bars) */}
          <div className="flex flex-col gap-4 pt-1">
            <div className="font-sans text-sm text-[#1b1b1c] font-bold uppercase tracking-wider">
              Performance Breakdown by Topic
            </div>

            {/* Chronology & Dates: 100% */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-[#1b1b1c] font-semibold">Chronology &amp; Historical Milestones</span>
                <span className="font-bold text-[#1b6d24]">100%</span>
              </div>
              <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1b6d24] h-full rounded-full transition-all duration-700" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Speeches & Quotes: 92% */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-[#1b1b1c] font-semibold">Speeches, Addresses &amp; Quotes</span>
                <span className="font-bold text-[#a43700]">92%</span>
              </div>
              <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
                <div className="bg-[#a43700] h-full rounded-full transition-all duration-700" style={{ width: '92%' }}></div>
              </div>
            </div>

            {/* Philosophical Concepts: 85% */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-[#1b1b1c] font-semibold">Philosophical Concepts (Vedanta &amp; Yoga)</span>
                <span className="font-bold text-[#984300]">85%</span>
              </div>
              <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
                <div className="bg-[#984300] h-full rounded-full transition-all duration-700" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={onDownloadCertificate}
              className="flex-1 py-3 px-4 rounded-xl bg-[#a43700] text-white font-sans text-xs sm:text-sm font-semibold hover:bg-[#cd4700] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download Certificate (PDF)</span>
            </button>
            <button 
              onClick={onReviewSolutions}
              className="py-3 px-4 rounded-xl bg-[#f0eded] text-[#1b1b1c] font-sans text-xs sm:text-sm font-semibold hover:bg-[#eae7e7] transition-colors flex items-center justify-center gap-2 border border-[#e5e2e1] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">rule</span>
              <span>Review Solutions</span>
            </button>
          </div>
        </div>

        {/* Verified Certificate Diplomatic Framed Preview (Right 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-[#e5e2e1]">
          {/* Certificate Canvas Container with Archival Gold and Warm Parchment Styling */}
          <div className="bg-[#FAF6EE] text-[#1b1b1c] p-6 sm:p-8 rounded-xl shadow-inner relative overflow-hidden flex flex-col justify-between min-h-[460px] border border-[#e3bfb2]">
            {/* Subtle Traditional Fillet / Corners */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#984300] pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#984300] pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#984300] pointer-events-none"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#984300] pointer-events-none"></div>

            {/* Certificate Header */}
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#ffdbcf] text-[#a43700] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[28px]">account_balance</span>
              </div>
              <div className="font-sans text-[11px] uppercase tracking-widest text-[#a43700] font-bold">
                Swami Vivekananda Studies • Academic Board
              </div>
              <div className="font-serif text-xl sm:text-2xl text-[#1b1b1c] font-bold">
                Certificate of Academic Distinction
              </div>
              <div className="w-32 h-0.5 bg-[#984300] my-1"></div>
              <p className="font-sans text-xs text-[#5a4138] italic">
                This is to formally certify that
              </p>
            </div>

            {/* Scholar Name & Module */}
            <div className="text-center my-4 flex flex-col gap-2">
              <div className="font-serif text-2xl sm:text-3xl text-[#1b1b1c] font-bold tracking-normal">
                {studentName}
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#5a4138] max-w-md mx-auto leading-relaxed">
                has satisfactorily completed the exhaustive canonical assessment for{' '}
                <strong className="text-[#1b1b1c] font-semibold">
                  “Life and Teachings of Swami Vivekananda: Historical &amp; Philosophical Compendium”
                </strong>{' '}
                with an aggregated evaluation of <span className="text-[#a43700] font-bold">90%</span>.
              </p>
            </div>

            {/* Bottom Row: Seals & Signatures */}
            <div className="pt-6 mt-2 border-t border-[#e3bfb2]/60 flex items-end justify-between gap-2">
              {/* Signature 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="font-serif italic text-sm sm:text-base text-[#1b1b1c] font-medium">
                  Swami Shuddhidananda
                </div>
                <div className="w-24 sm:w-28 h-px bg-[#8f7066] mt-1 mb-1"></div>
                <div className="font-sans text-[10px] sm:text-[11px] text-[#5a4138] uppercase font-semibold">
                  Academic Chairperson
                </div>
              </div>

              {/* Metallic Gold Seal Emblem */}
              <div className="flex flex-col items-center">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#FAF6EE] flex flex-col items-center justify-center text-[#984300]">
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px]">verified</span>
                    <span className="text-[7px] sm:text-[8px] font-bold tracking-widest uppercase">HONORS</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#8f7066] mt-1">ID: SV-1893-9021</span>
              </div>

              {/* Signature 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="font-serif italic text-sm sm:text-base text-[#1b1b1c] font-medium">
                  Dr. M. Radhakrishnan
                </div>
                <div className="w-24 sm:w-28 h-px bg-[#8f7066] mt-1 mb-1"></div>
                <div className="font-sans text-[10px] sm:text-[11px] text-[#5a4138] uppercase font-semibold">
                  Director of Examination
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-sans text-[#5a4138] px-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#1b6d24] text-[16px]">lock</span>
              <span>Cryptographically tamper-proof PDF</span>
            </span>
            <span className="font-sans text-[11px] text-[#8f7066]">Accredited Engine 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};
