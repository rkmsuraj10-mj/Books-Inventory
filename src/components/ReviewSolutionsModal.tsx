import React, { useState } from 'react';
import { Question } from '../types';

interface ReviewSolutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  moduleTitle: string;
}

export const ReviewSolutionsModal: React.FC<ReviewSolutionsModalProps> = ({
  isOpen,
  onClose,
  questions,
  moduleTitle
}) => {
  const [filterTopic, setFilterTopic] = useState<'all' | 'chronology' | 'speeches' | 'philosophy'>('all');

  if (!isOpen) return null;

  const filtered = filterTopic === 'all'
    ? questions
    : questions.filter((q) => q.topic === filterTopic);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-[#1b1b1c] rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl border border-[#e5e2e1] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#e5e2e1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#a0f399]/40 text-[#1b6d24] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">fact_check</span>
            </div>
            <div>
              <div className="font-sans text-xs uppercase text-[#a43700] font-bold tracking-wider">
                Exhaustive Solutions Compendium
              </div>
              <h3 className="font-serif text-xl text-[#1b1b1c] font-bold">
                {moduleTitle}
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

        {/* Filter bar */}
        <div className="p-3 bg-[#f6f3f2] border-b border-[#e5e2e1] flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-sans text-[#5a4138] px-2 font-medium">Filter by topic:</span>
          <button
            onClick={() => setFilterTopic('all')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
              filterTopic === 'all' ? 'bg-[#a43700] text-white shadow-xs' : 'bg-white text-[#5a4138] hover:bg-[#f0eded]'
            }`}
          >
            All Questions ({questions.length})
          </button>
          <button
            onClick={() => setFilterTopic('chronology')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
              filterTopic === 'chronology' ? 'bg-[#a43700] text-white shadow-xs' : 'bg-white text-[#5a4138] hover:bg-[#f0eded]'
            }`}
          >
            Chronology &amp; Dates
          </button>
          <button
            onClick={() => setFilterTopic('speeches')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
              filterTopic === 'speeches' ? 'bg-[#a43700] text-white shadow-xs' : 'bg-white text-[#5a4138] hover:bg-[#f0eded]'
            }`}
          >
            Speeches &amp; Quotes
          </button>
          <button
            onClick={() => setFilterTopic('philosophy')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
              filterTopic === 'philosophy' ? 'bg-[#a43700] text-white shadow-xs' : 'bg-white text-[#5a4138] hover:bg-[#f0eded]'
            }`}
          >
            Vedanta &amp; Yoga
          </button>
        </div>

        {/* Question List */}
        <div className="p-6 bg-[#f6f3f2] overflow-y-auto flex flex-col gap-5">
          {filtered.map((q, idx) => (
            <div key={q.id} className="bg-white p-5 rounded-xl border border-[#e5e2e1] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-[#a43700]">Question {q.id}</span>
                <span className="px-2 py-0.5 rounded bg-[#f6f3f2] text-[#5a4138] border border-[#e5e2e1]">
                  {q.category}
                </span>
              </div>

              <h4 className="font-serif text-base text-[#1b1b1c] font-normal">
                {q.prompt}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                {q.options.map((opt) => {
                  const isCorrect = opt.id === q.correctOptionId;
                  return (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        isCorrect
                          ? 'bg-[#a0f399]/30 border-[#1b6d24] text-[#1b6d24] font-bold'
                          : 'bg-[#f6f3f2] border-[#e5e2e1] text-[#5a4138]'
                      }`}
                    >
                      <span>
                        <strong className="mr-1">{opt.id}.</strong> {opt.text}
                      </span>
                      {isCorrect && (
                        <span className="text-[10px] bg-[#1b6d24] text-white px-1.5 py-0.5 rounded">
                          Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Canonical explanation box */}
              <div className="bg-[#FAF6EE] p-3.5 rounded-lg border border-[#e3bfb2] text-xs font-sans flex flex-col gap-1.5 mt-1">
                <div className="font-bold text-[#984300]">Scholarly Annotation:</div>
                <p className="text-[#1b1b1c] leading-relaxed">{q.explanation.scholarlyNote}</p>
                <div className="text-[11px] text-[#5a4138] border-t border-[#e3bfb2]/60 pt-1.5 mt-1 flex flex-col sm:flex-row justify-between gap-1">
                  <span><strong>Source:</strong> {q.explanation.canonicalSource}</span>
                  <span className="text-[#1b6d24] font-medium">{q.explanation.historicalImpact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#e5e2e1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-bold font-sans transition-colors cursor-pointer"
          >
            Close Solutions
          </button>
        </div>
      </div>
    </div>
  );
};
