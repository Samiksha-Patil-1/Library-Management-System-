import React, { useState } from 'react';
import { X, RotateCw, Calendar, CheckCircle } from 'lucide-react';

export const RenewModal = ({ transaction, onClose, onConfirmRenew }) => {
  if (!transaction) return null;

  const [loading, setLoading] = useState(false);
  const currentDueDate = new Date(transaction.return_due_date);
  const newDueDate = new Date(currentDueDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleRenew = async () => {
    setLoading(true);
    try {
      await onConfirmRenew(transaction.id, 14);
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
            <RotateCw className="w-5 h-5 text-[#C5A25A]" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#C5A25A]">Renew Book Loan</span>
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
            <h3 className="text-lg font-bold text-slate-900">Extend Borrowing Period</h3>
            <p className="text-xs text-slate-500 mt-1">Add +14 Days to Loan</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Book:</span>
              <span className="font-bold text-slate-800">{transaction.book_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Borrower:</span>
              <span className="font-bold text-slate-800">{transaction.student_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Current Due Date:</span>
              <span className="text-slate-600 font-mono">{transaction.return_due_date}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="text-[#0F3D3E] font-bold">New Extended Due Date:</span>
              <span className="text-[#0F3D3E] font-bold font-mono text-sm">{newDueDate}</span>
            </div>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-xs text-teal-800">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Eligible for semester extension. No renewal fee required.</span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleRenew}
              disabled={loading}
              className="px-5 py-2.5 bg-[#0F3D3E] hover:bg-[#165355] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:scale-102 flex items-center gap-2"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Renewing...' : 'Confirm 14-Day Extension'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
