/**
 * Dynamic Pre-rendering & SEO Engine for Univue Consultants ApS
 * 
 * Automatically generates static, semantic HTML and rich SEO metadata
 * directly from the live application data (Language translations, cities registry,
 * properties catalog, market corridor theses, and site settings).
 */

import { translations } from './src/contexts/LanguageContext';
import { cities, CityData } from './src/constants/cities';
import { properties, Property } from './src/constants/properties';
import { marketTranslations } from './src/data/marketTranslations';
import { DEFAULT_PHOTOS } from './src/contexts/SiteSettingsContext';

const BASE_URL = 'https://univueconsultants.com';
const tEn = translations.en;

function t(key: string): string {
  return tEn[key] || key;
}

export interface RouteMetadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage?: string;
  schema: Record<string, any>;
}

// ============================================================================
// 1. DYNAMIC ROUTE METADATA GENERATOR (Titles, Descriptions, OG, Twitter, Schema)
// ============================================================================

export function getRouteMetadata(pathname: string): RouteMetadata {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';

  // Dynamic City Microsite Route (/markets/:cityId)
  if (cleanPath.startsWith('/markets/')) {
    const rawId = cleanPath.replace('/markets/', '').toLowerCase();
    const cityId = rawId === 'ras-al-khaimah' ? 'rak' : (rawId === 'rak' ? 'rak' : rawId);
    const city = cities.find(c => c.id === cityId || (cityId === 'rak' && c.id === 'rak')) 
      || cities.find(c => c.id === rawId);
    
    const translationKey = rawId === 'rak' ? 'ras-al-khaimah' : rawId;
    const localized = marketTranslations.en[translationKey] || (city ? marketTranslations.en[city.id] : null);

    if (city) {
      const cityName = city.name;
      const thesis = localized?.desc || city.thesis;
      return {
        title: `${cityName} Real Estate & Market Analysis | Univue Consultants`,
        description: thesis.slice(0, 155),
        keywords: `${cityName} property investment, ${cityName} commercial real estate, ${city.country} market entry, ${city.targetBuyer}`,
        canonical: `${BASE_URL}/markets/${city.id}`,
        ogTitle: `${cityName} Real Estate & Market Analysis | Univue Consultants`,
        ogDescription: thesis.slice(0, 155),
        ogType: "article",
        ogImage: city.image || `${BASE_URL}/assets/images/logo.png`,
        schema: {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": cityName,
          "description": thesis,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": cityName,
            "addressCountry": city.country
          }
        }
      };
    }
  }

  // Core Static Routes
  switch (cleanPath) {
    case '/about':
      return {
        title: "About Us | Leadership & Mission | Univue Consultants ApS",
        description: "Univue Consultants simplifies international property investment. Discover our leadership, mission, Hornslet headquarters, and European cross-border advisory.",
        keywords: "Nimmi Schou, Univue Consultants leadership, international property advisory, Denmark cross border consulting",
        canonical: `${BASE_URL}/about`,
        ogTitle: "About Us | Leadership & Mission | Univue Consultants ApS",
        ogDescription: "Discover how Univue simplifies international property acquisitions through strategic partners across UAE, India, and Southeast Asia.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Univue Consultants ApS",
          "description": t('about.mission.quote'),
          "mainEntity": {
            "@type": "Organization",
            "name": "Univue Consultants ApS",
            "founder": {
              "@type": "Person",
              "name": "Nimmi Schou",
              "jobTitle": "Founder & Director"
            }
          }
        }
      };

    case '/services':
      return {
        title: "Specialist Advisory Services | Univue Consultants ApS",
        description: "Turnkey property sourcing, portfolio positioning, Tier-1 developer access, financing coordination, legal framework, and transaction management.",
        keywords: "off-plan sourcing, legal framework advisory, cross-border financing, property acquisition coordination",
        canonical: `${BASE_URL}/services`,
        ogTitle: "Specialist Advisory Services | Univue Consultants ApS",
        ogDescription: "From off-plan property sourcing to legal and financing coordination for cross-border investments.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Cross-Border Property & Investment Advisory",
          "provider": {
            "@type": "Organization",
            "name": "Univue Consultants ApS"
          },
          "serviceType": [
            "Off-plan Property Sourcing",
            "Investment Strategy & Portfolio Positioning",
            "Access to Vetted Projects",
            "Financing Coordination",
            "Legal Framework Advisory",
            "Transaction Coordination"
          ]
        }
      };

    case '/uae':
      return {
        title: "UAE Markets & Property Opportunities | Univue Consultants",
        description: "Navigate Dubai, Abu Dhabi, and Ras Al Khaimah (Al Marjan Island). Strategic off-plan luxury residences, 0% personal tax, and Tier-1 developer pipelines.",
        keywords: "Dubai property investment, Abu Dhabi real estate, Ras Al Khaimah Al Marjan Island, UAE Golden Visa, Emaar off-plan",
        canonical: `${BASE_URL}/uae`,
        ogTitle: "UAE Markets & Property Opportunities | Univue Consultants",
        ogDescription: "Advisory layer for international investors navigating Dubai, Abu Dhabi, and Ras Al Khaimah.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "UAE Real Estate & Strategic Markets",
          "description": t('uae.hero.desc')
        }
      };

    case '/india':
      return {
        title: "India Markets & Corporate Expansion | Univue Consultants",
        description: "Commercial real estate sourcing, Tech GCC setups, Bangalore IT corridor, Mumbai BKC, and FDI structuring for European enterprises.",
        keywords: "India corporate expansion, Bangalore Grade-A office, Mumbai BKC office space, India FDI real estate, RERA standard",
        canonical: `${BASE_URL}/india`,
        ogTitle: "India Markets & Corporate Expansion | Univue Consultants",
        ogDescription: "Scale your business operationally in the world's fastest-growing major economy with Univue Consultants.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "India Corporate Expansion & Commercial Markets",
          "description": t('india.hero.desc')
        }
      };

    case '/southeast-asia':
      return {
        title: "Southeast Asia Markets | Singapore, Thailand, Bali | Univue",
        description: "Wealth preservation in Singapore Grade-A commercial, luxury hospitality villas in Indonesia, and premium urban residential in Thailand.",
        keywords: "Singapore real estate safe haven, Bali resort villas, Thailand luxury property, Southeast Asia commercial assets",
        canonical: `${BASE_URL}/southeast-asia`,
        ogTitle: "Southeast Asia Markets | Singapore, Thailand, Bali | Univue",
        ogDescription: "Dual-track regional strategy: institutional safety in Singapore and high-growth hospitality in Thailand & Indonesia.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Southeast Asia Investment Markets",
          "description": t('sea.hero.desc')
        }
      };

    case '/market-catalog':
    case '/properties':
    case '/catalog':
      return {
        title: "Exclusive Property Catalog & Assets | Univue Consultants",
        description: "Curated portfolio of institutional-grade properties across Dubai, Abu Dhabi, RAK, and Bangalore with verified developer credentials.",
        keywords: "Dubai property catalog, Emaar off-plan, Wynn Al Marjan residences, Bangalore commercial offices, luxury villas Dubai",
        canonical: `${BASE_URL}/market-catalog`,
        ogTitle: "Exclusive Property Catalog & Assets | Univue Consultants",
        ogDescription: "Advisor-choice off-plan developments, prime luxury villas, penthouses, and Grade-A commercial workspaces.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Univue Curated Real Estate Catalog",
          "hasPart": properties.map(p => ({
            "@type": "RealEstateListing",
            "name": p.name,
            "description": p.description || p.highlights?.join(', '),
            "price": p.startingPrice,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": p.location,
              "addressCountry": p.country
            }
          }))
        }
      };

    case '/book':
      return {
        title: "Schedule Strategic Briefing | Univue Consultants ApS",
        description: "Book a confidential 30-minute private consultation with an international advisory partner at our Hornslet headquarters or via secure video conference.",
        keywords: "schedule property briefing, Univue consultation, cross border real estate meeting Hornslet Denmark",
        canonical: `${BASE_URL}/book`,
        ogTitle: "Schedule Strategic Briefing | Univue Consultants ApS",
        ogDescription: "Private briefing with international real estate and cross-border expansion advisors.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Schedule Private Briefing",
          "telephone": "+45 26 37 82 70",
          "email": "Univueconsultants@gmail.com"
        }
      };

    case '/questionnaire':
      return {
        title: "Strategy Session Questionnaire | Univue Consultants ApS",
        description: "Complete our strategic assessment to prepare your custom cross-border expansion or property investment briefing.",
        keywords: "property assessment questionnaire, investor profile, international expansion briefing preparation",
        canonical: `${BASE_URL}/questionnaire`,
        ogTitle: "Strategy Session Questionnaire | Univue Consultants ApS",
        ogDescription: "Answer 5 brief questions to help us tailor your international property briefing.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Strategy Session Questionnaire"
        }
      };

    case '/':
    default:
      return {
        title: "Univue Consultants | International Property Investment Advisory",
        description: "Univue Consultants simplifies international property investment by connecting clients with the right properties and coordinating financial, legal, and regulatory support.",
        keywords: "international property investment, cross-border real estate, turnkey property advisory, international acquisitions, Dubai real estate, Univue Consultants",
        canonical: `${BASE_URL}/`,
        ogTitle: "Univue Consultants | International Property Investment Advisory",
        ogDescription: "Opening doors across borders. Turnkey international property investment and corporate expansion advisory.",
        ogType: "website",
        schema: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${BASE_URL}/#website`,
              "name": "Univue Consultants ApS",
              "url": BASE_URL,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${BASE_URL}/market-catalog?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "Organization",
              "@id": `${BASE_URL}/#organization`,
              "name": "Univue Consultants ApS",
              "url": BASE_URL,
              "logo": `${BASE_URL}/assets/images/logo.png`,
              "description": t('hero.desc'),
              "telephone": "+45 26 37 82 70",
              "email": "Univueconsultants@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Amaliegårdvej 1",
                "postalCode": "8543",
                "addressLocality": "Hornslet",
                "addressCountry": "DK"
              },
              "areaServed": ["DK", "AE", "IN", "SG"],
              "founder": {
                "@type": "Person",
                "name": "Nimmi Schou"
              }
            }
          ]
        }
      };
  }
}

