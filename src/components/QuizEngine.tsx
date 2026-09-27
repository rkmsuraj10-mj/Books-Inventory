import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizEngineProps {
  questions: Question[];
  currentQuestionIndex: number;
  onQuestionIndexChange: (index: number) => void;
  selectedAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  onSelectAnswer: (questionId: number, optionId: 'A' | 'B' | 'C' | 'D') => void;
  flaggedQuestions: Record<number, boolean>;
  onToggleFlag: (questionId: number) => void;
  moduleTitle: string;
  onCompleteModule: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  currentQuestionIndex,
  onQuestionIndexChange,
  selectedAnswers,
  onSelectAnswer,
  flaggedQuestions,
  onToggleFlag,
  moduleTitle,
  onCompleteModule
}) => {
  // Timer state starting at 14 mins 32 seconds like reference
  const [secondsRemaining, setSecondsRemaining] = useState<number>(14 * 60 + 32);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showPalette, setShowPalette] = useState<boolean>(false);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const selectedOption = selectedAnswers[currentQ.id];
  const isFlagged = !!flaggedQuestions[currentQ.id];

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      onQuestionIndexChange(currentQuestionIndex + 1);
    } else {
      onCompleteModule();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      onQuestionIndexChange(currentQuestionIndex - 1);
    }
  };

  return (
    <section className="w-full bg-[#f6f3f2] py-12 lg:py-16 border-t border-b border-[#e5e2e1]" id="active-quiz-engine">
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Section Header Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 border-[#e3bfb2]/70 gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a43700] text-[24px]">local_library</span>
            <span className="font-serif text-lg sm:text-xl text-[#1b1b1c] font-bold">
              Live Assessment Mode: {moduleTitle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="px-2.5 py-1 rounded-full bg-white text-[#5a4138] border border-[#e5e2e1] hover:bg-[#f0eded] text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">grid_view</span>
              <span>Palette</span>
            </button>
            <span className="px-3 py-1 rounded-full bg-[#ffdbcf] text-[#a43700] font-sans text-xs font-bold uppercase tracking-wider">
              Exam Active
            </span>
          </div>
        </div>

        {/* Quick Question Palette Dropdown / Card */}
        {showPalette && (
          <div className="bg-white p-4 rounded-xl shadow-md border border-[#e5e2e1] animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-xs font-bold text-[#1b1b1c] uppercase">Question Navigation Matrix</span>
              <span className="font-sans text-[11px] text-[#5a4138]">
                {Object.keys(selectedAnswers).length} of {questions.length} Answered
              </span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const flagged = flaggedQuestions[q.id];

                let bgClass = "bg-[#f6f3f2] text-[#5a4138] border-[#e5e2e1]";
                if (isCurrent) {
                  bgClass = "bg-[#a43700] text-white border-[#a43700] font-bold shadow-xs";
                } else if (flagged) {
                  bgClass = "bg-[#ffdbca] text-[#984300] border-[#984300]/50 font-bold";
                } else if (isAnswered) {
                  bgClass = "bg-[#a0f399]/40 text-[#1b6d24] border-[#1b6d24]/40 font-bold";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onQuestionIndexChange(idx);
                      setShowPalette(false);
                    }}
                    className={`h-9 rounded-lg border text-xs font-mono transition-all flex items-center justify-center relative cursor-pointer ${bgClass}`}
                  >
                    <span>{idx + 1}</span>
                    {flagged && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#984300]"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Header Bar: Progress, Question Counter & Timer */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-[#e5e2e1] flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="font-sans text-base sm:text-lg font-bold text-[#a43700]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-[#e3bfb2] font-sans text-sm">•</span>
              <span className="font-sans text-xs text-[#5a4138] font-medium">
                {currentQ.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Timer badge */}
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                className="flex items-center gap-1.5 bg-[#f0eded] hover:bg-[#eae7e7] px-3 py-1 rounded-full font-sans text-xs text-[#1b1b1c] font-mono border border-[#e5e2e1] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#a43700]">
                  {isTimerRunning ? 'timer' : 'pause_circle'}
                </span>
                <span className="font-bold tabular-nums">{formatTimer(secondsRemaining)}</span>
                <span className="text-[11px] text-[#5a4138]">remaining</span>
              </button>

              {/* Chapter Marks Rule */}
              <div className="hidden sm:flex items-center gap-1 font-sans text-xs text-[#1b6d24] font-bold">
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>+{currentQ.points} correct • 0 penalty</span>
              </div>
            </div>
          </div>

          {/* Animated Progress bar */}
          <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#a43700] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Main Question Card */}
        <div className="bg-white p-5 sm:p-8 rounded-xl shadow-xs border border-[#e5e2e1] flex flex-col gap-5">
          {/* Category & Difficulty Pill */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded bg-[#f6f3f2] text-[#a43700] font-sans text-[11px] font-bold uppercase tracking-wider border border-[#e5e2e1]/70">
              {currentQ.category}
            </span>

            <button
              onClick={() => onToggleFlag(currentQ.id)}
              className={`inline-flex items-center gap-1 text-xs font-sans transition-colors cursor-pointer ${
                isFlagged ? 'text-[#984300] font-bold' : 'text-[#5a4138] hover:text-[#a43700]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFlagged ? 'bookmark' : 'bookmark_border'}
              </span>
              <span>{isFlagged ? 'Flagged for Review' : 'Flag for Review'}</span>
            </button>
          </div>

          {/* Question Prompt */}
          <h2 className="font-serif text-xl sm:text-2xl text-[#1b1b1c] font-normal leading-relaxed">
            {currentQ.prompt}
          </h2>

          {/* MCQ Options Grid (4 Cards) */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <div
                  key={option.id}
                  onClick={() => onSelectAnswer(currentQ.id, option.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectAnswer(currentQ.id, option.id);
                    }
                  }}
                  className={`group relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#ffdbcf]/25 ring-2 ring-[#a43700] shadow-md border border-[#a43700]'
                      : 'bg-white hover:bg-[#f6f3f2] shadow-xs border border-[#e5e2e1]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-sans text-base font-bold transition-colors ${
                        isSelected
                          ? 'bg-[#a43700] text-white shadow-xs'
                          : 'bg-[#f0eded] text-[#5a4138] group-hover:bg-[#ffdbcf] group-hover:text-[#a43700]'
                      }`}
                    >
                      {option.id}
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`font-sans text-base ${isSelected ? 'text-[#1b1b1c] font-semibold' : 'text-[#1b1b1c]'}`}>
                        {option.text}
                      </span>
                      {isSelected && (
                        <span className="text-xs text-[#a43700] font-bold">
                          (Your Selection)
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#a43700] text-white'
                        : 'bg-[#f0eded] text-transparent group-hover:border group-hover:border-[#a43700]/30'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Bar beneath options */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e5e2e1]">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-sans text-xs font-bold transition-colors flex items-center justify-center gap-1 border ${
                  currentQuestionIndex === 0
                    ? 'bg-[#f6f3f2] text-[#8f7066]/50 border-transparent cursor-not-allowed'
                    : 'bg-[#f6f3f2] hover:bg-[#f0eded] text-[#1b1b1c] border-[#e5e2e1] cursor-pointer'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                <span>Previous Question</span>
              </button>

              <button
                onClick={() => onToggleFlag(currentQ.id)}
                className={`px-3 py-2.5 rounded-lg border font-sans text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                  isFlagged
                    ? 'bg-[#ffdbca] text-[#984300] border-[#984300]/40 font-bold'
                    : 'bg-[#f6f3f2] hover:bg-[#f0eded] text-[#5a4138] border-[#e5e2e1]'
                }`}
                title="Mark for further thought"
              >
                <span className="material-symbols-outlined text-[18px] text-[#984300]">flag</span>
                <span className="hidden md:inline">{isFlagged ? 'Marked' : 'Mark'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleNext}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white font-sans text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg"
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Save & Next'}</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Post-Answer Feedback Drawer / Scholarly Context Box */}
        {selectedOption !== undefined && (
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-[#e5e2e1] border-l-4 border-l-[#1b6d24] flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[#1b6d24] font-serif text-lg">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <span className="font-bold">
                  {selectedOption === currentQ.correctOptionId
                    ? `Correct! Selected Option [${selectedOption}] ${currentQ.options.find(o => o.id === selectedOption)?.text}`
                    : `Reviewing: You selected [${selectedOption}], Correct Answer is [${currentQ.correctOptionId}]`}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#a0f399]/40 text-[#1b6d24] font-sans text-xs font-bold">
                {selectedOption === currentQ.correctOptionId ? `+${currentQ.points}.0 Marks Earned` : 'Review Context'}
              </span>
            </div>

            <div className="bg-[#f6f3f2] p-4 rounded-lg flex flex-col gap-1.5 border border-[#e5e2e1]/70">
              <div className="font-sans text-[11px] uppercase tracking-wider text-[#8f7066] font-bold">
                Scholarly Context &amp; Primary Note
              </div>
              <p className="font-sans text-sm text-[#1b1b1c] leading-relaxed">
                {currentQ.explanation.scholarlyNote}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 font-sans text-xs text-[#5a4138]">
              <div className="flex items-start gap-2 bg-white p-2 rounded border border-[#f0eded]">
                <span className="material-symbols-outlined text-[#a43700] text-[18px] shrink-0 mt-0.5">auto_stories</span>
                <div>
                  <strong className="text-[#1b1b1c]">Canonical Source:</strong> {currentQ.explanation.canonicalSource}
                </div>
              </div>
              <div className="flex items-start gap-2 bg-white p-2 rounded border border-[#f0eded]">
                <span className="material-symbols-outlined text-[#1b6d24] text-[18px] shrink-0 mt-0.5">public</span>
                <div>
                  <strong className="text-[#1b1b1c]">Historical Impact:</strong> {currentQ.explanation.historicalImpact}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
