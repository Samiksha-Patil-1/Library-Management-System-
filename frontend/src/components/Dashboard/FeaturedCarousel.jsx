import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export const FeaturedCarousel = ({ books = [], onSelectBook }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-8">
      {/* Header and Carousel navigation arrows */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F3D3E] tracking-tight font-serif flex items-center gap-2">
            <span>Featured Collections</span>
            <span className="w-2 h-2 rounded-full bg-[#C5A25A]" />
          </h2>
          <p className="text-xs text-slate-500 font-medium">Curated academic and premier literary selections</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-slate-300 hover:border-[#C5A25A] bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            aria-label="Previous books"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-slate-300 hover:border-[#C5A25A] bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            aria-label="Next books"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Books Row */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-thin scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="flex-none w-[175px] sm:w-[195px] academic-card p-3 sm:p-3.5 bg-white border border-slate-200/90 rounded-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            onClick={() => onSelectBook && onSelectBook(book)}
          >
            {/* Book Cover */}
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-slate-100 shadow-md group-hover:shadow-lg transition-shadow">
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Category pill */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0F3D3E]/85 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                {book.genre}
              </div>
            </div>

            {/* Book Details */}
            <div className="mt-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-[#0F3D3E] transition-colors" title={book.title}>
                  {book.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5" title={book.author}>
                  By {book.author}
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(book.rating || 4.8) ? 'text-[#C5A25A] fill-[#C5A25A]' : 'text-slate-300'}`}
                  />
                ))}
                <span className="text-[11px] font-bold text-slate-700 ml-1">{book.rating || 4.8}</span>
              </div>

              {/* View Details Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBook && onSelectBook(book);
                }}
                className="mt-3 w-full py-1.5 px-2 bg-[#0F3D3E] hover:bg-[#165355] text-white text-xs font-semibold rounded-lg shadow-sm transition-all text-center cursor-pointer group-hover:bg-[#C5A25A] group-hover:text-[#0F3D3E]"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
