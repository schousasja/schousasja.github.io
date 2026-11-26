import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  items: string[];
  images: string[];
  ctaText: string;
  link: string;
  accentColor: 'gold' | 'blue';
  imageRight?: boolean;
  listHeader?: string;
}

export const ServiceCard = ({ id, title, description, items, images, ctaText, link, accentColor, imageRight, listHeader }: ServiceCardProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 8000);
    return () => clearInterval(timer);
  }, [nextImage]);

  return (
    <motion.div 
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col ${imageRight ? 'md:flex-row-reverse' : 'md:flex-row'} rounded-sm`}
    >
      <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden bg-gray-100">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIdx}
            className="absolute inset-0 will-change-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.img 
              src={images[currentIdx]} 
              alt={`${title} - ${currentIdx + 1}`} 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.05 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Dynamic Interactive Tints based on image index */}
            <div className={`absolute inset-0 pointer-events-none mix-blend-overlay transition-colors duration-1000 ${
              currentIdx % 3 === 0 ? 'bg-blue-900/30' :
              currentIdx % 3 === 1 ? 'bg-orange-500/20' :
              'bg-orange-700/40'
            }`} />
            <div className="absolute inset-0 bg-brand-gold/5 mix-blend-soft-light pointer-events-none"></div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? 'bg-brand-gold w-4' : 'bg-brand-ivory/50'}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={(e) => { e.preventDefault(); prevImage(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-brand-ivory/10 backdrop-blur-sm border border-brand-ivory/20 text-brand-ivory rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-gold hover:border-brand-gold z-20 font-bold"
          aria-label="Previous image"
        >
          &lt;
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); nextImage(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-brand-ivory/10 backdrop-blur-sm border border-brand-ivory/20 text-brand-ivory rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-gold hover:border-brand-gold z-20 font-bold"
          aria-label="Next image"
        >
          &gt;
        </button>
      </div>
      
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <h3 className="text-3xl font-serif font-normal mb-4 text-brand-blue tracking-tight">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">{description}</p>
        
        {listHeader && (
          <h4 className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4">
            {listHeader}
          </h4>
        )}

        <ul className="space-y-3 mb-10">
          {items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <div className="mt-2 w-1 h-1 rounded-full bg-brand-gold shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        
        <Link to={link} className="flex items-center gap-2 font-bold text-brand-blue hover:text-brand-gold transition-colors group/link uppercase text-[11px] tracking-widest">
          <span>{ctaText}</span>
        </Link>
      </div>
    </motion.div>
  );
};
