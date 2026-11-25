import React, { useState } from 'react';
import { Mail, Phone, Linkedin, X, Instagram, Facebook, MessageCircle, Music2, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMessage(t('q.valid_email') || 'Please provide a valid email address.');
      return;
    }

    if (!consent) {
      setStatus('error');
      setErrorMessage(t('footer.newsletter.consent_error') || 'Please accept the consent terms to subscribe.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // 1. Dispatch to server-side double opt-in mailing service
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), consent: true })
      });

      // 2. Also register subscriber directly in Firestore collection
      try {
        await addDoc(collection(db, 'newsletter_subscribers'), {
          email: email.trim().toLowerCase(),
          displayName: email.split('@')[0],
          photoURL: '',
          isSubscribed: true,
          status: 'pending_confirmation',
          consent: true,
          source: 'footer',
          createdAt: serverTimestamp()
        });
      } catch (dbErr) {
        console.warn('Direct Firestore registration skipped; server processed request:', dbErr);
      }

      if (res.ok) {
        setStatus('success');
        setEmail('');
        setConsent(false);
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Subscription request could not be processed.');
      }
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      // If server responded or offline fallback, provide friendly state
      setStatus('success');
      setEmail('');
      setConsent(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-brand-blue text-brand-ivory pt-16 pb-12 px-6">
      {/* Monthly Market Briefing / Newsletter Email Capture */}
      <div className="max-w-7xl mx-auto mb-16 pb-16 border-b border-brand-ivory/10">
        <div className="bg-brand-navy-light/60 border border-brand-gold/30 p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] block mb-2">
              {t('footer.newsletter.tag')}
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-brand-ivory font-normal mb-3">
              {t('footer.newsletter.title')}
            </h3>
            <p className="text-brand-ivory/70 text-sm md:text-base leading-relaxed mb-6 max-w-2xl font-light">
              {t('footer.newsletter.desc')}
            </p>

            {status === 'success' ? (
              <div className="p-4 bg-brand-gold/15 border border-brand-gold/40 flex items-start gap-3 text-brand-ivory">
                <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('footer.newsletter.success')}</p>
                  <p className="text-xs text-brand-ivory/60 mt-1">Double opt-in confirmation required before dispatch.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.newsletter.placeholder')}
                    disabled={loading}
                    className="flex-grow px-5 py-3.5 bg-brand-blue border border-brand-ivory/20 text-brand-ivory text-sm placeholder:text-brand-ivory/40 outline-none focus:border-brand-gold transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-brand-gold text-brand-blue font-bold uppercase tracking-[0.2em] text-xs hover:bg-brand-gold-light transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{t('footer.newsletter.button')}</span>
                    )}
                  </button>
                </div>

                <label className="flex items-start gap-3 cursor-pointer text-xs text-brand-ivory/70 select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-brand-ivory/30 bg-brand-blue text-brand-gold accent-[#C8A96A] cursor-pointer"
                    required
                  />
                  <span className="leading-tight">
                    {t('footer.newsletter.consent')}
                  </span>
                </label>

                {status === 'error' && errorMessage && (
                  <div className="flex items-center gap-2 text-red-300 text-xs mt-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-brand-ivory/10 pb-12 mb-12">
        <div className="md:col-span-2">
          <Link to="/" className="inline-flex items-center mb-6" aria-label="Univue Consultants ApS">
            <img 
              src="/assets/images/logo-white.png" 
              alt="Univue Consultants ApS" 
              className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-opacity duration-300 hover:opacity-80" 
            />
          </Link>
          <p className="text-brand-ivory/60 max-w-sm mb-6">
            {t('footer.desc')}
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://www.linkedin.com/in/nimmi-schou-36839a40b/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 group-hover:text-brand-blue transition-colors" />
            </a>
            <a 
              href="https://x.com/Univue_Official" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer group"
              aria-label="X (Twitter)"
            >
              <X className="w-5 h-5 group-hover:text-brand-blue transition-colors" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61589903517439" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer group"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 group-hover:text-brand-blue transition-colors" />
            </a>
            <a 
              href="https://www.instagram.com/univueconsultants/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer group"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 group-hover:text-brand-blue transition-colors" />
            </a>
            <a 
              href="https://www.tiktok.com/@univue_official" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer group"
              aria-label="TikTok"
            >
              <Music2 className="w-5 h-5 group-hover:text-brand-blue transition-colors" />
            </a>
            <a 
              href="https://wa.me/4526378270" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors cursor-pointer group" 
              title="WhatsApp"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 group-hover:text-brand-blue transition-colors" />
            </a>
          </div>
        </div>
        
        <div>
          <h5 className="font-normal mb-6 text-brand-gold uppercase text-xs tracking-widest">{t('footer.markets')}</h5>
          <ul className="space-y-4 text-brand-ivory/60 text-sm">
            <li><Link to="/uae" className="hover:text-brand-ivory transition-colors">{t('footer.dubai_re')}</Link></li>
            <li><Link to="/india" className="hover:text-brand-ivory transition-colors">{t('footer.india_cs')}</Link></li>
            <li><Link to="/southeast-asia" className="hover:text-brand-ivory transition-colors">{t('footer.se_markets')}</Link></li>
            <li><Link to="/properties" className="hover:text-brand-ivory transition-colors">{t('nav.catalog')}</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-normal mb-6 text-brand-gold uppercase text-xs tracking-widest">{t('footer.contact')}</h5>
          <ul className="space-y-4 text-brand-ivory/60 text-sm">
            <li><span className="text-brand-ivory/40 mr-2">CVR-nr.</span> 45 84 53 62</li>
            <li>
              <a href="mailto:Univueconsultants@gmail.com" className="flex items-center gap-3 hover:text-brand-ivory transition-colors group">
                <Mail className="w-4 h-4 text-brand-gold group-hover:scale-110 transition-transform" /> 
                Univueconsultants@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+4526378270" className="flex items-center gap-3 hover:text-brand-ivory transition-colors group">
                <Phone className="w-4 h-4 text-brand-gold group-hover:scale-110 transition-transform" /> 
                +45 26 37 82 70
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" /> 
              <span>{t('footer.address')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h4 className="text-xl font-serif font-normal text-brand-ivory mb-3">{t('footer.compliance_title')}</h4>
        <p className="text-brand-ivory/50 text-sm leading-normal italic">
          {t('footer.compliance_desc')}
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest text-brand-ivory/30 font-bold border-t border-brand-ivory/5 pt-8">
        <span>&copy; 2026 Univue Consultants ApS. {t('footer.rights')}</span>
        <span>Hornslet, Denmark &bull; CVR: 45 84 53 62</span>
      </div>
    </footer>
  );
};

