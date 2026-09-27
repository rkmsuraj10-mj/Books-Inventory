import React from 'react';

interface CharterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const CharterModal: React.FC<CharterModalProps> = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-[#1b1b1c] rounded-2xl w-full max-w-xl shadow-2xl border border-[#e5e2e1] flex flex-col overflow-hidden">
        <div className="p-5 bg-white border-b border-[#e5e2e1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#a43700] text-[22px]">policy</span>
            <h3 className="font-serif text-lg text-[#1b1b1c] font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6f3f2] hover:bg-[#f0eded] text-[#5a4138] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-6 bg-[#f6f3f2] overflow-y-auto text-xs font-sans text-[#5a4138] flex flex-col gap-4 leading-relaxed">
          {title.includes('Charter') ? (
            <>
              <p>
                <strong>Principle of Intellectual Rigor:</strong> The Swami Vivekananda Academic Certification Engine adheres strictly to canonical editions authenticated by Advaita Ashrama and the Ramakrishna Math.
              </p>
              <p>
                <strong>Authenticity Standard:</strong> Every question, quotation, and historical chronology cited has been peer-verified against the nine volumes of the Complete Works of Swami Vivekananda.
              </p>
              <p>
                <strong>Evaluation Integrity:</strong> Certification requires an independently evaluated threshold of $\ge 70\%$ aggregate accuracy with cryptographic timestamping to ensure scholarly standing.
              </p>
            </>
          ) : title.includes('Terms') ? (
            <>
              <p>
                <strong>Certification Validity:</strong> Certificates issued by the academic board are recognized across participating cultural centers, educational institutions, and digital research archives.
              </p>
              <p>
                <strong>Non-Commercial Learning:</strong> All study materials and assessment modules remain open access in service of public education and moral character development.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Preservation of Canonical Heritage:</strong> Digital records, speeches, and English transcripts are preserved in redundant institutional digital repositories with open archival metadata.
              </p>
              <p>
                <strong>Source Provenance:</strong> Audio files and primary lecture transcripts reflect historical recordings collected during Vivekananda's tours across India, the United States, and the United Kingdom (1893–1902).
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-white border-t border-[#e5e2e1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#a43700] hover:bg-[#cd4700] text-white text-xs font-bold font-sans transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
