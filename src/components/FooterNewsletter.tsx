import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const FooterNewsletter: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // Standard email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setStatus('error');
      setMessage(t('footer.newsletter.error') || 'Please provide a valid work or business email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // 1. Check if email already exists in Firestore newsletter_subscribers
      const subQuery = query(
        collection(db, 'newsletter_subscribers'),
        where('email', '==', cleanEmail)
      );
      const subSnap = await getDocs(subQuery);

      let isNew = false;
      if (subSnap.empty) {
        isNew = true;
        const display = cleanEmail.split('@')[0];
        const photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(display)}&background=0B1F3A&color=C8A96A`;

        await addDoc(collection(db, 'newsletter_subscribers'), {
          email: cleanEmail,
          displayName: display,
          photoURL: photo,
          createdAt: serverTimestamp(),
        });
      }

      // 2. Synchronize authenticated user profile if logged in
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            isSubscribed: true,
            updatedAt: serverTimestamp(),
          });
        } catch (authDocErr) {
          console.warn('Authenticated user record update notice:', authDocErr);
        }
      }

      // 3. Dispatch confirmation & welcome email through Resend integration
      try {
        await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            name: user?.displayName || cleanEmail.split('@')[0],
          }),
        });
      } catch (resendErr) {
        console.warn('Resend welcome notification notice:', resendErr);
      }

      if (isNew) {
        setStatus('success');
        setMessage(t('footer.newsletter.success_desc') || 'Thank you for subscribing. You will receive periodic market updates and cross-border briefings directly in your inbox.');
        setEmail('');
      } else {
        setStatus('already');
        setMessage(t('footer.newsletter.already_subscribed') || 'You are already registered for our periodic market updates.');
      }
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
      setMessage(t('footer.newsletter.error') || 'Unable to complete subscription. Please verify your email and try again.');
    }
  };

  return (
    <div className="relative mb-16 overflow-hidden rounded-none border border-brand-gold/25 bg-gradient-to-br from-[#0c223f] via-[#0B1F3A] to-[#071527] p-8 shadow-2xl sm:p-10 md:p-12">
      {/* Decorative luxury lighting */}
      <div 
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-brand-blue/60 blur-3xl" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" 
        aria-hidden="true" 
      />

      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Heading & Context */}
        <div className="lg:col-span-7">
          <div className="mb-4 inline-flex items-center gap-2 border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">
            <Sparkles className="h-3 w-3 text-brand-gold" />
            <span>{t('footer.newsletter.badge') || 'PERIODIC MARKET UPDATES'}</span>
          </div>

          <h3 className="mb-3 font-serif text-2xl font-normal leading-tight text-brand-ivory sm:text-3xl md:text-4xl">
            {t('footer.newsletter.title') || 'Subscribe to Univue Intelligence'}
          </h3>

          <p className="max-w-2xl text-sm font-light leading-relaxed text-brand-ivory/70 sm:text-base">
            {t('footer.newsletter.desc') || 'Subscribe to receive periodic macroeconomic analyses, off-market real estate releases, and strategic cross-border regulatory updates across the UAE, India, and Southeast Asia.'}
          </p>
        </div>

        {/* Right Column: Interactive Subscription Form */}
        <div className="lg:col-span-5">
          {status === 'success' || status === 'already' ? (
            <div className="border border-brand-gold/40 bg-brand-gold/10 p-6 text-brand-ivory backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-gold shrink-0" />
                <h4 className="font-serif text-lg text-brand-gold">
                  {status === 'success' 
                    ? (t('footer.newsletter.success_title') || 'Subscription Confirmed') 
                    : (t('footer.newsletter.already_subscribed') || 'Already Subscribed')}
                </h4>
              </div>
              <p className="text-sm font-light leading-relaxed text-brand-ivory/80">
                {message}
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setMessage('');
                }}
                className="mt-4 text-[10px] font-bold uppercase tracking-widest text-brand-gold/80 hover:text-white transition-colors"
              >
                &larr; Subscribe another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 shadow-lg">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-brand-ivory/40">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    disabled={status === 'loading'}
                    placeholder={t('footer.newsletter.placeholder') || 'Enter your business email address...'}
                    required
                    aria-label="Email Address for Periodic Market Updates"
                    className="w-full border border-brand-ivory/20 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-brand-ivory placeholder:text-brand-ivory/30 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-300 disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 bg-brand-gold px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-blue transition-all duration-300 hover:bg-white hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-50 shrink-0 group"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>{t('footer.newsletter.subscribing') || 'SUBSCRIBING...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('footer.newsletter.button') || 'SUBSCRIBE'}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-xs text-rose-300 border border-rose-500/30 bg-rose-950/40 px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{message}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] font-light text-brand-ivory/50">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-gold/70 shrink-0" />
                <span>
                  {t('footer.newsletter.privacy') || 'Periodic intelligence updates. Zero spam. Unsubscribe at any time.'}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
