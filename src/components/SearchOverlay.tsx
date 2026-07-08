import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Building2, TrendingUp, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<{ properties: any[], insights: any[] }>({ properties: [], insights: [] });
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        setResults({ properties: [], insights: [] });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      // Note: Real client-side text search is limited without Algolia/Elastic.
      // We'll fetch a batch and filter client-side for this demo.
      const propertiesSnap = await getDocs(query(collection(db, 'properties'), limit(20)));
      const insightsSnap = await getDocs(query(collection(db, 'insights'), limit(20)));

      const searchLower = searchQuery.toLowerCase();

      const filteredProperties = propertiesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter(p => 
          p.name?.toLowerCase().includes(searchLower) || 
          p.location?.toLowerCase().includes(searchLower)
        ).slice(0, 4);

      const filteredInsights = insightsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter(i => 
          i.title?.toLowerCase().includes(searchLower) || 
          i.summary?.toLowerCase().includes(searchLower)
        ).slice(0, 4);

      setResults({ properties: filteredProperties, insights: filteredInsights });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-brand-blue/95 backdrop-blur-xl flex flex-col pt-32 px-6"
        >
          <button 
            onClick={onClose}
            className="absolute top-10 right-10 p-4 text-brand-ivory/40 hover:text-brand-gold transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-4xl mx-auto w-full">
            <div className="relative mb-20">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 text-brand-gold" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder') || "Search for markets, insights, or properties..."}
                className="w-full bg-transparent border-b-2 border-brand-ivory/10 py-8 pl-16 text-4xl font-serif text-brand-ivory outline-none focus:border-brand-gold transition-all placeholder:text-brand-ivory/20"
              />
              {isSearching && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-20">
              {/* Property Results */}
              <div>
                <h3 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-10 pb-4 border-b border-white/5">
                  Investment Assets
                </h3>
                <div className="space-y-8">
                  {results.properties.length > 0 ? results.properties.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleNavigate(`/market-catalog?id=${p.id}`)}
                      className="group flex items-start gap-4 text-left w-full"
                    >
                      <div className="w-16 h-16 bg-white/5 overflow-hidden flex-shrink-0">
                        <img src={p.image} alt="" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                      </div>
                      <div>
                        <div className="text-brand-ivory font-serif text-lg group-hover:text-brand-gold transition-colors">{p.name}</div>
                        <div className="text-xs text-brand-gold uppercase tracking-widest">{p.location}</div>
                      </div>
                    </button>
                  )) : searchQuery.length > 1 && !isSearching ? (
                    <p className="text-brand-ivory/30 text-sm">No assets found</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                       <button onClick={() => handleNavigate('/market-catalog')} className="text-brand-ivory/40 hover:text-brand-gold transition-colors text-sm flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> View Market Catalog
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Insights Results */}
              <div>
                <h3 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-10 pb-4 border-b border-white/5">
                  Market Intel
                </h3>
                <div className="space-y-8">
                   {results.insights.length > 0 ? results.insights.map((i) => (
                    <button
                      key={i.id}
                      onClick={() => handleNavigate('/insights')}
                      className="group block text-left w-full"
                    >
                      <div className="text-brand-ivory font-serif text-lg group-hover:text-brand-gold transition-colors mb-1">{i.title}</div>
                      <div className="text-[10px] text-brand-ivory/40 uppercase tracking-widest">{i.category}</div>
                    </button>
                  )) : searchQuery.length > 1 && !isSearching ? (
                    <p className="text-brand-ivory/30 text-sm">No insights found</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <button onClick={() => handleNavigate('/insights')} className="text-brand-ivory/40 hover:text-brand-gold transition-colors text-sm flex items-center gap-2">
                        <Newspaper className="w-4 h-4" /> Browse Intel Feed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-32 pt-10 border-t border-white/5 flex justify-between items-center text-brand-ivory/20 text-[10px] font-bold uppercase tracking-[0.3em]">
              <span>Univue Discovery Gateway v2.0</span>
              <button 
                onClick={onClose}
                className="hover:text-brand-gold transition-colors flex items-center gap-2"
              >
                Press ESC to close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
