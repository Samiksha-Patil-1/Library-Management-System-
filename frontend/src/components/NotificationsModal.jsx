import React, { useState } from 'react';
import { X, Bell, AlertTriangle, Mail, CheckCircle2, Clock } from 'lucide-react';

export const NotificationsModal = ({ isOpen, onClose, overdueTransactions = [] }) => {
  const [sentReminders, setSentReminders] = useState({});
  const [bulkSent, setBulkSent] = useState(false);

  if (!isOpen) return null;

  const handleSendReminder = (id) => {
    setSentReminders(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSentReminders(prev => ({ ...prev, [id]: false }));
    }, 4000);
  };

  const handleBulkRemind = () => {
    setBulkSent(true);
    setTimeout(() => {
      setBulkSent(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F3D3E] text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#C5A25A]" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#C5A25A]">
              Overdue Alerts & Notice Center
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Pending Overdue Books</h3>
              <p className="text-xs text-slate-500">Students with unreturned materials past expiration date</p>
            </div>
            {overdueTransactions.length > 0 && (
              <button
                onClick={handleBulkRemind}
                className="px-3 py-1.5 bg-[#C5A25A] hover:bg-[#b59247] text-[#0F3D3E] font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Notify All ({overdueTransactions.length})</span>
              </button>
            )}
          </div>

          {bulkSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Automated electronic reminder notices sent to all delinquent accounts!</span>
            </div>
          )}

          {overdueTransactions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">All books are in good standing!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">No overdue loans are currently recorded.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTransactions.map((tx) => {
                const wasSent = sentReminders[tx.id];
                return (
                  <div
                    key={tx.id || tx.transaction_code}
                    className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{tx.book_title}</h4>
                          <span className="text-[10px] font-mono font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            Due: {tx.return_due_date}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Borrower: <strong className="text-slate-800">{tx.student_name}</strong> ({tx.student_code || '22401'})
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-rose-500" />
                          <span>Fine accrued: ${Number(tx.fine_amount || 12.00).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendReminder(tx.id)}
                      disabled={wasSent}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                        wasSent
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-[#0F3D3E] hover:bg-[#165355] text-white shadow-xs'
                      }`}
                    >
                      {wasSent ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Notified</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3 h-3 text-[#C5A25A]" />
                          <span>Send Notice</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
