import React from 'react';
import { Search } from 'lucide-react';

export const HeroBanner = ({ searchQuery, setSearchQuery, onSearchSubmit }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c353d] to-[#0A292A] text-white shadow-xl border border-[#C5A25A]/30">
      {/* Background Academic Library Visual */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80')`
        }}
      />
      
      {/* Warm Golden Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D3E]/95 via-[#0F3D3E]/85 to-transparent" />

      {/* Decorative Gold Border Line Accent */}
      <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-[#C5A25A] to-transparent" />
      <div className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-[#C5A25A] to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full min-h-[300px]">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A25A]/20 border border-[#C5A25A]/40 text-[#DFC27D] text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Center of Knowledge</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white font-serif leading-tight">
            WELCOME TO YOUR <br />
            <span className="text-[#DFC27D] drop-shadow-sm">ACADEMIC HUB</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed max-w-md font-light">
            Manage your library experience seamlessly. Find books, track issues, and explore new academic resources.
          </p>
        </div>

        {/* Pill Search Bar matching screenshot */}
        <div className="mt-6 max-w-lg">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (onSearchSubmit) onSearchSubmit();
            }}
            className="relative flex items-center shadow-lg"
          >
            <div className="absolute left-4 pointer-events-none text-[#C5A25A]">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books, authors, subjects..."
              className="w-full pl-12 pr-28 py-3.5 bg-[#0A292A]/90 hover:bg-[#0A292A] focus:bg-[#082223] text-white placeholder-slate-400 text-sm rounded-full border border-[#C5A25A]/60 focus:border-[#C5A25A] focus:outline-none focus:ring-2 focus:ring-[#C5A25A]/40 transition-all shadow-inner"
            />

            <button
              type="submit"
              className="absolute right-1.5 px-4 py-2 bg-[#C5A25A] hover:bg-[#b8954c] text-[#0F3D3E] text-xs font-bold rounded-full transition-all cursor-pointer shadow-md hover:scale-102"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
