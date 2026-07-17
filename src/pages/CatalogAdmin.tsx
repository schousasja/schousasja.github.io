import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Globe2, 
  MapPin, 
  TrendingUp, 
  Tag, 
  ShieldCheck, 
  PlusCircle, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Image as ImageIcon,
  Mail,
  LayoutDashboard,
  Pencil,
  Search
} from 'lucide-react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Link } from 'react-router-dom';
import { useMarkets } from '../contexts/MarketContext';

interface Developer {
  name: string;
  credibility: string;
}

interface PropertyData {
  name: string;
  type: string;
  country: string;
  city?: string;
  cityId: string;
  location: string;
  startingPrice: string;
  image: string;
  images?: string[];
  developer: Developer;
  highlights: string[];
  isAdvisorsChoice: boolean;
  description?: string;
  paymentPlan?: string;
  recommendationLevel?: string;
  handoverTime?: string;
  status: string;
}

const INITIAL_FORM_STATE: PropertyData = {
  name: '',
  location: '',
  cityId: '',
  type: 'Apartment',
  country: 'UAE',
  image: '',
  images: [''],
  startingPrice: '',
  status: 'INVESTMENT READY',
  developer: {
    name: '',
    credibility: ''
  },
  highlights: [''],
  isAdvisorsChoice: false,
  city: '',
  description: '',
  paymentPlan: '',
  recommendationLevel: '',
  handoverTime: ''
};

import { AdminNav } from '../components/AdminNav';

