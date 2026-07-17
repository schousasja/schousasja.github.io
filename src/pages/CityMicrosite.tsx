import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useMarkets } from '../contexts/MarketContext';
import { marketTranslations } from '../data/marketTranslations';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { StructuredData } from '../components/StructuredData';

const CityMicrosite: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const { t, language, translateCity } = useLanguage();
  const { cities: allCities, loading } = useMarkets();
  const city = allCities.find(c => c.id === cityId);

  const langKey = language === 'da' ? 'da' : 'en';
  const localizedData = city ? marketTranslations[langKey][city.id] : null;

  useDocumentMetadata({
    title: city ? (language === 'da' ? `${translateCity(city.name)} Markedsanalyse & Indsigt` : `${city.name} Market Analysis & Insights`) : (language === 'da' ? 'Markedsanalyse' : 'Market Analysis'),
    description: city ? (localizedData?.desc || city.thesis) : 'Local market insights and strategic real estate/business expansion analysis.',
    keywords: city ? `${city.name} real estate, ${city.name} yield, ${city.name} investment, Univue ${city.name}` : 'market analysis, property investment'
  });

  const cityPageSchema = city ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${city.name} Real Estate & Business Market Insights | Univue Consultants`,
    "description": localizedData?.desc || city.thesis,
    "publisher": {
      "@type": "Organization",
      "name": "Univue Consultants ApS",
      "url": "https://univueconsultants.com"
    },
    "about": {
      "@type": "Place",
      "name": city.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city.name,
        "addressCountry": city.country
      }
    }
  } : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!city && !loading) {
      navigate('/insights');
    }
  }, [city, loading, navigate]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-brand-ivory">
        {/* Skeleton Hero Header */}
        <section className="relative h-[60vh] flex items-end bg-brand-blue overflow-hidden animate-pulse">
          <div className="absolute inset-0 z-0 bg-blue-950/20" />
          <div className="max-w-7xl mx-auto px-6 pb-16 relative z-10 w-full">
            <div className="w-32 h-4 bg-gray-500/40 rounded mb-4" />
            <div className="w-1/2 h-16 bg-gray-500/30 rounded mb-6" />
            <div className="flex flex-wrap gap-4">
              <div className="w-32 h-8 bg-gray-500/20 rounded-full" />
              <div className="w-32 h-8 bg-gray-500/20 rounded-full" />
            </div>
          </div>
        </section>

        {/* Skeleton Investment Thesis Section */}
        <section className="section-padding py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="w-32 h-4 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="w-3/4 h-10 bg-gray-200 rounded mb-8 animate-pulse" />
                <div className="space-y-3 mb-10 animate-pulse">
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-11/12 h-4 bg-gray-200 rounded" />
                  <div className="w-5/6 h-4 bg-gray-200 rounded" />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="p-6 bg-white border border-gray-100 shadow-sm border-l-4 border-brand-gold/30 h-32 animate-pulse">
                    <div className="w-24 h-3 bg-gray-200 rounded mb-3" />
                    <div className="w-full h-4 bg-gray-155 rounded mb-2" />
                    <div className="w-3/4 h-4 bg-gray-155 rounded" />
                  </div>
                  <div className="p-6 bg-white border border-gray-100 shadow-sm border-l-4 border-brand-gold/30 h-32 animate-pulse">
                    <div className="w-24 h-3 bg-gray-200 rounded mb-3" />
                    <div className="w-full h-4 bg-gray-155 rounded mb-2" />
                    <div className="w-3/4 h-4 bg-gray-155 rounded" />
                  </div>
                </div>
              </div>

              <div className="bg-brand-blue p-12 text-brand-ivory relative overflow-hidden animate-pulse">
                <div className="w-24 h-3 bg-gray-300/50 rounded mb-10" />
                
                <div className="space-y-10">
                  <div>
                    <div className="w-20 h-2 bg-gray-300/35 rounded mb-2" />
                    <div className="w-32 h-6 bg-gray-300/50 rounded" />
                  </div>
                  <div>
                    <div className="w-20 h-2 bg-gray-300/35 rounded mb-2" />
                    <div className="w-32 h-6 bg-gray-300/50 rounded" />
                  </div>
                  <div>
                    <div className="w-20 h-2 bg-gray-300/35 rounded mb-2" />
                    <div className="w-48 h-5 bg-gray-300/50 rounded" />
                  </div>
                </div>

                <div className="mt-12 w-full h-12 bg-gray-300/25 rounded" />
              </div>
            </div>
          </div>
        </section>

        {/* Skeleton Cross-border Relevance Footer */}
        <section className="py-20 border-t border-gray-100 bg-gray-50/50 animate-pulse">
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            <div className="w-32 h-3 bg-gray-200 rounded mb-4" />
            <div className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
            <div className="w-1/2 h-4 bg-gray-200 rounded" />
          </div>
        </section>
      </div>
    );
  }

  if (!city) return null;

  return (
    <div className="pt-24 min-h-screen bg-brand-ivory">
      {cityPageSchema && <StructuredData data={cityPageSchema} />}
      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-end bg-brand-blue overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={city.image} 
            alt={city.name} 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/40 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pb-16 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-gold font-bold tracking-widest uppercase text-xs mb-4 inline-block">
              {t('city.hero.tag')}: {city.country}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-brand-ivory mb-6 leading-tight">
              {city.name}
            </h1>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 border border-brand-ivory/20 bg-brand-ivory/5 backdrop-blur-md rounded-full text-brand-ivory text-xs uppercase tracking-widest">
                {localizedData?.type || `${city.positioning} Focus`}
              </span>
              <span className="px-4 py-2 border border-brand-gold/20 bg-brand-gold/5 backdrop-blur-md rounded-full text-brand-gold text-xs uppercase tracking-widest">
                {city.rentalYield} {t('catalog.yield')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Thesis Section */}
      <section className="section-padding py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-brand-gold font-normal uppercase tracking-[0.2em] text-xs mb-4">{t('city.thesis.tag')}</h2>
              <h3 className="text-3xl md:text-5xl font-serif font-normal text-brand-blue mb-8 leading-tight">
                {t('city.thesis.title')} {city.name}.
              </h3>
              <p className="text-xl text-gray-700 leading-relaxed mb-10 font-light italic">
                "{language === 'da' && localizedData ? localizedData.desc : city.thesis}"
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-6 bg-white border border-gray-100 shadow-sm border-l-4 border-brand-gold">
                  <h4 className="font-bold text-brand-blue mb-2 uppercase text-xs tracking-widest">{t('city.thesis.buyer')}</h4>
                  <p className="text-sm text-gray-500">{city.targetBuyer}</p>
                </div>
                <div className="p-6 bg-white border border-gray-100 shadow-sm border-l-4 border-brand-gold">
                  <h4 className="font-bold text-brand-blue mb-2 uppercase text-xs tracking-widest">{t('city.thesis.relevance')}</h4>
                  <p className="text-sm text-gray-500">{city.relevance}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-blue p-12 text-brand-ivory relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
              
              <h4 className="text-brand-gold uppercase tracking-widest text-xs mb-10">{t('city.stats.tag')}</h4>
              
              <div className="space-y-10">
                <div className="flex items-start gap-5">
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.3em] text-brand-gold/60 mb-1">{t('city.stats.price')}</span>
                    <span className="text-2xl font-serif">{city.avgPricing}</span>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.3em] text-brand-gold/60 mb-1">{t('city.stats.yield')}</span>
                    <span className="text-2xl font-serif">{city.rentalYield}</span>
                  </div>
                </div>

                {localizedData && (
                  <div className="flex items-start gap-5">
                    <div>
                      <span className="block text-[9px] uppercase tracking-[0.3em] text-brand-gold/60 mb-1">
                        {language === 'da' ? "VÆKST" : "GROWTH"}
                      </span>
                      <span className="text-2xl font-serif">
                        {localizedData.stats[1]?.value}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-5">
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.3em] text-brand-gold/60 mb-1">
                      {localizedData ? localizedData.stats[2]?.label : t('city.stats.infra')}
                    </span>
                    <span className="text-lg leading-snug">
                      {localizedData ? localizedData.stats[2]?.value : city.infraGrowth}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/book')}
                className="mt-12 w-full py-4 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-blue transition-all duration-500 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 group"
              >
                {t('city.stats.cta')}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Highlights Section */}
      <section className="section-padding py-20 bg-brand-ivory border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-xs font-bold text-brand-gold uppercase tracking-[0.22em] mb-4">
            {language === 'da' ? "Markedshøjdepunkter" : "Market Highlights"}
          </h3>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-blue mb-12">
            {language === 'da' ? `Strategiske investeringsfaktorer for ${city.name}` : `Strategic Investment Drivers for ${city.name}`}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {(localizedData?.highlights || [
              `Infrastructure and Development: ${city.infraGrowth || 'Major master-planned development projects and infrastructure pipelines.'}`,
              `Cross-border Relevance: ${city.relevance || 'Establishment of special economic initiatives and premium asset positioning.'}`,
              `Stable Yield Environment: Strong organic demand delivering high rental performance relative to regional peers.`
            ]).map((h, i) => {
              const hasColon = h.includes(':');
              const title = hasColon ? h.substring(0, h.indexOf(':')) : (language === 'da' ? `Punkt ${i + 1}` : `Point ${i + 1}`);
              const desc = hasColon ? h.substring(h.indexOf(':') + 1) : h;
              return (
                <div key={i} className="flex gap-6 p-8 bg-white border border-gray-100/60 hover:border-brand-gold/30 transition-all duration-300 rounded-sm shadow-sm group">
                  <span className="text-3xl font-serif text-brand-gold/80 font-normal shrink-0 group-hover:text-brand-gold transition-colors">
                    0{i + 1}
                  </span>
                  <div>
                    <h4 className="font-serif text-lg text-brand-blue mb-2 font-medium">
                      {title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {desc.trim()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cross-border Relevance Footer */}
      <section className="py-20 border-t border-gray-100 bg-brand-ivory">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h4 className="text-sm font-normal text-brand-gold uppercase tracking-[0.3em] mb-4">{t('city.footer.tag')}</h4>
            <p className="text-gray-600 leading-relaxed font-light italic">
              "{t('city.footer.quote1')} {city.name}. {t('city.footer.quote2')}"
            </p>
        </div>
      </section>
    </div>
  );
};

export default CityMicrosite;
