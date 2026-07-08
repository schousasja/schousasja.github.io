import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Clock, 
  ChevronRight, 
  Mail,
  Loader2,
  Linkedin,
  X,
  Facebook,
  CheckCircle2
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  orderBy,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import ReactMarkdown from 'react-markdown';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import rehypeRaw from 'rehype-raw';
import { Link } from 'react-router-dom';

interface Insight {
  id: string;
  title: string;
  type: string;
  description: string;
  photoUrl: string;
  content: string;
  markets: string[];
  subMarkets: string[];
  market?: string; // For backward compatibility
  subMarket?: string; // For backward compatibility
  sections: string[];
  displayDate: string;
  authorId: string;
  createdAt: any;
  updatedAt: any;
}

export const MarketInsights = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { photos } = useSiteSettings();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'main' | 'archive' | 'article' | 'univue'>('main');
  const [selectedArticle, setSelectedArticle] = useState<Insight | null>(null);

  useDocumentMetadata({
    title: view === 'article' && selectedArticle 
      ? selectedArticle.title 
      : `${t('nav.insights') || 'Insights & Research'}`,
    description: view === 'article' && selectedArticle 
      ? selectedArticle.description 
      : t('insights.subtitle') || 'Explore our dynamic library of cross-border real estate, legal, and operational investment papers and research reports.',
    keywords: view === 'article' && selectedArticle 
      ? `${selectedArticle.title}, ${selectedArticle.type}, Univue research` 
      : 'market intelligence, Dubai research papers, India operational expansion analysis'
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [marketFilter, setMarketFilter] = useState(t('insights.market.all'));
  const [subMarketFilter, setSubMarketFilter] = useState(t('insights.submarket.all'));
  const [typeFilter, setTypeFilter] = useState(t('insights.paper_type.all'));
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);
  const [isUnsubscribingMode, setIsUnsubscribingMode] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const PAPER_TYPES = [t('insights.paper_type.all'), "Article", "Report", "Research", "Interview", "Case Study"];
  const SUB_MARKETS: Record<string, string[]> = {
    "UAE": ["Dubai", "Abu Dhabi", "Ras Al Khaimah"],
    "India": ["Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Chennai", "Goa"],
    "Southeast Asia": ["Singapore", "Vietnam", "Thailand", "Indonesia", "Sri Lanka"],
    "Emerging Markets": ["Saudi Arabia", "Egypt", "Nigeria", "Brazil", "Mexico", "Turkey"],
    "Global": ["Macro Trends", "Cross-Border", "Digital Assets", "ESG"]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const q = query(collection(db, 'insights'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Insight));
      setInsights(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'insights');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auto-unsubscribe handler from newsletter footer link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const unsubEmail = params.get('unsub');
    if (unsubEmail) {
      setIsUnsubscribingMode(true);
      setNewsletterEmail(unsubEmail);
      
      const triggerAutoUnsub = async (emailToUnsub: string) => {
        setIsSubscribing(true);
        setNewsletterStatus('Processing your unsubscribe request...');
        try {
          const emailLower = emailToUnsub.trim().toLowerCase();
          
          // 1. Delete from newsletter_subscribers
          const q = query(
            collection(db, 'newsletter_subscribers'),
            where('email', '==', emailLower)
          );
          const snap = await getDocs(q);
          let deletedCount = 0;
          for (const docOfSnap of snap.docs) {
            await deleteDoc(doc(db, 'newsletter_subscribers', docOfSnap.id));
            deletedCount++;
          }

          // 2. Update users document
          const userQuery = query(
            collection(db, 'users'),
            where('email', '==', emailLower)
          );
          const userSnap = await getDocs(userQuery);
          for (const userDoc of userSnap.docs) {
            await updateDoc(doc(db, 'users', userDoc.id), {
              isSubscribed: false,
              updatedAt: serverTimestamp()
            });
            deletedCount++;
          }

          setNewsletterStatus("Successfully unsubscribed from our network. We are sorry to see you go.");
          setNewsletterEmail('');
          
          setTimeout(() => {
            const element = document.getElementById('newsletter-card');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        } catch (error) {
          console.error("Auto unsubscribe failed:", error);
          setNewsletterStatus("Error processing request. Please try again or contact us.");
        } finally {
          setIsSubscribing(false);
          try {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
          } catch (e) {
            console.warn(e);
          }
        }
      };

      triggerAutoUnsub(unsubEmail);
    }
  }, []);

  // Deep-linking from automated newsletters
  useEffect(() => {
    if (insights.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('id') || params.get('article');
      if (articleId) {
        const found = insights.find(i => i.id === articleId);
        if (found) {
          setSelectedArticle(found);
          setView('article');
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
          try {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
          } catch (e) {
            console.warn("Unable to clear search params representing the state", e);
          }
        }
      }
    }
  }, [insights]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubscribing(true);
    setNewsletterStatus(t('insights.newsletter.status_loading'));
    try {
      if (user) {
        const path = `users/${user.uid}`;
        const userRef = doc(db, path);
        await updateDoc(userRef, {
          isSubscribed: true,
          updatedAt: serverTimestamp()
        });
        setNewsletterStatus(t('insights.newsletter.status_success'));
        setNewsletterEmail('');
      } else {
        if (!newsletterEmail) return;
        const email = newsletterEmail.trim();
        const display = email.split('@')[0];
        const photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(display)}&background=0B1F3A&color=C8A96A`;
        
        await addDoc(collection(db, 'newsletter_subscribers'), {
          email: email,
          displayName: display,
          photoURL: photo,
          createdAt: serverTimestamp()
        });
        setNewsletterStatus(t('insights.newsletter.status_success'));
        setNewsletterEmail('');
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setNewsletterStatus(t('insights.newsletter.status_error'));
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    setIsSubscribing(true);
    setNewsletterStatus(t('insights.newsletter.status_loading'));
    const email = newsletterEmail.trim().toLowerCase();
    try {
      // Look up and delete from newsletter_subscribers
      const q = query(
        collection(db, 'newsletter_subscribers'),
        where('email', '==', email)
      );
      const snap = await getDocs(q);
      
      let deletedCount = 0;
      for (const docOfSnap of snap.docs) {
        await deleteDoc(doc(db, 'newsletter_subscribers', docOfSnap.id));
        deletedCount++;
      }

      // Also check if they are registered and matching the email, we can query active users
      const userQuery = query(
        collection(db, 'users'),
        where('email', '==', email)
      );
      const userSnap = await getDocs(userQuery);
      for (const userDoc of userSnap.docs) {
        await updateDoc(doc(db, 'users', userDoc.id), {
          isSubscribed: false,
          updatedAt: serverTimestamp()
        });
        deletedCount++;
      }

      if (deletedCount > 0) {
        setNewsletterStatus("Successfully unsubscribed from our network.");
        setNewsletterEmail('');
      } else {
        setNewsletterStatus("Email address not found in subscription list.");
      }
    } catch (error) {
      console.error("Newsletter unsubscribe error:", error);
      setNewsletterStatus("Error unsubscribing. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const filteredInsights = insights
    .filter(i => {
      const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           i.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMarket = marketFilter === t('insights.market.all') || 
                           (i.markets && i.markets.includes(marketFilter)) || 
                           i.market === marketFilter;
      const matchesSubMarket = subMarketFilter === t('insights.submarket.all') || 
                              (i.subMarkets && i.subMarkets.includes(subMarketFilter)) || 
                              i.subMarket === subMarketFilter;
      const matchesType = typeFilter === t('insights.paper_type.all') || i.type === typeFilter;
      return matchesSearch && matchesMarket && matchesSubMarket && matchesType;
    })
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate() || new Date(0);
      const dateB = b.createdAt?.toDate() || new Date(0);
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
    });

  const spotlightArticles = insights.filter(i => i.sections.includes('Spotlight'));
  const univueLatest = insights.filter(i => i.sections.includes('New from Univue'));
  const regularInsights = insights.filter(i => i.sections.includes('Regular')).slice(0, 4);

  const renderArticleVertical = (insight: Insight, isSpotlight?: boolean) => (
    <motion.div
      key={insight.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => {
        setSelectedArticle(insight);
        setView('article');
        window.scrollTo(0, 0);
      }}
      className="group cursor-pointer bg-white shadow-sm border border-gray-50 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 shrink-0">
        <img 
          src={insight.photoUrl} 
          alt={insight.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {isSpotlight && (
            <span className="px-3 py-1 bg-brand-gold text-brand-blue text-[10px] uppercase tracking-widest font-black backdrop-blur-sm">
              {t('insights.spotlight.tag')}
            </span>
          )}
          <span className="px-3 py-1 bg-brand-blue text-brand-gold text-[10px] uppercase tracking-widest font-bold backdrop-blur-sm">
            {insight.type}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-gray-400 mb-3">
          <span className="flex items-center gap-1 font-bold"><Clock className="w-3 h-3" /> {insight.displayDate}</span>
          {(insight.subMarkets || (insight.subMarket ? [insight.subMarket] : []))?.map(sm => (
            <span key={sm} className="text-brand-gold font-bold">/ {sm}</span>
          ))}
        </div>
        <h3 className="text-xl font-serif text-brand-blue mb-3 group-hover:text-brand-gold transition-colors line-clamp-2 leading-tight">
          {insight.title}
        </h3>
        <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-2">
          {insight.description}
        </p>
      </div>
    </motion.div>
  );

  const renderArticleHorizontal = (insight: Insight, isSpotlight?: boolean) => (
    <motion.div
      key={insight.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => {
        setSelectedArticle(insight);
        setView('article');
        window.scrollTo(0, 0);
      }}
      className={`group cursor-pointer flex flex-col ${isSpotlight ? 'lg:flex-row' : 'md:flex-row'} bg-white shadow-sm border border-gray-50 hover:shadow-md transition-all duration-300 overflow-hidden`}
    >
      <div className={`w-full ${isSpotlight ? 'lg:w-[45%]' : 'md:w-80'} aspect-[16/9] overflow-hidden bg-gray-100 shrink-0 relative`}>
        <img 
          src={insight.photoUrl} 
          alt={insight.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {isSpotlight && (
          <div className="absolute top-0 left-0 px-4 py-2 bg-brand-gold text-brand-blue text-[10px] uppercase tracking-[0.3em] font-black z-10 shadow-lg">
            {t('insights.spotlight.tag')}
          </div>
        )}
      </div>
      <div className="flex-grow p-8 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-3">
          <span className="px-3 py-1 bg-brand-blue text-brand-gold text-[10px] uppercase tracking-widest font-bold">
            {insight.type}
          </span>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-gray-400 font-bold flex-wrap">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {insight.displayDate}</span>
            {(insight.markets || (insight.market ? [insight.market] : []))?.map(m => (
              <span key={m}>/ {m}</span>
            ))}
            {(insight.subMarkets || (insight.subMarket ? [insight.subMarket] : []))?.map(sm => (
              <span key={sm} className="text-brand-gold">/ {sm}</span>
            ))}
          </div>
        </div>
        <h3 className={`${isSpotlight ? 'text-3xl md:text-4xl' : 'text-2xl'} font-serif text-brand-blue mb-4 group-hover:text-brand-gold transition-colors leading-tight`}>
          {insight.title}
        </h3>
        <p className={`${isSpotlight ? 'text-lg' : 'text-base'} text-gray-500 font-light leading-relaxed max-w-3xl line-clamp-2 md:line-clamp-3 mb-6`}>
          {insight.description}
        </p>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-blue group-hover:text-brand-gold transition-colors">
          {t('insights.read_publication')} <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-ivory">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 bg-brand-ivory min-h-screen selection:bg-brand-gold selection:text-brand-ivory">
      <AnimatePresence mode="wait">
        {view === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero */}
            <section className="bg-brand-blue py-20 px-6 relative overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src={photos.insights_hero} 
                  alt="Market Intelligence" 
                  className="w-full h-full object-cover grayscale-[0.5] brightness-[0.4]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay" />
              </div>
              <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >
                  <h1 className="text-5xl md:text-7xl text-white mb-6 font-serif">
                    {t('insights.title')}
                  </h1>
                  <p className="text-white/60 text-xl font-light leading-relaxed mb-8">
                    {t('insights.subtitle')}
                  </p>
                  <div className="flex flex-wrap items-center gap-8">
                    <motion.a 
                      href="https://www.linkedin.com/in/nimmi-schou-36839a40b/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-brand-gold hover:text-white transition-colors group"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">LinkedIn</span>
                    </motion.a>

                    <motion.a 
                      href="https://x.com/Univue_Official"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-brand-gold hover:text-white transition-colors group"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">X</span>
                    </motion.a>

                    <motion.a 
                      href="https://www.facebook.com/people/Univue-Consultants-ApS/61589903517439/?mibextid=wwXIfr&rdid=P7IV0rRmDq3z8wV8&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1B9fC5GJVz%2F%3Fmibextid%3DwwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-brand-gold hover:text-white transition-colors group"
                    >
                      <Facebook className="w-5 h-5" />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Facebook</span>
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Spotlight Section */}
            <section className="section-padding px-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-sm font-normal text-brand-gold uppercase tracking-[0.4em] mb-4">{t('insights.spotlight.tag')}</h2>
                  </div>
                  <button 
                    onClick={() => { setView('archive'); window.scrollTo(0, 0); }}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-blue hover:text-brand-gold transition-colors flex items-center gap-2 mb-2"
                  >
                    {t('insights.more_insights')} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {spotlightArticles.length > 0 ? (
                  <div className="space-y-16">
                    {/* Main Spotlight */}
                    {renderArticleHorizontal(spotlightArticles[0], true)}

                    {/* Underneath 2 */}
                    <div className="grid xl:grid-cols-2 gap-12">
                      {spotlightArticles.slice(1, 3).map(i => renderArticleHorizontal(i, true))}
                    </div>

                    {/* Rows of 4 */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {spotlightArticles.slice(3).map(i => renderArticleVertical(i, true))}
                    </div>

                    {/* Regular Row of 4 */}
                    {regularInsights.length > 0 && (
                      <div className="border-t border-gray-100 pt-16 mt-16">
                        <div className="mb-12">
                          <h2 className="text-sm font-normal text-brand-gold uppercase tracking-[0.4em] mb-4">{t('insights.regular.tag')}</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                          {regularInsights.map(i => renderArticleVertical(i))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center border border-dashed border-gray-200">
                    <p className="text-gray-400 italic font-light tracking-wide">{t('insights.no_spotlight')}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-brand-blue relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1)_0%,transparent_50%)]" />
              </div>
              
              <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-px bg-brand-gold" />
                       <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold">{t('insights.newsletter.tag')}</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl text-white font-serif mb-8 leading-tight">
                      {t('insights.newsletter.title').split('Newsletter')[0]} <span className="text-brand-gold italic">Newsletter</span>
                    </h3>
                    <p className="text-white/60 text-lg font-light leading-relaxed mb-10 max-w-lg">
                      {t('insights.newsletter.desc')}
                    </p>
                    <div className="flex flex-wrap gap-8 opacity-40 grayscale brightness-200">
                       <div className="text-[9px] uppercase tracking-widest font-black text-white px-3 py-1 border border-white/20">Institutional</div>
                       <div className="text-[9px] uppercase tracking-widest font-black text-white px-3 py-1 border border-white/20">Bespoke</div>
                       <div className="text-[9px] uppercase tracking-widest font-black text-white px-3 py-1 border border-white/20">Exclusive</div>
                    </div>
                  </motion.div>

                  <motion.div
                    id="newsletter-card"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 relative max-w-md lg:ml-auto w-full"
                  >
                    {profile?.isSubscribed ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                        <p className="text-brand-gold text-xs uppercase tracking-[0.2em] font-bold">
                          You are subscribed to our network
                        </p>
                        <p className="text-white/60 text-xs mt-2 font-mono">
                          Delivered to {profile.email}
                        </p>
                        <button
                          disabled={isSubscribing}
                          onClick={async () => {
                            if (!user) return;
                            setIsSubscribing(true);
                            setNewsletterStatus('Processing...');
                            const userPath = `users/${user.uid}`;
                            try {
                              // 1. Update user profile to unsubscribed
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
                              setNewsletterStatus("Successfully unsubscribed from our network.");
                            } catch (error) {
                              console.error(error);
                              setNewsletterStatus("Error unsubscribing. Please try again.");
                            } finally {
                              setIsSubscribing(false);
                            }
                          }}
                          className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 px-6 py-2 border border-red-500/20 transition-all cursor-pointer pointer-events-auto"
                        >
                          {isSubscribing ? 'Processing...' : 'Unsubscribe'}
                        </button>
                      </div>
                    ) : isUnsubscribingMode ? (
                      <form onSubmit={handleUnsubscribe} className="space-y-6">
                        <div>
                          <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 block">Unsubscribe from Newsletter</label>
                          <input 
                            type="email" 
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="Your subscribed email"
                            className="w-full bg-brand-blue/30 border border-white/10 px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-gold transition-all"
                            required
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={isSubscribing}
                          className="w-full bg-red-900/40 text-red-100 border border-red-500/30 py-5 font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-red-900/60 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 cursor-pointer pointer-events-auto"
                        >
                          {isSubscribing ? 'Processing...' : 'Unsubscribe Now'} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setIsUnsubscribingMode(false);
                              setNewsletterStatus(null);
                            }}
                            className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/60 hover:text-brand-gold transition-colors font-bold cursor-pointer"
                          >
                            Back to subscription
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        {user ? (
                          <div className="space-y-6">
                            <div>
                              <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 block">Subscribe to Newsletter</label>
                              <p className="text-white/80 text-sm leading-relaxed mb-6">
                                Join our network. We will use your registered email address (<span className="text-brand-gold font-semibold">{profile?.email || user.email}</span>) for the subscription.
                              </p>
                            </div>
                            <button 
                              onClick={handleSubscribe}
                              disabled={isSubscribing}
                              className="w-full bg-brand-gold text-brand-blue py-5 font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all flex items-center justify-center gap-3 group disabled:opacity-50 cursor-pointer pointer-events-auto"
                            >
                              {isSubscribing ? 'Processing...' : 'Join Our Newsletter'} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubscribe} className="space-y-6">
                            <div>
                              <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 block">Professional Information</label>
                              <input 
                                type="email" 
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Your professional email"
                                className="w-full bg-brand-blue/30 border border-white/10 px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-gold transition-all"
                                required
                              />
                            </div>
                            <button 
                              type="submit"
                              disabled={isSubscribing}
                              className="w-full bg-brand-gold text-brand-blue py-5 font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all flex items-center justify-center gap-3 group disabled:opacity-50 cursor-pointer pointer-events-auto"
                            >
                              {isSubscribing ? 'Processing...' : t('insights.newsletter.request')} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                          </form>
                        )}
                        <div className="text-center mt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsUnsubscribingMode(true);
                              setNewsletterStatus(null);
                            }}
                            className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-brand-gold transition-colors font-bold cursor-pointer"
                          >
                            Want to unsubscribe? Click here
                          </button>
                        </div>
                      </div>
                    )}
                    {newsletterStatus && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-brand-gold text-[10px] mt-6 text-center uppercase tracking-widest font-bold"
                      >
                        {newsletterStatus}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              </div>
            </section>

            {/* New from Univue Section */}
            <section className="section-padding">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-sm font-normal text-brand-gold uppercase tracking-[0.4em] mb-4">{t('insights.latest.tag')}</h2>
                  </div>
                  <button 
                    onClick={() => { setView('univue'); window.scrollTo(0, 0); }}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-blue hover:text-brand-gold transition-colors flex items-center gap-2 mb-2"
                  >
                    {t('insights.see_latest')} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                  {univueLatest.length > 0 ? (
                    univueLatest.map(i => renderArticleVertical(i))
                  ) : (
                    <div className="col-span-3 py-20 text-center border border-dashed border-gray-200">
                      <p className="text-gray-400 italic">{t('insights.loading_error')}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-24 bg-brand-ivory border-t border-gray-100">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <h3 className="text-3xl font-serif text-brand-blue mb-6">{t('insights.cta.title')}</h3>
                <p className="text-gray-500 font-light text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                  {t('insights.cta.desc')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/questionnaire" className="btn-briefing w-full sm:w-auto">
                    {t('nav.book')}
                  </Link>
                  <button 
                    onClick={() => { setView('archive'); window.scrollTo(0, 0); }}
                    className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-blue hover:text-brand-gold transition-colors py-4 px-8 border border-brand-blue/10 hover:border-brand-gold inline-flex items-center gap-2 group"
                  >
                    {t('insights.cta.secondary')} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {view === 'archive' && (
          <motion.div
            key="archive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section-padding px-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-12">
                <div>
                  <h2 className="text-3xl font-serif text-brand-blue mb-2">{t('insights.archive.title')}</h2>
                  <p className="text-gray-500 font-light">{t('insights.archive.desc')}</p>
                </div>
                <button 
                  onClick={() => setView('main')}
                  className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 hover:text-brand-blue flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> {t('insights.back_to_focus')}
                </button>
              </div>

              {/* Search and Filters */}
              <div className="mb-12 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                <div className="relative group flex-grow max-w-2xl w-full">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${searchQuery ? 'text-brand-gold' : 'text-gray-400'}`} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('insights.search.placeholder')}
                    className="w-full bg-white border border-gray-100 py-4 pl-12 pr-12 text-brand-blue placeholder:text-gray-400 focus:outline-none focus:border-brand-gold transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                  <div className="flex-grow lg:flex-grow-0 min-w-[140px]">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">{t('insights.filter.market')}</label>
                    <select 
                      value={marketFilter}
                      onChange={(e) => {
                        setMarketFilter(e.target.value);
                        setSubMarketFilter(t('insights.submarket.all'));
                      }}
                      className="w-full bg-white border border-gray-100 px-4 py-3 text-brand-blue text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-brand-gold appearance-none"
                    >
                      {[t('insights.market.all'), "Global", "UAE", "India", "Southeast Asia", "Emerging Markets"].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {marketFilter !== t('insights.market.all') && (
                    <div className="flex-grow lg:flex-grow-0 min-w-[140px]">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">{t('insights.filter.focus')}</label>
                      <select 
                        value={subMarketFilter}
                        onChange={(e) => setSubMarketFilter(e.target.value)}
                        className="w-full bg-white border border-gray-100 px-4 py-3 text-brand-blue text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-brand-gold appearance-none"
                      >
                        <option value={t('insights.submarket.all')}>{t('insights.submarket.all')} {marketFilter}</option>
                        {SUB_MARKETS[marketFilter]?.map(sm => (
                          <option key={sm} value={sm}>{sm}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex-grow lg:flex-grow-0 min-w-[140px]">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">{t('insights.filter.type')}</label>
                    <select 
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full bg-white border border-gray-100 px-4 py-3 text-brand-blue text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-brand-gold appearance-none"
                    >
                      {PAPER_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-grow lg:flex-grow-0 min-w-[140px]">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">{t('insights.filter.sort')}</label>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full bg-white border border-gray-100 px-4 py-3 text-brand-blue text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-brand-gold appearance-none"
                    >
                      <option value="latest">{t('insights.sort.latest')}</option>
                      <option value="oldest">{t('insights.sort.oldest')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                {filteredInsights.map(i => renderArticleHorizontal(i))}
                
                {filteredInsights.length === 0 && (
                  <div className="py-20 text-center border border-dashed border-gray-200">
                    <p className="text-gray-400 italic">{t('insights.no_results')}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'univue' && (
          <motion.div
            key="univue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section-padding px-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-12">
                <div>
                  <h2 className="text-3xl font-serif text-brand-blue mb-2">{t('insights.latest.tag')}</h2>
                  <p className="text-gray-500 font-light">{t('insights.archive.desc')}</p>
                </div>
                <button 
                  onClick={() => setView('main')}
                  className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 hover:text-brand-blue flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> {t('insights.back_to_focus')}
                </button>
              </div>

              <div className="space-y-12">
                {univueLatest.map(i => renderArticleHorizontal(i))}
                
                {univueLatest.length === 0 && (
                  <div className="py-20 text-center border border-dashed border-gray-200">
                    <p className="text-gray-400 italic">{t('insights.no_results')}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'article' && selectedArticle && (
          <motion.div
            key="article"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-24"
          >
            <div className="max-w-4xl mx-auto px-6">
              <div className="py-12 flex justify-between items-center">
                <button 
                  onClick={() => setView('main')}
                  className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 hover:text-brand-blue flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> {t('insights.back')}
                </button>
                <div className="flex gap-4 flex-wrap">
                  {(selectedArticle.markets || (selectedArticle.market ? [selectedArticle.market] : []))?.map(m => (
                    <span key={m} className="px-3 py-1 bg-gray-100 text-[10px] uppercase tracking-widest font-bold text-brand-blue">
                      {m}
                    </span>
                  ))}
                  {(selectedArticle.subMarkets || (selectedArticle.subMarket ? [selectedArticle.subMarket] : []))?.map(sm => (
                    <span key={sm} className="px-3 py-1 bg-brand-gold/10 text-[10px] uppercase tracking-widest font-bold text-brand-gold">
                      {sm}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    {selectedArticle.type}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    {selectedArticle.displayDate}
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif text-brand-blue mb-12 leading-[1.1]">
                {selectedArticle.title}
              </h1>

              <div className="aspect-[21/9] mb-16 overflow-hidden">
                <img 
                  src={selectedArticle.photoUrl} 
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <article className="prose prose-brand max-w-none prose-h2:font-serif prose-h2:text-3xl prose-h2:text-brand-blue prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg prose-p:font-light">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    blockquote: ({ children }) => (
                      <div className="my-16 px-12 py-4 relative border-l-2 border-brand-gold bg-brand-ivory/50">
                        <div className="absolute -top-6 -left-3 text-7xl font-serif text-brand-gold/20 leading-none">"</div>
                        <div className="text-2xl font-serif text-brand-blue italic leading-relaxed">
                          {children}
                        </div>
                      </div>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-3xl font-serif text-brand-blue mt-16 mb-8 pb-4 border-b border-gray-100">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold uppercase tracking-widest text-brand-gold mt-12 mb-6">
                        {children}
                      </h3>
                    ),
                    hr: () => (
                      <div className="my-16 flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-brand-gold/30" />
                        <div className="w-2 h-2 rounded-full bg-brand-gold" />
                        <div className="h-[1px] w-12 bg-brand-gold/30" />
                      </div>
                    )
                  }}
                >
                  {selectedArticle.content
                    .replace(/:::highlight\n([\s\S]*?)\n:::/g, '<div class="insight-highlight font-sans text-brand-ivory">$1</div>')
                    .replace(/:::grid\n([\s\S]*?)\n:::/g, '<div class="insight-grid">$1</div>')
                  }
                </ReactMarkdown>
              </article>

              {/* More from Univue CTA inside article */}
              <div className="mt-24 pt-12 border-t border-gray-100">
                 <div className="bg-brand-blue p-8 md:p-12 text-center">
                    <h3 className="text-2xl text-brand-gold font-serif mb-4 italic">{t('insights.gain_clarity')}</h3>
                    <p className="text-white/60 text-sm font-light mb-8 max-w-lg mx-auto">
                      {t('insights.clarity_desc')}
                    </p>
                    <Link to="/questionnaire" className="btn-briefing inline-block">
                       {t('nav.book')}
                    </Link>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
