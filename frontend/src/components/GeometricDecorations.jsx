import React from 'react';

export const GeometricDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Right Geometric Line Accents */}
      <svg
        className="absolute top-12 right-0 w-48 h-64 opacity-60 text-[#C5A25A]"
        viewBox="0 0 200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M200 20L80 140L200 260" stroke="#C5A25A" strokeWidth="1.5" strokeOpacity="0.7" />
        <path d="M200 45L105 140L200 235" stroke="#0F3D3E" strokeWidth="1.2" strokeOpacity="0.4" />
        <path d="M200 70L130 140L200 210" stroke="#C5A25A" strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M200 95L155 140L200 185" stroke="#0F3D3E" strokeWidth="1" strokeOpacity="0.3" />
      </svg>

      {/* Bottom Left Geometric Line Accents */}
      <svg
        className="absolute bottom-6 left-0 w-48 h-64 opacity-60"
        viewBox="0 0 200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 260L120 140L0 20" stroke="#0F3D3E" strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M0 235L95 140L0 45" stroke="#C5A25A" strokeWidth="1.2" strokeOpacity="0.7" />
        <path d="M0 210L70 140L0 70" stroke="#0F3D3E" strokeWidth="1.5" strokeOpacity="0.5" />
        <path d="M0 185L45 140L0 95" stroke="#C5A25A" strokeWidth="1" strokeOpacity="0.4" />
      </svg>

      {/* Left Edge Dot Matrix (as seen in screenshots 1, 2, 3, 4) */}
      <div className="absolute left-6 top-1/2 -translate-y-12 hidden lg:grid grid-cols-4 gap-2 opacity-50">
        {[...Array(24)].map((_, i) => (
          <div key={`dot-l-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#0F3D3E]" />
        ))}
      </div>

      {/* Right Edge Dot Matrix */}
      <div className="absolute right-8 bottom-16 hidden lg:grid grid-cols-4 gap-2 opacity-40">
        {[...Array(16)].map((_, i) => (
          <div key={`dot-r-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#C5A25A]" />
        ))}
      </div>
    </div>
  );
};
