import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useMarkets } from '../contexts/MarketContext';
import { User, Search as SearchIcon } from 'lucide-react';
import { SearchOverlay } from './SearchOverlay';

export const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, logout } = useAuth();
  const { markets, cities } = useMarkets();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileInvestOpen, setIsMobileInvestOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileInvestOpen(false);
  }, [location]);

  const uaeCities = cities.filter(c => c.country === 'UAE');
  const indiaCities = cities.filter(c => c.country === 'India');
  const seAsiaCities = cities.filter(c => c.country === 'Southeast Asia');

  const isAdmin = profile?.role === 'admin';

  const handleBookClick = () => {
    setIsMenuOpen(false);
    navigate('/questionnaire');
  };

  return (
    <>
      <div className="fixed w-full z-50 transition-all duration-300 translate-y-0 pointer-events-none">
        <div className="hidden md:block bg-brand-blue border-b border-white/10 py-2.5 transition-all duration-300 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 flex justify-between md:justify-end items-center gap-4 md:gap-8 text-[9px] font-bold tracking-[0.2em] uppercase">
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <button 
                onClick={() => setLanguage('en')}
                className={`transition-colors duration-300 cursor-pointer ${language === 'en' ? 'text-brand-gold' : 'text-brand-ivory/60'} hover:text-brand-gold`}
              >
                ENGLISH
              </button>
              <button 
                onClick={() => setLanguage('da')}
                className={`transition-colors duration-300 cursor-pointer ${language === 'da' ? 'text-brand-gold' : 'text-brand-ivory/60'} hover:text-brand-gold`}
              >
                DANSK
              </button>
            </div>

            <div className="hidden md:block w-px h-3 bg-white/10" />

            <Link 
              to={user ? "/account" : "/login"} 
              className="flex items-center gap-2 text-brand-ivory/60 hover:text-brand-gold transition-colors duration-300"
            >
              <User className="w-3 h-3 text-brand-gold" />
              {user ? t('nav.account') : t('nav.login')}
            </Link>
          </div>
        </div>

        <nav className={`w-full transition-all duration-300 pointer-events-auto ${isScrolled ? 'bg-brand-ivory shadow-md py-3 md:py-4' : 'bg-transparent py-4 md:py-6'}`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group z-50">
              <span className="font-serif text-2xl font-normal tracking-tight transition-colors">
                <span className="text-brand-gold">Univue</span> <span className={`${isScrolled || isMenuOpen ? 'text-brand-blue' : 'text-brand-ivory'}`}>Consultants ApS</span>
              </span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10 text-[11px] font-normal tracking-[0.2em] uppercase">
              {/* Invest Dropdown */}
              <div 
                className="relative py-2 group"
                onMouseEnter={() => setIsInvestOpen(true)}
                onMouseLeave={() => setIsInvestOpen(false)}
              >
                <button className={`flex items-center gap-1 transition-colors duration-300 ${isScrolled ? 'text-brand-blue hover:text-brand-gold' : 'text-brand-ivory/80 hover:text-brand-ivory'}`}>
                  {t('nav.invest')}
                </button>
                
                <AnimatePresence>
                  {isInvestOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-[720px] bg-brand-ivory shadow-2xl border border-gray-100 p-8"
                    >
                      <div className="grid grid-cols-3 gap-10">
                        {markets.map((market) => (
                          <div key={market.id}>
                            <Link to={`/${market.slug}`} className="block text-[10px] text-brand-gold tracking-[0.3em] mb-4 border-b border-gray-100 pb-2 hover:text-brand-blue transition-colors uppercase">
                              {market.name} {t('nav.markets_suffix')}
                            </Link>
                            <div className="flex flex-col gap-3">
                              {cities.filter(c => c.marketId === market.id).map((loc) => (
                                <Link 
                                  key={loc.id} 
                                  to={`/markets/${loc.id}`}
                                  className="text-[12px] text-brand-blue hover:text-brand-gold transition-colors flex items-center justify-between group lowercase tracking-wide first-letter:uppercase"
                                >
                                  <span className="capitalize">{loc.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                        <Link 
                          to="/market-catalog"
                          className="flex items-center gap-2 text-brand-gold hover:text-brand-blue transition-colors font-bold tracking-[0.2em] text-[10px]"
                        >
                          {t('nav.catalog')}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/services" className={isScrolled ? 'text-brand-blue hover:text-brand-gold' : 'text-brand-ivory/80 hover:text-brand-ivory transition-colors duration-300'}>{t('nav.services')}</Link>
              <Link to="/insights" className={isScrolled ? 'text-brand-blue hover:text-brand-gold' : 'text-brand-ivory/80 hover:text-brand-ivory transition-colors duration-300'}>{t('nav.insights')}</Link>
              <Link to="/about" className={isScrolled ? 'text-brand-blue hover:text-brand-gold' : 'text-brand-ivory/80 hover:text-brand-ivory transition-colors duration-300'}>{t('nav.about')}</Link>
              
              {isAdmin && (
                <Link 
                  to="/admin/catalog" 
                  className={`font-bold transition-colors duration-300 ${isScrolled ? 'text-brand-gold hover:text-brand-blue' : 'text-brand-gold hover:text-brand-ivory'}`}
                >
                  {t('nav.admin')}
                </Link>
              )}

              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors duration-300 ${isScrolled ? 'text-brand-blue hover:text-brand-gold' : 'text-brand-ivory/80 hover:text-brand-ivory'}`}
                aria-label="Search"
              >
                <SearchIcon className="w-4 h-4" />
              </button>

              <button onClick={handleBookClick} className="btn-briefing py-2 px-6">{t('nav.book')}</button>
            </div>

            {/* Toggle Button */}
            <button 
              className="md:hidden z-50 text-brand-gold p-2 font-bold tracking-widest text-xs"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? t('nav.close') : t('nav.menu')}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-brand-ivory md:hidden pt-32 px-6 overflow-y-auto"
          >
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-6" role="group" aria-label="Language selection">
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`text-sm font-bold tracking-widest ${language === 'en' ? 'text-brand-gold border-b-2 border-brand-gold pb-1' : 'text-gray-400'}`}
                      aria-label="Switch to English"
                      aria-pressed={language === 'en'}
                    >
                      ENGLISH
                    </button>
                    <button 
                      onClick={() => setLanguage('da')}
                      className={`text-sm font-bold tracking-widest ${language === 'da' ? 'text-brand-gold border-b-2 border-brand-gold pb-1' : 'text-gray-400'}`}
                      aria-label="Skift til dansk"
                      aria-pressed={language === 'da'}
                    >
                      DANSK
                    </button>
                  </div>
                  <button 
                    onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}
                    className="p-2 text-brand-gold"
                  >
                    <SearchIcon className="w-5 h-5" />
                  </button>
                </div>

              {/* Mobile Invest Section */}
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setIsMobileInvestOpen(!isMobileInvestOpen)}
                  className="text-3xl font-serif font-normal text-brand-blue uppercase flex items-center justify-between"
                >
                  {t('nav.invest')}
                </button>
                <AnimatePresence>
                  {isMobileInvestOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-8 pl-4 border-l-2 border-brand-gold/20 pt-4"
                    >
                      {markets.map((market) => (
                        <div key={market.id}>
                          <Link to={`/${market.slug}`} className="block text-[9px] text-brand-gold tracking-[0.3em] mb-4 hover:text-brand-blue transition-colors uppercase">{market.name}</Link>
                          <div className="flex flex-col gap-4">
                            {cities.filter(c => c.marketId === market.id).map((loc) => (
                              <Link 
                                key={loc.id} 
                                to={`/markets/${loc.id}`} 
                                className="text-xl font-serif text-brand-blue/70"
                              >
                                {loc.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                        <Link 
                          to="/market-catalog"
                          className="flex items-center gap-2 text-brand-gold hover:text-brand-blue transition-colors font-bold tracking-[0.2em] text-[10px]"
                        >
                          {t('nav.catalog')}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                to="/services" 
                className="text-3xl font-serif font-normal text-brand-blue uppercase"
              >
                {t('nav.services')}
              </Link>

              <Link 
                to="/insights" 
                className="text-3xl font-serif font-normal text-brand-blue uppercase"
              >
                {t('nav.insights')}
              </Link>
              
              <Link 
                to="/about" 
                className="text-3xl font-serif font-normal text-brand-blue uppercase"
              >
                {t('nav.about')}
              </Link>

              {isAdmin && (
                <Link 
                  to="/admin/catalog"
                  className="text-3xl font-serif font-normal text-brand-gold uppercase"
                >
                  {t('nav.admin')}
                </Link>
              )}

              <Link 
                to={user ? "/account" : "/login"} 
                className="text-3xl font-serif font-normal text-brand-blue uppercase flex items-center gap-4"
              >
                <User className="w-6 h-6 text-brand-gold" />
                {user ? t('nav.account') : t('nav.login')}
              </Link>
              
              {user && (
                <button 
                  onClick={async () => {
                    await logout();
                    setIsMenuOpen(false);
                    navigate('/login');
                  }}
                  className="text-3xl font-serif font-normal text-red-800 uppercase flex items-center gap-4 text-left"
                >
                  {t('nav.logout')}
                </button>
              )}
              
              <div className="h-px bg-gray-100 w-full my-4"></div>
              
              <button 
                onClick={handleBookClick} 
                className="btn-briefing py-5 px-6 text-xl mt-8"
              >
                {t('nav.book')}
              </button>
            </div>
            
            <div className="mt-20 text-center pb-10">
              <p className="text-xs font-normal uppercase tracking-widest text-gray-300">Univue Consultants ApS</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

