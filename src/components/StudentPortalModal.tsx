import React, { useState } from 'react';
import { StudentProfile } from '../types';

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateName: (name: string) => void;
  onViewCertificate: () => void;
}

export const StudentPortalModal: React.FC<StudentPortalModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateName,
  onViewCertificate
}) => {
  const [name, setName] = useState(profile.name);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdateName(name.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-[#1b1b1c] rounded-2xl w-full max-w-xl shadow-2xl border border-[#e5e2e1] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#e5e2e1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffdbcf] text-[#a43700] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <div>
              <div className="font-sans text-xs uppercase text-[#a43700] font-bold tracking-wider">
                Academic Candidate Profile
              </div>
              <h3 className="font-serif text-xl text-[#1b1b1c] font-bold">
                Student &amp; Examination Portal
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
        <div className="p-6 bg-[#f6f3f2] flex flex-col gap-5 overflow-y-auto">
          {/* Identity Card */}
          <div className="bg-white p-5 rounded-xl border border-[#e5e2e1] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-sans font-bold uppercase text-[#8f7066]">
                Enrolled Scholar
              </div>
              <div className="font-serif text-xl font-bold text-[#1b1b1c]">{profile.name}</div>
              <div className="text-xs font-sans text-[#5a4138]">{profile.institution}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-[#8f7066]">Candidate ID</div>
              <div className="font-mono text-xs font-bold text-[#a43700]">{profile.certificateId}</div>
              <div className="inline-block px-2 py-0.5 mt-1 rounded bg-[#a0f399]/40 text-[#1b6d24] text-[10px] font-bold">
                Distinction Candidate
              </div>
            </div>
          </div>

          {/* Edit Name Form */}
          <form onSubmit={handleSave} className="bg-white p-4 rounded-xl border border-[#e5e2e1] flex flex-col gap-3">
            <label className="text-xs font-sans font-bold text-[#1b1b1c]">
              Change Candidate Name (as printed on Certificate):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#e5e2e1] text-xs font-sans text-[#1b1b1c] outline-none focus:ring-2 focus:ring-[#a43700]"
                required
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-bold font-sans transition-colors cursor-pointer"
              >
                {isSaved ? 'Updated!' : 'Update'}
              </button>
            </div>
          </form>

          {/* Academic Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-[#e5e2e1]">
              <div className="text-[10px] font-sans text-[#5a4138] uppercase font-bold">Aggregate Score</div>
              <div className="font-serif text-2xl font-bold text-[#a43700] mt-1">90%</div>
              <div className="text-[11px] font-sans text-[#1b6d24] font-semibold">Distinction Benchmark Met</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#e5e2e1]">
              <div className="text-[10px] font-sans text-[#5a4138] uppercase font-bold">Course Status</div>
              <div className="font-serif text-2xl font-bold text-[#1b1b1c] mt-1">60% Complete</div>
              <div className="text-[11px] font-sans text-[#5a4138]">2 of 5 Modules Verified</div>
            </div>
          </div>

          {/* Certificate Quick Action */}
          <div className="bg-[#FAF6EE] p-4 rounded-xl border border-[#e3bfb2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#984300] text-[24px]">verified</span>
              <div>
                <div className="font-serif text-xs font-bold text-[#1b1b1c]">
                  Diplomatic E-Certificate Available
                </div>
                <div className="text-[11px] font-sans text-[#5a4138]">
                  ID: {profile.certificateId} • Verified
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onViewCertificate();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#a43700] text-white text-xs font-bold font-sans hover:bg-[#cd4700] transition-colors cursor-pointer"
            >
              View Document
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#e5e2e1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#f0eded] hover:bg-[#eae7e7] text-[#1b1b1c] text-xs font-bold font-sans transition-colors cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
