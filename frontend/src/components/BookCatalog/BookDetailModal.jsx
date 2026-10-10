import React from 'react';
import { X, Star, BookOpen, MapPin, CheckCircle, AlertCircle, Copy, ArrowRight } from 'lucide-react';

export const BookDetailModal = ({ book, onClose, onQuickIssue }) => {
  if (!book) return null;

  const isAvailable = book.status === 'Available' && (book.available_copies === undefined || book.available_copies > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F3D3E] text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C5A25A]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#C5A25A]">Book Catalog Details</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Cover & Badges */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-48 aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-slate-200 relative group">
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                isAvailable
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-amber-600 text-white shadow-md'
              }`}>
                {book.status}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(book.rating || 4.5) ? 'text-[#C5A25A] fill-[#C5A25A]' : 'text-slate-300'}`}
                />
              ))}
              <span className="text-sm font-bold text-slate-800 ml-1">{book.rating || 4.8} / 5.0</span>
            </div>

            <div className="mt-2 text-xs text-slate-500 font-medium">
              Published: {book.published_year || 2021}
            </div>
          </div>

          {/* Details & Specs */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0F3D3E]/10 text-[#0F3D3E]">
                {book.genre}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 font-serif leading-tight">
                {book.title}
              </h2>

              <p className="text-sm font-medium text-slate-600 mt-1">
                By <span className="text-[#0F3D3E] font-semibold">{book.author}</span>
              </p>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">ISBN</span>
                  <span className="font-bold text-slate-800 font-mono">{book.isbn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Location</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C5A25A]" />
                    {book.shelf_location || 'Floor 2, Shelf F-04'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Copies</span>
                  <span className="font-bold text-slate-800">{book.total_copies ?? 5} units</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Available</span>
                  <span className={`font-bold ${isAvailable ? 'text-emerald-700' : 'text-red-600'}`}>
                    {book.available_copies ?? (isAvailable ? 4 : 0)} in library
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Synopsis</h4>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto">
                  {book.description || 'A remarkable work in the academic repository, selected for coursework, scholarly research, and intellectual enrichment.'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onQuickIssue) onQuickIssue(book);
                }}
                className={`px-5 py-2.5 text-xs font-bold rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  isAvailable
                    ? 'bg-[#0F3D3E] hover:bg-[#165355] text-white hover:scale-102'
                    : 'bg-[#C5A25A] hover:bg-[#b59247] text-[#0F3D3E] hover:scale-102'
                }`}
              >
                <span>{isAvailable ? 'Issue This Book' : 'Place Reservation Request'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