// ============================================================================
// 2. LIVE SHARED UI COMPONENTS (Nav, Footer)
// ============================================================================

const sharedNav = `
<header role="banner" class="univue-header" style="background-color: #0B1F3A; color: #FDFCF5; border-bottom: 1px solid rgba(200, 169, 106, 0.2); position: sticky; top: 0; z-index: 50; backdrop-blur: 8px;">
  <!-- Top Utility Bar -->
  <div style="background-color: #061224; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0.4rem 1.5rem; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">
    <div style="max-width: 80rem; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 1rem; color: rgba(253, 252, 245, 0.6);">
        <span style="color: #C8A96A;">ENGLISH</span>
        <span>DANSK</span>
      </div>
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <a href="tel:+4526378270" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">+45 26 37 82 70</a>
        <a href="/login" style="color: #C8A96A; text-decoration: none;">MY ACCOUNT</a>
      </div>
    </div>
  </div>

  <!-- Main Navigation Bar -->
  <div style="max-width: 80rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.5rem; flex-wrap: wrap; gap: 1rem;">
    <a href="/" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: #FDFCF5;" aria-label="Univue Consultants ApS">
      <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.5rem; letter-spacing: 0.08em; font-weight: 500;">UNIVUE</span>
      <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; border-left: 1px solid rgba(200, 169, 106, 0.4); padding-left: 0.75rem;">Consultants ApS</span>
    </a>
    <nav role="navigation" aria-label="Main Navigation" style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
      <a href="/properties" style="color: #FDFCF5; text-decoration: none; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;">Properties</a>
      <a href="/uae" style="color: #FDFCF5; text-decoration: none; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;">UAE</a>
      <a href="/india" style="color: #FDFCF5; text-decoration: none; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;">India</a>
      <a href="/southeast-asia" style="color: #FDFCF5; text-decoration: none; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;">Southeast Asia</a>
      <a href="/services" style="color: #FDFCF5; text-decoration: none; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;">Services</a>
      <a href="/about" style="color: #FDFCF5; text-decoration: none; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;">About Us</a>
      <a href="/book" style="background-color: #C8A96A; color: #0B1F3A; padding: 0.5rem 1.25rem; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; border: 1px solid #C8A96A;">Schedule Briefing</a>
    </nav>
  </div>
</header>
`;

