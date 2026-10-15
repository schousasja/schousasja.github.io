import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { MarketProvider } from './contexts/MarketContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { StructuredData } from './components/StructuredData';
import { BackToTop } from './components/BackToTop';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';

// Code-split / lazy-load non-critical routes to optimize initial bundle size & load speed
const UAEOpportunities = lazy(() => import('./pages/UAEOpportunities').then(m => ({ default: m.UAEOpportunities })));
const IndiaExpansion = lazy(() => import('./pages/IndiaExpansion').then(m => ({ default: m.IndiaExpansion })));
const SoutheastAsiaMarkets = lazy(() => import('./pages/SoutheastAsiaMarkets').then(m => ({ default: m.SoutheastAsiaMarkets })));
const Questionnaire = lazy(() => import('./pages/Questionnaire').then(m => ({ default: m.Questionnaire })));
const Booking = lazy(() => import('./pages/Booking').then(m => ({ default: m.Booking })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const AboutUs = lazy(() => import('./pages/AboutUs').then(m => ({ default: m.AboutUs })));
const MarketInsights = lazy(() => import('./pages/MarketInsights').then(m => ({ default: m.MarketInsights })));
const MarketCatalog = lazy(() => import('./pages/MarketCatalog').then(m => ({ default: m.MarketCatalog })));
const CityMicrosite = lazy(() => import('./pages/CityMicrosite'));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Account = lazy(() => import('./pages/Account').then(m => ({ default: m.Account })));

// Admin routes (heavy editors, WYSIWYG, MJML generators)
const NewsletterAdmin = lazy(() => import('./pages/NewsletterAdmin').then(m => ({ default: m.NewsletterAdmin })));
const CatalogAdmin = lazy(() => import('./pages/CatalogAdmin').then(m => ({ default: m.CatalogAdmin })));
const InsightsAdmin = lazy(() => import('./pages/InsightsAdmin').then(m => ({ default: m.InsightsAdmin })));
const MarketManagementAdmin = lazy(() => import('./pages/MarketManagementAdmin').then(m => ({ default: m.MarketManagementAdmin })));
const PhotoAdmin = lazy(() => import('./pages/PhotoAdmin').then(m => ({ default: m.PhotoAdmin })));

function App() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Univue Consultants ApS",
    "url": "https://univueconsultants.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://univueconsultants.com/market-catalog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Univue Consultants ApS",
    "url": "https://univueconsultants.com",
    "logo": "https://univueconsultants.com/assets/images/logo.png",
    "description": "Univue Consultants simplifies international property investment by connecting clients with the right properties and coordinating the financial, legal and regulatory support needed to navigate cross-border acquisitions with confidence.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+45 26 37 82 70",
      "contactType": "customer service",
      "areaServed": ["DK", "AE", "IN", "SG"],
      "availableLanguage": ["English", "Danish"]
    }
  };

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <MarketProvider>
            <SiteSettingsProvider>
              <StructuredData data={websiteSchema} />
              <StructuredData data={organizationSchema} />
              <Router>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow">
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/insights" element={<MarketInsights />} />
                        <Route path="/market-catalog" element={<MarketCatalog />} />
                        <Route path="/properties" element={<MarketCatalog />} />
                        <Route path="/catalog" element={<MarketCatalog />} />
                        <Route path="/uae" element={<UAEOpportunities />} />
                        <Route path="/india" element={<IndiaExpansion />} />
                        <Route path="/southeast-asia" element={<SoutheastAsiaMarkets />} />
                        <Route path="/questionnaire" element={<Questionnaire />} />
                        <Route path="/book" element={<Booking />} />
                        <Route path="/markets/:cityId" element={<CityMicrosite />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/admin/newsletter" element={<NewsletterAdmin />} />
                        <Route path="/admin/catalog" element={<CatalogAdmin />} />
                        <Route path="/admin/insights" element={<InsightsAdmin />} />
                        <Route path="/admin/markets" element={<MarketManagementAdmin />} />
                        <Route path="/admin/photos" element={<PhotoAdmin />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                  <BackToTop />
                </div>
              </Router>
            </SiteSettingsProvider>
          </MarketProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
