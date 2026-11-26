import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useNavigate } from 'react-router-dom';
import { StructuredData } from '../components/StructuredData';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

export const Services = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { photos } = useSiteSettings();

  useDocumentMetadata({
    title: t('services.title') || 'Advisory Services',
    description: t('services.subtitle') || 'Explore our comprehensive list of advisory services, from off-plan property sourcing to transaction and legal coordination.',
    keywords: 'real estate sourcing, portfolio positioning, transaction coordination, legal framework advisory'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coreServices = [
    {
      title: t('services.s1.title'),
      description: t('services.s1.desc'),
      features: [t('services.s1.f1'), t('services.s1.f2'), t('services.s1.f3'), t('services.s1.f4')]
    },
    {
      title: t('services.s2.title'),
      description: t('services.s2.desc'),
      features: [t('services.s2.f1'), t('services.s2.f2'), t('services.s2.f3'), t('services.s2.f4')]
    },
    {
      title: t('services.s3.title'),
      description: t('services.s3.desc'),
      features: [t('services.s3.f1'), t('services.s3.f2'), t('services.s3.f3'), t('services.s3.f4'), t('services.s3.f5'), t('services.s3.f6'), t('services.s3.f7')]
    },
    {
      title: t('services.s4.title'),
      description: t('services.s4.desc'),
      features: [t('services.s4.f1'), t('services.s4.f2'), t('services.s4.f3'), t('services.s4.f4')]
    },
    {
      title: t('services.s5.title'),
      description: t('services.s5.desc'),
      features: [t('services.s5.f1'), t('services.s5.f2'), t('services.s5.f3'), t('services.s5.f4')]
    },
    {
      title: t('services.s6.title'),
      description: t('services.s6.desc'),
      features: [t('services.s6.f1'), t('services.s6.f2'), t('services.s6.f3'), t('services.s6.f4')]
    }
  ];

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Real Estate Investment Advisory",
    "provider": {
      "@type": "Organization",
      "name": "Univue Consultants ApS"
    },
    "description": t('services.subtitle'),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Univue Consultants ApS Professional Services",
      "itemListElement": coreServices.map(s => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.title,
          "description": s.description
        }
      }))
    }
  };

  return (
    <div className="pt-20">
      <StructuredData data={servicesSchema} />
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden bg-brand-blue">
        <div className="absolute inset-0">
          <img 
            src={photos.services_hero} 
            alt="Modern Architecture" 
            className="w-full h-full object-cover grayscale-[0.5] brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-left"
          >
            <h1 className="text-4xl md:text-6xl text-brand-ivory mb-6 font-serif">
              {t('services.title').split(' ')[0]} <span className="text-brand-gold italic">{t('services.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-brand-ivory/60 text-lg max-w-2xl font-light">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="section-padding bg-brand-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {coreServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 border border-gray-100 hover:border-brand-gold/30 transition-all duration-500 hover:shadow-2xl bg-white"
              >
                <h3 className="text-2xl mb-4 text-brand-blue">{service.title}</h3>
                <p className="text-gray-600 mb-8 font-light leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-ivory border-t border-gray-100 relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl text-brand-blue mb-8">{t('services.cta_title')}</h2>
          <button 
            onClick={() => navigate('/questionnaire')}
            className="btn-briefing"
          >
            {t('nav.book')}
          </button>
        </div>
      </section>
    </div>
  );
};
