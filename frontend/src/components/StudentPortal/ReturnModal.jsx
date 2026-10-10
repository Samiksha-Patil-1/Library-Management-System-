import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, DollarSign, ArrowLeft } from 'lucide-react';

export const ReturnModal = ({ transaction, onClose, onConfirmReturn }) => {
  if (!transaction) return null;

  const [loading, setLoading] = useState(false);
  const today = new Date();
  const dueDate = new Date(transaction.return_due_date);
  
  let calculatedFine = 0;
  if (today > dueDate) {
    const diffDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    calculatedFine = Math.max(0, diffDays * 1.0);
  } else if (transaction.fine_amount) {
    calculatedFine = Number(transaction.fine_amount);
  }

  const handleReturn = async () => {
    setLoading(true);
    try {
      await onConfirmReturn(transaction.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F3D3E] text-white">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-[#C5A25A]" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#C5A25A]">Process Book Return</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900">Confirm Book Return</h3>
            <p className="text-xs text-slate-500 mt-1">Transaction #{transaction.transaction_code}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Student:</span>
              <span className="font-bold text-slate-800">{transaction.student_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Book Title:</span>
              <span className="font-bold text-slate-800">{transaction.book_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Issue Date:</span>
              <span className="text-slate-700 font-mono">{transaction.issue_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Due Date:</span>
              <span className="text-slate-700 font-mono">{transaction.return_due_date}</span>
            </div>
          </div>

          {calculatedFine > 0 ? (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs font-semibold text-rose-800">Overdue Fine Incurred:</span>
              </div>
              <span className="text-sm font-extrabold text-rose-700">${calculatedFine.toFixed(2)}</span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Returned in good standing. No outstanding fines.</span>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleReturn}
              disabled={loading}
              className="px-5 py-2.5 bg-[#C5A25A] hover:bg-[#b8954c] text-[#0F3D3E] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:scale-102"
            >
              {loading ? 'Processing...' : 'Confirm Return & Restock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
