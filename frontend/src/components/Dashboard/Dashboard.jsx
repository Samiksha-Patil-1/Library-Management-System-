import React from 'react';
import { HeroBanner } from './HeroBanner';
import { StatCards } from './StatCards';
import { FeaturedCarousel } from './FeaturedCarousel';

export const Dashboard = ({
  stats,
  books = [],
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onSelectBook
}) => {
  return (
    <div className="space-y-8">
      {/* Top Section: Hero Banner on Left (Span 8) + Stat Cards on Right (Span 4) matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <HeroBanner
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={onSearchSubmit}
          />
        </div>

        <div className="lg:col-span-4">
          <StatCards stats={stats} />
        </div>
      </div>

      {/* Featured Collections Carousel matching Screenshot 2 */}
      <FeaturedCarousel
        books={books}
        onSelectBook={onSelectBook}
      />
    </div>
  );
};
