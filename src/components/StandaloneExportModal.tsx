import React, { useState } from 'react';
import { Check, Copy, Download, FileCode, X } from 'lucide-react';
import { AcademicEvent } from '../types.ts';
import { generateStandaloneHtml } from '../utils/standaloneHtmlGenerator.ts';

interface StandaloneExportModalProps {
  events: AcademicEvent[];
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  events,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const standaloneHtmlCode = generateStandaloneHtml(events);

  const handleCopy = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 relative my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <FileCode className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Ekspor Standalone Single-File (index.html)
              </h3>
              <p className="text-xs text-slate-500">
                Satu file HTML5 murni lengkap dengan Tailwind CSS, Lucide Icons, dan Vanilla JS tanpa ketergantungan build-tools.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 bg-slate-50 px-4 rounded-xl my-4 border border-slate-200">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Format:</span> Standalone HTML5 + Vanilla JS · Tersimpan ke <code className="bg-slate-200 px-1 py-0.5 rounded text-emerald-900 font-mono">localStorage</code>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Salin Seluruh Kode</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File index.html</span>
            </button>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="flex-1 overflow-hidden flex flex-col border border-slate-200 rounded-xl bg-slate-900 text-slate-100">
          <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>index.html (Pratinjau Kode Standalone)</span>
            <span>{Math.round(standaloneHtmlCode.length / 1024)} KB</span>
          </div>
          <pre className="p-4 overflow-auto text-[11px] font-mono leading-relaxed text-emerald-400 select-all flex-1">
            <code>{standaloneHtmlCode.slice(0, 3000)}...

{`/* ... (kode lengkap sebanyak ${Math.round(standaloneHtmlCode.length / 1024)} KB siap disalin atau diunduh dengan tombol di atas) */`}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>File ini siap langsung dibuka di peramban apa pun (Chrome, Edge, Firefox, Safari) secara offline tanpa Node.js.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
