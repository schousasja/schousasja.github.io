import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Globe, MapPin, ChevronRight, Save, X } from 'lucide-react';
import { useMarkets, Market, City } from '../contexts/MarketContext';

import { AdminNav } from '../components/AdminNav';

export const MarketManagementAdmin: React.FC = () => {
  const { markets, cities, addMarket, updateMarket, deleteMarket, addCity, updateCity, deleteCity } = useMarkets();
  
  const [activeTab, setActiveTab] = useState<'markets' | 'cities'>('markets');
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isAddingMarket, setIsAddingMarket] = useState(false);
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingCityId, setDeletingCityId] = useState<string | null>(null);

  const [marketForm, setMarketForm] = useState<Omit<Market, 'id'>>({ name: '', slug: '', order: 0 });
  const [cityForm, setCityForm] = useState<Omit<City, 'id'>>({
    name: '',
    marketId: '',
    country: '',
    thesis: '',
    targetBuyer: '',
    avgPricing: '',
    rentalYield: '',
    positioning: 'Balanced',
    infraGrowth: '',
    relevance: '',
    image: '',
  });

  const handleEditMarket = (market: Market) => {
    setEditingMarket(market);
    setMarketForm({ name: market.name, slug: market.slug, order: market.order });
    setIsAddingMarket(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setCityForm({ ...city });
    setIsAddingCity(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMarket) {
      await updateMarket(editingMarket.id, marketForm);
    } else {
      await addMarket(marketForm);
    }
    setEditingMarket(null);
    setIsAddingMarket(false);
    setMarketForm({ name: '', slug: '', order: 0 });
  };

  const handleDeleteMarket = async (id: string) => {
    if (deletingId !== id) {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
      return;
    }
    setDeletingId(null);
    await deleteMarket(id);
  };

  const handleDeleteCity = async (id: string) => {
    if (deletingCityId !== id) {
      setDeletingCityId(id);
      setTimeout(() => setDeletingCityId(null), 3000);
      return;
    }
    setDeletingCityId(null);
    await deleteCity(id);
  };

  const saveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCity) {
      await updateCity(editingCity.id, cityForm);
    } else {
      await addCity(cityForm);
    }
    setEditingCity(null);
    setIsAddingCity(false);
    setCityForm({
      name: '',
      marketId: '',
      country: '',
      thesis: '',
      targetBuyer: '',
      avgPricing: '',
      rentalYield: '',
      positioning: 'Balanced',
      infraGrowth: '',
      relevance: '',
      image: '',
    });
  };

  return (
    <div className="min-h-screen bg-brand-ivory pt-24 pb-20 selection:bg-brand-gold selection:text-brand-ivory">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-brand-gold font-normal uppercase tracking-[0.4em] text-[10px] mb-4">Strategic Architecture</h1>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-blue leading-tight tracking-tighter mb-4">
            Market <span className="text-brand-gold">Hierarchy</span>.
          </h2>
          <p className="text-brand-blue/60 max-w-2xl mb-8 text-sm italic">
            Control the global investment structure. Deploy changes to navigation and market intelligence layers in real-time.
          </p>

          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('markets')}
              className={`pb-4 px-8 text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === 'markets' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-brand-blue/40 border-b-2 border-transparent'
              }`}
            >
              Markets
            </button>
            <button 
              onClick={() => setActiveTab('cities')}
              className={`pb-4 px-8 text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === 'cities' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-brand-blue/40 border-b-2 border-transparent'
              }`}
            >
              Cities & Regions
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'markets' ? (
            <motion.div 
              key="markets"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif text-2xl text-brand-blue">Active Markets</h2>
                  <button 
                    onClick={() => { setIsAddingMarket(true); setEditingMarket(null); }}
                    className="p-2 text-brand-gold hover:bg-brand-gold/5 rounded-full transition-colors"
                    title="Add Market"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden divide-y divide-gray-100">
                  {markets.map((market) => (
                    <div 
                      key={market.id} 
                      className={`p-4 flex items-center justify-between hover:bg-brand-blue/5 transition-colors cursor-pointer ${editingMarket?.id === market.id ? 'bg-brand-blue/5 border-l-4 border-brand-gold' : ''}`}
                      onClick={() => handleEditMarket(market)}
                    >
                      <div>
                        <h3 className="font-medium text-brand-blue">{market.name}</h3>
                        <p className="text-[10px] text-brand-blue/40 uppercase tracking-widest italic">{market.slug}</p>
                      </div>
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => handleDeleteMarket(market.id)} 
                          className={`p-2 transition-all duration-300 ${deletingId === market.id ? 'text-red-600 font-bold bg-red-50 text-[10px]' : 'text-brand-blue/40 hover:text-red-600'}`}
                        >
                          {deletingId === market.id ? 'CONFIRM' : <Trash2 size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {(isAddingMarket || editingMarket) ? (
                    <motion.div 
                      key="market-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-8 rounded-lg shadow-xl border border-brand-gold/20"
                    >
                      <form onSubmit={saveMarket} className="space-y-8">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                          <h3 className="font-serif text-2xl text-brand-blue">
                            {editingMarket ? `Edit Market: ${editingMarket.name}` : 'Create New Market'}
                          </h3>
                          <button type="button" onClick={() => { setIsAddingMarket(false); setEditingMarket(null); }} className="text-brand-blue/40 hover:text-brand-blue">
                            <X size={24} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Display Name</label>
                              <input 
                                type="text" 
                                required
                                value={marketForm.name}
                                onChange={e => setMarketForm({...marketForm, name: e.target.value})}
                                className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all text-brand-blue font-serif text-lg"
                                placeholder="e.g. United Arab Emirates"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">URL Slug</label>
                              <input 
                                type="text" 
                                required
                                value={marketForm.slug}
                                onChange={e => setMarketForm({...marketForm, slug: e.target.value})}
                                className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all font-mono text-sm"
                                placeholder="uae"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Sequence Order</label>
                              <input 
                                type="number" 
                                required
                                value={marketForm.order}
                                onChange={e => setMarketForm({...marketForm, order: parseInt(e.target.value)})}
                                className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all"
                              />
                              <p className="mt-2 text-[10px] text-brand-blue/40">Determines the position in the navigation menu.</p>
                            </div>
                          </div>
                        </div>

                        <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg">
                          <Save size={20} /> {editingMarket ? 'Update Market Configuration' : 'Establish New Market'}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-12 text-center bg-white/50">
                      <Globe size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-brand-blue font-serif text-xl mb-2">Manage Your Regions</h3>
                      <p className="text-brand-blue/40 max-w-xs mx-auto text-sm">
                        Select a market from the left to edit its details, or create a new one using the plus icon.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="cities"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif text-2xl text-brand-blue">Nodes</h2>
                  <button 
                    onClick={() => { setIsAddingCity(true); setEditingCity(null); }}
                    className="p-2 text-brand-gold hover:bg-brand-gold/5 rounded-full transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden max-h-[700px] overflow-y-auto divide-y divide-gray-100">
                  {cities.map((city) => (
                    <div 
                      key={city.id} 
                      className={`p-4 flex items-center justify-between hover:bg-brand-blue/5 transition-colors cursor-pointer ${editingCity?.id === city.id ? 'bg-brand-blue/5 border-l-4 border-brand-gold' : ''}`}
                      onClick={() => handleEditCity(city)}
                    >
                      <div>
                        <h3 className="font-medium text-brand-blue">{city.name}</h3>
                        <span className="inline-block px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[9px] font-bold uppercase tracking-widest rounded mt-1">
                          {markets.find(m => m.id === city.marketId)?.name || 'Unassigned'}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteCity(city.id); }} 
                        className={`p-2 transition-all duration-300 ${deletingCityId === city.id ? 'text-red-600 font-bold bg-red-50 text-[10px]' : 'text-brand-blue/40 hover:text-red-600'}`}
                      >
                        {deletingCityId === city.id ? 'CONFIRM' : <Trash2 size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {(isAddingCity || editingCity) ? (
                    <motion.div 
                      key="city-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-8 rounded-lg shadow-xl border border-brand-gold/20"
                    >
                      <form onSubmit={saveCity} className="space-y-10">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                          <h3 className="font-serif text-2xl text-brand-blue">
                            {editingCity ? `Configure: ${editingCity.name}` : 'New City Deployment'}
                          </h3>
                          <button type="button" onClick={() => { setIsAddingCity(false); setEditingCity(null); }} className="text-brand-blue/40 hover:text-brand-blue">
                            <X size={24} />
                          </button>
                        </div>

                        {/* Basic Meta */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-brand-gold">
                            <ChevronRight size={18} />
                            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Deployment Identity</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Location Name</label>
                              <input 
                                type="text" 
                                required
                                value={cityForm.name}
                                onChange={e => setCityForm({...cityForm, name: e.target.value})}
                                className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all font-serif text-lg"
                                placeholder="e.g. Dubai"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Parent Market</label>
                              <select 
                                required
                                value={cityForm.marketId}
                                onChange={e => {
                                  const market = markets.find(m => m.id === e.target.value);
                                  setCityForm({...cityForm, marketId: e.target.value, country: market?.name || ''});
                                }}
                                className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all"
                              >
                                <option value="">Assign To Market...</option>
                                {markets.map(m => (
                                  <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Investment Metrics */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-brand-gold">
                            <ChevronRight size={18} />
                            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Investment Metrics</h4>
                          </div>
                          <div className="grid grid-cols-3 gap-6">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Strategic Position</label>
                              <select 
                                required
                                value={cityForm.positioning}
                                onChange={e => setCityForm({...cityForm, positioning: e.target.value as any})}
                                className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all"
                              >
                                <option value="Luxury">Luxury Core</option>
                                <option value="Growth">Growth/Expansion</option>
                                <option value="Balanced">Balanced Yield</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Avg Entry Price</label>
                              <input 
                                type="text" 
                                value={cityForm.avgPricing}
                                onChange={e => setCityForm({...cityForm, avgPricing: e.target.value})}
                                className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all"
                                placeholder="e.g. $400k - $1M"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Rental Yield Profile</label>
                              <input 
                                type="text" 
                                value={cityForm.rentalYield}
                                onChange={e => setCityForm({...cityForm, rentalYield: e.target.value})}
                                className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all"
                                placeholder="e.g. 6.5% - 8%"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Content Narrative */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-brand-gold">
                            <ChevronRight size={18} />
                            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Strategic Narrative</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Investment Thesis</label>
                              <textarea 
                                value={cityForm.thesis}
                                onChange={e => setCityForm({...cityForm, thesis: e.target.value})}
                                className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all h-32 resize-none text-sm leading-relaxed"
                                placeholder="Core rationale for investment in this specific node..."
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Target Demographic</label>
                                <input 
                                  type="text" 
                                  value={cityForm.targetBuyer}
                                  onChange={e => setCityForm({...cityForm, targetBuyer: e.target.value})}
                                  className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all"
                                  placeholder="e.g. HNWI, Tech Expats"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Infrastructure Hook</label>
                                <input 
                                  type="text" 
                                  value={cityForm.infraGrowth}
                                  onChange={e => setCityForm({...cityForm, infraGrowth: e.target.value})}
                                  className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all"
                                  placeholder="e.g. New Metro Line, Airport"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Visual Asset */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-brand-gold">
                            <ChevronRight size={18} />
                            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Visual Representation</h4>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-2">Cover Image URL</label>
                            <input 
                              type="text" 
                              value={cityForm.image}
                              onChange={e => setCityForm({...cityForm, image: e.target.value})}
                              className="w-full px-5 py-3 bg-brand-ivory border border-gray-100 focus:border-brand-gold outline-none transition-all font-mono text-[10px]"
                              placeholder="https://images.unsplash.com/..."
                            />
                            {cityForm.image && (
                              <div className="mt-4 aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-gray-200">
                                <img src={cityForm.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 flex gap-4">
                          <button type="submit" className="flex-1 btn-primary py-4 flex items-center justify-center gap-3 text-lg leading-none">
                            <Save size={20} /> {editingCity ? 'Commit Deployment Changes' : 'Initialize New Node'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-12 text-center bg-white/50">
                      <MapPin size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-brand-blue font-serif text-xl mb-2">City-Level Configuration</h3>
                      <p className="text-brand-blue/40 max-w-xs mx-auto text-sm">
                        Define specific cities and regions. Use the selection on the left to start editing.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
