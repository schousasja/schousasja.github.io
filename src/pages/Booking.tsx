import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { InlineWidget } from 'react-calendly';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { StructuredData } from '../components/StructuredData';

export const Booking = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const questionnaireData = location.state?.questionnaireData;

  useDocumentMetadata({
    title: '10-Minute Executive Briefing',
    description: 'Book a confidential 10-minute executive briefing with an international advisory partner at our Hornslet headquarters or via secure video conference.',
    keywords: 'schedule property briefing, 10 minute briefing, Univue consultation, cross border real estate meeting Hornslet Denmark'
  });

  const bookingSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "10-Minute Executive Briefing",
    "description": "Book a confidential 10-minute executive briefing with an international advisory partner at our Hornslet headquarters or via secure video conference.",
    "telephone": "+45 26 37 82 70",
    "email": "Univueconsultants@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Amaliegårdvej 1",
      "postalCode": "8543",
      "addressLocality": "Hornslet",
      "addressCountry": "DK"
    }
  };

  // Map questionnaire answers to strings for prefilling
  const getAnswersSummary = () => {
    if (!questionnaireData) return '';
    
    const parts = [];
    if (questionnaireData.company) {
      parts.push(`COMPANY: ${questionnaireData.company}`);
    }
    
    const questions = [
      { id: 'q1', text: t('q.q1') },
      { id: 'q2', text: t('q.q2') },
      { id: 'q3', text: t('q.q3') },
      { id: 'q4', text: t('q.q4') },
      { id: 'q5', text: t('q.q5') },
    ];

    questions.forEach(q => {
      const answers = questionnaireData[q.id];
      if (answers && answers.length > 0) {
        const answerStrings = answers.map((ans: string) => {
          if (q.id === 'q1') {
            const label = t(`q.q1.${ans}`);
            if (ans === 'other' && questionnaireData.q1OtherText) {
              return `${label}: ${questionnaireData.q1OtherText}`;
            }
            return label;
          }
          if (q.id === 'q4') {
            const label = t(`q.q4.${ans}`);
            if (ans === 'other' && questionnaireData.q4OtherText) {
              return `${label}: ${questionnaireData.q4OtherText}`;
            }
            return label;
          }
          // Default localized lookups
          const possibleKeys = [
            `q.${ans}`,
            `invest.${ans}`,
            `nav.${ans}`
          ];
          for (const key of possibleKeys) {
            const resolved = t(key);
            if (resolved !== key) return resolved;
          }
          return ans;
        });

        parts.push(`${q.text}\n→ ${answerStrings.join(', ')}`);
      }
    });
    
    return parts.join('\n\n');
  };

  return (
    <div className="pt-28 md:pt-36 pb-10 min-h-screen bg-white">
      <StructuredData data={bookingSchema} />
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/questionnaire')}
            className="flex items-center gap-2 text-brand-blue/50 hover:text-brand-blue transition-colors text-xs font-bold uppercase tracking-widest mb-6"
          >
            {t('book.back')}
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h2 className="text-4xl font-serif font-normal text-brand-blue mb-4">{t('book.title')}</h2>
              <p className="text-gray-500 max-w-lg">{t('book.desc')}</p>
              
              {questionnaireData && (
                <div 
                  className="mt-6 p-4 bg-brand-gold/5 border border-brand-gold/10"
                >
                  <div>
                    <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">{t('book.sync')}</p>
                    <p className="text-xs text-brand-blue/80 italic whitespace-pre-line leading-relaxed">
                      {getAnswersSummary()}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold bg-brand-gold/5 px-3 py-1 rounded-full">
                Powered by Calendly
              </span>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden min-h-[700px]"
        >
          <InlineWidget 
            url="https://calendly.com/univueconsultants" 
            styles={{
              height: '750px',
              width: '100%'
            }}
            prefill={{
              email: questionnaireData?.email || '',
              name: questionnaireData?.name || '',
              // We pass the summary to the 'a1' field as a fallback, 
              // but standard practice is often prefilling the description if the URL allows it
              // Or customAnswers for specific field IDs
              customAnswers: {
                a1: getAnswersSummary()
              }
            }}
            pageSettings={{
              backgroundColor: 'ffffff',
              hideEventTypeDetails: false,
              hideLandingPageDetails: false,
              primaryColor: 'A5832F', // Brand Gold
              textColor: '002D3F', // Brand Blue
            }}
          />
        </div>
      </div>
    </div>
  );
};
