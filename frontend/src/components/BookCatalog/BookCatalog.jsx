import React, { useState } from 'react';
import { Search, Plus, Filter, Star, ChevronLeft, ChevronRight, BookMarked, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookDetailModal } from './BookDetailModal';
import { AddBookModal } from './AddBookModal';

export const BookCatalog = ({ books = [], onAddBook, onQuickIssue }) => {
  const { isLibrarian } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Subjects');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const genres = ['All Subjects', 'Fiction', 'Non-Fiction', 'History', 'Science'];

  // Filtering
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
      selectedGenre === 'All Subjects' || book.genre.toLowerCase() === selectedGenre.toLowerCase();

    const matchesStatus =
      selectedStatus === 'All' || book.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesGenre && matchesStatus;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Title & Librarian Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D3E] font-serif tracking-tight">
            Book Catalog & Search
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Browse through scholarly editions, scientific texts, and featured literature.
          </p>
        </div>

        {isLibrarian && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2 bg-[#0F3D3E] hover:bg-[#165355] text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-102"
          >
            <Plus className="w-4 h-4 text-[#C5A25A]" />
            <span>Add New Book</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar matching Screenshot 4 */}
      <div className="academic-card p-4 sm:p-5 bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          
          {/* Dark Pill Search Bar */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A25A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for books, authors, subjects..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#0F3D3E] text-white placeholder-slate-300 text-xs sm:text-sm rounded-full border border-[#C5A25A]/40 focus:border-[#C5A25A] focus:outline-none focus:ring-2 focus:ring-[#C5A25A]/30 transition-all shadow-inner"
            />
          </div>

          {/* Genre Filter Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full lg:w-auto pb-1 sm:pb-0 scrollbar-none">
            {genres.map((genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0F3D3E] text-white border-[#0F3D3E] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A25A]"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Issued">Issued</option>
            </select>
          </div>

        </div>
      </div>

      {/* Book Grid */}
      {paginatedBooks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No books found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your keywords or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4.5">
          {paginatedBooks.map((book) => {
            const isAvailable = book.status === 'Available' && (book.available_copies === undefined || book.available_copies > 0);
            return (
              <div
                key={book.id}
                className="academic-card p-3 sm:p-3.5 bg-white border border-slate-200 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Book Cover and Status Badge */}
                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-slate-100 shadow-sm mb-2.5">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Availability Badge */}
                  <span
                    className={`absolute bottom-2 left-2 right-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-center rounded-sm shadow-md ${
                      isAvailable
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {isAvailable ? 'AVAILABLE' : 'ISSUED'}
                  </span>
                </div>

                {/* Book Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-[#0F3D3E] transition-colors"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={book.author}>
                      By {book.author}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(book.rating || 4.5) ? 'text-[#C5A25A] fill-[#C5A25A]' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>

                  {/* Action Buttons matching Screenshot 4 */}
                  <div className="mt-3 space-y-1.5">
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="w-full py-1.5 px-2 bg-[#0F3D3E] hover:bg-[#165355] text-white text-[11px] font-semibold rounded-md transition-colors cursor-pointer text-center"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => onQuickIssue && onQuickIssue(book)}
                      className={`w-full py-1.5 px-2 text-[11px] font-bold rounded-md transition-colors cursor-pointer text-center ${
                        isAvailable
                          ? 'bg-[#C5A25A] hover:bg-[#b8954c] text-[#0F3D3E]'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      disabled={!isAvailable}
                    >
                      {isAvailable ? 'Request Book' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls matching reference screenshot */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="w-8 h-8 rounded-full bg-[#0F3D3E] text-white text-xs font-bold flex items-center justify-center shadow-sm">
          {currentPage}
        </span>

        {totalPages > 1 && (
          <button
            onClick={() => setCurrentPage(2)}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            2
          </button>
        )}

        {totalPages > 2 && (
          <span className="text-slate-400 text-xs px-1">...</span>
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onQuickIssue={onQuickIssue}
        />
      )}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={onAddBook}
      />
    </div>
  );
};
