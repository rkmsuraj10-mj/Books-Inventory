import React, { useState } from 'react';

interface HeroSectionProps {
  onStartQuiz: () => void;
  onExploreCurriculum: () => void;
  onVerifyCertificate: () => void;
  currentLanguage: 'EN' | 'HI' | 'MR';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartQuiz,
  onExploreCurriculum,
  onVerifyCertificate,
  currentLanguage
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const quotesByLang = {
    EN: "“Arise, awake, and stop not till the goal is reached.”",
    HI: "“उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।”",
    MR: "“उठा, जागे व्हा आणि ध्येय साध्य होईपर्यंत थांबू नका.”"
  };

  const heroImageSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuAlwbSLDszM5G17bCw6bNlW3EEl-Q8JUDALui_6sjplGyzsLGeawq5NkXAlJSoSyvv0CRnCEM6FQ0dRnujZI1O4RAuIdlEMn74gQ-KIc6PFdfCbOA_O0hrU4DhmC9XUJdhxM12R7w3c-gj-cZBDvd1_aXz-7j-rSy5KYLtTpQ43r6RM4mFkoaCS_s5vJ4JgxlODYfqnVD2Z0AQttheQOcvZazafREb71aZ4jIunW54AcH1UamNy33r_KQ";

  return (
    <section className="relative w-full bg-[#f6f3f2] overflow-hidden border-b border-[#e5e2e1]/80">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#ffdbcf]/40 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#a0f399]/25 blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
        {/* Motto Banner */}
        <div className="inline-flex items-center gap-2.5 bg-white shadow-xs rounded-full px-4 py-1.5 mb-6 border border-[#e5e2e1]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#a43700] animate-pulse"></span>
          <span className="font-sans text-xs text-[#a43700] tracking-wide uppercase font-bold">Canon &amp; Ideals</span>
          <span className="text-[#e3bfb2] font-sans text-xs">•</span>
          <blockquote className="font-serif italic text-sm text-[#5a4138]">
            {quotesByLang[currentLanguage]}
          </blockquote>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center gap-1.5 text-[#a43700] font-sans text-xs uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Accredited Academic Certification Program</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#1b1b1c] tracking-tight leading-[1.2] font-bold text-balance">
              Discover the Life, Message, and Philosophy of{' '}
              <span className="text-[#a43700]">Swami Vivekananda</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#5a4138] max-w-xl leading-relaxed">
              A chapter-wise, interactive MCQ certification course covering his transformative early struggles, historic 1893 Chicago Parliament address, foundational Raja Yoga exposition, and practical Vedantic humanitarianism.
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onStartQuiz}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#a43700] text-white font-sans text-sm font-semibold shadow-md hover:bg-[#cd4700] transition-all hover:shadow-lg cursor-pointer"
              >
                <span>Start Chapter 1 Quiz</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                onClick={onExploreCurriculum}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#1b1b1c] font-sans text-sm font-semibold shadow-xs hover:bg-[#f0eded] transition-colors border border-[#e5e2e1] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#984300]">menu_book</span>
                <span>Explore Curriculum</span>
              </button>

              <button
                onClick={onVerifyCertificate}
                className="inline-flex items-center gap-1.5 text-[#a43700] hover:text-[#cd4700] font-sans text-sm font-semibold px-2 py-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                <span className="underline underline-offset-4">Verify Certificate</span>
              </button>
            </div>

            {/* Academic Seal Signoff */}
            <div className="flex items-center gap-3 pt-3">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#ffdbcf] flex items-center justify-center text-[#a43700] font-serif text-[12px] font-bold shadow-xs">
                  SV
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#a3f69c] flex items-center justify-center text-[#1b6d24] font-serif text-[12px] font-bold shadow-xs">
                  RA
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#ffdbca] flex items-center justify-center text-[#984300] font-serif text-[12px] font-bold shadow-xs">
                  RK
                </div>
              </div>
              <p className="font-sans text-xs text-[#5a4138]">
                Endorsed by scholarly advisors across 42 institutions • 14,280+ certified learners
              </p>
            </div>
          </div>

          {/* Visual Hero Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white rounded-2xl p-4 shadow-md border border-[#e5e2e1]">
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-[#f0eded]">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f0eded] animate-pulse">
                    <span className="material-symbols-outlined text-4xl text-[#8f7066]">account_circle</span>
                  </div>
                )}
                
                {imageError ? (
                  <div className="w-full h-full bg-gradient-to-br from-[#a43700] to-[#763300] flex flex-col items-center justify-center text-white p-6 text-center">
                    <span className="material-symbols-outlined text-5xl mb-2 text-[#ffdbcf]">auto_stories</span>
                    <span className="font-serif text-xl font-bold">Swami Vivekananda</span>
                    <span className="text-xs text-[#ffdbcf] mt-1">Chicago, 1893</span>
                  </div>
                ) : (
                  <img
                    src={heroImageSrc}
                    alt="Dignified sepia portrait of Swami Vivekananda in Chicago 1893 attire"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    referrerPolicy="no-referrer"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="font-sans text-[11px] uppercase tracking-widest text-[#ffdbcf] font-semibold">
                    September 11, 1893
                  </span>
                  <p className="font-serif text-lg leading-snug font-bold drop-shadow-xs">
                    World's Parliament of Religions • Art Institute of Chicago
                  </p>
                </div>
              </div>

              {/* Mini stats overlay */}
              <div className="mt-3 pt-2 grid grid-cols-2 gap-3">
                <div className="bg-[#f6f3f2] p-2.5 rounded-lg flex items-center gap-2.5 border border-[#e5e2e1]/70">
                  <span className="material-symbols-outlined text-[#a43700] text-[22px]">school</span>
                  <div>
                    <div className="font-sans text-[10px] uppercase text-[#5a4138] font-bold">Standard</div>
                    <div className="font-sans text-sm text-[#1b1b1c] font-bold">Postgraduate Rigor</div>
                  </div>
                </div>
                <div className="bg-[#f6f3f2] p-2.5 rounded-lg flex items-center gap-2.5 border border-[#e5e2e1]/70">
                  <span className="material-symbols-outlined text-[#1b6d24] text-[22px]">military_tech</span>
                  <div>
                    <div className="font-sans text-[10px] uppercase text-[#5a4138] font-bold">Threshold</div>
                    <div className="font-sans text-sm text-[#1b1b1c] font-bold">70% for Honors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#e5e2e1] flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#ffdbcf] flex items-center justify-center text-[#a43700]">
              <span className="material-symbols-outlined text-[22px]">auto_stories</span>
            </div>
            <div className="font-serif text-lg text-[#1b1b1c] font-bold">5 Core Modules</div>
            <p className="font-sans text-xs text-[#5a4138] leading-relaxed">
              Systematic breakdown spanning early search, wandering years, world tours, and Vedantic legacy.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#e5e2e1] flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#ffdbca] flex items-center justify-center text-[#984300]">
              <span className="material-symbols-outlined text-[22px]">fact_check</span>
            </div>
            <div className="font-serif text-lg text-[#1b1b1c] font-bold">100+ Curated Questions</div>
            <p className="font-sans text-xs text-[#5a4138] leading-relaxed">
              Multi-level assessments formulated directly against Complete Works canonical editions.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#e5e2e1] flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#a3f69c] flex items-center justify-center text-[#1b6d24]">
              <span className="material-symbols-outlined text-[22px]">smart_outlet</span>
            </div>
            <div className="font-serif text-lg text-[#1b1b1c] font-bold">Instant Explanations</div>
            <p className="font-sans text-xs text-[#5a4138] leading-relaxed">
              Scholarly historical citations, verified speeches, and primary-source context for each answer.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#e5e2e1] flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#ffdbcf] flex items-center justify-center text-[#a43700]">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div className="font-serif text-lg text-[#1b1b1c] font-bold">Verified E-Certificate</div>
            <p className="font-sans text-xs text-[#5a4138] leading-relaxed">
              Distinctive cryptographic credential awarded upon achieving 70%+ aggregate score.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
