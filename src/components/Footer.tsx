import { Globe2, Users2, Mail, Phone, Linkedin, X, Instagram, Facebook, MessageCircle, Music2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-blue text-brand-ivory py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-brand-ivory/10 pb-12 mb-12">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <span className="font-serif text-2xl font-normal tracking-tight">
              <span className="text-brand-gold">Univue</span> <span>Consultants ApS</span>
            </span>
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
              <span>Amaliegårdvej 1, 8543 Hornslet</span>
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
        <div className="flex gap-8">
           <span>Dubai, UAE</span>
           <span>Bangalore, IN</span>
        </div>
      </div>
    </footer>
  );
};
