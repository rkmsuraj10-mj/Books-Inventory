import React from 'react';

interface HeaderProps {
  currentLanguage: 'EN' | 'HI' | 'MR';
  onLanguageChange: (lang: 'EN' | 'HI' | 'MR') => void;
  studyModeActive: boolean;
  onToggleStudyMode: () => void;
  onOpenPortal: () => void;
  onOpenLeaderboard: () => void;
  onOpenPracticeQuiz: () => void;
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
  studentName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  studyModeActive,
  onToggleStudyMode,
  onOpenPortal,
  onOpenLeaderboard,
  onOpenPracticeQuiz,
  onNavigateSection,
  activeSection,
  studentName
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/90 backdrop-blur-xl border-b border-[#e5e2e1]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <button 
          onClick={() => onNavigateSection('top')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="h-10 w-10 rounded-lg bg-[#a43700] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm shrink-0">
            SV
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-[19px] sm:text-[20px] text-[#a43700] font-bold leading-tight tracking-tight group-hover:text-[#cd4700] transition-colors">
              Swami Vivekananda
            </span>
            <span className="font-sans text-[10px] sm:text-[11px] font-semibold text-[#5a4138] tracking-wider uppercase">
              Life &amp; Vision | Online Certification Engine
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
          <button
            onClick={() => onNavigateSection('curriculum-path')}
            className={`font-sans text-sm font-semibold rounded-lg px-3 py-1.5 transition-colors ${
              activeSection === 'curriculum-path'
                ? 'bg-[#cd4700] text-white'
                : 'text-[#5a4138] hover:text-[#1b1b1c] hover:bg-[#f6f3f2]'
            }`}
          >
            Course Modules
          </button>
          <button
            onClick={onOpenPracticeQuiz}
            className="font-sans text-sm font-medium text-[#5a4138] hover:text-[#1b1b1c] hover:bg-[#f6f3f2] rounded-lg px-3 py-1.5 transition-colors"
          >
            Take Practice Quiz
          </button>
          <button
            onClick={onOpenLeaderboard}
            className="font-sans text-sm font-medium text-[#5a4138] hover:text-[#1b1b1c] hover:bg-[#f6f3f2] rounded-lg px-3 py-1.5 transition-colors"
          >
            Leaderboard
          </button>
          <button
            onClick={() => onNavigateSection('distinction-certificate')}
            className="font-sans text-sm font-medium text-[#5a4138] hover:text-[#1b1b1c] hover:bg-[#f6f3f2] rounded-lg px-3 py-1.5 transition-colors"
          >
            Honors &amp; Certificate
          </button>
          <button
            onClick={() => onNavigateSection('canonical-archive')}
            className="font-sans text-sm font-medium text-[#5a4138] hover:text-[#1b1b1c] hover:bg-[#f6f3f2] rounded-lg px-3 py-1.5 transition-colors"
          >
            About &amp; Resources
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="hidden sm:flex items-center bg-[#f6f3f2] p-1 rounded-full shadow-[0_1px_3px_rgba(31,31,31,0.04)] border border-[#e5e2e1]/70">
            <button
              onClick={() => onLanguageChange('EN')}
              className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                currentLanguage === 'EN'
                  ? 'bg-white text-[#a43700] shadow-sm'
                  : 'text-[#5a4138] hover:text-[#1b1b1c]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('HI')}
              className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                currentLanguage === 'HI'
                  ? 'bg-white text-[#a43700] shadow-sm'
                  : 'text-[#5a4138] hover:text-[#1b1b1c]'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('MR')}
              className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                currentLanguage === 'MR'
                  ? 'bg-white text-[#a43700] shadow-sm'
                  : 'text-[#5a4138] hover:text-[#1b1b1c]'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Study Mode Toggle */}
          <button
            onClick={onToggleStudyMode}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              studyModeActive
                ? 'bg-[#1b6d24] text-white border-[#1b6d24] shadow-sm'
                : 'bg-[#f6f3f2] text-[#5a4138] border-[#e5e2e1] hover:bg-[#f0eded] hover:text-[#1b1b1c]'
            }`}
            title="Toggle reflective study mode"
          >
            <span className="material-symbols-outlined text-[16px] text-inherit">spa</span>
            <span>{studyModeActive ? 'Study Mode On' : 'Study Mode'}</span>
          </button>

          {/* Student Portal Login Button */}
          <button
            onClick={onOpenPortal}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#a43700] text-white hover:bg-[#cd4700] transition-all shadow-[0_2px_8px_rgba(164,55,0,0.2)] text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <span>Portal Login</span>
          </button>

          {/* User Profile Avatar Icon */}
          <button
            onClick={onOpenPortal}
            title={`Logged in as ${studentName}`}
            className="w-8 h-8 rounded-full bg-[#ffdbcf] text-[#a43700] border border-[#a43700]/30 flex items-center justify-center shrink-0 hover:ring-2 hover:ring-[#a43700] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
