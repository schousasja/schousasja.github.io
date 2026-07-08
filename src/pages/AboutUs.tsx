import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useNavigate } from 'react-router-dom';
import { StructuredData } from '../components/StructuredData';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

export const AboutUs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { photos } = useSiteSettings();

  useDocumentMetadata({
    title: `${t('about.title')} | Leadership & Mission`,
    description: t('about.mission.quote') || 'Learn about Univue Consultants leadership, team, vision, and values in international cross-border advisory.',
    keywords: 'Univue leadership, Nimmi Schou, Copenhagen cross border consulting, Dubai strategic partner'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const leadership = [
    {
      name: "Nimmi Schou",
      role: t('about.team.role'),
      bio: t('about.team.bio'),
      image: "https://www.image2url.com/r2/default/images/1778952491863-ed3009f7-3721-4d87-86fd-8169e9a76aba.jpeg"
    }
  ];


  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": `About Univue Consultants ApS - ${t('about.title')}`,
    "description": t('about.mission.quote'),
    "mainEntity": {
      "@type": "Organization",
      "name": "Univue Consultants ApS"
    }
  };

  return (
    <div className="pt-20">
      <StructuredData data={aboutSchema} />
      {/* Hero Section */}
      <section className="h-[40vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={photos.about_hero} 
            alt="Global Business Center" 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl text-brand-ivory mb-4 tracking-tighter leading-[1.1] max-w-5xl">
              {t('about.title')} <span className="text-brand-gold italic">{t('about.title.accent')}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-normal text-brand-gold uppercase tracking-[0.3em] mb-6">{t('about.mission.tag')}</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-brand-blue mb-8 tracking-tight">{t('about.mission.title')}</h3>
            <p className="text-gray-600 text-2xl md:text-3xl font-light italic max-w-4xl mx-auto leading-relaxed">
              {t('about.mission.quote')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {[
              { img: photos.about_vision1, alt: "Modern Architecture Vision", className: "aspect-[4/5]" },
              { img: photos.about_vision2, alt: "Luxury Estate Context", className: "aspect-[2/3] lg:mt-8" },
              { img: photos.about_vision3, alt: "Expert Consultation", className: "aspect-square lg:-mt-4" },
              { img: photos.about_vision4, alt: "Global Connection", className: "aspect-[3/4] lg:mt-4" }
            ].map((pic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${pic.className} overflow-hidden transition-all duration-700 shadow-2xl`}
              >
                <img src={pic.img} alt={pic.alt} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why / Approach */}
      <section className="section-padding bg-brand-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto bg-white shadow-2xl border border-gray-100 overflow-hidden">
          {/* Our Why */}
          <div className="grid lg:grid-cols-2 gap-0 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-full min-h-[400px]"
            >
              <img 
                src={photos.about_why} 
                alt="Global Vision" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border border-brand-gold/20 m-4" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center px-12 lg:px-24 py-12"
            >
              <h4 className="text-brand-gold uppercase tracking-widest text-xs font-bold mb-6">{t('about.why.title')}</h4>
              <p className="text-gray-600 font-light leading-relaxed text-xl">
                {t('about.why.desc')}
              </p>
            </motion.div>
          </div>

          {/* Our Approach */}
          <div className="grid lg:grid-cols-2 gap-0 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 flex flex-col justify-center px-12 lg:px-24 py-12"
            >
              <h4 className="text-brand-gold uppercase tracking-widest text-xs font-bold mb-6">{t('about.approach.title')}</h4>
              <p className="text-gray-600 font-light leading-relaxed text-xl">
                {t('about.approach.desc')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-full min-h-[400px] order-1 lg:order-2"
            >
              <img 
                src={photos.about_approach} 
                alt="Strategic Approach" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border border-brand-gold/20 m-4" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <h4 className="text-brand-gold uppercase tracking-widest text-xs font-bold mb-12">{t('about.values.title')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: t('about.values.v1.title'), 
                desc: t('about.values.v1.desc') 
              },
              { 
                title: t('about.values.v2.title'), 
                desc: t('about.values.v2.desc') 
              },
              { 
                title: t('about.values.v3.title'), 
                desc: t('about.values.v3.desc') 
              }
            ].map((v, i) => (
              <div key={i} className="bg-white p-10 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <h5 className="text-brand-blue font-medium text-xl mb-4 leading-tight">{v.title}</h5>
                <p className="text-gray-600 font-light leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="section-padding bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-sm font-normal text-brand-gold uppercase tracking-[0.2em] mb-4 text-center">{t('about.team.tag')}</h2>
            <h3 className="text-4xl text-center">{t('about.team.title')}</h3>
          </div>
          
          <div className="max-w-xl mx-auto mb-20">
            {leadership.map(person => (
              <div key={person.name} className="bg-white p-12 border border-gray-100 shadow-xl">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-48 h-48 object-cover rounded-sm"
                  />
                  <div>
                    <h4 className="text-2xl font-serif text-brand-blue">{person.name}</h4>
                    <p className="text-brand-gold text-xs uppercase tracking-widest mb-6">{person.role}</p>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">{person.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA: The Univue Advantage */}
      <section className="section-padding bg-brand-ivory relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div>
              <h2 className="text-sm font-normal text-brand-gold uppercase tracking-[0.2em] mb-4">{t('about.advantage.tag')}</h2>
              <h3 className="text-3xl md:text-5xl font-serif text-brand-blue mb-8">{t('about.advantage.title')}</h3>
              <p className="text-gray-600 text-lg font-light mb-12 leading-relaxed italic">
                {t('about.advantage.desc')}
              </p>
              <button 
                onClick={() => navigate('/questionnaire')}
                className="btn-briefing !px-12"
              >
                {t('nav.book')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
