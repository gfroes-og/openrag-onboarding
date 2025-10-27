'use client';

import { useState } from 'react';
import { MOCK_PDFS, getUserProgress, markPdfAsRead, unmarkPdfAsRead } from '@/app/lib/mockData';

export default function PDFReaderModal({ isOpen, onClose, onRefresh, userId }) {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const progress = getUserProgress(userId);

  if (!isOpen) return null;

  const handleMarkAsRead = (pdfId, pdfTitle) => {
    markPdfAsRead(userId, pdfId);
    onRefresh?.();
    // Show success message
    alert(`"${pdfTitle}" marked as read!`);
  };

  const handleUnmarkAsRead = (pdfId, pdfTitle) => {
    unmarkPdfAsRead(userId, pdfId);
    onRefresh?.();
    alert(`↩️ "${pdfTitle}" unmarked!`);
  };

  const isPdfRead = (pdfId) => !!progress.pdfRead[pdfId];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-openpurple-600 to-openpurple-700 text-white px-6 py-4 flex items-center justify-between border-b border-openpurple-700">
          <h2 className="text-xl font-semibold">Reading Materials</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-openpurple-800 rounded-lg p-1.5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_PDFS.map((pdf) => (
              <div
                key={pdf.id}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5 hover:shadow-lg transition-shadow"
              >
                {/* PDF Icon and Title */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-openpurple-100 dark:bg-openpurple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-openpurple-600 dark:text-openpurple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm">
                      {pdf.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {pdf.category}
                    </p>
                  </div>
                  {isPdfRead(pdf.id) && (
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* PDF Metadata */}
                <div className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400">{pdf.fileName}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(pdf.url, '_blank')}
                    className="flex-1 px-3 py-2 bg-openpurple-50 dark:bg-openpurple-900/20 text-openpurple-700 dark:text-openpurple-400 rounded-lg hover:bg-openpurple-100 dark:hover:bg-openpurple-900/40 text-xs font-medium transition-colors border border-openpurple-200 dark:border-openpurple-800"
                  >
                    View
                  </button>
                  {!isPdfRead(pdf.id) ? (
                    <button
                      onClick={() => handleMarkAsRead(pdf.id, pdf.title)}
                      className="flex-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 text-xs font-medium transition-colors border border-green-200 dark:border-green-800"
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnmarkAsRead(pdf.id, pdf.title)}
                      className="flex-1 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-medium transition-colors border border-amber-200 dark:border-amber-800"
                    >
                      Unmark
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-white">
              {Object.keys(progress.pdfRead).length}
            </span>
            {' '}of {MOCK_PDFS.length} documents read
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-openpurple-600 to-openpurple-700 hover:from-openpurple-700 hover:to-openpurple-800 text-white rounded-lg font-medium transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
