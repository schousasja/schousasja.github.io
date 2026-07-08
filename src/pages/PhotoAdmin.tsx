import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Sliders,
  Check,
  Globe,
  Compass
} from 'lucide-react';
import { useMarkets } from '../contexts/MarketContext';
import { useSiteSettings, PhotosMap } from '../contexts/SiteSettingsContext';
import { AdminNav } from '../components/AdminNav';

const HERO_ITEMS = [
  { id: 'hero_uae_col', title: 'Home Page Hero Panel 0 (UAE)', description: 'The leftmost background column in the interactive cover header.' },
  { id: 'hero_india_col', title: 'Home Page Hero Panel 1 (India)', description: 'The middle background column in the interactive cover header.' },
  { id: 'hero_seasia_col', title: 'Home Page Hero Panel 2 (SE Asia)', description: 'The rightmost background column in the interactive cover header.' },
  { id: 'about_hero', title: 'About Us Page Background', description: 'Large architectural visual behind the headline at the top of the About page.' },
  { id: 'about_why', title: "About Us - 'Our Why' Layout", description: 'Narrative illustration on the left of the "Our Why" about section.' },
  { id: 'about_approach', title: "About Us - 'Our Approach' Layout", description: 'Narrative illustration on the right of the "Our Approach" about section.' },
  { id: 'about_vision1', title: 'About Us - Vision Grid Image 1', description: 'The first box in the four-piece mission showcase collage.' },
  { id: 'about_vision2', title: 'About Us - Vision Grid Image 2', description: 'The second box in the four-piece mission showcase collage.' },
  { id: 'about_vision3', title: 'About Us - Vision Grid Image 3', description: 'The third box in the four-piece mission showcase collage.' },
  { id: 'about_vision4', title: 'About Us - Vision Grid Image 4', description: 'The fourth box in the four-piece mission showcase collage.' },
  { id: 'services_hero', title: 'Our Services Hero Header', description: 'Visual behind the header on the professional advisory services list.' },
  { id: 'questionnaire_hero', title: 'Advisory Questionnaire Banner', description: 'Visual behind the onboarding questionnaire screen.' },
  { id: 'catalog_hero', title: 'Market Real-Estate Catalog Banner', description: 'Header backdrop at the top of the browseable property inventory.' },
  { id: 'insights_hero', title: 'Publications & Insights Banner', description: 'Header photo at the top of the research papers list.' },
  { id: 'uae_microsite_hero', title: 'UAE Specific Microsite Banner', description: 'The leading banner photo inside the UAE Opportunities regional portal.' },
  { id: 'india_microsite_hero', title: 'India Specific Microsite Banner', description: 'The leading banner photo inside the India strategic expansion portal.' },
  { id: 'seasia_microsite_hero', title: 'SE Asia Specific Microsite Banner', description: 'The leading banner photo inside the SE Asia regional portal.' }
];

const MARKET_ITEMS = [
  { id: 'market_uae_slide1', title: 'UAE Core Market Showcase: Image 1', description: 'Slider photo 1 inside the UAE card on the homepage.' },
  { id: 'market_uae_slide2', title: 'UAE Core Market Showcase: Image 2', description: 'Slider photo 2 inside the UAE card on the homepage.' },
  { id: 'market_uae_slide3', title: 'UAE Core Market Showcase: Image 3', description: 'Slider photo 3 inside the UAE card on the homepage.' },
  
  { id: 'market_india_slide1', title: 'India Core Market Showcase: Image 1', description: 'Slider photo 1 inside the India card on the homepage.' },
  { id: 'market_india_slide2', title: 'India Core Market Showcase: Image 2', description: 'Slider photo 2 inside the India card on the homepage.' },
  { id: 'market_india_slide3', title: 'India Core Market Showcase: Image 3', description: 'Slider photo 3 inside the India card on the homepage.' },
  
  { id: 'market_seasia_slide1', title: 'SE Asia Core Market Showcase: Image 1', description: 'Slider photo 1 inside the Southeast Asia card on the homepage.' },
  { id: 'market_seasia_slide2', title: 'SE Asia Core Market Showcase: Image 2', description: 'Slider photo 2 inside the Southeast China/Asia card on the homepage.' },
  { id: 'market_seasia_slide3', title: 'SE Asia Core Market Showcase: Image 3', description: 'Slider photo 3 inside the Southeast China/Asia card on the homepage.' }
];

