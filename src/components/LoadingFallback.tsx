import React from 'react';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-brand-ivory text-brand-blue">
      <div className="relative w-12 h-12 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-brand-gold/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-brand-gold border-t-transparent animate-spin"></div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue/60">
        Loading Advisory Environment...
      </p>
    </div>
  );
};