export const CatalogAdmin = () => {
  const { profile } = useAuth();
  const { markets, cities } = useMarkets();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'add'>('inventory');
  const [editId, setEditId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [formData, setFormData] = useState<PropertyData>(INITIAL_FORM_STATE);
  
  const handleTypeToggle = (typeToToggle: string) => {
    const currentTypes = formData.type
      ? formData.type.split(/[,/•|]+/).map(t => t.trim()).filter(Boolean)
      : [];
    
    let newTypes;
    if (currentTypes.includes(typeToToggle)) {
      newTypes = currentTypes.filter(t => t !== typeToToggle);
    } else {
      newTypes = [...currentTypes, typeToToggle];
    }
    
    setFormData(prev => ({
      ...prev,
      type: newTypes.join(', ')
    }));
  };
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMarket, setFilterMarket] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchProperties();
    }
  }, [profile]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const props = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(props);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'properties');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMarket = filterMarket === 'all' || p.country === filterMarket;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesMarket && matchesStatus;
  });

  const stats = {
    total: properties.length,
    investmentReady: properties.filter(p => p.status === 'INVESTMENT READY').length,
    offPlan: properties.filter(p => p.status === 'OFF-PLAN').length,
    advisorsChoice: properties.filter(p => p.isAdvisorsChoice).length
  };

  const handleAddHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({
      ...prev,
      highlights: newHighlights
    }));
  };

  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleEdit = (prop: any) => {
    setEditId(prop.id);
    setFormData({
      name: prop.name || '',
      location: prop.location || '',
      cityId: prop.cityId || '',
      type: prop.type || 'Apartment',
      country: prop.country || 'UAE',
      image: prop.image || '',
      images: prop.images && prop.images.length > 0 ? prop.images : [prop.image || ''],
      startingPrice: prop.startingPrice || '',
      status: prop.status || 'INVESTMENT READY',
      developer: {
        name: prop.developer?.name || '',
        credibility: prop.developer?.credibility || ''
      },
      highlights: prop.highlights && prop.highlights.length > 0 ? prop.highlights : [''],
      isAdvisorsChoice: prop.isAdvisorsChoice || false,
      city: prop.city || '',
      description: prop.description || '',
      paymentPlan: prop.paymentPlan || '',
      recommendationLevel: prop.recommendationLevel || '',
      handoverTime: prop.handoverTime || ''
    });
    setActiveTab('add');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData(INITIAL_FORM_STATE);
    setActiveTab('inventory');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const cleanImages = formData.images ? formData.images.filter(img => img.trim() !== '') : [];
      let mainImage = formData.image;
      if (!mainImage && cleanImages.length > 0) {
        mainImage = cleanImages[0];
      }

      const cleanData = {
        ...formData,
        image: mainImage,
        images: cleanImages,
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        updatedAt: serverTimestamp(),
        updatedBy: profile.uid
      };

      if (editId) {
        try {
          await updateDoc(doc(db, 'properties', editId), cleanData);
          setStatus({ type: 'success', message: 'Property details updated successfully.' });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `properties/${editId}`);
        }
      } else {
        try {
          const createData = {
            ...cleanData,
            createdAt: serverTimestamp(),
            createdBy: profile.uid
          };
          await addDoc(collection(db, 'properties'), createData);
          setStatus({ type: 'success', message: 'Property published successfully to the global catalog.' });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'properties');
        }
      }
      
      setFormData(INITIAL_FORM_STATE);
      setEditId(null);
      fetchProperties();
      setActiveTab('inventory');
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to ${editId ? 'update' : 'publish'} property: ` + error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    // Basic confirmation check
    if (deletingId !== id) {
      setDeletingId(id);
      // Reset after 3 seconds if not clicked again
      setTimeout(() => setDeletingId(null), 3000);
      return;
    }

    setDeletingId(null);
    setSubmitting(true);
    setStatus(null);
    try {
      await deleteDoc(doc(db, 'properties', id));
      setProperties(prev => prev.filter(p => p.id !== id));
      setStatus({ type: 'success', message: 'Listing removed successfully.' });
    } catch (error: any) {
      console.error('Delete error:', error);
      let errorMsg = 'Failed to remove listing.';
      try {
        const errInfo = JSON.parse(error.message);
        errorMsg = `Permission Denied: ${errInfo.error}`;
      } catch {
        errorMsg = error.message || 'Unknown error occurred.';
      }
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen pt-24 bg-brand-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/account" />;
  }

  return (
    <div className="pt-24 min-h-screen bg-brand-ivory selection:bg-brand-gold selection:text-brand-ivory">
      <AdminNav />

      {/* Header */}
      <section className="bg-brand-blue py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-brand-gold font-normal uppercase tracking-[0.4em] text-[10px] mb-4">Institutional Asset Manager</h1>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-ivory leading-tight tracking-tighter">
                Catalog <span className="text-gold-gradient">Inventory</span>.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-gold/10 backdrop-blur-sm p-4 border border-brand-gold/20 min-w-[120px]">
                <div className="text-[8px] uppercase tracking-widest text-brand-gold/60 mb-1">Total Assets</div>
                <div className="text-xl font-serif text-brand-ivory">{stats.total}</div>
              </div>
              <div className="bg-brand-gold/10 backdrop-blur-sm p-4 border border-brand-gold/20 min-w-[120px]">
                <div className="text-[8px] uppercase tracking-widest text-brand-gold/60 mb-1">Featured</div>
                <div className="text-xl font-serif text-brand-ivory">{stats.advisorsChoice}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-gray-100 bg-white sticky top-[80px] z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-12">
            {[
              { id: 'inventory', label: 'Inventory Overview', icon: Building2 },
              { id: 'add', label: editId ? 'Editing Listing' : 'Add New Property', icon: editId ? Pencil : PlusCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 py-6 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-brand-blue' : 'text-gray-400 hover:text-brand-gold'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabProp"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-4 flex items-center gap-4 border ${
                status.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-xs font-medium uppercase tracking-widest">{status.message}</span>
              <button 
                onClick={() => setStatus(null)}
                className="ml-auto text-[10px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-8">
              {/* Filter Bar */}
              <div className="bg-white border border-gray-100 p-6 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-sm">
                <div className="relative flex-grow max-w-xl w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search by asset name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-none px-12 py-3 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                  <select 
                    value={filterMarket}
                    onChange={(e) => setFilterMarket(e.target.value)}
                    className="bg-gray-50 border-none px-4 py-3 text-brand-blue text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-brand-gold min-w-[140px]"
                  >
                    <option value="all">All Markets</option>
                    {markets.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-gray-50 border-none px-4 py-3 text-brand-blue text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-brand-gold min-w-[140px]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="INVESTMENT READY">Investment Ready</option>
                    <option value="OFF-PLAN">Off-Plan</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="LIMITED RELEASE">Limited Release</option>
                    <option value="HOT OPPORTUNITY">Hot Opportunity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProperties.map((prop) => (
                  <motion.div
                    key={prop.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white border border-gray-100 shadow-sm overflow-hidden group"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={prop.image} 
                        alt={prop.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339902294-12e006a13344?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button 
                          onClick={() => handleEdit(prop)}
                          className="p-2 bg-brand-blue text-white hover:bg-brand-gold hover:text-brand-blue transition-colors shadow-lg"
                          title="Edit Listing"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(prop.id)}
                          disabled={submitting}
                          className={`p-2 transition-all duration-300 shadow-lg flex items-center justify-center min-h-[40px] ${
                            deletingId === prop.id 
                              ? 'bg-orange-500 hover:bg-orange-600 px-4' 
                              : 'bg-red-500 hover:bg-red-600 w-10'
                          } text-white`}
                        >
                          {submitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : deletingId === prop.id ? (
                            <span className="text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">Confirm Delete?</span>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="px-2 py-1 bg-brand-gold text-brand-blue text-[8px] font-bold uppercase tracking-widest self-start">
                          {prop.country}
                        </span>
                        {prop.isAdvisorsChoice && (
                          <span className="px-2 py-1 bg-brand-blue text-brand-gold text-[8px] font-bold uppercase tracking-widest self-start flex items-center gap-1">
                            <ShieldCheck className="w-2 h-2" /> Advisor's Choice
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-serif text-brand-blue mb-1">{prop.name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-brand-gold" />
                        {prop.location}
                      </p>
                      {prop.developer?.name && (
                        <p className="text-[8px] text-brand-blue font-bold tracking-widest uppercase mb-4 opacity-60">
                          Dev: {prop.developer.name}
                        </p>
                      )}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <div className="text-[10px] uppercase tracking-widest text-gray-400">Type: <span className="text-brand-gold font-bold">{prop.type || 'N/A'}</span></div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-400">Price: <span className="text-brand-blue font-bold">{prop.startingPrice}</span></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              </div>

              {properties.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-gray-200 bg-white">
                   <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                   <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">No properties in database. Add your first listing.</p>
                </div>
              )}

              {properties.length > 0 && filteredProperties.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-gray-200 bg-white">
                   <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                   <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold font-sans">No properties match your filter preferences.</p>
                </div>
              )}
            </div>

          )}

          {activeTab === 'add' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <PlusCircle className="w-48 h-48" />
                </div>
                
                <h3 className="text-2xl font-serif text-brand-blue mb-10 border-b border-gray-50 pb-6 relative z-10 flex items-center justify-between">
                  <span>{editId ? 'Modify Listing' : 'Property Specification'}</span>
                  {editId && (
                    <button 
                      type="button"
                      onClick={cancelEdit}
                      className="text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel Edit
                    </button>
                  )}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Property Name</label>
                        <input 
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                          placeholder="e.g. The Opus Tower"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block font-sans">Property Type(s)</label>
                        <input 
                          type="text"
                          required
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value})}
                          className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold font-sans"
                          placeholder="e.g. Apartment, Penthouse"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Commercial', 'Land'].map(t => {
                            const currentTypes = formData.type
                              ? formData.type.split(/[,/•|]+/).map(item => item.trim()).filter(Boolean)
                              : [];
                            const isSelected = currentTypes.includes(t);
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => handleTypeToggle(t)}
                                className={`px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-widest border transition-all duration-300 rounded-sm cursor-pointer ${
                                  isSelected 
                                    ? 'bg-brand-gold text-brand-blue border-brand-gold shadow-sm font-black' 
                                    : 'bg-brand-ivory/50 text-brand-blue border-brand-blue/5 hover:border-brand-gold/30'
                                }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Market / Country</label>
                        <div className="relative">
                          <select 
                            required
                            value={formData.country}
                            onChange={e => {
                                const market = markets.find(m => m.name === e.target.value);
                                setFormData({...formData, country: e.target.value, cityId: ''});
                            }}
                            className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold appearance-none"
                          >
                            {markets.map(m => (
                                <option key={m.id} value={m.name}>{m.name}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Sub-Market / City</label>
                        <div className="relative">
                          <select 
                            value={formData.cityId}
                            onChange={e => {
                                const city = cities.find(c => c.id === e.target.value);
                                setFormData({...formData, cityId: e.target.value, location: city ? `${city.name}, ${city.country}` : formData.location});
                            }}
                            className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold appearance-none"
                          >
                            <option value="">Select City...</option>
                            {cities.filter(c => c.country === formData.country).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3 h-3 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Detailed Address / Location</label>
                        <input 
                           type="text"
                           value={formData.location}
                           onChange={e => setFormData({...formData, location: e.target.value})}
                           className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                           placeholder="e.g. Business Bay, Dubai"
                        />
                      </div>
                    </div>

                    {/* Financials */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Starting Price</label>
                          <input 
                            type="text"
                            value={formData.startingPrice}
                            onChange={e => setFormData({...formData, startingPrice: e.target.value})}
                            className="w-full bg-gray-50 border-none px-4 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                            placeholder="AED 2.45M"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Banner Image URL</label>
                        <div className="flex gap-4">
                          <div className="relative flex-grow">
                            <input 
                              type="text"
                              value={formData.image}
                              onChange={e => setFormData({...formData, image: e.target.value})}
                              className="w-full bg-gray-50 border-none px-6 py-4 pl-12 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                              placeholder="https://images.unsplash.com/..."
                            />
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                          </div>
                          {formData.image && (
                            <div className="w-12 h-12 border border-gray-100 overflow-hidden shrink-0">
                              <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339902294-12e006a13344?auto=format&fit=crop&q=80&w=200';
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-[8px] text-gray-400 mt-2 uppercase tracking-widest italic">Use direct image url to represent the property details.</p>
                      </div>

                      {/* Multiple Photos */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400">Additional Photos</label>
                          <button 
                            type="button"
                            onClick={handleAddImage}
                            className="text-[9px] uppercase tracking-widest font-black text-brand-blue flex items-center gap-1 hover:text-brand-gold transition-colors"
                          >
                            <Plus className="w-3 h-3 text-brand-gold" /> Add Photo
                          </button>
                        </div>
                        <div className="space-y-3">
                          {formData.images?.map((imgUrl, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="relative flex-grow">
                                <input 
                                  type="text"
                                  value={imgUrl}
                                  onChange={e => handleImageChange(idx, e.target.value)}
                                  className="w-full bg-gray-50 border-none px-6 py-4 pl-12 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                                  placeholder="https://images.unsplash.com/..."
                                />
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                              </div>
                              {imgUrl && (
                                <div className="w-12 h-12 border border-gray-100 overflow-hidden shrink-0">
                                  <img 
                                    src={imgUrl} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339902294-12e006a13344?auto=format&fit=crop&q=80&w=200';
                                    }}
                                  />
                                </div>
                              )}
                              {formData.images && formData.images.length > 1 && (
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="p-3 text-red-300 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Specifications & Recommendation */}
                  <div className="pt-10 border-t border-gray-100">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-8">Property Profile & Recommendation</h4>
                    
                    <div className="space-y-8">
                      {/* Profiles & Badges */}
                      <div>
                        <h5 className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-blue mb-4 pb-2 border-b border-gray-100">Profile Details</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Payment Plan</label>
                            <input 
                              type="text"
                              value={formData.paymentPlan || ''}
                              onChange={e => setFormData({...formData, paymentPlan: e.target.value})}
                              className="w-full bg-gray-50 border-none px-4 py-3 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                              placeholder="e.g. 60/40 payment plan"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Level of Recommendation</label>
                            <select 
                              value={formData.recommendationLevel || ''}
                              onChange={e => setFormData({...formData, recommendationLevel: e.target.value})}
                              className="w-full bg-gray-50 border-none px-4 py-3 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                            >
                              <option value="">No recommendation badge</option>
                              <option value="Recommended">Recommended</option>
                              <option value="Highly Recommended">Highly Recommended</option>
                              <option value="Strongly Recommended">Strongly Recommended</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Handover Time</label>
                            <input 
                              type="text"
                              value={formData.handoverTime || ''}
                              onChange={e => setFormData({...formData, handoverTime: e.target.value})}
                              className="w-full bg-gray-50 border-none px-4 py-3 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                              placeholder="e.g. Q4 2026, Immediate"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Short Description / Statement of the Property</label>
                        <textarea 
                          rows={3}
                          value={formData.description || ''}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold resize-none"
                          placeholder="Provide a compelling short statement or description of the property."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Developer Info */}
                  <div className="pt-10 border-t border-gray-50">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-8">Developer Credibility</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Developer Name</label>
                        <input 
                          type="text"
                          value={formData.developer.name}
                          onChange={e => setFormData({
                            ...formData, 
                            developer: { ...formData.developer, name: e.target.value }
                          })}
                          className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                          placeholder="e.g. Omniyat"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Credibility Statement</label>
                        <textarea 
                          rows={2}
                          value={formData.developer.credibility}
                          onChange={e => setFormData({
                            ...formData, 
                            developer: { ...formData.developer, credibility: e.target.value }
                          })}
                          className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold resize-none"
                          placeholder="e.g. Award-winning developer known for architectural masterpieces."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="pt-10 border-t border-gray-50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                      <div className="flex items-center gap-4 bg-brand-gold/5 p-4 border border-brand-gold/10">
                        <input 
                          type="checkbox"
                          id="isAdvisorsChoice"
                          checked={formData.isAdvisorsChoice}
                          onChange={e => setFormData({...formData, isAdvisorsChoice: e.target.checked})}
                          className="w-4 h-4 text-brand-gold focus:ring-brand-gold bg-transparent border-brand-gold/30"
                        />
                        <label htmlFor="isAdvisorsChoice" className="text-[10px] uppercase tracking-widest font-black text-brand-blue cursor-pointer select-none">
                          Feature in "Advisor's Choice" on Homepage
                        </label>
                      </div>
                      <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold">Asset Highlights</h4>
                      <button 
                        type="button"
                        onClick={handleAddHighlight}
                        className="text-[9px] uppercase tracking-widest font-black text-brand-blue flex items-center gap-1.5 hover:text-brand-gold transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Highlight
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.highlights.map((h, i) => (
                        <div key={i} className="flex gap-4">
                          <input 
                            type="text"
                            value={h}
                            onChange={e => handleHighlightChange(i, e.target.value)}
                            className="flex-grow bg-gray-50 border-none px-6 py-3 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                            placeholder="e.g. Prime Business Hub"
                          />
                          {formData.highlights.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => handleRemoveHighlight(i)}
                              className="p-3 text-red-300 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-6 bg-brand-blue text-brand-ivory text-[10px] uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3 hover:bg-brand-gold hover:text-brand-blue transition-all disabled:opacity-50 shadow-xl shadow-brand-blue/10"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {editId ? 'Synchronizing Updates...' : 'Synchronizing...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        {editId ? 'Update Listing Details' : 'Publish Property Listing'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
