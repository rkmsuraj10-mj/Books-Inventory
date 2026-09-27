import React, { useState } from 'react';
import { MODULE_3_QUESTIONS } from '../data/curriculumData';

interface PracticeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  // Use 5 questions for rapid practice
  const practiceQuestions = MODULE_3_QUESTIONS.slice(0, 5);
  const currentQ = practiceQuestions[currentIdx];
  const selectedOpt = answers[currentQ.id];

  const handleSelect = (opt: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleNext = () => {
    if (currentIdx < practiceQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    practiceQuestions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) {
        correct++;
      }
    });
    return { correct, total: practiceQuestions.length };
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setAnswers({});
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-[#1b1b1c] rounded-2xl w-full max-w-2xl shadow-2xl border border-[#e5e2e1] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#e5e2e1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ffdbcf] text-[#a43700] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">quiz</span>
            </div>
            <div>
              <div className="font-sans text-xs uppercase text-[#a43700] font-bold tracking-wider">
                Practice Mode
              </div>
              <h3 className="font-serif text-xl text-[#1b1b1c] font-bold">
                Rapid Knowledge Self-Test
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

        {/* Body */}
        <div className="p-6 bg-[#f6f3f2] flex-1 overflow-y-auto">
          {isFinished ? (
            <div className="bg-white p-8 rounded-xl border border-[#e5e2e1] text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#a0f399]/40 text-[#1b6d24] flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#1b1b1c]">
                Practice Quiz Completed!
              </h4>
              <p className="font-sans text-sm text-[#5a4138]">
                You scored <strong className="text-[#a43700] text-lg">{calculateScore().correct}</strong> out of{' '}
                <strong>{calculateScore().total}</strong> questions correctly (
                {Math.round((calculateScore().correct / calculateScore().total) * 100)}%).
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={resetQuiz}
                  className="px-5 py-2.5 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-bold font-sans cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-[#f0eded] hover:bg-[#eae7e7] text-[#1b1b1c] text-xs font-bold font-sans cursor-pointer"
                >
                  Back to Course
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-[#e5e2e1] flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-sans text-[#5a4138]">
                <span className="font-bold text-[#a43700]">
                  Question {currentIdx + 1} of {practiceQuestions.length}
                </span>
                <span>{currentQ.category}</span>
              </div>

              <div className="w-full bg-[#f0eded] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#a43700] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / practiceQuestions.length) * 100}%` }}
                ></div>
              </div>

              <h4 className="font-serif text-lg text-[#1b1b1c] font-normal leading-snug">
                {currentQ.prompt}
              </h4>

              <div className="flex flex-col gap-2 pt-2">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`p-3 rounded-lg border text-left text-xs font-sans transition-all flex items-center justify-between cursor-pointer ${
                      selectedOpt === opt.id
                        ? 'bg-[#ffdbcf]/30 border-[#a43700] ring-1 ring-[#a43700] font-semibold'
                        : 'bg-white border-[#e5e2e1] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <span>
                      <strong className="mr-2">{opt.id}.</strong> {opt.text}
                    </span>
                    {selectedOpt === opt.id && (
                      <span className="material-symbols-outlined text-[16px] text-[#a43700]">
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t border-[#e5e2e1]">
                <button
                  onClick={handleNext}
                  disabled={!selectedOpt}
                  className={`px-5 py-2 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                    selectedOpt
                      ? 'bg-[#a43700] hover:bg-[#cd4700] text-white shadow-xs'
                      : 'bg-[#f0eded] text-[#8f7066] cursor-not-allowed'
                  }`}
                >
                  {currentIdx === practiceQuestions.length - 1 ? 'Finish Practice' : 'Next Question'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
