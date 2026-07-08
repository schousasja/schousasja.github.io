import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  User, 
  LogOut, 
  Heart,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  MapPin,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { collection, query, getDocs, updateDoc, doc, serverTimestamp, deleteDoc, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Link } from 'react-router-dom';
import { properties as mockProperties } from '../constants/properties';

export const Account: React.FC = () => {
  const { user, profile, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [company, setCompany] = useState(profile?.company || '');
  
  // Saved properties state
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('univue_favorites');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Synergize and load saved properties matching bookmarks
  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (!user) return;
      setPropertiesLoading(true);
      try {
        // Core properties initially loaded from local constants
        let allProps: any[] = [...mockProperties].map(p => ({
          ...p,
          createdAt: new Date('2026-06-01')
        }));

        // Dynamically fetch custom properties added in Firestore
        try {
          const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const firestoreProps = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          }));

          if (firestoreProps.length > 0) {
            const existingIds = new Set(firestoreProps.map(p => p.id));
            allProps = [
              ...firestoreProps,
              ...allProps.filter(p => !existingIds.has(p.id))
            ];
          }
        } catch (dbError) {
          console.warn("Firestore fetch error within account page:", dbError);
        }

        // Filter and align with local storage bookmarks
        const filtered = allProps.filter(p => favorites.includes(p.id));
        setSavedProperties(filtered);
      } catch (error) {
        console.error("Failed to load saved properties:", error);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchSavedProperties();
  }, [user, favorites]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      const userRef = doc(db, path);
      await updateDoc(userRef, {
        company: company,
        updatedAt: serverTimestamp()
      });
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    const newFavorites = favorites.filter(fav => fav !== id);
    setFavorites(newFavorites);
    localStorage.setItem('univue_favorites', JSON.stringify(newFavorites));
    setSavedProperties(prev => prev.filter(p => p.id !== id));
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-brand-ivory pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl text-brand-blue mb-2">Welcome Back, {profile?.displayName?.split(' ')[0]}</h1>
            <p className="text-sm text-gray-500 font-sans">
              Managing your international real estate and expansion portfolio.
            </p>
          </div>
          <button 
            onClick={async () => {
              try {
                await logout();
              } catch (error) {
                console.error("Sign out error:", error);
              } finally {
                navigate('/login');
              }
            }}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brand-gold transition-colors tracking-[0.2em] uppercase"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar Navigation */}
          <aside className="space-y-2">
            {[
              { id: 'overview', label: 'Portfolio Overview', icon: User },
              { id: 'saved', label: 'Saved Properties', icon: Heart },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 text-sm font-sans ${
                  activeTab === item.id 
                    ? 'bg-brand-blue text-brand-gold shadow-lg shadow-brand-blue/10' 
                    : 'text-gray-500 hover:bg-white hover:text-brand-blue'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-grow text-left uppercase tracking-[0.1em] text-[11px] font-bold">
                  {item.label}
                </span>
                {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}

            {profile?.role === 'admin' && (
              <div className="pt-6 border-t border-gray-200 mt-6 space-y-2">
                <p className="px-6 text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">Administrative Control</p>
                <Link
                  to="/admin/catalog"
                  className="w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 text-sm font-sans text-brand-blue hover:bg-brand-gold/10 hover:text-brand-blue"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-gold" />
                  <span className="flex-grow text-left uppercase tracking-[0.1em] text-[11px] font-bold">
                    Admin Control Panel
                  </span>
                  <ChevronRight className="w-4 h-4 text-brand-gold" />
                </Link>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm min-h-[600px]">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-serif text-brand-blue mb-8">Executive Profile</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-8 border-b border-gray-50 pb-8">
                    <img src={profile?.photoURL} alt={profile?.displayName} className="w-20 h-20 rounded-none border border-brand-gold/20" />
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Primary Consultant</p>
                      <p className="text-xl text-brand-blue flex items-center gap-3">
                        {profile?.displayName}
                        <span className="text-[9px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 font-bold uppercase tracking-widest border border-brand-gold/20">
                          {profile?.role || 'Client'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-brand-ivory border border-gray-100">
                      <p className="text-[10px] text-brand-gold uppercase tracking-widest font-bold mb-3 flex items-center justify-between">
                        Company Affiliation
                        {!isEditing && (
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="text-brand-blue hover:text-brand-gold transition-colors"
                          >
                            Edit
                          </button>
                        )}
                      </p>
                      {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <input 
                            type="text" 
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Enter company name"
                            className="w-full bg-white border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button type="submit" className="text-[10px] bg-brand-blue text-brand-gold px-3 py-1 font-bold uppercase tracking-widest">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-brand-blue font-serif text-lg">{profile?.company || 'Personal Account'}</p>
                      )}
                    </div>
                    <div className="p-6 bg-brand-ivory border border-gray-100">
                      <p className="text-[10px] text-brand-gold uppercase tracking-widest font-bold mb-3">Portfolio Status</p>
                      <p className="text-brand-blue font-serif text-lg">Active Advisory</p>
                    </div>
                  </div>

                  {/* Newsletter Subscription */}
                  <div className="p-8 bg-brand-blue text-brand-ivory border border-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gold/5 pointer-events-none"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-serif text-brand-gold mb-2">Market Intelligence Digest</h3>
                      <p className="text-sm text-brand-ivory/60 mb-6 max-w-lg">
                        Subscribe to our exclusive newsletter for weekly deep-dives into high-growth markets, regulatory shifts, and off-market opportunities.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        {profile?.isSubscribed ? (
                          <div className="flex flex-wrap items-center gap-4">
                            <button
                              disabled={isSubscribing}
                              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 text-brand-gold bg-transparent border border-brand-gold/20 px-4 py-2"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              Subscribed to Intelligence
                            </button>
                            <button
                              disabled={isSubscribing}
                              onClick={async () => {
                                if (!user) return;
                                setIsSubscribing(true);
                                const userPath = `users/${user.uid}`;
                                try {
                                  // 1. Update user profile subscription to false
                                  const userRef = doc(db, userPath);
                                  await updateDoc(userRef, {
                                    isSubscribed: false,
                                    updatedAt: serverTimestamp()
                                  });

                                  // 2. Also locate and delete any guest subscriptions with this email to be thorough
                                  if (profile?.email) {
                                    const q = query(
                                      collection(db, 'newsletter_subscribers'),
                                      where('email', '==', profile.email)
                                    );
                                    const snap = await getDocs(q);
                                    for (const docOfSnap of snap.docs) {
                                      await deleteDoc(doc(db, 'newsletter_subscribers', docOfSnap.id));
                                    }
                                  }
                                } catch (error) {
                                  handleFirestoreError(error, OperationType.UPDATE, userPath);
                                } finally {
                                  setIsSubscribing(false);
                                }
                              }}
                              className="text-[10px] font-bold uppercase tracking-[0.2em] bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 px-4 py-2 border border-red-500/20 transition-all cursor-pointer pointer-events-auto"
                            >
                              {isSubscribing ? 'Processing...' : 'Unsubscribe'}
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={isSubscribing}
                            onClick={async () => {
                              if (!user) return;
                              setIsSubscribing(true);
                              const path = `users/${user.uid}`;
                              try {
                                const userRef = doc(db, path);
                                await updateDoc(userRef, {
                                  isSubscribed: true,
                                  updatedAt: serverTimestamp()
                                });
                              } catch (error) {
                                handleFirestoreError(error, OperationType.UPDATE, path);
                              } finally {
                                setIsSubscribing(false);
                              }
                            }}
                            className="bg-brand-gold text-brand-blue px-6 py-2 font-bold uppercase tracking-[0.2em] hover:bg-brand-ivory text-[10px] disabled:opacity-50 transition-all cursor-pointer pointer-events-auto"
                          >
                            {isSubscribing ? 'Processing...' : 'Join Exclusive List'}
                          </button>
                        )}
                        {profile?.isSubscribed && (
                          <span className="text-[9px] text-brand-ivory/40 uppercase tracking-widest italic">
                            Delivered every Monday to {profile.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-4xl md:text-5xl font-serif font-normal text-brand-blue/10 mb-4 pointer-events-none uppercase">
                      Univue Private.
                    </h3>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'saved' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-serif text-brand-blue">Saved Properties</h2>
                  <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-3 py-1 font-bold uppercase tracking-widest">
                    {savedProperties.length} Saved Assets
                  </span>
                </div>

                {propertiesLoading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-gold mx-auto mb-4" />
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Retrieving your portfolio assets...</p>
                  </div>
                ) : savedProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {savedProperties.map((prop) => (
                      <div 
                        key={prop.id} 
                        className="group flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative"
                      >
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFavorite(prop.id)}
                          className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 hover:text-red-500 transition-all text-gray-400 z-10"
                          title="Remove from saved list"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 animate-fade-in">
                          <img 
                            src={prop.image} 
                            alt={prop.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800';
                            }}
                          />
                          <div className="absolute bottom-3 left-3 bg-brand-blue/80 backdrop-blur-md px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-brand-ivory">
                            {prop.country}
                          </div>
                          <div className="absolute top-4 left-4 bg-brand-gold/90 backdrop-blur-sm px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-brand-blue font-bold">
                            {prop.status}
                          </div>
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                          <div className="mb-4">
                            <h3 className="text-xl font-serif text-brand-blue group-hover:text-brand-gold transition-colors duration-300">
                              {prop.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1 font-sans">
                              <MapPin className="w-3 h-3 text-brand-gold" />
                              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                                {prop.location}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-6 font-sans">
                            <div className="bg-brand-ivory p-3 border border-gray-50">
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Yield Potential</p>
                              <p className="text-base text-brand-blue font-serif">{prop.expectedYield}</p>
                            </div>
                            <div className="bg-brand-ivory p-3 border border-gray-50">
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Starting Price</p>
                              <p className="text-[11px] font-bold text-brand-blue truncate" title={prop.startingPrice}>{prop.startingPrice}</p>
                            </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-end">
                            <button
                              onClick={() => navigate('/book')}
                              className="w-full py-2.5 bg-brand-blue text-brand-ivory hover:bg-brand-gold hover:text-brand-blue text-[9px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300"
                            >
                              Inquire Portfolio Hub
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 px-6 border border-dashed border-gray-200">
                    <Heart className="w-12 h-12 text-gray-250 mx-auto mb-6" />
                    <h3 className="text-lg text-brand-blue mb-2 font-serif">Your saved list is empty</h3>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6 font-sans leading-relaxed">
                      Explore the developments inside the Market Discovery catalog and bookmark them to compare or review them later.
                    </p>
                    <button
                      onClick={() => navigate('/catalog')}
                      className="inline-block bg-brand-blue text-brand-gold text-[9px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-brand-gold hover:text-brand-blue transition-colors duration-300 font-sans"
                    >
                      Browse Market Catalog
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
