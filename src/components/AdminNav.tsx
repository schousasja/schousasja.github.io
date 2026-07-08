import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Globe, 
  Mail,
  Image
} from 'lucide-react';

export const AdminNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/catalog', label: 'Property Catalog', icon: Building2 },
    { path: '/admin/insights', label: 'Insights & Publications', icon: FileText },
    { path: '/admin/markets', label: 'Market Architecture', icon: Globe },
    { path: '/admin/newsletter', label: 'Newsletter & Broadcasting', icon: Mail },
    { path: '/admin/photos', label: 'Photo & Media Workspace', icon: Image },
  ];

  return (
    <div className="bg-brand-blue border-b border-white/10 px-6 py-3 sticky top-0 z-[60] backdrop-blur-md bg-brand-blue/90">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-x-8 gap-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`text-[9px] uppercase tracking-widest font-bold transition-colors flex items-center gap-2 ${
              location.pathname === item.path 
                ? 'text-brand-gold' 
                : 'text-white/40 hover:text-brand-gold'
            }`}
          >
            <item.icon className={`w-3 h-3 ${location.pathname === item.path ? 'text-brand-gold' : ''}`} />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