export const PhotoAdmin: React.FC = () => {
  const { profile } = useAuth();
  const { cities, updateCity, loading: marketsLoading } = useMarkets();
  const { photos, updatePhotos, loading: settingsLoading } = useSiteSettings();
  
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track modified photo URLs locally for preview
  const [localPhotoUrls, setLocalPhotoUrls] = useState<Record<string, string>>({});
  
  // Status feedback toast/alerts
  const [status, setStatus] = useState<{ id: string, type: 'success' | 'error', message: string } | null>(null);

  // Active workspace tab: heroes, core_markets, or cities
  const [activeTab, setActiveTab] = useState<'heroes' | 'core_markets' | 'cities'>('heroes');

  // Load photos and cities into local state
  useEffect(() => {
    if (photos) {
      setLocalPhotoUrls(prev => ({
        ...prev,
        ...photos
      }));
    }
  }, [photos]);

  useEffect(() => {
    if (cities && cities.length > 0) {
      const cityUrls: Record<string, string> = {};
      cities.forEach(c => {
        cityUrls[c.id] = c.image || '';
      });
      setLocalPhotoUrls(prev => ({ ...prev, ...cityUrls }));
    }
  }, [cities]);

  if (profile?.role !== 'admin') {
    return <Navigate to="/account" />;
  }

  const showToast = (id: string, type: 'success' | 'error', message: string) => {
    setStatus({ id, type, message });
    setTimeout(() => {
      setStatus(null);
    }, 4000);
  };

  // Perform Firestore operation to update the photo URL
  const handleSavePhotoChange = async (id: string, type: 'heroes' | 'core_markets' | 'cities', currentUrl: string) => {
    setSubmitting(id);
    try {
      if (type === 'heroes' || type === 'core_markets') {
        // Update in SiteSettings context
        await updatePhotos({
          [id]: currentUrl
        } as any);
      } else if (type === 'cities') {
        // Update via MarketContext
        await updateCity(id, {
          image: currentUrl
        });
      }
      showToast(id, 'success', 'Saved successfully to database!');
    } catch (err: any) {
      console.error("Failed to update layout photo:", err);
      showToast(id, 'error', `Save failed: ${err.message}`);
    } finally {
      setSubmitting(null);
    }
  };

  // Filters items by search query
  const getFilteredItems = () => {
    const searchLower = searchTerm.toLowerCase();
    
    if (activeTab === 'heroes') {
      return HERO_ITEMS.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      );
    } else if (activeTab === 'core_markets') {
      return MARKET_ITEMS.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      );
    } else {
      return cities.filter(c => 
        (c.name || '').toLowerCase().includes(searchLower) || 
        (c.country || '').toLowerCase().includes(searchLower)
      );
    }
  };

  const itemsToDisplay = getFilteredItems();

  return (
    <div className="pt-24 min-h-screen bg-brand-ivory selection:bg-brand-gold selection:text-brand-blue">
      <AdminNav />

      {/* Hero Workspace Header */}
      <section className="bg-brand-blue py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-brand-gold font-normal uppercase tracking-[0.4em] text-[10px] mb-3 font-sans">Arid Studio Layout Controls</h1>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-ivory leading-tight tracking-tighter">
                Website <span className="text-gold-gradient">Layout Media Hub</span>
              </h2>
              <p className="text-brand-ivory/60 text-xs italic mt-2 max-w-2xl font-sans">
                Streamlined administrative engine to modify photograph headers, hero sections, About us highlights, slide portfolios, and city banners website-wide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Control Tabs */}
      <section className="py-6 px-6 bg-white border-b border-gray-100 sticky top-[80px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center">
          
          <div className="flex border-b border-gray-100 w-full md:w-auto">
            {[
              { id: 'heroes', label: 'Heros & Headers', count: HERO_ITEMS.length, icon: Globe },
              { id: 'core_markets', label: 'Core Homepage Markets', count: MARKET_ITEMS.length, icon: Sliders },
              { id: 'cities', label: 'Cities & Regions Showcase', count: cities.length, icon: MapPin },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-2 px-5 py-3 text-[10px] uppercase tracking-widest font-black transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-brand-blue font-bold border-b-2 border-brand-gold' : 'text-gray-400 hover:text-brand-blue'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className="ml-1 text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full font-sans">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Search in ${activeTab}...`}
              className="w-full pl-9 pr-4 py-2 text-xs bg-brand-ivory border border-gray-200 outline-none focus:border-brand-gold transition-colors font-sans text-brand-blue"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-brand-blue text-[10px] font-sans">
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Workspace Body */}
      <section className="py-10 px-6 max-w-4xl mx-auto">
        
        {/* Dynamic Image Cards list */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-xl text-brand-blue">
              Modify Photographs: <span className="text-brand-gold capitalize">{activeTab.replace('_', ' ')}</span>
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold font-sans">
              Currently listing {itemsToDisplay.length} Nodes
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {itemsToDisplay.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-16 text-center border border-dashed border-gray-200"
                >
                  <p className="text-xs text-gray-400 font-sans italic">No active nodes match your filters.</p>
                </motion.div>
              ) : (
                itemsToDisplay.map((item, idx) => {
                  const currentPhotoUrl = localPhotoUrls[item.id] || '';
                  
                  // Saved URL logic
                  let savedUrl = '';
                  if (activeTab === 'heroes' || activeTab === 'core_markets') {
                    savedUrl = photos[item.id as keyof PhotosMap] || '';
                  } else {
                    savedUrl = (item as any).image || '';
                  }

                  const isSaved = savedUrl === currentPhotoUrl;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                      className="bg-white p-5 border border-gray-200/80 shadow-md hover:shadow-lg transition-all grid grid-cols-1 md:grid-cols-12 gap-5 relative overflow-hidden group"
                    >
                      {/* Active Status Alert */}
                      {status && status.id === item.id && (
                        <div className={`absolute top-0 left-0 right-0 py-1.5 px-4 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider transition-all z-10 ${
                          status.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          <span className="flex items-center gap-1.5">
                            {status.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {status.message}
                          </span>
                        </div>
                      )}

                      {/* Photo Thumbnail Visualiser */}
                      <div className="md:col-span-3 flex flex-col justify-start">
                        <div className="aspect-video md:aspect-[4/3] w-full bg-brand-ivory border border-gray-100 overflow-hidden relative shadow-inner">
                          {currentPhotoUrl ? (
                            <img 
                              src={currentPhotoUrl} 
                              alt={item.title || (item as any).name} 
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                              onError={(e) => {
                                (e.target as any).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&q=80&w=600';
                              }}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                              <ImageIcon className="w-8 h-8 mb-1" />
                              <span className="text-[8px] font-sans">Empty Link</span>
                            </div>
                          )}
                          
                          <div className="absolute top-2 left-2 flex gap-1 z-10">
                            <span className="text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-blue text-brand-ivory">
                              {activeTab.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1.5 flex justify-between items-center px-0.5">
                          <span className="text-[8px] text-gray-400 font-mono">
                            Aspect: Responsive
                          </span>
                          {!isSaved && (
                            <span className="text-[7.5px] uppercase font-sans font-black tracking-widest text-rose-500 bg-rose-50 px-1 py-0.2 animate-pulse">
                              Pending Unsaved Edits
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Configurations Input Block */}
                      <div className="md:col-span-9 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="font-serif text-base text-brand-blue mb-1 leading-tight font-semibold">
                              {item.title || (item as any).name}
                            </h4>
                            {(item as any).country && (
                              <span className="text-[9px] font-sans text-brand-blue/50 flex items-center gap-1 bg-brand-ivory px-2 py-0.5 rounded">
                                <Compass className="w-3 h-3 text-brand-gold" /> {(item as any).country}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                            {item.description || `Showcase photo configuring the regional identity for ${(item as any).name || 'the system layout'}.`}
                          </p>
                          
                          <div className="mt-3">
                            <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-brand-blue/40 mb-1.5">
                              Image URL Address (HTTPS Link)
                            </label>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={currentPhotoUrl}
                                onChange={e => setLocalPhotoUrls(prev => ({
                                  ...prev,
                                  [item.id]: e.target.value
                                }))}
                                className="flex-1 px-3 py-2 bg-brand-ivory border border-gray-100 text-[10px] font-mono select-all text-brand-blue outline-none focus:border-brand-gold transition-colors focus:bg-white"
                                placeholder="Paste clean photograph url here..."
                              />
                              
                              {currentPhotoUrl && (
                                <a 
                                  href={currentPhotoUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="px-2.5 bg-brand-ivory hover:bg-gray-100 text-brand-blue border border-gray-100 flex items-center justify-center transition-colors"
                                  title="Open live link"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Save Action */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                          {currentPhotoUrl && (
                            <button
                              onClick={() => {
                                setLocalPhotoUrls(prev => ({ ...prev, [item.id]: '' }));
                                showToast(item.id, 'success', 'URL cleared! Click "Save Image" to commit.');
                              }}
                              className="px-4 py-2 text-[9px] uppercase tracking-widest font-black transition-all border bg-white hover:bg-rose-50 border-gray-200 hover:border-rose-400 text-rose-500 cursor-pointer"
                            >
                              Clear Photo
                            </button>
                          )}
                          <button
                            disabled={submitting === item.id || isSaved}
                            onClick={() => handleSavePhotoChange(item.id, activeTab, currentPhotoUrl)}
                            className={`px-5 py-2 text-[9px] uppercase tracking-widest font-black flex items-center gap-1.5 transition-all outline-none border ${
                              isSaved 
                                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-brand-gold text-brand-blue border-brand-gold active:scale-[0.98] cursor-pointer hover:bg-brand-gold-light'
                            }`}
                          >
                            {submitting === item.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" /> Committing...
                              </>
                            ) : isSaved ? (
                              <>
                                <Check className="w-3 h-3" /> Configured
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" /> Save Image
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

      </section>
    </div>
  );
};
