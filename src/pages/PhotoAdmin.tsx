import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { MapPin, Search, Image as ImageIcon, Save, CheckCircle2, AlertCircle, Loader2, ExternalLink, Sliders, Check, Globe, Compass } from 'lucide-react';
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
  const { cities, updateCity } = useMarkets();
  const { photos, updatePhotos } = useSiteSettings();
  
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local modifications state
  const [localPhotoUrls, setLocalPhotoUrls] = useState<Record<string, string>>({});
  
  // Status feedback toast/alerts
  const [status, setStatus] = useState<{ id: string, type: 'success' | 'error', message: string } | null>(null);

  // Active workspace tab
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
    } else if (activeTab === 'cities') {
      return cities.filter(c => 
        (c.name || '').toLowerCase().includes(searchLower) || 
        (c.country || '').toLowerCase().includes(searchLower)
      );
    }
    return [];
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
              <span className="text-brand-gold text-[9px] uppercase tracking-widest font-bold block mb-2 font-sans">
                Content & Layout Media Control
              </span>
              <h1 className="text-3xl md:text-4xl font-serif text-brand-ivory leading-tight tracking-tighter">
                Website <span className="text-gold-gradient">Photo & Visual Assets</span>
              </h1>
              <p className="text-brand-ivory/70 text-xs italic mt-2 max-w-2xl font-sans">
                Update, replace, and curate high-resolution photographic banners, hero backdrops, and regional highlights across the entire Univue Consultants portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Tabs & Search */}
      <section className="py-4 px-6 bg-white border-b border-gray-100 sticky top-[80px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center">
          
          {/* Workspace Tabs */}
          <div className="flex border-b border-gray-100 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'heroes', label: 'Heros & Page Headers', count: HERO_ITEMS.length, icon: Globe },
              { id: 'core_markets', label: 'Core Homepage Markets', count: MARKET_ITEMS.length, icon: Sliders },
              { id: 'cities', label: 'Cities & Regions Showcase', count: cities.length, icon: MapPin },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-2 px-5 py-3 text-[10px] uppercase tracking-widest font-black transition-all relative whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id ? 'text-brand-blue font-bold border-b-2 border-brand-gold bg-brand-ivory/50' : 'text-gray-400 hover:text-brand-blue'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-brand-gold' : ''}`} />
                {tab.label}
                <span className="ml-1 text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full font-sans">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Search ${itemsToDisplay.length} image slots...`}
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

      {/* Grid of Photo Cards */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        
        {/* Toast / Status alert */}
        {status && (
          <div className={`mb-6 p-4 border flex items-center justify-between transition-all ${
            status.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'
          }`}>
            <div className="flex items-center gap-3 text-xs font-bold font-sans">
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
              <span>{status.message}</span>
            </div>
            <button onClick={() => setStatus(null)} className="text-xs font-mono uppercase hover:opacity-75">Dismiss</button>
          </div>
        )}

        {itemsToDisplay.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-200">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4 stroke-1" />
            <h3 className="font-serif text-lg text-brand-blue">No visual layout slots match your search</h3>
            <p className="text-xs text-gray-500 font-sans mt-1">Try a different keyword or reset the filter.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-brand-blue text-brand-gold font-sans text-xs uppercase tracking-wider font-bold"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsToDisplay.map((item: any) => {
              const currentUrl = localPhotoUrls[item.id] || '';
              const isSubmittingThis = submitting === item.id;
              
              // For cities, item has name/country; for heroes, item has title/description
              const title = item.title || `${item.name}, ${item.country}`;
              const description = item.description || `Showcase photo for city card: ${item.name} (${item.country}).`;

              return (
                <div key={item.id} className="bg-white border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  
                  {/* Top info & live image view */}
                  <div>
                    {/* Live Preview Container */}
                    <div className="aspect-[16/9] w-full bg-brand-blue/10 relative overflow-hidden border-b border-gray-100 group">
                      {currentUrl ? (
                        <img 
                          src={currentUrl} 
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-[10px] font-sans">No photo URL configured</span>
                        </div>
                      )}

                      {/* Tag Overlay */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-brand-blue/80 backdrop-blur-xs text-[8px] uppercase tracking-widest text-brand-gold font-bold">
                        {activeTab === 'cities' ? 'City Media' : activeTab === 'core_markets' ? 'Market Slider' : 'Page Header'}
                      </div>
                    </div>

                    {/* Meta description */}
                    <div className="p-4">
                      <h4 className="font-serif text-brand-blue text-sm font-semibold leading-tight line-clamp-1">
                        {title}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-sans mt-1 line-clamp-2 leading-relaxed">
                        {description}
                      </p>

                      {/* Image Input field */}
                      <div className="mt-4">
                        <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-brand-blue/60 mb-1">
                          Image HTTPS URL (Unsplash or CDN)
                        </label>
                        <input
                          type="text"
                          value={currentUrl}
                          onChange={(e) => {
                            setLocalPhotoUrls(prev => ({
                              ...prev,
                              [item.id]: e.target.value
                            }));
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 bg-brand-ivory border border-gray-200 text-xs font-mono select-all text-brand-blue outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between gap-3">
                    {currentUrl ? (
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-gray-400 hover:text-brand-blue flex items-center gap-1 font-sans transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> View Source
                      </a>
                    ) : <div />}

                    <button
                      disabled={isSubmittingThis}
                      onClick={() => handleSavePhotoChange(item.id, activeTab, currentUrl)}
                      className="px-4 py-2 bg-brand-blue text-brand-gold hover:bg-brand-gold hover:text-brand-blue font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingThis ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3" /> Save Image
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
