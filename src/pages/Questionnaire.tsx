import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const Questionnaire = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    q1: [] as string[],
    q2: [] as string[],
    q3: [] as string[],
    q4: [] as string[],
    q5: [] as string[],
    q1OtherText: '',
    q4OtherText: '',
  });

  const toggleOption = (question: 'q1' | 'q2' | 'q3' | 'q4' | 'q5', option: string) => {
    setFormData(prev => {
      const isIncluded = prev[question].includes(option);
      const updatedList = isIncluded
        ? prev[question].filter(o => o !== option)
        : [...prev[question], option];

      let extra = {};
      if (option === 'other' && isIncluded) {
        if (question === 'q1') extra = { q1OtherText: '' };
        if (question === 'q4') extra = { q4OtherText: '' };
      }

      return {
        ...prev,
        [question]: updatedList,
        ...extra
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/book', { state: { questionnaireData: formData } });
  };

  const Option = ({ question, value, label }: { question: 'q1' | 'q2' | 'q3' | 'q4' | 'q5', value: string, label: string }) => {
    const isSelected = formData[question].includes(value);
    return (
      <button
        type="button"
        onClick={() => toggleOption(question, value)}
        className={`flex items-center gap-3 p-3 border rounded-sm transition-all text-left ${
          isSelected 
            ? 'border-brand-gold bg-brand-gold/5 text-brand-blue ring-1 ring-brand-gold' 
            : 'border-gray-200 hover:border-brand-gold/40 text-gray-600'
        }`}
      >
        <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
          isSelected ? 'bg-brand-gold border-brand-gold' : 'border-gray-300 bg-brand-ivory'
        }`}>
          {isSelected && <span className="text-brand-ivory text-[10px] font-bold">✓</span>}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  };

  const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
    <div className="mb-6">
      <h3 className="text-xl font-serif font-normal text-brand-blue mb-2">{children}</h3>
      {subtitle && <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{subtitle}</p>}
    </div>
  );

  const isDanish = useLanguage().language === 'da';

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-ivory px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-ivory shadow-2xl rounded-sm overflow-hidden border border-gray-100"
        >
          <div className="bg-brand-blue p-10 text-brand-ivory relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-serif font-normal mb-3">{t('q.title')}</h2>
              <p className="text-brand-ivory/60 max-w-xl">{t('q.desc')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-12">
            {/* Contact Info */}
            <div className="grid md:grid-cols-3 gap-6 pb-8 border-b border-gray-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('q.name')}</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 border-b border-gray-200 focus:border-brand-gold outline-none transition-colors bg-transparent"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('q.email')}</label>
                <input 
                  required
                  type="email" 
                  className="w-full p-3 border-b border-gray-200 focus:border-brand-gold outline-none transition-colors bg-transparent"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('q.company')}</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 border-b border-gray-200 focus:border-brand-gold outline-none transition-colors bg-transparent"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>

            {/* Q1 */}
            <section>
              <SectionTitle>{t('q.q1')}</SectionTitle>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Residential */}
                <button
                  type="button"
                  onClick={() => toggleOption('q1', 'residential')}
                  className={`flex flex-col p-5 border rounded-sm transition-all text-left h-full ${
                    formData.q1.includes('residential') 
                      ? 'border-brand-gold bg-brand-gold/5 text-brand-blue ring-1 ring-brand-gold' 
                      : 'border-gray-200 hover:border-brand-gold/40 text-gray-600 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
                      formData.q1.includes('residential') ? 'bg-brand-gold border-brand-gold' : 'border-gray-300 bg-brand-ivory'
                    }`}>
                      {formData.q1.includes('residential') && <span className="text-brand-ivory text-[10px] font-bold">✓</span>}
                    </div>
                    <span className="text-base font-serif font-medium text-brand-blue">{t('q.q1.residential')}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-8">
                    {t('q.q1.residential.desc')}
                  </p>
                </button>

                {/* Commercial */}
                <button
                  type="button"
                  onClick={() => toggleOption('q1', 'commercial')}
                  className={`flex flex-col p-5 border rounded-sm transition-all text-left h-full ${
                    formData.q1.includes('commercial') 
                      ? 'border-brand-gold bg-brand-gold/5 text-brand-blue ring-1 ring-brand-gold' 
                      : 'border-gray-200 hover:border-brand-gold/40 text-gray-600 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
                      formData.q1.includes('commercial') ? 'bg-brand-gold border-brand-gold' : 'border-gray-300 bg-brand-ivory'
                    }`}>
                      {formData.q1.includes('commercial') && <span className="text-brand-ivory text-[10px] font-bold">✓</span>}
                    </div>
                    <span className="text-base font-serif font-medium text-brand-blue">{t('q.q1.commercial')}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-8">
                    {t('q.q1.commercial.desc')}
                  </p>
                </button>

                {/* Industrial */}
                <button
                  type="button"
                  onClick={() => toggleOption('q1', 'industrial')}
                  className={`flex flex-col p-5 border rounded-sm transition-all text-left h-full ${
                    formData.q1.includes('industrial') 
                      ? 'border-brand-gold bg-brand-gold/5 text-brand-blue ring-1 ring-brand-gold' 
                      : 'border-gray-200 hover:border-brand-gold/40 text-gray-600 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
                      formData.q1.includes('industrial') ? 'bg-brand-gold border-brand-gold' : 'border-gray-300 bg-brand-ivory'
                    }`}>
                      {formData.q1.includes('industrial') && <span className="text-brand-ivory text-[10px] font-bold">✓</span>}
                    </div>
                    <span className="text-base font-serif font-medium text-brand-blue">{t('q.q1.industrial')}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-8">
                    {t('q.q1.industrial.desc')}
                  </p>
                </button>

                {/* Other */}
                <button
                  type="button"
                  onClick={() => toggleOption('q1', 'other')}
                  className={`flex flex-col p-5 border rounded-sm transition-all text-left h-full ${
                    formData.q1.includes('other') 
                      ? 'border-brand-gold bg-brand-gold/5 text-brand-blue ring-1 ring-brand-gold' 
                      : 'border-gray-200 hover:border-brand-gold/40 text-gray-600 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
                      formData.q1.includes('other') ? 'bg-brand-gold border-brand-gold' : 'border-gray-300 bg-brand-ivory'
                    }`}>
                      {formData.q1.includes('other') && <span className="text-brand-ivory text-[10px] font-bold">✓</span>}
                    </div>
                    <span className="text-base font-serif font-medium text-brand-blue">{t('q.q1.other')}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-8">
                    {isDanish 
                      ? 'Specifikke krav eller andre ejendomstyper.' 
                      : 'Specific requirements or other property types.'}
                  </p>
                </button>
              </div>

              {formData.q1.includes('other') && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold block mb-2">
                    {isDanish ? 'Udfyld dine ejendomskrav:' : 'Specify your property requirements:'}
                  </label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full p-4 border border-brand-gold/30 focus:border-brand-gold outline-none transition-colors bg-white rounded-sm text-sm text-gray-700"
                    placeholder={isDanish ? 'f.eks. villa med havudsigt, kontorlokaler i tech-korridor...' : 'e.g. 4-bedroom villa with sea view, commercial office space in prime tech corridor...'}
                    value={formData.q1OtherText}
                    onChange={e => setFormData({...formData, q1OtherText: e.target.value})}
                  />
                </motion.div>
              )}
            </section>

            {/* Q2 */}
            <section>
              <SectionTitle>{t('q.q2')}</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-widest border-l-2 border-brand-gold pl-3">{t('nav.dubai')}</p>
                  <div className="grid gap-3">
                    <Option question="q2" value="dubai" label={t('invest.dubai')} />
                    <Option question="q2" value="abu_dhabi" label={t('invest.abu_dhabi')} />
                    <Option question="q2" value="rak" label={t('invest.rak')} />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-widest border-l-2 border-brand-gold pl-3">{t('nav.india')}</p>
                  <div className="grid gap-2">
                    <Option question="q2" value="bangalore" label={t('q.it_hub')} />
                    <Option question="q2" value="mumbai" label={t('q.fin_cap')} />
                    <Option question="q2" value="hyderabad" label={t('q.fast_growing')} />
                    <Option question="q2" value="gurgaon" label={t('q.corp_hq')} />
                    <Option question="q2" value="pune" label={t('q.eng_ops')} />
                    <Option question="q2" value="chennai" label={t('q.log_corridor')} />
                    <Option question="q2" value="goa" label={t('q.goa_luxury')} />
                  </div>
                </div>
                <div className="space-y-4 md:col-span-2 lg:col-span-1">
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-widest border-l-2 border-brand-gold pl-3">{t('nav.seasia')}</p>
                  <div className="grid gap-2">
                    <Option question="q2" value="singapore" label={t('q.singapore')} />
                    <Option question="q2" value="thailand" label={t('q.thailand')} />
                    <Option question="q2" value="indonesia" label={t('q.indonesia')} />
                    <Option question="q2" value="vietnam" label={t('q.vietnam')} />
                    <Option question="q2" value="sri_lanka" label={t('q.sri_lanka')} />
                  </div>
                </div>
              </div>
            </section>

            {/* Q3 */}
            <section>
              <SectionTitle>{t('q.q3')}</SectionTitle>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Option question="q3" value="300-600" label="€300K – €600K" />
                <Option question="q3" value="600-1m" label="€600K – €1M" />
                <Option question="q3" value="1m-3m" label="€1M – €3M" />
                <Option question="q3" value="3m+" label="€3M+" />
              </div>
            </section>

            {/* Q4 */}
            <section>
              <SectionTitle>{t('q.q4')}</SectionTitle>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Option question="q4" value="private_investor" label={t('q.q4.private_investor')} />
                <Option question="q4" value="expanding_co" label={t('q.q4.expanding_co')} />
                <Option question="q4" value="entrepreneur" label={t('q.q4.entrepreneur')} />
                <Option question="q4" value="family_office" label={t('q.q4.family_office')} />
                <Option question="q4" value="other" label={t('q.q4.other')} />
              </div>

              {formData.q4.includes('other') && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold block mb-2">
                    {isDanish ? 'Angiv venligst din situation:' : 'Please specify your situation:'}
                  </label>
                  <textarea 
                    required
                    rows={2}
                    className="w-full p-4 border border-brand-gold/30 focus:border-brand-gold outline-none transition-colors bg-white rounded-sm text-sm text-gray-700"
                    placeholder={isDanish ? 'Beskriv din situation her...' : 'Describe your situation here...'}
                    value={formData.q4OtherText}
                    onChange={e => setFormData({...formData, q4OtherText: e.target.value})}
                  />
                </motion.div>
              )}
            </section>

            {/* Q5 */}
            <section>
              <SectionTitle>{t('q.q5')}</SectionTitle>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Option question="q5" value="trusted_execution" label={t('q.trusted_exec')} />
                <Option question="q5" value="strategic_advisory" label={t('q.strat_adv')} />
                <Option question="q5" value="long_term_value" label={t('q.long_term_val')} />
                <Option question="q5" value="ops_scalability" label={t('q.ops_scale')} />
                <Option question="q5" value="financing_coord" label={t('q.fin_coord')} />
                <Option question="q5" value="compliance" label={t('q.compliance')} />
                <Option question="q5" value="vetted_opps" label={t('q.vetted_opps')} />
                <Option question="q5" value="simplicity" label={t('q.simplicity')} />
              </div>
            </section>

            <div className="pt-8 border-t border-gray-100 italic text-gray-400 text-sm">
              <p>{t('q.note')}</p>
            </div>

            <button type="submit" className="w-full btn-primary py-6 flex items-center justify-center gap-3 group text-lg uppercase tracking-widest font-bold">
              {t('q.submit')}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
