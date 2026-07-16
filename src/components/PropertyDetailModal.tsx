import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Building2, Tag, Calendar, ShieldCheck, Mail, Phone, ChevronRight, CheckCircle2, FileText, Info } from 'lucide-react';
import { PropertyImageSlider } from './PropertyImageSlider';

interface PropertyDetailModalProps {
  property: any;
  onClose: () => void;
}

export const PropertyDetailModal = ({ property, onClose }: PropertyDetailModalProps) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState(
    `Hello, I would like to request more details and a private consultation regarding ${property.name}.`
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!property) return null;

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  // Recommendation level style mapping
  const getRecBadgeStyles = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'strongly recommended':
        return 'bg-amber-600 text-white font-semibold border-amber-700';
      case 'highly recommended':
        return 'bg-brand-gold text-brand-blue font-bold border-brand-gold';
      case 'recommended':
        return 'bg-brand-blue text-brand-gold font-medium border-brand-blue/30';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-blue/65 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white border border-gray-100 w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] z-10 rounded-sm"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 bg-brand-blue/80 hover:bg-brand-gold text-white hover:text-brand-blue transition-colors rounded-full"
            aria-label="Close detailed view"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column - Imagery, Developer & Perks */}
          <div className="w-full md:w-1/2 bg-gray-50 flex flex-col border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto">
            {/* Gallery / Images */}
            <div className="relative aspect-[16/10] md:aspect-[4/3] bg-brand-blue shrink-0">
              <PropertyImageSlider 
                images={property.images} 
                defaultImage={property.image} 
                alt={property.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Overlaid details */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="px-3 py-1 bg-brand-blue/85 backdrop-blur-md text-brand-gold text-[9px] font-bold uppercase tracking-widest border border-brand-gold/10">
                  {property.type || 'EXQUISITE ASSET'}
                </span>
                <span className="px-3 py-1 bg-white text-brand-blue text-[9px] font-bold uppercase tracking-widest border border-gray-100">
                  {property.status || 'INVESTMENT READY'}
                </span>
              </div>
            </div>

            {/* Developer Section */}
            <div className="p-6 md:p-8 space-y-6">
              {property.developer?.name && (
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-black mb-2">Architect & Developer</p>
                  <h4 className="text-xl font-serif text-brand-blue font-semibold mb-2">{property.developer.name}</h4>
                  {property.developer.credibility && (
                    <p className="text-xs text-gray-500 font-light leading-relaxed italic">
                      "{property.developer.credibility}"
                    </p>
                  )}
                </div>
              )}

              {/* Extra Highlights & Perks */}
              {property.highlights && property.highlights.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-black mb-3">Asset Highlights & Perks</p>
                  <ul className="space-y-2.5">
                    {property.highlights.map((highlight: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 font-sans">
                        <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                        <span className="font-light">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Spec Details & Inquiry Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-8 bg-white">
            <div className="space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                    {property.country} {property.city ? `• ${property.city}` : ''}
                  </span>
                  
                  {/* Level of Recommendation Badge */}
                  {property.recommendationLevel && (
                    <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border rounded-sm ${getRecBadgeStyles(property.recommendationLevel)}`}>
                      ★ {property.recommendationLevel}
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-serif text-brand-blue tracking-tight leading-tight">
                  {property.name}
                </h3>

                <p className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mt-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>{property.location}</span>
                </p>
              </div>

              {/* Pricing, Payment Plan, Handover Time Grid */}
              <div className="grid grid-cols-2 gap-4 bg-brand-ivory p-4 border border-brand-blue/5 rounded-sm">
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Starting Price</p>
                  <p className="text-base font-bold text-brand-blue tracking-tight">{property.startingPrice}</p>
                </div>
                {property.handoverTime && (
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Handover Time</p>
                    <p className="text-xs font-semibold text-brand-blue flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                      {property.handoverTime}
                    </p>
                  </div>
                )}
                {property.paymentPlan && (
                  <div className="col-span-2 pt-2 border-t border-brand-blue/5 mt-1">
                    <p className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Flexible Payment Plan</p>
                    <p className="text-xs font-medium text-brand-blue">{property.paymentPlan}</p>
                  </div>
                )}
              </div>

              {/* Short Statement / Description */}
              {property.description && (
                <div className="border-t border-gray-100 pt-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-black mb-2">Statement of the Property</p>
                  <p className="text-xs text-gray-600 font-light leading-relaxed antialiased">
                    {property.description}
                  </p>
                </div>
              )}
            </div>

            {/* Inquire Form */}
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-xs font-serif text-brand-blue font-bold tracking-tight mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold" />
                <span>Private Consultation & Inquiry</span>
              </h4>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-100 p-6 text-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-brand-blue mb-1">Inquiry Transmitted Successfully</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-light">
                    An executive advisor specializing in the {property.country} market will reach out to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 font-sans">
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name"
                      value={inquiryName}
                      onChange={e => setInquiryName(e.target.value)}
                      className="w-full bg-gray-50 border border-transparent px-4 py-3 text-xs text-brand-blue placeholder:text-gray-400 focus:bg-white focus:border-brand-gold outline-none rounded-sm transition-all"
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="Your Email"
                      value={inquiryEmail}
                      onChange={e => setInquiryEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-transparent px-4 py-3 text-xs text-brand-blue placeholder:text-gray-400 focus:bg-white focus:border-brand-gold outline-none rounded-sm transition-all"
                    />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Phone Number (Optional)"
                    value={inquiryPhone}
                    onChange={e => setInquiryPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-transparent px-4 py-3 text-xs text-brand-blue placeholder:text-gray-400 focus:bg-white focus:border-brand-gold outline-none rounded-sm transition-all"
                  />
                  <textarea 
                    rows={2}
                    required
                    placeholder="Your message..."
                    value={inquiryMessage}
                    onChange={e => setInquiryMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-transparent px-4 py-3 text-xs text-brand-blue placeholder:text-gray-400 focus:bg-white focus:border-brand-gold outline-none rounded-sm transition-all resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-brand-blue hover:bg-brand-gold text-brand-ivory hover:text-brand-blue text-[9px] uppercase tracking-widest font-black flex items-center justify-center gap-2 duration-300 shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Transmitting inquiry...' : 'Inquire via Advisor'}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
