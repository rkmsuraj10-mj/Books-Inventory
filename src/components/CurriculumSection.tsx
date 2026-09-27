import React from 'react';
import { CourseModule } from '../types';

interface CurriculumSectionProps {
  modules: CourseModule[];
  activeModuleId: number;
  onSelectModule: (moduleId: number) => void;
  onReviewAnswers: (moduleId: number) => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  modules,
  activeModuleId,
  onSelectModule,
  onReviewAnswers
}) => {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16" id="curriculum-path">
      {/* Header with progress bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[#a43700] font-sans text-xs uppercase font-bold tracking-wider">
            <span className="material-symbols-outlined text-[16px]">account_tree</span>
            <span>Academic Pathway</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#1b1b1c] font-bold">
            Course Syllabus &amp; Assessment Path
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#5a4138] max-w-xl leading-relaxed">
            Progress through the authenticated canonical milestones. Each module must achieve minimum benchmark status to release the final evaluation.
          </p>
        </div>

        {/* Overall Track Progress Card */}
        <div className="bg-[#f6f3f2] px-5 py-4 rounded-xl border border-[#e5e2e1] flex flex-col gap-2 min-w-[280px] shadow-xs">
          <div className="flex justify-between items-center text-[#1b1b1c] font-sans text-xs sm:text-sm">
            <span className="font-bold text-[#1b1b1c]">Overall Course Progress</span>
            <span className="text-[#a43700] font-bold">60% Complete</span>
          </div>
          <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#a43700] h-full rounded-full transition-all duration-700" 
              style={{ width: '60%' }}
            ></div>
          </div>
          <div className="flex justify-between items-center font-sans text-xs text-[#5a4138]">
            <span>2 of 5 Modules Passed</span>
            <span className="text-[#1b6d24] font-bold">Honors Track</span>
          </div>
        </div>
      </div>

      {/* 5 Module Cards Grid + Requirement Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const isSelected = mod.id === activeModuleId;

          if (mod.status === 'completed') {
            return (
              <div 
                key={mod.id}
                className="bg-white rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden border border-[#e5e2e1]"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1b6d24]"></div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#a0f399]/40 text-[#1b6d24] font-sans text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>Completed ({mod.scorePercent}%)</span>
                    </span>
                    <span className="font-sans text-xs text-[#5a4138] flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{mod.estimatedMins} mins</span>
                    </span>
                  </div>

                  <div className="font-sans text-[11px] text-[#8f7066] uppercase font-bold tracking-wider">
                    {mod.numberStr}
                  </div>

                  <h3 className="font-serif text-lg text-[#1b1b1c] font-bold leading-snug">
                    {mod.title}
                  </h3>

                  <p className="font-sans text-xs text-[#5a4138] leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-[#f6f3f2] text-[#5a4138] px-2 py-0.5 rounded text-[11px] font-semibold border border-[#e5e2e1]/60">
                      {mod.level}
                    </span>
                    <span className="bg-[#f6f3f2] text-[#5a4138] px-2 py-0.5 rounded text-[11px] font-semibold border border-[#e5e2e1]/60">
                      {mod.questionCount} Questions
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-2">
                  <button 
                    onClick={() => onReviewAnswers(mod.id)}
                    className="w-full py-2.5 rounded-lg bg-[#f0eded] text-[#1b1b1c] font-sans text-xs font-bold hover:bg-[#eae7e7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">replay</span>
                    <span>Review Answers &amp; Notes</span>
                  </button>
                </div>
              </div>
            );
          }

          if (mod.status === 'in-progress') {
            return (
              <div 
                key={mod.id}
                className="bg-white rounded-xl p-5 shadow-md ring-2 ring-[#a43700] flex flex-col justify-between relative overflow-hidden border border-[#a43700]/30"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-[#a43700]"></div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#ffdbcf] text-[#a43700] font-sans text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#a43700] animate-ping"></span>
                      <span>In Progress (Q 4/20)</span>
                    </span>
                    <span className="font-sans text-xs text-[#5a4138] flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{mod.estimatedMins} mins</span>
                    </span>
                  </div>

                  <div className="font-sans text-[11px] text-[#a43700] font-bold uppercase tracking-wider">
                    Active Assessment Module
                  </div>

                  <h3 className="font-serif text-lg text-[#a43700] font-bold leading-snug">
                    {mod.title}
                  </h3>

                  <p className="font-sans text-xs text-[#5a4138] leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-[#ffdbcf]/60 text-[#802a00] px-2 py-0.5 rounded text-[11px] font-bold">
                      {mod.level}
                    </span>
                    <span className="bg-[#f6f3f2] text-[#5a4138] px-2 py-0.5 rounded text-[11px] font-semibold border border-[#e5e2e1]/60">
                      {mod.questionCount} Questions
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-2">
                  <button
                    onClick={() => onSelectModule(mod.id)}
                    className="w-full py-2.5 rounded-lg bg-[#a43700] text-white font-sans text-xs font-bold hover:bg-[#cd4700] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Resume Module Assessment</span>
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  </button>
                </div>
              </div>
            );
          }

          if (mod.status === 'up-next') {
            return (
              <div 
                key={mod.id}
                className="bg-white rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden border border-[#e5e2e1]"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#e3bfb2]"></div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-[#f0eded] text-[#5a4138] font-sans text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">lock_open</span>
                      <span>Up Next</span>
                    </span>
                    <span className="font-sans text-xs text-[#5a4138] flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{mod.estimatedMins} mins</span>
                    </span>
                  </div>

                  <div className="font-sans text-[11px] text-[#8f7066] uppercase font-bold tracking-wider">
                    {mod.numberStr}
                  </div>

                  <h3 className="font-serif text-lg text-[#1b1b1c] font-bold leading-snug">
                    {mod.title}
                  </h3>

                  <p className="font-sans text-xs text-[#5a4138] leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-[#f6f3f2] text-[#5a4138] px-2 py-0.5 rounded text-[11px] font-semibold border border-[#e5e2e1]/60">
                      {mod.level}
                    </span>
                    <span className="bg-[#f6f3f2] text-[#5a4138] px-2 py-0.5 rounded text-[11px] font-semibold border border-[#e5e2e1]/60">
                      {mod.questionCount} Questions
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-2">
                  <button 
                    onClick={() => onSelectModule(mod.id)}
                    className="w-full py-2.5 rounded-lg bg-[#f6f3f2] text-[#1b1b1c] font-sans text-xs font-bold hover:bg-[#f0eded] transition-colors flex items-center justify-center gap-2 border border-[#e5e2e1] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">start</span>
                    <span>Start Module</span>
                  </button>
                </div>
              </div>
            );
          }

          // Locked Module
          return (
            <div 
              key={mod.id}
              className="bg-[#f6f3f2] rounded-xl p-5 shadow-none flex flex-col justify-between relative overflow-hidden border border-[#e5e2e1] opacity-75"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#8f7066]/40"></div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-[#eae7e7] text-[#5a4138] font-sans text-xs font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>Locked</span>
                  </span>
                  <span className="font-sans text-xs text-[#5a4138] flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>{mod.estimatedMins} mins</span>
                  </span>
                </div>

                <div className="font-sans text-[11px] text-[#8f7066] uppercase font-bold tracking-wider">
                  {mod.numberStr}
                </div>

                <h3 className="font-serif text-lg text-[#1b1b1c] font-bold leading-snug">
                  {mod.title}
                </h3>

                <p className="font-sans text-xs text-[#5a4138] leading-relaxed">
                  {mod.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="bg-[#e5e2e1] text-[#5a4138] px-2 py-0.5 rounded text-[11px] font-medium">
                    {mod.level}
                  </span>
                  <span className="bg-[#e5e2e1] text-[#5a4138] px-2 py-0.5 rounded text-[11px] font-medium">
                    {mod.questionCount} Questions
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-2">
                <button 
                  disabled
                  className="w-full py-2.5 rounded-lg bg-[#e5e2e1] text-[#5a4138] font-sans text-xs font-bold cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Unlocks after Module 4</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Certification Requirement Tile in Grid */}
        <div className="bg-white rounded-xl p-5 shadow-xs flex flex-col justify-between border border-dashed border-[#e3bfb2]">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-full bg-[#ffdbcf] text-[#a43700] flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
            </div>
            <div className="font-sans text-base text-[#1b1b1c] font-bold">
              Certification Requirement
            </div>
            <p className="font-sans text-xs text-[#5a4138] leading-relaxed">
              Complete all 5 modules with an aggregate score of 70% or above. Successful candidates receive a verified, digitally signed academic certificate.
            </p>
          </div>
          <div className="pt-4 border-t border-[#f0eded]">
            <div className="text-[11px] font-sans text-[#a43700] font-bold uppercase tracking-wider">
              Advaita Ashrama Alignment
            </div>
            <div className="text-xs font-sans text-[#5a4138]">
              Standardized Academic Engine 2025
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
