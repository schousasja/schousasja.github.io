import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyImageSliderProps {
  images?: string[];
  defaultImage: string;
  alt: string;
}

export const PropertyImageSlider = ({ images, defaultImage, alt }: PropertyImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const allImages = (images && images.filter(img => img.trim() !== '').length > 0) 
    ? images.filter(img => img.trim() !== '') 
    : [defaultImage];

  if (allImages.length <= 1) {
    return (
      <img 
        src={allImages[0] || defaultImage} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800';
        }}
      />
    );
  }

  return (
    <div className="relative w-full h-full group/slider overflow-hidden">
      <img 
        src={allImages[currentIndex]} 
        alt={`${alt} - Photo ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-all duration-500"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800';
        }}
      />
      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setCurrentIndex(prev => (prev - 1 + allImages.length) % allImages.length);
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/85 hover:bg-white text-brand-blue flex items-center justify-center rounded-full opacity-0 group-hover/slider:opacity-100 transition-all shadow-md z-10 hover:scale-105"
      >
        <ChevronLeft className="w-4 h-4 text-brand-blue" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setCurrentIndex(prev => (prev + 1) % allImages.length);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/85 hover:bg-white text-brand-blue flex items-center justify-center rounded-full opacity-0 group-hover/slider:opacity-100 transition-all shadow-md z-10 hover:scale-105"
      >
        <ChevronRight className="w-4 h-4 text-brand-blue" />
      </button>
      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {allImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCurrentIndex(idx);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-brand-gold w-3' : 'bg-white/50 hover:bg-white'}`}
          />
        ))}
      </div>
    </div>
  );
};
