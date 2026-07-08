import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useMarkets } from '../contexts/MarketContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { marketTranslations } from '../data/marketTranslations';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { StructuredData } from '../components/StructuredData';

export const IndiaExpansion = () => {
  const { t, language } = useLanguage();
  const { cities: allCities } = useMarkets();
  const { photos } = useSiteSettings();
  const navigate = useNavigate();

  useDocumentMetadata({
    title: `${t('india.hero.title') || 'India Operations & Expansion'}`,
    description: t('india.hero.desc') || 'Scale your business operations in India. Expert coordination for Grade-A office setups, compliance, logistics, and partnerships.',
    keywords: 'India business expansion, Bangalore tech hub, Mumbai corporate HQ, Grade-A offices Gurgaon'
  });

  const indiaCities = allCities.filter(c => c.marketId === 'india');
  const [selectedCity, setSelectedCity] = React.useState(indiaCities[0]?.name || "Bangalore");

  const indiaSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${t('india.hero.title') || 'India Operational Expansion'} | Univue Consultants`,
    "description": t('india.hero.desc') || 'Comprehensive operational entry and corporate advisory in Indian high-growth cities.',
    "publisher": {
      "@type": "Organization",
      "name": "Univue Consultants ApS",
      "url": "https://univueconsultants.com"
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (indiaCities.length > 0 && !indiaCities.some(c => c.name === selectedCity)) {
       setSelectedCity(indiaCities[0].name);
    }
  }, [indiaCities, selectedCity]);

  const cityDetails = indiaCities.reduce((acc, city) => {
    const langKey = language === 'da' ? 'da' : 'en';
    const dict = marketTranslations[langKey];
    const key = city.id;
    if (dict[key]) {
      acc[city.name] = {
        ...dict[key],
        image: city.image || "https://images.unsplash.com/photo-1596761301586-5c502150123b?auto=format&fit=crop&q=80&w=2070"
      };
    } else {
      acc[city.name] = {
        type: city.positioning + " Investment",
        desc: city.thesis,
        stats: [
          { label: "Talent", value: "1.5M+" },
          { label: "Yield", value: city.rentalYield || "3-5%" },
          { label: "Status", value: city.positioning }
        ],
        highlights: [
          city.infraGrowth || "Strategic infrastructure growth",
          city.relevance || "Global tech capital relevance",
          "High capital appreciation potential"
        ],
        image: city.image || "https://images.unsplash.com/photo-1596761301586-5c502150123b?auto=format&fit=crop&q=80&w=2070"
      };
    }
    return acc;
  }, {} as any);

  const cities = Object.keys(cityDetails);
  
  const currentDetail = cityDetails[selectedCity] || {
    type: language === 'da' ? "Førsteklasses Virksomhedsetablering" : "Premium Enterprise Setup",
    desc: language === 'da' 
      ? "Indien udgør en af de hurtigst voksende store økonomier globalt, drevet af teknologisk innovation, dybe talentmasser og store industrielle ekspansioner."
      : "India constitutes one of the fastest-growing major economies globally, driven by tech innovation, deep talent pools, and major industrial expansions.",
    stats: [
      { label: language === 'da' ? "Fagfolk" : "Talent", value: "1.5M+" },
      { label: language === 'da' ? "Afkast" : "Yield", value: "3-5%" },
      { label: "Status", value: language === 'da' ? "Vækstundermarked" : "Growth Sub-Market" }
    ],
    highlights: [
      language === 'da'
        ? "Hurtigt skalerbare Grade-A teknologi- og innovationsklynger"
        : "Rapidly scaling Grade-A technology and innovation clusters",
      language === 'da'
        ? "Robuste regulatoriske initiativer og særlige økonomiske zonefordele"
        : "Robust regulatory initiatives and special economic zone incentives",
      language === 'da'
        ? "Stærkt langsigtet indenlandsk forbrug og kapitalvækst"
        : "Strong long-term domestic consumption and capital appreciation"
    ],
    image: "https://images.unsplash.com/photo-1596761301586-5c502150123b?auto=format&fit=crop&q=80&w=2070"
  };

  const [comparisonItems, setComparisonItems] = React.useState<string[]>([]);

  const toggleComparison = (id: string) => {
    setComparisonItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const opportunities = [
    {
      title: t('india.opt1.title'),
      desc: t('india.opt1.desc')
    },
    {
      title: t('india.opt2.title'),
      desc: t('india.opt2.desc')
    },
    {
      title: t('india.opt3.title'),
      desc: t('india.opt3.desc')
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-brand-ivory">
      <StructuredData data={indiaSchema} />
      {/* Page Header */}
      <section className="relative h-[40vh] flex items-center overflow-hidden bg-brand-blue text-brand-ivory">
        <div className="absolute inset-0">
          <img 
            src={photos.india_microsite_hero} 
            alt="Modern Architecture" 
            className="w-full h-full object-cover grayscale-[0.5] brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay" />
        </div>
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-normal mb-6">{t('india.hero.title')}</h1>
            <p className="text-lg text-brand-ivory/70 max-w-2xl leading-relaxed">
              {t('india.hero.desc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Market Highlights & Advantages */}
      <section className="section-padding overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {opportunities.map((opt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white border border-gray-100 rounded-sm hover:border-brand-gold transition-colors shadow-sm"
              >
                <div className="w-12 h-1 bg-brand-gold mb-6" />
                <h3 className="text-xl font-normal text-brand-blue mb-4">{opt.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{opt.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 bg-white border border-gray-100 p-8 md:p-12 group hover:border-brand-gold/30 transition-all duration-500 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <h4 className="text-2xl font-serif text-brand-blue">{t('india.adv.title')}</h4>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: t('india.adv1.title'), desc: t('india.adv1.desc') },
                { title: t('india.adv2.title'), desc: t('india.adv2.desc') },
                { title: t('india.adv3.title'), desc: t('india.adv3.desc') },
                { title: t('india.adv4.title'), desc: t('india.adv4.desc') }
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                  <div>
                    <span className="block font-bold text-brand-blue text-[11px] uppercase tracking-wider mb-1">{point.title}</span>
                    <p className="text-gray-500 text-xs leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Hubs - Interactive Selector */}
      <section className="section-padding bg-brand-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-normal text-brand-gold uppercase tracking-[0.2em] mb-4">{t('uae.hubs.tag')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('india.hubs.desc')}
            </p>
          </div>

          {/* City Selector Tabs */}
          <div className="flex justify-center mb-16 border-b border-gray-200">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-px">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-6 pb-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative group ${
                    selectedCity === city ? "text-brand-blue" : "text-gray-400 hover:text-brand-blue"
                  }`}
                >
                  <motion.span 
                    className="relative z-10"
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {city}
                  </motion.span>
                  
                  {/* Subtle hover background */}
                  <div className={`absolute inset-0 bg-gray-100/0 group-hover:bg-brand-gold/5 transition-all duration-300 rounded-t-lg -top-2 ${
                    selectedCity === city ? "bg-brand-gold/10" : ""
                  }`} />

                  {selectedCity === city && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold z-20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selected City Content */}
          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCity}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
            <div className="space-y-8">
              <div>
                <span className="text-brand-gold font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">
                  {currentDetail.type}
                </span>
                <h4 className="text-3xl font-serif text-brand-blue mb-6">{t('india.profile.title')}: {selectedCity}</h4>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {currentDetail.desc}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-8">
                {currentDetail.stats.map((stat: any, i: number) => (
                  <div key={i}>
                    <p className="text-2xl font-serif text-brand-blue">{stat.value}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <p className="font-bold text-xs uppercase tracking-widest text-brand-blue">{t('india.highlights.title')}</p>
                <ul className="space-y-3">
                  {currentDetail.highlights.map((highlight: string, i: number) => {
                    const hasColon = highlight.includes(':');
                    const title = hasColon ? highlight.substring(0, highlight.indexOf(':')) : '';
                    const desc = hasColon ? highlight.substring(highlight.indexOf(':') + 1) : highlight;
                    return (
                      <li key={i} className="flex gap-3 text-sm text-gray-600 align-start">
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0 mt-2" />
                        <div>
                          {hasColon ? (
                            <>
                              <strong className="text-brand-blue font-bold block mb-1">{title}</strong>
                              <span className="text-gray-600 text-sm leading-relaxed">{desc.trim()}</span>
                            </>
                          ) : (
                            <span>{highlight}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[650px] overflow-hidden rounded-sm group/image">
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full h-full"
              >
                <img
                  src={currentDetail.image}
                  alt={selectedCity}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute inset-0 bg-brand-blue/10"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </section>

      {/* Comparison Tool */}
  <section className="section-padding bg-corporate-gradient text-brand-ivory">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-sm font-normal text-brand-gold uppercase tracking-[0.2em] mb-4">{t('uae.compare.tag')}</h2>
          <p className="text-brand-ivory/60 max-w-xl">
            {t('india.compare.desc')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {cities.map(c => (
            <button
              key={c}
              onClick={() => toggleComparison(c)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all duration-300 ${
                comparisonItems.includes(c) 
                  ? "bg-brand-gold border-brand-gold text-brand-blue" 
                  : "border-brand-ivory/20 text-brand-ivory/60 hover:border-brand-gold/50"
              }`}
            >
              {c}
            </button>
          ))}
          {comparisonItems.length > 0 && (
            <button 
              onClick={() => setComparisonItems([])}
              className="text-[10px] uppercase tracking-widest font-bold text-brand-gold underline underline-offset-4 ml-2"
            >
              {t('uae.compare.clear')}
            </button>
          )}
        </div>
      </div>

      {comparisonItems.length === 0 ? (
        <div className="py-20 border border-dashed border-brand-ivory/10 rounded-sm text-center">
          <p className="text-brand-ivory/40 text-sm">{t('india.compare.empty')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar">
          <div className={`grid gap-px bg-brand-ivory/10 min-w-[1000px]`} style={{ gridTemplateColumns: `repeat(${comparisonItems.length}, 1fr)` }}>
            {/* Header Row */}
            <div className="grid grid-cols-subgrid col-span-full">
              {comparisonItems.map(id => (
                <div key={id} className="bg-corporate-gradient p-6 text-center border-x border-brand-ivory/5">
                  <div className="aspect-video mb-4 overflow-hidden rounded-sm">
                    <img src={cityDetails[id].image} alt={id} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="text-xl font-serif text-brand-gold">{id}</h4>
                  <p className="text-[10px] text-brand-ivory/40 uppercase tracking-widest mt-1">
                    {cityDetails[id].type}
                  </p>
                </div>
              ))}
            </div>

            {/* Description Row */}
            <div className="grid grid-cols-subgrid col-span-full border-t border-brand-ivory/5">
              {comparisonItems.map(id => (
                <div key={id} className="p-6 text-xs text-brand-ivory/60 leading-relaxed border-x border-brand-ivory/5">
                  {cityDetails[id].desc}
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-subgrid col-span-full border-t border-brand-ivory/5">
              {comparisonItems.map(id => (
                <div key={id} className="p-6 bg-white/5 border-x border-brand-ivory/5">
                  <div className="space-y-4">
                    {cityDetails[id].stats.map((stat, i) => (
                      <div key={i}>
                        <p className="text-lg font-serif text-white">{stat.value}</p>
                        <p className="text-[8px] text-brand-ivory/40 uppercase tracking-tighter">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights Row */}
            <div className="grid grid-cols-subgrid col-span-full border-t border-brand-ivory/5">
              {comparisonItems.map(id => (
                <div key={id} className="p-6 border-x border-brand-ivory/5">
                  <ul className="space-y-3">
                    {cityDetails[id].highlights.map((h, i) => {
                      const hasColon = h.includes(':');
                      const title = hasColon ? h.substring(0, h.indexOf(':')) : '';
                      const desc = hasColon ? h.substring(h.indexOf(':') + 1) : h;
                      return (
                        <li key={i} className="flex gap-2 text-[10px] text-brand-ivory/70 leading-snug">
                          <div className="w-1 h-1 bg-brand-gold rounded-full shrink-0 mt-1.5" />
                          <div>
                            {hasColon ? (
                              <>
                                <strong className="text-brand-gold font-bold block mb-0.5">{title}</strong>
                                <span>{desc.trim()}</span>
                              </>
                            ) : (
                              <span>{h}</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-ivory relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-brand-blue mb-8">{t('india.cta.title')}</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('india.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button onClick={() => navigate('/questionnaire')} className="btn-briefing py-4 px-12">{t('hero.cta.primary')}</button>
            <button onClick={() => navigate('/market-catalog')} className="btn-outline py-4 px-12">{t('home.choice.catalog')}</button>
          </div>
        </div>
      </section>
    </div>
  );
};
