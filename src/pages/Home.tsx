import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ServiceCard } from '../components/ServiceCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2, Heart, MapPin, Calendar } from 'lucide-react';
import { StructuredData } from '../components/StructuredData';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
// @ts-ignore
import uaeRegeneratedImage from '../assets/images/regenerated_image_1780661181173.jpg';
import { PropertyImageSlider } from '../components/PropertyImageSlider';
import { PropertyDetailModal } from '../components/PropertyDetailModal';

export const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useDocumentMetadata({
    title: t('hero.subtitle') || 'International Advisory',
    description: t('hero.desc') || 'Cross-border coordination supported through strategic real estate partner networks across UAE, India, and Southeast Asian markets.',
    keywords: 'Univue Consultants, Dubai Investment, India business expansion, Denmark to Dubai, European business relocation, advisor choice properties'
  });

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

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [hoveredColumn, setHoveredColumn] = React.useState<number | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const { photos } = useSiteSettings();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, 'properties'), 
          where('isAdvisorsChoice', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        
        // Sort client-side by createdAt desc to avoid composite index requirement
        fetched.sort((a, b) => {
          const tA = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
          const tB = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
          return tB - tA;
        });

        // Limit to 6 documents
        const limited = fetched.slice(0, 6);
        
        if (limited.length > 0) {
          // Map to internal format if needed, but the UI is flexible
          setFeaturedProperties(limited.map((p: any) => ({
            id: p.id,
            name: p.name,
            title: p.name,
            location: p.location,
            country: p.country,
            startingPrice: p.startingPrice,
            price: p.startingPrice,
            developer: p.developer,
            image: p.image,
            images: p.images || [],
            city: p.city,
            type: p.type,
            highlights: p.highlights || [],
            description: p.description,
            paymentPlan: p.paymentPlan,
            recommendationLevel: p.recommendationLevel,
            handoverTime: p.handoverTime,
            status: p.status
          })));
        } else {
          setFeaturedProperties([]);
        }
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
        setFeaturedProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchFeatured();
  }, []);

  const heroColumns = [
    {
      id: 0,
      title: t('home.hero.col.uae'),
      subtitle: "",
      image: photos.hero_uae_col,
      link: "/uae"
    },
    {
      id: 1,
      title: t('home.hero.col.india'),
      subtitle: "",
      image: photos.hero_india_col,
      link: "/india"
    },
    {
      id: 2,
      title: t('home.hero.col.seasia'),
      subtitle: "",
      image: photos.hero_seasia_col,
      link: "/southeast-asia"
    }
  ];

  const featuredOpportunities = [
    {
      title: "The Oasis by Emaar",
      location: "Dubai, UAE",
      yield: "7.2% Expected",
      price: "From $1.2M",
      rationale: "Strategic luxury expansion by Emaar with limited waterfront villas. Ideal for capital preservation and high rental demand from high-net-worth families.",
      developer: "Emaar Properties",
      image: "https://images.unsplash.com/photo-1582672097732-28a6044ca66a?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Saadiyat Lagoons",
      location: "Abu Dhabi, UAE",
      yield: "6.8% Expected",
      price: "From $1.8M",
      rationale: "Culture-adjacent living in the UAE's most prestigious cultural district. Strong institutional backing and strict supply control ensure long-term value.",
      developer: "Aldar Properties",
      image: "https://images.unsplash.com/photo-1544918877-460635b6d13e?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Wynn Residences",
      location: "Al Marjan Island, RAK",
      yield: "12% Capital Growth",
      price: "From $850k",
      rationale: "First mover advantage in the GCC's only integrated resort district. Massive upside potential as infrastructure completes.",
      developer: "Marjan / Licensed Partners",
      image: "https://images.unsplash.com/photo-1622323773173-9a4f7e274718?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Bangalore North IT Hub",
      location: "Bangalore, India",
      yield: "8.5% Commercial",
      price: "From $500k",
      rationale: "Grade-A office assets in the heart of India's Silicon Valley. High pre-leasing velocity by global tech firms ensures immediate returns.",
      developer: "Prestige Group",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc183f23?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Cyber City Phase II",
      location: "Gurgaon, India",
      yield: "9% Rental Yield",
      price: "Portfolio Entry",
      rationale: "Re-development of prime commercial land into premium flexible workspaces. Strategic positioning for Fortune 500 regional HQs.",
      developer: "DLF Limited",
      image: "https://images.unsplash.com/photo-1590059345108-a5649987f6ed?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Palm Jumeirah Signature Suite",
      location: "Dubai, UAE",
      yield: "10% Short-term",
      price: "From $2.4M",
      rationale: "Rare trophy asset on the world's most famous man-made island. Exceptional short-term rental performance and secondary market liquidity.",
      developer: "Select Group",
      image: "https://images.unsplash.com/photo-1578142385315-77981f970220?auto=format&fit=crop&q=80&w=2000"
    }
  ];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Univue Consultants ApS",
    "url": "https://univueconsultants.com",
    "logo": "https://univueconsultants.com/logo.png",
    "description": t('hero.desc'),
    "sameAs": [
      "https://linkedin.com/company/univue-consultants"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UAE"
    }
  };

  return (
    <div className="selection:bg-brand-gold selection:text-brand-ivory">
      <StructuredData data={organizationSchema} />
      <motion.div className="scroll-progress" style={{ scaleX }} />
      
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center overflow-hidden bg-brand-blue">
        {/* Simplified Premium Background for Mobile Screen Layout */}
        <div className="absolute inset-0 block md:hidden z-0 bg-brand-blue">
          <img 
            src={photos.about_hero} 
            alt="Univue Global Capital" 
            className="w-full h-full object-cover opacity-25 brightness-[0.45]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/60 to-transparent" />
        </div>

        {/* Interactive Background Columns - Desktop Only */}
        <div className="absolute inset-0 hidden md:flex z-0">
          {heroColumns.map((col, idx) => (
            <motion.div
              key={col.id}
              className="relative h-full border-r border-white/5 last:border-0 overflow-hidden cursor-pointer"
              initial={false}
              animate={{ 
                flex: hoveredColumn === null ? 1 : (hoveredColumn === idx ? 2 : 0.5),
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredColumn(idx)}
              onMouseLeave={() => setHoveredColumn(null)}
              onClick={() => navigate(col.link)}
            >
              <motion.img 
                src={col.image} 
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0"
                animate={{ 
                  scale: hoveredColumn === idx ? 1.1 : 1,
                  filter: hoveredColumn === idx ? "grayscale(0) brightness(0.6)" : "grayscale(0.5) brightness(0.4)"
                }}
                transition={{ duration: 0.8 }}
                referrerPolicy="no-referrer"
              />
              
              {/* Interactive Tints based on column index */}
              {idx === 0 && (
                <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay z-10 pointer-events-none" />
              )}
              {idx === 1 && (
                <div className="absolute inset-0 bg-orange-500/20 mix-blend-overlay z-10 pointer-events-none" />
              )}
              {idx === 2 && (
                <div className="absolute inset-0 bg-orange-700/40 mix-blend-overlay z-10 pointer-events-none" />
              )}
              
              <div className="absolute inset-0 bg-brand-gold/10 mix-blend-soft-light z-10 pointer-events-none" />
              <div className="absolute inset-0 backdrop-blur-[1px] z-10 pointer-events-none" />
              
              {/* Column Content (Visible on individual columns if needed) */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 z-20 pointer-events-none">
                <motion.div
                  animate={{ 
                    opacity: hoveredColumn === idx ? 1 : 0.3,
                    y: hoveredColumn === idx ? 0 : 20
                  }}
                >
                  {col.subtitle && (
                    <span className="block text-brand-gold font-normal tracking-[0.3em] uppercase text-xs text-center mb-2">
                      {col.subtitle}
                    </span>
                  )}
                  <h4 className="text-brand-ivory font-serif font-normal text-sm uppercase tracking-widest drop-shadow-md">
                    {col.title}
                  </h4>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Central Hero Text Overlay */}
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pointer-events-none">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-brand-gold font-normal tracking-[0.4em] uppercase text-xs mb-4 drop-shadow-sm">
                {t('hero.subtitle')}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-normal text-brand-ivory leading-tight mb-5 drop-shadow-2xl tracking-tight">
                {t('hero.title')} <span className="text-gold-gradient">{t('hero.title.accent')} {t('hero.title.bottom')}</span>
              </h1>
              <p className="text-base md:text-lg text-brand-ivory/95 max-w-xl mb-8 leading-relaxed drop-shadow-lg font-normal antialiased">
                {t('hero.desc')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 pointer-events-auto">
                <button 
                  onClick={() => navigate('/questionnaire')}
                  className="btn-primary flex items-center justify-center gap-2 group uppercase text-[11px] tracking-widest"
                >
                  {t('hero.cta.primary')} 
                </button>
                <button 
                  onClick={() => navigate('/market-catalog')}
                  className="btn-outline flex items-center justify-center gap-2 group uppercase text-[11px] tracking-widest"
                >
                  {t('nav.catalog')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Subtle Bottom Shade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-blue to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* Access to Market Leaders - Sophisticated Marquee */}
      <section className="py-12 bg-brand-ivory border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-2">{t('home.partners.title')}</h3>
          <div className="w-12 h-[1px] bg-brand-gold/30 mx-auto" />
        </div>
        
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-20 py-4">
            {[
              { name: t('home.partner.emaar'), desc: t('home.partner.emaar.desc') },
              { name: t('home.partner.sobha'), desc: t('home.partner.sobha.desc') },
              { name: t('home.partner.damac'), desc: t('home.partner.damac.desc') },
              { name: t('home.partner.binghatti'), desc: t('home.partner.binghatti.desc') },
              { name: t('home.partner.azizi'), desc: t('home.partner.azizi.desc') },
              { name: t('home.partner.wasel'), desc: t('home.partner.wasel.desc') },
              { name: t('home.partner.bnw'), desc: t('home.partner.bnw.desc') },
              // Duplicate for seamless loop
              { name: t('home.partner.emaar'), desc: t('home.partner.emaar.desc') },
              { name: t('home.partner.sobha'), desc: t('home.partner.sobha.desc') },
              { name: t('home.partner.damac'), desc: t('home.partner.damac.desc') },
              { name: t('home.partner.binghatti'), desc: t('home.partner.binghatti.desc') },
              { name: t('home.partner.azizi'), desc: t('home.partner.azizi.desc') },
              { name: t('home.partner.wasel'), desc: t('home.partner.wasel.desc') },
              { name: t('home.partner.bnw'), desc: t('home.partner.bnw.desc') }
            ].map((partner, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-serif font-black text-3xl md:text-4xl text-brand-blue/10 hover:text-brand-blue transition-colors duration-700 cursor-default tracking-tighter">
                  {partner.name}
                </span>
                <span className="text-[8px] uppercase font-bold text-brand-gold tracking-[0.2em] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {partner.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-12 md:py-16 px-6 md:px-12 lg:px-24 bg-brand-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xs font-normal text-brand-gold uppercase tracking-[0.4em] mb-4 inline-block">{t('home.workwith.tag')}</h2>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: t('home.workwith.investors.title'), 
                desc: t('home.workwith.investors.desc')
              },
              { 
                title: t('home.workwith.expansion.title'), 
                desc: t('home.workwith.expansion.desc')
              },
              { 
                title: t('home.workwith.entrepreneurship.title'), 
                desc: t('home.workwith.entrepreneurship.desc')
              },
              { 
                title: t('home.workwith.corporate.title'), 
                desc: t('home.workwith.corporate.desc')
              },
              { 
                title: t('home.workwith.investmentgroups.title'), 
                desc: t('home.workwith.investmentgroups.desc')
              },
              { 
                title: t('home.workwith.collaboration.title'), 
                desc: t('home.workwith.collaboration.desc')
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`flex-col items-center text-center p-6 bg-white border border-gray-100/80 hover:border-brand-gold/30 transition-all duration-500 shadow-sm group h-full ${i >= 3 ? 'hidden md:flex' : 'flex'}`}
              >
                <h4 className="font-normal text-brand-blue uppercase tracking-widest text-sm mb-2 min-h-[1.5rem] flex items-center">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-normal antialiased">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-brand-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-normal text-brand-gold uppercase tracking-[0.2em]">{t('home.markets.tag')}</h2>
          </div>

          <div className="space-y-12">
            <ServiceCard 
              id="uae"
              title={t('home.markets.uae.title')}
              description={t('home.markets.uae.desc')}
              accentColor="gold"
              images={[
                photos.market_uae_slide1,
                photos.market_uae_slide2,
                photos.market_uae_slide3
              ]}
              ctaText={t('dubai.cta')}
              link="/uae"
              listHeader={t('home.markets.uae.advantages_title')}
              items={[
                t('home.markets.uae.item1'),
                t('home.markets.uae.item2'),
                t('home.markets.uae.item3'),
                t('home.markets.uae.item4')
              ]}
            />

            <ServiceCard 
              id="india"
              title={t('home.markets.india.title')}
              description={t('home.markets.india.desc')}
              accentColor="blue"
              images={[
                photos.market_india_slide1,
                photos.market_india_slide2,
                photos.market_india_slide3
              ]}
              ctaText={t('india.cta')}
              link="/india"
              imageRight={true}
              listHeader={t('home.markets.india.advantages_title')}
              items={[
                t('home.markets.india.item1'),
                t('home.markets.india.item2'),
                t('home.markets.india.item3'),
                t('home.markets.india.item4')
              ]}
            />

            <ServiceCard 
              id="seasia"
              title={t('home.markets.seasia.title')}
              description={t('home.markets.seasia.desc')}
              accentColor="gold"
              images={[
                photos.market_seasia_slide1,
                photos.market_seasia_slide2,
                photos.market_seasia_slide3
              ]}
              ctaText={t('nav.seasia.markets')}
              link="/southeast-asia"
              listHeader={t('home.markets.seasia.advantages_title')}
              items={[
                t('home.markets.seasia.item1'),
                t('home.markets.seasia.item2'),
                t('home.markets.seasia.item3'),
                t('home.markets.seasia.item4')
              ]}
            />
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="section-padding bg-brand-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-xs font-normal text-brand-gold uppercase tracking-[0.4em] mb-4">{t('home.choice.tag')}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loadingProperties ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t('home.choice.loading')}</p>
              </div>
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((op, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedProperty(op)}
                  className="group flex flex-col h-full bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-brand-gold/20 cursor-pointer"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <PropertyImageSlider images={op.images} defaultImage={op.image} alt={op.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/60 via-transparent to-transparent opacity-40 pointer-events-none" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 bg-brand-gold/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-brand-blue border border-brand-blue/5 shadow-lg">
                      {op.status || 'INVESTMENT READY'}
                    </div>

                    {/* Recommendation Badge */}
                    {op.recommendationLevel && (
                      <div className="absolute top-4 right-4 bg-amber-600/95 backdrop-blur-sm px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                        ★ {op.recommendationLevel}
                      </div>
                    )}

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(op.id, e);
                      }}
                      className="absolute top-12 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform text-brand-blue z-10"
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(op.id) ? 'fill-red-500 text-red-500' : 'text-brand-blue'}`} />
                    </button>

                    {/* Submarket & Market */}
                    <div className="absolute bottom-4 left-4 bg-brand-blue/80 backdrop-blur-md px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-brand-ivory border border-white/10">
                      {op.country} {op.city ? `• ${op.city}` : ''}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      {/* Developer & Type */}
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                          {op.type || 'Property'} {op.developer?.name || op.developer ? `by ${op.developer?.name || op.developer}` : ''}
                        </span>
                      </div>
                      
                      {/* Property Name */}
                      <h3 className="text-xl font-serif text-brand-blue group-hover:text-brand-gold transition-colors mb-2 line-clamp-1">
                        {op.title}
                      </h3>
                      
                      {/* Location Address */}
                      <div className="flex items-center gap-1.5 text-gray-400 font-medium text-xs mb-3">
                        <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span className="truncate">{op.location}</span>
                      </div>

                      {/* Description / Statement of the property */}
                      {op.description && (
                        <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-2 mb-3">
                          {op.description}
                        </p>
                      )}

                      {/* Highlights & Perks (horizontal tags) */}
                      {op.highlights && op.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {op.highlights.slice(0, 2).map((highlight: string, idx: number) => (
                            <span key={idx} className="bg-brand-ivory text-brand-blue text-[8px] font-medium uppercase tracking-wider px-2 py-0.5 border border-brand-blue/5">
                              ✓ {highlight}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Handover & Payment Plan details */}
                    <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-light">
                        {op.handoverTime && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                            Handover: <strong className="text-brand-blue font-semibold">{op.handoverTime}</strong>
                          </span>
                        )}
                        {op.paymentPlan && (
                          <span className="text-right truncate max-w-[150px]" title={op.paymentPlan}>
                            Plan: <strong className="text-brand-blue font-semibold">{op.paymentPlan}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-end mt-1">
                        <span className="text-[10px] uppercase tracking-wider text-brand-gold font-bold">Starts From</span>
                        <span className="text-lg font-serif font-bold text-brand-blue tracking-tight">
                          {op.startingPrice || op.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-brand-ivory rounded-full flex items-center justify-center mb-6">
                  <Loader2 className="w-6 h-6 text-brand-gold/40 animate-spin" />
                </div>
                <p className="text-lg font-serif text-brand-blue mb-2">{t('home.choice.empty')}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">{t('home.choice.empty.sub')}</p>
              </div>
            )}
          </div>

          <div className="mt-20 text-center">
            <button 
              onClick={() => navigate('/market-catalog')}
              className="btn-outline border-brand-blue/10 text-brand-blue hover:border-brand-gold"
            >
              {t('home.choice.catalog')}
            </button>
          </div>
        </div>
      </section>

      {/* Process / Client Journey */}
      <section id="journey" className="section-padding bg-brand-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-xs font-normal text-brand-gold uppercase tracking-[0.4em] mb-4">{t('home.journey.tag')}</h2>
            <p className="text-gray-500 text-sm max-w-xl leading-relaxed antialiased">
              {t('home.journey.desc')}
            </p>
          </div>

          <div className="relative">
            {/* Progression Line (Desktop) */}
            <div className="hidden lg:block absolute top-[45px] left-0 right-0 h-[1px] bg-gray-100 z-0">
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-brand-gold origin-left w-full"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { 
                  num: "01", 
                  title: t('home.journey.step1.title'), 
                  desc: t('home.journey.step1.desc') 
                },
                { 
                  num: "02", 
                  title: t('home.journey.step2.title'), 
                  desc: t('home.journey.step2.desc') 
                },
                { 
                  num: "03", 
                  title: t('home.journey.step3.title'), 
                  desc: t('home.journey.step3.desc') 
                },
                { 
                  num: "04", 
                  title: t('home.journey.step4.title'), 
                  desc: t('home.journey.step4.desc') 
                }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative group lg:pt-16"
                >
                  {/* Timeline Point */}
                  <div className="hidden lg:flex absolute top-10 left-0 w-3 h-3 rounded-full bg-white border border-brand-gold items-center justify-center transform -translate-y-1/2 z-20 group-hover:scale-150 transition-transform duration-500">
                    <div className="w-1 h-1 rounded-full bg-brand-gold" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-6xl font-serif font-black text-brand-blue/5 mb-4 group-hover:text-brand-gold/10 transition-colors duration-700">
                      {step.num}
                    </span>
                    <h4 className="text-xl font-normal text-brand-blue mb-4 tracking-tight uppercase text-xs font-bold tracking-[0.2em]">
                      {step.title}
                    </h4>
                    <div className="h-[1px] w-8 bg-brand-gold mb-6 group-hover:w-full transition-all duration-700 opacity-50" />
                    <p className="text-sm text-gray-500 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-brand-ivory relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-6xl font-serif font-normal text-brand-blue mb-6 md:mb-8 tracking-tight">{t('home.cta.title')}</h2>
          <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed antialiased">
            {t('home.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <button 
              onClick={() => navigate('/questionnaire')}
              className="btn-briefing !py-4 md:!py-6 !px-8 md:!px-16 !text-xs md:!text-sm shadow-2xl hover:translate-y-[-4px]"
            >
              {t('hero.cta.primary')}
            </button>
            <a 
              href="tel:+4526378270"
              className="flex items-center justify-center gap-3 text-brand-blue font-bold px-4 py-3 md:py-0 hover:text-brand-gold transition-colors text-sm"
            >
              +45 26 37 82 70
            </a>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      </section>

      {/* Detail Overlay Modal */}
      {selectedProperty && (
        <PropertyDetailModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </div>
  );
};