const sharedFooter = `
<footer class="univue-footer" role="contentinfo" style="background-color: #0B1F3A; color: #FDFCF5; border-top: 1px solid rgba(200, 169, 106, 0.2); padding: 4rem 1.5rem 2rem 1.5rem; margin-top: auto;">
  <div style="max-width: 80rem; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2.5rem; margin-bottom: 3rem;">
    <!-- Company Identity -->
    <div>
      <div style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.5rem; color: #FDFCF5; margin-bottom: 0.5rem;">UNIVUE CONSULTANTS</div>
      <p style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem;">International Advisory</p>
      <p style="color: rgba(253, 252, 245, 0.7); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
        ${t('footer.desc')}
      </p>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="https://www.linkedin.com/in/nimmi-schou-36839a40b/" target="_blank" rel="noopener noreferrer" style="color: #C8A96A; text-decoration: none; font-size: 0.8rem; border: 1px solid rgba(200,169,106,0.3); padding: 0.35rem 0.65rem;">LinkedIn</a>
        <a href="https://x.com/Univue_Official" target="_blank" rel="noopener noreferrer" style="color: #C8A96A; text-decoration: none; font-size: 0.8rem; border: 1px solid rgba(200,169,106,0.3); padding: 0.35rem 0.65rem;">X</a>
        <a href="https://www.instagram.com/univueconsultants/" target="_blank" rel="noopener noreferrer" style="color: #C8A96A; text-decoration: none; font-size: 0.8rem; border: 1px solid rgba(200,169,106,0.3); padding: 0.35rem 0.65rem;">Instagram</a>
        <a href="https://wa.me/4526378270" target="_blank" rel="noopener noreferrer" style="color: #C8A96A; text-decoration: none; font-size: 0.8rem; border: 1px solid rgba(200,169,106,0.3); padding: 0.35rem 0.65rem;">WhatsApp</a>
      </div>
    </div>

    <!-- Strategic Corridors -->
    <div>
      <h3 style="color: #C8A96A; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; font-family: 'Bodoni Moda', Georgia, serif;">Strategic Corridors</h3>
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem;">
        <li><a href="/uae" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">United Arab Emirates (Dubai, Abu Dhabi, RAK)</a></li>
        <li><a href="/india" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">India (Bangalore, Gurgaon, Mumbai, Chennai)</a></li>
        <li><a href="/southeast-asia" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Southeast Asia (Singapore, Thailand, Bali)</a></li>
        <li><a href="/properties" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Exclusive Property Catalog</a></li>
      </ul>
    </div>

    <!-- Advisory Services -->
    <div>
      <h3 style="color: #C8A96A; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; font-family: 'Bodoni Moda', Georgia, serif;">Advisory Services</h3>
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem;">
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Off-plan Property Sourcing</a></li>
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Investment Strategy & Positioning</a></li>
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Access to Vetted Tier-1 Projects</a></li>
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Financing Coordination & Banking</a></li>
        <li><a href="/services" style="color: rgba(253, 252, 245, 0.8); text-decoration: none;">Legal Framework & Ownership Advisory</a></li>
      </ul>
    </div>

    <!-- Direct Contact & Legal CVR -->
    <div>
      <h3 style="color: #C8A96A; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem; font-family: 'Bodoni Moda', Georgia, serif;">Executive Contact</h3>
      <p style="color: rgba(253, 252, 245, 0.8); font-size: 0.9rem; margin-bottom: 0.5rem;">
        <strong>CVR-nr.</strong> 45 84 53 62
      </p>
      <p style="color: rgba(253, 252, 245, 0.8); font-size: 0.9rem; margin-bottom: 0.5rem;">
        <strong>Email:</strong> <a href="mailto:Univueconsultants@gmail.com" style="color: #C8A96A; text-decoration: none;">Univueconsultants@gmail.com</a>
      </p>
      <p style="color: rgba(253, 252, 245, 0.8); font-size: 0.9rem; margin-bottom: 0.5rem;">
        <strong>Telephone:</strong> <a href="tel:+4526378270" style="color: #C8A96A; text-decoration: none;">+45 26 37 82 70</a>
      </p>
      <p style="color: rgba(253, 252, 245, 0.8); font-size: 0.9rem; margin-bottom: 1.25rem;">
        <strong>Address:</strong> Amaliegårdvej 1, 8543 Hornslet, Denmark
      </p>
      <a href="/book" style="display: inline-block; background-color: transparent; border: 1px solid #C8A96A; color: #C8A96A; padding: 0.5rem 1rem; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;">Schedule Consultation</a>
    </div>
  </div>

  <div style="max-width: 80rem; margin: 0 auto; border-top: 1px solid rgba(253, 252, 245, 0.1); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.75rem; color: rgba(253, 252, 245, 0.5);">
    <p>© 2026 Univue Consultants ApS. All rights reserved. CVR-nr. 45 84 53 62.</p>
    <div style="display: flex; gap: 1.5rem;">
      <a href="/about" style="color: rgba(253, 252, 245, 0.5); text-decoration: none;">About</a>
      <a href="/services" style="color: rgba(253, 252, 245, 0.5); text-decoration: none;">Services</a>
      <a href="/questionnaire" style="color: rgba(253, 252, 245, 0.5); text-decoration: none;">Assessment</a>
      <a href="/book" style="color: rgba(253, 252, 245, 0.5); text-decoration: none;">Briefing</a>
    </div>
  </div>
</footer>
`;

// ============================================================================
// 3. LIVE PAGE BODY GENERATORS (Mirroring React SPA Components)
// ============================================================================

