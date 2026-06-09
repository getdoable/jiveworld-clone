import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// "Enter your code" popup. For now, applying any non-empty code succeeds and
// shows a confirmation message (no backend coupon validation yet).
export default function RedeemCodeModal({ open, onClose }) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState('');

  // Reset state each time the modal opens, and close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    setCode('');
    setApplied('');
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function apply() {
    const trimmed = code.trim();
    if (!trimmed) return;
    setApplied(trimmed);
  }

  return createPortal(
    <div
      className="animate-backdrop-fade fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-modal-pop w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Enter your code"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">Enter your code</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form
          className="mt-6 flex items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon code"
            autoFocus
            className="min-w-0 flex-1 rounded-2xl bg-gray-100 px-5 py-4 text-lg text-jw-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jw-blue dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            type="submit"
            disabled={!code.trim()}
            className="shrink-0 rounded-2xl bg-jw-blue px-7 py-4 text-lg font-bold text-white hover:opacity-90 disabled:opacity-40"
          >
            Apply
          </button>
        </form>

        {applied && (
          <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-base font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
            Coupon “{applied}” applied successfully.
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
