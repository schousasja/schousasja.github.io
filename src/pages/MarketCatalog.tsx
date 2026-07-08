import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { properties as mockProperties } from '../constants/properties';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { Globe2, TrendingUp, Building2, MapPin, ArrowRight, ShieldCheck, Tag, Loader2 } from 'lucide-react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { useMarkets } from '../contexts/MarketContext';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { Search, Filter, ChevronDown, ListFilter, Calendar, Heart } from 'lucide-react';

export const MarketCatalog = () => {
  const { t } = useLanguage();
  const { markets, cities } = useMarkets();
  const { photos } = useSiteSettings();
  const navigate = useNavigate();

  useDocumentMetadata({
    title: t('nav.catalog') || 'Explore Market Catalog',
    description: t('catalog.hero.desc') || 'A curated selection of high-yield institutional-grade real estate assets across global growth corridors.',
    keywords: 'off-plan property, investment catalog, high yield properties Dubai, Bangalore IT office space'
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('univue_favorites');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('univue_favorites', JSON.stringify(newFavorites));
  };
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarket, setActiveMarket] = useState('all');
  const [activeCity, setActiveCity] = useState('all');
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'yield-desc'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const props = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Parse price for sorting if it's a string like "AED 2.45M" or "$400k"
        numericPrice: parseNumericPrice(doc.data().startingPrice),
        numericYield: parseFloat(doc.data().expectedYield) || 0,
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      setProperties(props);
    } catch (error) {
      console.error("Firestore fetch failed:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const parseNumericPrice = (priceStr: string) => {
    if (!priceStr) return 0;
    const clean = priceStr.toLowerCase().replace(/[^0-9.]/g, '');
    let val = parseFloat(clean) || 0;
    if (priceStr.toLowerCase().includes('m')) val *= 1000000;
    if (priceStr.toLowerCase().includes('k')) val *= 1000;
    // Basic exchange rate normalization if multiple currencies are used, 
    // but here we just treat them as numbers for relative sorting.
    return val;
  };

  const propertyTypes = ["Apartment", "Villa", "Townhouse", "Penthouse", "Commercial", "Land"];

  const filteredProperties = properties
    .filter(prop => {
      const matchesSearch = prop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             prop.developer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMarket = activeMarket === 'all' || prop.country === activeMarket;
      const matchesCity = activeCity === 'all' || prop.cityId === activeCity;
      const matchesType = activePropertyType === 'all' || prop.type === activePropertyType;
      
      return matchesSearch && matchesMarket && matchesCity && matchesType;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'newest': return b.createdAt - a.createdAt;
        case 'oldest': return a.createdAt - b.createdAt;
        case 'price-asc': return a.numericPrice - b.numericPrice;
        case 'price-desc': return b.numericPrice - a.numericPrice;
        case 'yield-desc': return b.numericYield - a.numericYield;
        default: return 0;
      }
    });

  return (
    <div className="pt-24 min-h-screen bg-brand-ivory selection:bg-brand-gold selection:text-brand-ivory">
      {/* Catalog Header */}
      <section className="relative h-[40vh] flex items-center overflow-hidden bg-brand-blue">
        <div className="absolute inset-0">
          <img 
            src={photos.catalog_hero} 
            alt="Modern Architecture" 
            className="w-full h-full object-cover grayscale-[0.5] brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-brand-gold font-normal uppercase tracking-[0.4em] text-[10px] mb-6">{t('catalog.hero.tag')}</h1>
              <h2 className="text-5xl md:text-7xl font-serif text-brand-ivory leading-[1.1] tracking-tighter mb-8">
                {t('catalog.hero.title1')} <span className="text-gold-gradient">{t('catalog.hero.title2')}</span>.
              </h2>
              <p className="text-brand-ivory/60 text-lg font-light leading-relaxed max-w-xl">
                {t('catalog.hero.desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Filter Interface */}
      <section className="sticky top-20 z-40 bg-brand-ivory border-b border-gray-100 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search properties, developers, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 text-xs text-brand-blue focus:border-brand-gold outline-none transition-all placeholder:text-gray-300 font-medium"
              />
            </div>

            {/* Quick Actions & Count */}
            <div className="flex items-center gap-6">
              <div className="hidden sm:block text-[9px] uppercase font-bold tracking-[0.2em] text-gray-400">
                {loading ? (
                  <span className="inline-block w-40 h-3 bg-gray-200/50 animate-pulse rounded" />
                ) : (
                  <>Found <span className="text-brand-blue">{filteredProperties.length}</span> Matching Assets</>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative group">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as any)}
                    className="appearance-none pl-10 pr-10 py-3 bg-white border border-gray-100 text-[9px] uppercase tracking-widest font-black text-brand-blue outline-none focus:border-brand-gold cursor-pointer"
                  >
                    <option value="newest">Newest Listings</option>
                    <option value="oldest">Oldest Listings</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="yield-desc">Highest Yield First</option>
                  </select>
                  <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-gold" />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                </div>

                {/* Filter Toggle */}
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-6 py-3 border transition-all text-[9px] uppercase tracking-widest font-black ${
                    isFilterOpen ? 'bg-brand-blue text-brand-ivory border-brand-blue' : 'bg-white text-brand-blue border-gray-100'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {isFilterOpen ? 'Close Filters' : 'Advanced Filters'}
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters Pane */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 mt-4 border-t border-gray-50">
                  {/* Market Select */}
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.3em] font-black text-brand-gold mb-3">Investment Market</label>
                    <div className="flex flex-wrap gap-2">
                       <button 
                        onClick={() => { setActiveMarket('all'); setActiveCity('all'); }}
                        className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all ${activeMarket === 'all' ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'border-gray-100 hover:border-brand-gold/50'}`}
                      >
                        Global
                      </button>
                      {markets.map(m => (
                        <button 
                          key={m.id}
                          onClick={() => { setActiveMarket(m.name); setActiveCity('all'); }}
                          className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all ${activeMarket === m.name ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'border-gray-100 hover:border-brand-gold/50'}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City Select */}
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.3em] font-black text-brand-gold mb-3">Sub-Market Focus</label>
                    <select 
                      value={activeCity}
                      onChange={(e) => setActiveCity(e.target.value)}
                      disabled={activeMarket === 'all'}
                      className="w-full bg-white border border-gray-100 px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest outline-none focus:border-brand-gold disabled:opacity-30 transition-all"
                    >
                      <option value="all">All Cities</option>
                      {cities.filter(c => c.country === activeMarket).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Asset Type Select */}
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.3em] font-black text-brand-gold mb-3">Asset Classification</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setActivePropertyType('all')}
                        className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all ${activePropertyType === 'all' ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'border-gray-100 hover:border-brand-gold/50'}`}
                      >
                        All Assets
                      </button>
                      {propertyTypes.map(type => (
                        <button 
                          key={type}
                          onClick={() => setActivePropertyType(type)}
                          className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all ${activePropertyType === type ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'border-gray-100 hover:border-brand-gold/50'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pb-8">
                  <button 
                    onClick={() => {
                      setActiveMarket('all');
                      setActiveCity('all');
                      setActivePropertyType('all');
                      setSearchQuery('');
                      setSortOption('newest');
                    }}
                    className="text-[9px] uppercase tracking-widest font-black text-red-400 hover:text-red-600 transition-colors"
                  >
                    Reset All Discovery Parameters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="py-24 px-6 min-h-[60rem]">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex flex-col h-full bg-white border border-gray-100 shadow-sm animate-pulse">
                  {/* Imagery Pulse */}
                  <div className="relative aspect-[16/10] bg-gray-200">
                    <div className="absolute top-4 left-4 w-16 h-5 bg-gray-300 rounded" />
                    <div className="absolute top-4 right-4 w-16 h-5 bg-gray-300 rounded" />
                    <div className="absolute bottom-4 left-4 w-20 h-4 bg-gray-300 rounded" />
                  </div>

                  {/* Content Pulse */}
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="mb-6">
                      <div className="w-3/4 h-7 bg-gray-200 rounded mb-3" />
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 bg-gray-300 rounded-full" />
                        <div className="w-24 h-3 bg-gray-200 rounded" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-gray-50/50 p-4 border border-gray-100">
                        <div className="w-12 h-2.5 bg-gray-200 rounded mb-2" />
                        <div className="w-16 h-4 bg-gray-300 rounded" />
                      </div>
                      <div className="bg-gray-50/50 p-4 border border-gray-100">
                        <div className="w-12 h-2.5 bg-gray-200 rounded mb-2" />
                        <div className="w-16 h-4 bg-gray-300 rounded" />
                      </div>
                    </div>

                    {/* Developer Pulse */}
                    <div className="mb-8 p-4 border-l-2 border-brand-gold bg-brand-gold/5">
                      <div className="w-20 h-3 bg-gray-200 rounded mb-2" />
                      <div className="w-full h-3 bg-gray-150 rounded" />
                    </div>

                    <div className="space-y-2 mb-10">
                      <div className="w-1/2 h-2.5 bg-gray-150 rounded" />
                      <div className="w-2/3 h-2.5 bg-gray-150 rounded" />
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="w-16 h-3 bg-gray-150 rounded" />
                      <div className="w-24 h-8 bg-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {filteredProperties.map((prop, i) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group flex flex-col h-full bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-brand-gold/20"
                >
                  {/* Large Imagery */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={prop.image} 
                      alt={prop.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/60 via-transparent to-transparent opacity-40"></div>
                    <div className="absolute top-4 left-4 bg-brand-gold/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-brand-blue border border-brand-blue/5 shadow-lg">
                      {prop.status}
                    </div>
                    {prop.type && (
                       <div className="absolute top-4 right-4 bg-brand-ivory/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-brand-blue border border-brand-blue/5 shadow-lg">
                       {prop.type}
                     </div>
                    )}
                    <button 
                      onClick={(e) => toggleFavorite(prop.id, e)}
                      className="absolute top-12 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform text-brand-blue z-10"
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(prop.id) ? 'fill-red-500 text-red-500' : 'text-brand-blue'}`} />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-brand-blue/80 backdrop-blur-md px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-brand-ivory border border-white/10">
                      {prop.country}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-serif text-brand-blue group-hover:text-brand-gold transition-colors">{prop.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-brand-gold" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black leading-none">
                          {prop.location}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-gray-50/50 p-4 border border-gray-100 transition-colors group-hover:bg-brand-gold/5">
                        <div className="flex items-center gap-1.5 text-brand-gold mb-1">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-[9px] font-black tracking-widest uppercase">{t('catalog.yield')}</span>
                        </div>
                        <div className="text-xl font-serif text-brand-blue">{prop.expectedYield}</div>
                      </div>
                      <div className="bg-gray-50/50 p-4 border border-gray-100 transition-colors group-hover:bg-brand-gold/5">
                        <div className="flex items-center gap-1.5 text-brand-gold mb-1">
                          <Tag className="w-3 h-3" />
                          <span className="text-[9px] font-black tracking-widest uppercase">{t('catalog.starting')}</span>
                        </div>
                        <div className="text-sm font-bold text-brand-blue truncate" title={prop.startingPrice}>{prop.startingPrice}</div>
                      </div>
                    </div>

                    {/* Developer Credibility */}
                    {prop.developer && (
                      <div className="mb-8 p-4 border-l-2 border-brand-gold bg-brand-gold/5">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue">
                            {prop.developer.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 italic leading-relaxed antialiased">
                          "{prop.developer.credibility}"
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 mb-10">
                      {prop.highlights?.slice(0, 3).map((highlight: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-1 h-1 bg-brand-gold/40 rounded-full" />
                          <span className="text-[9px] text-brand-blue uppercase tracking-widest font-bold opacity-60 italic">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                       <div className="flex items-center gap-2 text-[8px] text-gray-400 font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {prop.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                      <button 
                        onClick={() => navigate('/book')}
                        className="py-3 px-8 bg-brand-blue text-brand-ivory text-[9px] uppercase tracking-widest font-black flex items-center justify-center gap-2 group-hover:bg-brand-gold group-hover:text-brand-blue transition-all duration-300 shadow-md"
                      >
                        {t('catalog.inquire')}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-brand-gold/40" />
              </div>
              <h4 className="text-xl font-serif text-brand-blue mb-2">No Matching Discovery</h4>
              <p className="text-sm text-gray-400 leading-relaxed antialiased font-light">
                We couldn't find any properties matching your current filters. Try adjusting your parameters or resetting the discovery engine.
              </p>
              <button 
                onClick={() => {
                  setActiveMarket('all');
                  setActiveCity('all');
                  setActivePropertyType('all');
                  setSearchQuery('');
                }}
                className="mt-8 text-brand-gold text-[10px] font-black uppercase tracking-widest border-b border-brand-gold pb-1"
              >
                Clear All Discovery Parameters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Strategic Coordination Layer */}
      <section className="py-24 bg-brand-ivory text-brand-blue relative overflow-hidden border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-brand-gold font-normal uppercase tracking-[0.4em] text-[10px] mb-6">
              {t('catalog.intel.tag')}
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif leading-tight tracking-tighter mb-6 max-w-2xl">
              {t('catalog.intel.title')}
            </h3>
            <p className="text-brand-blue/70 text-base md:text-lg font-light leading-relaxed max-w-2xl mb-10">
              {t('catalog.intel.desc')}
            </p>
            <button 
              onClick={() => navigate('/questionnaire')}
              className="btn-briefing"
            >
              {t('catalog.intel.cta')}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
