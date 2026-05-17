import React from 'react';

/* ─────────────────────────────────────────────
   CompanyDeleteAlert (Delete Confirmation Modal)

   Props
   ─────
   isOpen     {boolean}  – controls visibility
   onConfirm  {function} – called when user clicks "Delete"
   onCancel   {function} – called when user clicks "Cancel" or the backdrop
───────────────────────────────────────────── */
const CompanyDeleteAlert = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    /* ── Full-screen backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => {
        // close on backdrop click
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      {/* ── Modal card ── */}
      <div
        className="relative bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md mx-4 px-8 pt-8 pb-6 flex flex-col items-center text-center border border-slate-200 dark:border-slate-800"
        style={{ boxShadow: '0 20px 60px rgba(25,28,30,0.18)' }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-alert-title"
        aria-describedby="delete-alert-desc"
      >
        {/* Red trash icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mb-5 shadow-lg shadow-red-200 dark:shadow-red-900/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>

        {/* Heading */}
        <h2
          id="delete-alert-title"
          className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight"
        >
          Delete Company Account?
        </h2>

        {/* Body */}
        <p
          id="delete-alert-desc"
          className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-7 max-w-[340px]"
        >
          You are about to permanently delete your company account. 
          <span className="font-semibold text-slate-700 dark:text-slate-200"> All your internship offers and received applications will be permanently deleted.</span> Students will be notified. This action cannot be undone.
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 w-full mb-5">
          <button
            id="btn-confirm-delete"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-red-700 hover:bg-red-800 active:scale-[0.98] text-white font-bold text-sm tracking-wide transition-all duration-150 shadow-md shadow-red-200 dark:shadow-red-900/20"
          >
            Yes, Delete Account
          </button>
          <button
            id="btn-cancel-delete"
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 active:scale-[0.98] text-slate-900 font-bold text-sm tracking-wide transition-all duration-150"
          >
            Cancel
          </button>
        </div>

        {/* Footer warning */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
          <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            !
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-widest">
            ALL DATA WILL BE PERMANENTLY ERASED
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDeleteAlert;