function renderHomeBody(): string {
  const partners = [
    { name: t('home.partner.emaar'), desc: t('home.partner.emaar.desc') },
    { name: t('home.partner.sobha'), desc: t('home.partner.sobha.desc') },
    { name: t('home.partner.damac'), desc: t('home.partner.damac.desc') },
    { name: t('home.partner.binghatti'), desc: t('home.partner.binghatti.desc') },
    { name: t('home.partner.azizi'), desc: t('home.partner.azizi.desc') },
    { name: t('home.partner.wasel'), desc: t('home.partner.wasel.desc') },
    { name: t('home.partner.bnw'), desc: t('home.partner.bnw.desc') }
  ];

  const clientTypes = [
    { title: t('home.workwith.investors.title'), desc: t('home.workwith.investors.desc') },
    { title: t('home.workwith.expansion.title'), desc: t('home.workwith.expansion.desc') },
    { title: t('home.workwith.entrepreneurship.title'), desc: t('home.workwith.entrepreneurship.desc') },
    { title: t('home.workwith.corporate.title'), desc: t('home.workwith.corporate.desc') },
    { title: t('home.workwith.investmentgroups.title'), desc: t('home.workwith.investmentgroups.desc') },
    { title: t('home.workwith.collaboration.title'), desc: t('home.workwith.collaboration.desc') },
  ];

  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <!-- Hero Section -->
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem 6rem 1.5rem; position: relative; overflow: hidden; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; position: relative; z-index: 10;">
      <span style="display: inline-block; color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 1.25rem; font-weight: 600;">
        ${t('hero.subtitle')}
      </span>
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.1; margin: 0 0 1.5rem 0; font-weight: 400; letter-spacing: -0.02em;">
        ${t('hero.title')} <span style="color: #C8A96A; font-style: italic;">${t('hero.title.accent')} ${t('hero.title.bottom')}</span>
      </h1>
      <p style="font-size: clamp(1.1rem, 2vw, 1.4rem); line-height: 1.6; max-width: 48rem; color: rgba(253, 252, 245, 0.9); margin-bottom: 2.5rem; font-weight: 300;">
        ${t('hero.desc')}
      </p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="/questionnaire" style="background-color: #C8A96A; color: #0B1F3A; padding: 1rem 2.25rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
          ${t('hero.cta.primary')}
        </a>
        <a href="/properties" style="border: 1px solid rgba(200, 169, 106, 0.5); color: #C8A96A; padding: 1rem 2.25rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
          ${t('nav.catalog')}
        </a>
      </div>
    </div>
  </section>

  <!-- Access to Market Leaders -->
  <section style="background-color: #F8F6F0; border-top: 1px solid #EBE7DD; border-bottom: 1px solid #EBE7DD; padding: 3rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto; text-align: center;">
      <span style="font-size: 0.75rem; font-weight: 800; color: #C8A96A; letter-spacing: 0.35em; text-transform: uppercase; display: block; margin-bottom: 1.5rem;">
        ${t('home.partners.title')}
      </span>
      <div style="display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap;">
        ${partners.map(p => `
          <div style="text-align: center;">
            <div style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.6rem; font-weight: 700; color: #0B1F3A; letter-spacing: 0.05em;">${p.name}</div>
            <div style="font-size: 0.7rem; color: #8C7B5D; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 0.25rem;">${p.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Who We Work With -->
  <section style="padding: 5rem 1.5rem; max-width: 80rem; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 3rem;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">
        ${t('home.workwith.tag')}
      </span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
      ${clientTypes.map(c => `
        <div style="background: #ffffff; border: 1px solid rgba(11, 31, 58, 0.08); padding: 2rem;">
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.25rem; color: #0B1F3A; margin: 0 0 0.5rem 0;">${c.title}</h3>
          <p style="color: #666; font-size: 0.9rem; line-height: 1.6; margin: 0;">${c.desc}</p>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Core Strategic Corridors -->
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3.5rem;">
        <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Core Corridors</span>
        <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2rem, 3.5vw, 3rem); margin: 0.5rem 0;">
          International Strategic Gateways
        </h2>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
        <!-- UAE Corridor -->
        <article style="background: rgba(255,255,255,0.04); border: 1px solid rgba(200, 169, 106, 0.3); padding: 2.5rem;">
          <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Corridor 01</span>
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.8rem; color: #FDFCF5; margin: 0.5rem 0 1rem 0;">${t('home.markets.uae.title')}</h3>
          <p style="color: rgba(253, 252, 245, 0.8); line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.5rem;">
            ${t('home.markets.uae.desc').replace(/\n/g, '<br />')}
          </p>
          <a href="/uae" style="color: #C8A96A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 2px solid #C8A96A; padding-bottom: 0.25rem;">
            Explore UAE Markets →
          </a>
        </article>

        <!-- India Corridor -->
        <article style="background: rgba(255,255,255,0.04); border: 1px solid rgba(200, 169, 106, 0.3); padding: 2.5rem;">
          <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Corridor 02</span>
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.8rem; color: #FDFCF5; margin: 0.5rem 0 1rem 0;">${t('home.markets.india.title')}</h3>
          <p style="color: rgba(253, 252, 245, 0.8); line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.5rem;">
            ${t('home.markets.india.desc').replace(/\n/g, '<br />')}
          </p>
          <a href="/india" style="color: #C8A96A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 2px solid #C8A96A; padding-bottom: 0.25rem;">
            Explore India Expansion →
          </a>
        </article>

        <!-- Southeast Asia Corridor -->
        <article style="background: rgba(255,255,255,0.04); border: 1px solid rgba(200, 169, 106, 0.3); padding: 2.5rem;">
          <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Corridor 03</span>
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.8rem; color: #FDFCF5; margin: 0.5rem 0 1rem 0;">${t('home.markets.seasia.title')}</h3>
          <p style="color: rgba(253, 252, 245, 0.8); line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.5rem;">
            ${t('home.markets.seasia.desc').replace(/\n/g, '<br />')}
          </p>
          <a href="/southeast-asia" style="color: #C8A96A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 2px solid #C8A96A; padding-bottom: 0.25rem;">
            Explore Southeast Asia →
          </a>
        </article>
      </div>
    </div>
  </section>

  <!-- Featured Advisor Properties from Live Catalog -->
  <section style="max-width: 80rem; margin: 5rem auto; padding: 0 1.5rem;">
    <div style="text-align: center; margin-bottom: 3.5rem;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">${t('home.choice.tag')}</span>
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2rem, 3.5vw, 3rem); color: #0B1F3A; margin: 0.5rem 0;">
        ${t('home.choice.title')}
      </h2>
      <p style="color: #6b7280; font-size: 1.1rem; max-width: 36rem; margin: 0 auto; font-weight: 300;">
        ${t('home.choice.desc')}
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
      ${properties.map(p => `
        <article style="background: #ffffff; border: 1px solid #e5e7eb; overflow: hidden; display: flex; flex-direction: column;">
          <div style="height: 220px; overflow: hidden; position: relative;">
            <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
            <div style="position: absolute; top: 1rem; left: 1rem; background: #0B1F3A; color: #C8A96A; font-size: 0.7rem; font-weight: 700; padding: 0.35rem 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;">
              ${p.type || 'Property'} • ${p.country}
            </div>
          </div>
          <div style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
            <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">${p.location}</span>
            <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.5rem; margin: 0.5rem 0; color: #0B1F3A;">${p.name}</h3>
            <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; flex-grow: 1;">
              ${p.description || p.highlights?.join('. ') || ''}
            </p>
            <div style="border-top: 1px solid #f3f4f6; padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.7rem; color: #9ca3af; text-transform: uppercase; display: block;">Starting Price</span>
                <span style="font-size: 1.1rem; font-weight: 700; color: #0B1F3A;">${p.startingPrice}</span>
              </div>
              <a href="/market-catalog?id=${p.id}" style="color: #C8A96A; font-weight: 700; text-decoration: none; font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase;">
                View Asset →
              </a>
            </div>
          </div>
        </article>
      `).join('')}
    </div>

    <div style="text-align: center; margin-top: 3rem;">
      <a href="/properties" style="display: inline-block; background-color: #0B1F3A; color: #FDFCF5; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;">
        ${t('home.choice.catalog')}
      </a>
    </div>
  </section>

  <!-- Client Journey (4-step approach) -->
  <section style="background-color: #F8F6F0; border-top: 1px solid #EBE7DD; padding: 5rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 3.5rem;">
        <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">${t('home.journey.tag')}</span>
        <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2rem, 3.5vw, 3rem); color: #0B1F3A; margin: 0.5rem 0;">
          The Client Experience
        </h2>
        <p style="color: #6b7280; font-size: 1.1rem; max-width: 36rem; margin: 0 auto; font-weight: 300;">
          ${t('home.journey.desc')}
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem;">
        <div style="background: #ffffff; padding: 2.5rem; border: 1px solid rgba(11, 31, 58, 0.08);">
          <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.5rem; color: #C8A96A; display: block; margin-bottom: 0.5rem;">01</span>
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.75rem 0;">${t('home.journey.step1.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('home.journey.step1.desc')}</p>
        </div>
        <div style="background: #ffffff; padding: 2.5rem; border: 1px solid rgba(11, 31, 58, 0.08);">
          <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.5rem; color: #C8A96A; display: block; margin-bottom: 0.5rem;">02</span>
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.75rem 0;">${t('home.journey.step2.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('home.journey.step2.desc')}</p>
        </div>
        <div style="background: #ffffff; padding: 2.5rem; border: 1px solid rgba(11, 31, 58, 0.08);">
          <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.5rem; color: #C8A96A; display: block; margin-bottom: 0.5rem;">03</span>
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.75rem 0;">${t('home.journey.step3.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('home.journey.step3.desc')}</p>
        </div>
        <div style="background: #ffffff; padding: 2.5rem; border: 1px solid rgba(11, 31, 58, 0.08);">
          <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.5rem; color: #C8A96A; display: block; margin-bottom: 0.5rem;">04</span>
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.75rem 0;">${t('home.journey.step4.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('home.journey.step4.desc')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Ready to invest or expand CTA -->
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; text-align: center;">
    <div style="max-width: 48rem; margin: 0 auto;">
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2rem, 4vw, 3rem); margin: 0 0 1rem 0;">
        ${t('home.cta.title')}
      </h2>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.15rem; line-height: 1.6; margin-bottom: 2.5rem;">
        ${t('home.cta.desc')}
      </p>
      <a href="/book" style="background-color: #C8A96A; color: #0B1F3A; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
        ${t('hero.cta.primary')}
      </a>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderAboutBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0 0 1rem 0;">
        ${t('about.title')} <span style="color: #C8A96A; font-style: italic;">${t('about.title.accent')}</span>
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        International Cross-Border Real Estate & Corporate Advisory
      </p>
    </div>
  </section>

  <!-- Mission Statement -->
  <section style="padding: 5rem 1.5rem; max-width: 68rem; margin: 0 auto; text-align: center;">
    <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">${t('about.mission.tag')}</span>
    <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); color: #0B1F3A; margin: 0.75rem 0 2rem 0;">
      ${t('about.mission.title')}
    </h2>
    <blockquote style="font-family: 'Bodoni Moda', Georgia, serif; font-style: italic; font-size: 1.5rem; color: #666; line-height: 1.6; margin: 0 0 3rem 0; border: none; padding: 0;">
      ${t('about.mission.quote')}
    </blockquote>
  </section>

  <!-- Why & Approach -->
  <section style="background-color: #F8F6F0; border-top: 1px solid #EBE7DD; border-bottom: 1px solid #EBE7DD; padding: 5rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3rem;">
      <div style="background: #ffffff; padding: 3rem; border: 1px solid rgba(11,31,58,0.08);">
        <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.8rem; color: #0B1F3A; margin: 0 0 1.25rem 0;">${t('about.why.title')}</h3>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.7; margin: 0;">${t('about.why.desc')}</p>
      </div>
      <div style="background: #ffffff; padding: 3rem; border: 1px solid rgba(11,31,58,0.08);">
        <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.8rem; color: #0B1F3A; margin: 0 0 1.25rem 0;">${t('about.approach.title')}</h3>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.7; margin: 0;">${t('about.approach.desc')}</p>
      </div>
    </div>
  </section>

  <!-- Values -->
  <section style="padding: 5rem 1.5rem; max-width: 80rem; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 3.5rem;">
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2rem, 3.5vw, 3rem); color: #0B1F3A;">${t('about.values.title')}</h2>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
      <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A;">
        <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.75rem 0;">${t('about.values.v1.title')}</h3>
        <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('about.values.v1.desc')}</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A;">
        <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.75rem 0;">${t('about.values.v2.title')}</h3>
        <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('about.values.v2.desc')}</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A;">
        <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.75rem 0;">${t('about.values.v3.title')}</h3>
        <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('about.values.v3.desc')}</p>
      </div>
    </div>
  </section>

  <!-- Leadership -->
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem;">
    <div style="max-width: 60rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">${t('about.team.tag')}</span>
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.5rem; margin: 0.5rem 0 2rem 0;">${t('about.team.title')}</h2>
      
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(200, 169, 106, 0.3); padding: 3rem; max-width: 44rem; margin: 0 auto;">
        <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.8rem; color: #C8A96A; margin: 0 0 0.25rem 0;">Nimmi Schou</h3>
        <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(253, 252, 245, 0.6); display: block; margin-bottom: 1.25rem;">
          ${t('about.team.role')}
        </span>
        <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.05rem; line-height: 1.7; margin: 0;">
          ${t('about.team.bio')}
        </p>
      </div>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderServicesBody(): string {
  const coreServices = [
    {
      title: t('services.s1.title'),
      description: t('services.s1.desc'),
      features: [t('services.s1.f1'), t('services.s1.f2'), t('services.s1.f3'), t('services.s1.f4')]
    },
    {
      title: t('services.s2.title'),
      description: t('services.s2.desc'),
      features: [t('services.s2.f1'), t('services.s2.f2'), t('services.s2.f3'), t('services.s2.f4')]
    },
    {
      title: t('services.s3.title'),
      description: t('services.s3.desc'),
      features: [t('services.s3.f1'), t('services.s3.f2'), t('services.s3.f3'), t('services.s3.f4'), t('services.s3.f5'), t('services.s3.f6'), t('services.s3.f7')]
    },
    {
      title: t('services.s4.title'),
      description: t('services.s4.desc'),
      features: [t('services.s4.f1'), t('services.s4.f2'), t('services.s4.f3'), t('services.s4.f4')]
    },
    {
      title: t('services.s5.title'),
      description: t('services.s5.desc'),
      features: [t('services.s5.f1'), t('services.s5.f2'), t('services.s5.f3'), t('services.s5.f4')]
    },
    {
      title: t('services.s6.title'),
      description: t('services.s6.desc'),
      features: [t('services.s6.f1'), t('services.s6.f2'), t('services.s6.f3'), t('services.s6.f4')]
    }
  ];

  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0 0 1rem 0;">
        ${t('services.title')}
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        ${t('services.subtitle')}
      </p>
    </div>
  </section>

  <section style="max-width: 80rem; margin: 5rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2.5rem;">
      ${coreServices.map((s, index) => `
        <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A; display: flex; flex-direction: column;">
          <span style="font-size: 0.75rem; color: #C8A96A; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">Service 0${index + 1}</span>
          <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.5rem; color: #0B1F3A; margin: 0.5rem 0 1rem 0;">${s.title}</h2>
          <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
            ${s.description}
          </p>
          <div style="margin-top: auto; border-top: 1px solid #f3f4f6; padding-top: 1rem;">
            <span style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; font-weight: 700; display: block; margin-bottom: 0.5rem;">Key Scope:</span>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; color: #1e293b;">
              ${s.features.map(f => `<li style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: #C8A96A;">•</span> ${f}</li>`).join('')}
            </ul>
          </div>
        </article>
      `).join('')}
    </div>
  </section>

  <!-- CTA -->
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 4.5rem 1.5rem; text-align: center;">
    <div style="max-width: 48rem; margin: 0 auto;">
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.2rem; margin: 0 0 1rem 0;">
        ${t('services.cta_title')}
      </h2>
      <a href="/book" style="background-color: #C8A96A; color: #0B1F3A; padding: 1rem 2.25rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
        Schedule Briefing
      </a>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderUAEBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">${t('uae.hero.tag')}</span>
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        ${t('uae.hero.title')}
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        ${t('uae.hero.desc')}
      </p>
    </div>
  </section>

  <!-- Emirates Districts -->
  <section style="max-width: 80rem; margin: 5rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem;">
      <!-- Dubai -->
      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Emirate 01</span>
        <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 0.5rem 0;">Dubai</h2>
        <span style="font-size: 0.8rem; text-transform: uppercase; color: #9ca3af; font-weight: 600; display: block; margin-bottom: 1rem;">${t('uae.dist.dubai.type')}</span>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${t('uae.dist.dubai.desc')}
        </p>
        <a href="/markets/dubai" style="color: #C8A96A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">
          View Dubai Microsite →
        </a>
      </article>

      <!-- Abu Dhabi -->
      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Emirate 02</span>
        <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 0.5rem 0;">Abu Dhabi</h2>
        <span style="font-size: 0.8rem; text-transform: uppercase; color: #9ca3af; font-weight: 600; display: block; margin-bottom: 1rem;">${t('uae.dist.abu-dhabi.type')}</span>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${t('uae.dist.abu-dhabi.desc')}
        </p>
        <a href="/markets/abu-dhabi" style="color: #C8A96A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">
          View Abu Dhabi Microsite →
        </a>
      </article>

      <!-- Ras Al Khaimah -->
      <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2.5rem; border-top: 3px solid #C8A96A;">
        <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;">Emirate 03</span>
        <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.8rem; color: #0B1F3A; margin: 0.5rem 0 0.5rem 0;">Ras Al Khaimah (RAK)</h2>
        <span style="font-size: 0.8rem; text-transform: uppercase; color: #9ca3af; font-weight: 600; display: block; margin-bottom: 1rem;">${t('uae.dist.rak.type')}</span>
        <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${t('uae.dist.rak.desc')}
        </p>
        <a href="/markets/rak" style="color: #C8A96A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">
          View RAK Microsite →
        </a>
      </article>
    </div>
  </section>

  <!-- Advantages -->
  <section style="background-color: #F8F6F0; border-top: 1px solid #EBE7DD; padding: 5rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.5rem; text-align: center; color: #0B1F3A; margin-bottom: 3rem;">
        ${t('uae.adv.title')}
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem;">
        <div style="background: #ffffff; padding: 2rem; border: 1px solid rgba(11,31,58,0.08);">
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.5rem 0;">${t('uae.adv1.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('uae.adv1.desc')}</p>
        </div>
        <div style="background: #ffffff; padding: 2rem; border: 1px solid rgba(11,31,58,0.08);">
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.5rem 0;">${t('uae.adv2.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('uae.adv2.desc')}</p>
        </div>
        <div style="background: #ffffff; padding: 2rem; border: 1px solid rgba(11,31,58,0.08);">
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.5rem 0;">${t('uae.adv3.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('uae.adv3.desc')}</p>
        </div>
        <div style="background: #ffffff; padding: 2rem; border: 1px solid rgba(11,31,58,0.08);">
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.5rem 0;">${t('uae.adv4.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('uae.adv4.desc')}</p>
        </div>
      </div>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderIndiaBody(): string {
  const indiaCities = cities.filter(c => c.country === 'India');

  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">${t('india.hero.tag')}</span>
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        ${t('india.hero.title')}
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        ${t('india.hero.desc')}
      </p>
    </div>
  </section>

  <!-- Key Operational Hubs -->
  <section style="max-width: 80rem; margin: 5rem auto; padding: 0 1.5rem;">
    <div style="text-align: center; margin-bottom: 3.5rem;">
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.5rem; color: #0B1F3A;">${t('india.hubs.title')}</h2>
      <p style="color: #666; font-size: 1.05rem; max-width: 40rem; margin: 0.5rem auto 0 auto;">${t('india.hubs.desc')}</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
      ${indiaCities.map(c => `
        <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2rem; border-top: 3px solid #C8A96A;">
          <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">${c.positioning}</span>
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.5rem; color: #0B1F3A; margin: 0.5rem 0;">${c.name}</h3>
          <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
            ${c.thesis}
          </p>
          <a href="/markets/${c.id}" style="color: #C8A96A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">
            Explore ${c.name} Hub →
          </a>
        </article>
      `).join('')}
    </div>
  </section>

  <!-- India Strategic Advantages -->
  <section style="background-color: #F8F6F0; border-top: 1px solid #EBE7DD; padding: 5rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.5rem; text-align: center; color: #0B1F3A; margin-bottom: 3rem;">
        ${t('india.adv.title')}
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem;">
        <div style="background: #ffffff; padding: 2rem; border: 1px solid rgba(11,31,58,0.08);">
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.5rem 0;">${t('india.adv1.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('india.adv1.desc')}</p>
        </div>
        <div style="background: #ffffff; padding: 2rem; border: 1px solid rgba(11,31,58,0.08);">
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.5rem 0;">${t('india.adv2.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('india.adv2.desc')}</p>
        </div>
        <div style="background: #ffffff; padding: 2rem; border: 1px solid rgba(11,31,58,0.08);">
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.5rem 0;">${t('india.adv3.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('india.adv3.desc')}</p>
        </div>
        <div style="background: #ffffff; padding: 2rem; border: 1px solid rgba(11,31,58,0.08);">
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.3rem; color: #0B1F3A; margin: 0 0 0.5rem 0;">${t('india.adv4.title')}</h3>
          <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin: 0;">${t('india.adv4.desc')}</p>
        </div>
      </div>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderSoutheastAsiaBody(): string {
  const seaCities = cities.filter(c => c.country === 'Southeast Asia');

  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">${t('sea.hero.tag')}</span>
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        ${t('sea.hero.title')}
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        ${t('sea.hero.desc')}
      </p>
    </div>
  </section>

  <!-- Regional Nodes -->
  <section style="max-width: 80rem; margin: 5rem auto; padding: 0 1.5rem;">
    <div style="text-align: center; margin-bottom: 3.5rem;">
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.5rem; color: #0B1F3A;">${t('sea.hubs.title')}</h2>
      <p style="color: #666; font-size: 1.05rem; max-width: 40rem; margin: 0.5rem auto 0 auto;">${t('sea.hubs.desc')}</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
      ${seaCities.map(c => `
        <article style="background: #ffffff; border: 1px solid #e5e7eb; padding: 2rem; border-top: 3px solid #C8A96A;">
          <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">${c.positioning}</span>
          <h3 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.5rem; color: #0B1F3A; margin: 0.5rem 0;">${c.name}</h3>
          <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
            ${c.thesis}
          </p>
          <a href="/markets/${c.id}" style="color: #C8A96A; font-weight: 700; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">
            Explore ${c.name} Node →
          </a>
        </article>
      `).join('')}
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderCatalogBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Curated Properties & Assets</span>
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        ${t('catalog.hero.title1')} ${t('catalog.hero.title2')}
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        ${t('catalog.hero.desc')}
      </p>
    </div>
  </section>

  <section style="max-width: 80rem; margin: 5rem auto; padding: 0 1.5rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2.5rem;">
      ${properties.map(p => `
        <article style="background: #ffffff; border: 1px solid #e5e7eb; overflow: hidden; display: flex; flex-direction: column;">
          <div style="height: 240px; overflow: hidden; position: relative;">
            <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
            <div style="position: absolute; top: 1rem; left: 1rem; background: #0B1F3A; color: #C8A96A; font-size: 0.7rem; font-weight: 700; padding: 0.35rem 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;">
              ${p.type || 'Property'} • ${p.country}
            </div>
            <div style="position: absolute; bottom: 1rem; right: 1rem; background: #C8A96A; color: #0B1F3A; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.65rem;">
              ${p.status}
            </div>
          </div>
          <div style="padding: 2.5rem; display: flex; flex-direction: column; flex-grow: 1;">
            <span style="color: #C8A96A; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">${p.location}</span>
            <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 1.6rem; margin: 0.5rem 0; color: #0B1F3A;">${p.name}</h2>
            <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem; flex-grow: 1;">
              ${p.description || p.highlights?.join('. ') || ''}
            </p>
            
            <div style="background: #FDFCF5; border: 1px solid #f1ece1; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                <span style="color: #64748b;">Developer:</span>
                <strong style="color: #0B1F3A;">${p.developer?.name || 'Verified Partner'}</strong>
              </div>
              ${p.handoverTime ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                <span style="color: #64748b;">Handover:</span>
                <strong style="color: #0B1F3A;">${p.handoverTime}</strong>
              </div>
              ` : ''}
              ${p.paymentPlan ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Plan:</span>
                <strong style="color: #0B1F3A;">${p.paymentPlan}</strong>
              </div>
              ` : ''}
            </div>

            <div style="border-top: 1px solid #f3f4f6; padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.7rem; color: #9ca3af; text-transform: uppercase; display: block;">Starting Price</span>
                <span style="font-size: 1.25rem; font-weight: 700; color: #0B1F3A;">${p.startingPrice}</span>
              </div>
              <a href="/book" style="background-color: #0B1F3A; color: #FDFCF5; padding: 0.65rem 1.25rem; font-weight: 700; text-decoration: none; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;">
                Inquire →
              </a>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderCityMicrositeBody(cityId: string): string {
  const rawId = cityId.toLowerCase();
  const lookupId = rawId === 'ras-al-khaimah' ? 'rak' : rawId;
  const city = cities.find(c => c.id === lookupId) || cities.find(c => c.id === rawId) || cities[0];
  const translationKey = rawId === 'rak' ? 'ras-al-khaimah' : rawId;
  const localized = marketTranslations.en[translationKey] || marketTranslations.en[city.id] || {
    type: city.positioning,
    desc: city.thesis,
    stats: [
      { label: "PRICING", value: city.avgPricing },
      { label: "YIELD", value: city.rentalYield },
      { label: "RELEVANCE", value: city.relevance }
    ],
    highlights: [city.thesis, city.infraGrowth, city.relevance]
  };

  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A; position: relative;">
    <div style="max-width: 72rem; margin: 0 auto; position: relative; z-index: 10;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">
        ${city.country} Market Profile
      </span>
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        ${city.name} Market Analysis
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 48rem; line-height: 1.6;">
        ${localized.desc}
      </p>
    </div>
  </section>

  <!-- Key Metrics Bar -->
  <section style="background: #F8F6F0; border-bottom: 1px solid #EBE7DD; padding: 2.5rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem;">
      <div style="background: #ffffff; padding: 1.5rem; border: 1px solid rgba(11,31,58,0.08);">
        <span style="font-size: 0.7rem; color: #C8A96A; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Pricing Benchmark</span>
        <strong style="font-size: 1.1rem; color: #0B1F3A;">${city.avgPricing}</strong>
      </div>
      <div style="background: #ffffff; padding: 1.5rem; border: 1px solid rgba(11,31,58,0.08);">
        <span style="font-size: 0.7rem; color: #C8A96A; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Market Segment</span>
        <strong style="font-size: 1.1rem; color: #0B1F3A;">${city.rentalYield}</strong>
      </div>
      <div style="background: #ffffff; padding: 1.5rem; border: 1px solid rgba(11,31,58,0.08);">
        <span style="font-size: 0.7rem; color: #C8A96A; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Target Profile</span>
        <strong style="font-size: 1.1rem; color: #0B1F3A;">${city.targetBuyer}</strong>
      </div>
    </div>
  </section>

  <!-- Market Rationale & Highlights -->
  <section style="max-width: 72rem; margin: 5rem auto; padding: 0 1.5rem;">
    <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2.2rem; color: #0B1F3A; margin-bottom: 2rem;">
      Strategic Highlights in ${city.name}
    </h2>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      ${(localized.highlights || []).map((h: string) => `
        <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 1.75rem; border-left: 4px solid #C8A96A;">
          <p style="color: #334155; font-size: 1rem; line-height: 1.6; margin: 0;">${h}</p>
        </div>
      `).join('')}
    </div>

    <div style="margin-top: 4rem; text-align: center;">
      <a href="/book" style="background-color: #0B1F3A; color: #FDFCF5; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
        Inquire for ${city.name} Opportunities
      </a>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderBookingBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Executive Consultation</span>
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        Schedule Your Strategic Briefing
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        Book a confidential 30-minute private consultation with an international advisory partner at our Hornslet headquarters or via secure video conference.
      </p>
    </div>
  </section>

  <section style="max-width: 50rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 3rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center;">
      <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 2rem; color: #0B1F3A; margin-bottom: 1rem;">
        Direct Executive Access
      </h2>
      <p style="color: #4b5563; font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem;">
        Whether evaluating an off-plan property purchase in Dubai, exploring the UAE 10-Year Golden Visa, or structuring an operational subsidiary in Bangalore, our senior advisors are at your service.
      </p>
      
      <div style="background: #FDFCF5; padding: 2rem; border: 1px solid #e5e7eb; margin-bottom: 2rem; text-align: left;">
        <h3 style="font-size: 1.1rem; color: #0B1F3A; margin-bottom: 0.75rem; font-weight: 700;">Executive Office Contact:</h3>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.6; margin: 0 0 0.5rem 0;">
          <strong>Phone:</strong> <a href="tel:+4526378270" style="color: #0B1F3A; font-weight: 600;">+45 26 37 82 70</a>
        </p>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.6; margin: 0 0 0.5rem 0;">
          <strong>Email:</strong> <a href="mailto:Univueconsultants@gmail.com" style="color: #0B1F3A;">Univueconsultants@gmail.com</a>
        </p>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.6; margin: 0 0 0.5rem 0;">
          <strong>Registration:</strong> CVR-nr. 45 84 53 62 (Danish Business Authority)
        </p>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.6; margin: 0;">
          <strong>Headquarters:</strong> Univue Consultants ApS, Amaliegårdvej 1, 8543 Hornslet, Denmark
        </p>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="tel:+4526378270" style="background-color: #0B1F3A; color: #FDFCF5; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
          Call +45 26 37 82 70
        </a>
        <a href="/questionnaire" style="border: 1px solid #0B1F3A; color: #0B1F3A; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
          Prepare Questionnaire
        </a>
      </div>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

function renderQuestionnaireBody(): string {
  return `
${sharedNav}
<main role="main" class="univue-main" style="background-color: #FDFCF5; color: #0B1F3A; font-family: 'Inter', system-ui, sans-serif;">
  <section style="background-color: #0B1F3A; color: #FDFCF5; padding: 5rem 1.5rem; border-bottom: 2px solid #C8A96A;">
    <div style="max-width: 72rem; margin: 0 auto; text-align: center;">
      <span style="color: #C8A96A; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700;">Strategic Assessment</span>
      <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: clamp(2.5rem, 5vw, 4rem); margin: 0.5rem 0 1.5rem 0;">
        ${t('q.title')}
      </h1>
      <p style="color: rgba(253, 252, 245, 0.85); font-size: 1.25rem; max-width: 44rem; margin: 0 auto; line-height: 1.6;">
        ${t('q.desc')}
      </p>
    </div>
  </section>

  <section style="max-width: 50rem; margin: 4rem auto; padding: 0 1.5rem;">
    <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 3rem;">
      <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2.5rem;">
        ${t('q.note')}
      </p>

      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3 style="font-size: 1.15rem; color: #0B1F3A; margin-bottom: 0.75rem;">${t('q.q1')}</h3>
          <p style="color: #64748b; font-size: 0.9rem;">Residential • Commercial • Industrial • Other</p>
        </div>
        <div>
          <h3 style="font-size: 1.15rem; color: #0B1F3A; margin-bottom: 0.75rem;">${t('q.q2')}</h3>
          <p style="color: #64748b; font-size: 0.9rem;">United Arab Emirates (Dubai / Abu Dhabi / RAK) • India • Southeast Asia</p>
        </div>
        <div>
          <h3 style="font-size: 1.15rem; color: #0B1F3A; margin-bottom: 0.75rem;">${t('q.q3')}</h3>
          <p style="color: #64748b; font-size: 0.9rem;">Custom investment tiers from $300k to institutional allocations.</p>
        </div>
        <div>
          <h3 style="font-size: 1.15rem; color: #0B1F3A; margin-bottom: 0.75rem;">${t('q.q4')}</h3>
          <p style="color: #64748b; font-size: 0.9rem;">Private investor • Expanding company • Entrepreneur • Family office</p>
        </div>
        <div>
          <h3 style="font-size: 1.15rem; color: #0B1F3A; margin-bottom: 0.75rem;">${t('q.q5')}</h3>
          <p style="color: #64748b; font-size: 0.9rem;">Trusted execution • Strategic advisory • Long-term value • Compliance</p>
        </div>
      </div>

      <div style="margin-top: 3rem; text-align: center;">
        <a href="/book" style="background-color: #0B1F3A; color: #FDFCF5; padding: 1rem 2.5rem; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block;">
          Proceed to Calendar
        </a>
      </div>
    </div>
  </section>
</main>
${sharedFooter}
`;
}

// ============================================================================
// 4. MAIN ROUTER AND HTML INJECTION
// ============================================================================

export function getPrerenderedBody(pathname: string): string {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';

  if (cleanPath.startsWith('/markets/')) {
    const cityId = cleanPath.replace('/markets/', '');
    return renderCityMicrositeBody(cityId);
  }

  switch (cleanPath) {
    case '/about':
      return renderAboutBody();
    case '/services':
      return renderServicesBody();
    case '/uae':
      return renderUAEBody();
    case '/india':
      return renderIndiaBody();
    case '/southeast-asia':
      return renderSoutheastAsiaBody();
    case '/market-catalog':
    case '/properties':
    case '/catalog':
      return renderCatalogBody();
    case '/book':
      return renderBookingBody();
    case '/questionnaire':
      return renderQuestionnaireBody();
    case '/':
    default:
      return renderHomeBody();
  }
}

/**
 * Transforms an HTML template string by injecting route-specific metadata and pre-rendered body
 */
export function getPrerenderedPage(pathname: string, htmlTemplate: string): string {
  const meta = getRouteMetadata(pathname);
  const bodyHtml = getPrerenderedBody(pathname);

  let output = htmlTemplate;

  // 1. Update <title>
  output = output.replace(/<title>.*?<\/title>/i, `<title>${meta.title}</title>`);

  // 2. Update or inject meta description & keywords
  if (/<meta\s+name=["']description["']/i.test(output)) {
    output = output.replace(
      /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="description" content="${meta.description}" />`
    );
  } else {
    output = output.replace(
      '<head>',
      `<head>\n    <meta name="description" content="${meta.description}" />`
    );
  }

  if (meta.keywords) {
    if (/<meta\s+name=["']keywords["']/i.test(output)) {
      output = output.replace(
        /<meta\s+name=["']keywords["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="keywords" content="${meta.keywords}" />`
      );
    } else {
      output = output.replace(
        /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
        `$&\n    <meta name="keywords" content="${meta.keywords}" />`
      );
    }
  }

  // 3. Update or inject OpenGraph & Twitter tags
  output = output.replace(
    /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:title" content="${meta.ogTitle}" />`
  );
  output = output.replace(
    /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:description" content="${meta.ogDescription}" />`
  );
  output = output.replace(
    /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:url" content="${meta.canonical}" />`
  );
  output = output.replace(
    /<meta\s+property=["']og:type["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:type" content="${meta.ogType}" />`
  );

  output = output.replace(
    /<meta\s+property=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="twitter:title" content="${meta.ogTitle}" />`
  );
  output = output.replace(
    /<meta\s+property=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="twitter:description" content="${meta.ogDescription}" />`
  );
  output = output.replace(
    /<meta\s+property=["']twitter:url["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="twitter:url" content="${meta.canonical}" />`
  );

  // 4. Update canonical link
  output = output.replace(
    /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
    `<link rel="canonical" href="${meta.canonical}" />`
  );

  // 5. Inject Schema.org JSON-LD structured data
  const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(meta.schema, null, 2)}\n    </script>`;
  if (/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/i.test(output)) {
    output = output.replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/i, schemaScript);
  } else {
    output = output.replace('</head>', `\n    ${schemaScript}\n  </head>`);
  }

  // 6. Clean, exact root container replacement
  const rootStart = '<div id="root">';
  const rootStartIndex = output.indexOf(rootStart);
  if (rootStartIndex !== -1) {
    const scriptIndex = output.indexOf('<script', rootStartIndex);
    let rootEndIndex = -1;
    if (scriptIndex !== -1) {
      rootEndIndex = scriptIndex;
    } else {
      const bodyCloseIndex = output.indexOf('</body>', rootStartIndex);
      rootEndIndex = bodyCloseIndex !== -1 ? bodyCloseIndex : output.length;
    }
    output = output.substring(0, rootStartIndex) + `<div id="root">${bodyHtml}</div>\n    ` + output.substring(rootEndIndex);
  } else {
    output = output.replace('<body>', `<body><div id="root">${bodyHtml}</div>`);
  }

  return output;
}
