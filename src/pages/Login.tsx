import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Eye, EyeOff, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { t } = useLanguage();
  const { user, signInWithGoogle, signInEmail, signUpEmail, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [subscribe, setSubscribe] = useState(true);
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/account');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);

    try {
      if (isLogin) {
        await signInEmail(email, password);
      } else {
        if (!name) throw new Error(t('login.error.name'));
        await signUpEmail(email, password, name, subscribe);
      }
      navigate('/account');
    } catch (err: any) {
      console.error('Auth check:', err.code, err);
      switch (err.code) {
        case 'auth/operation-not-allowed':
          setError(t('login.error.not_enabled'));
          break;
        case 'auth/invalid-email':
          setError(t('login.error.invalid_email'));
          break;
        case 'auth/user-disabled':
          setError(t('login.error.disabled'));
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError(t('login.error.invalid_cred'));
          break;
        case 'auth/email-already-in-use':
          setError(t('login.error.email_in_use'));
          break;
        case 'auth/weak-password':
          setError(t('login.error.weak_password'));
          break;
        case 'auth/network-request-failed':
          setError(t('login.error.network'));
          break;
        default:
          setError(err.message || t('login.error.google_failed'));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setAuthLoading(true);
    try {
      await signInWithGoogle(subscribe);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError(t('login.error.cancelled'));
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError(t('login.error.in_progress'));
      } else {
        setError(t('login.error.google_failed'));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-brand-ivory relative overflow-hidden font-sans">
      {/* Subtle Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-gold/5 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-navy-light/5 rounded-full blur-3xl -ml-20 -mb-20" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[440px] w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 md:p-12 border border-gray-100 relative z-10 text-center"
      >
        <div className="mb-10">
          <h1 className="text-3xl font-serif text-brand-blue mb-3">
            {t('login.title')}
          </h1>
          <p className="text-sm text-gray-400 font-normal max-w-xs mx-auto">
            {t('login.desc')}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3 text-red-700 text-xs font-medium text-left"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 pl-1">{t('login.label.name')}</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 text-sm focus:bg-white focus:outline-none focus:border-brand-gold transition-all duration-300"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 pl-1">{t('login.label.email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 text-sm focus:bg-white focus:outline-none focus:border-brand-gold transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center pl-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t('login.label.password')}</label>
              {isLogin && (
                <button type="button" className="text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-blue transition-colors">
                  {t('login.forgot')}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-12 text-sm focus:bg-white focus:outline-none focus:border-brand-gold transition-all duration-300"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-1 py-2">
            <input 
              type="checkbox" 
              id="subscribe"
              checked={subscribe}
              onChange={(e) => setSubscribe(e.target.checked)}
              className="w-4 h-4 border-gray-300 rounded text-brand-gold focus:ring-brand-gold accent-brand-gold cursor-pointer"
            />
            <label htmlFor="subscribe" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 cursor-pointer select-none">
              {t('login.subscribe')}
            </label>
          </div>

          <button 
            type="submit" 
            disabled={authLoading}
            className="w-full bg-brand-blue text-brand-gold py-5 text-xs font-bold uppercase tracking-[0.3em] hover:bg-brand-navy-light transition-all duration-300 shadow-xl shadow-brand-blue/10 active:scale-[0.98] disabled:opacity-50"
          >
            {authLoading ? t('login.btn.processing') : isLogin ? t('login.btn.signin') : t('login.btn.signup')}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
            <span className="bg-white px-4 text-gray-300">{t('login.continue_with')}</span>
          </div>
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="w-full flex items-center justify-center gap-4 bg-white border border-gray-200 py-5 px-6 hover:bg-gray-50 hover:border-brand-gold/30 transition-all duration-300 group disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span className="text-[12px] font-bold text-gray-700 uppercase tracking-[0.2em]">
              {authLoading ? t('login.btn.verifying') : t('login.btn.google')}
            </span>
          </button>

          <p className="text-center text-sm text-gray-400">
            {isLogin ? t('login.no_account') : t('login.has_account')}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-brand-gold font-bold hover:text-brand-blue transition-colors underline underline-offset-4 decoration-1"
            >
              {isLogin ? t('login.link.signup') : t('login.link.login')}
            </button>
          </p>
        </div>

        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-50"></div></div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-bold">
            <span className="bg-white px-6 text-gray-200">{t('login.standards')}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold text-brand-blue/40 tracking-[0.3em] uppercase">{t('login.secure_shell')}</span>
          </div>
          <p className="text-[10px] text-gray-300 max-w-[200px] mx-auto italic">
            {t('login.encrypted')}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
