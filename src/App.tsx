import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { UAEOpportunities } from './pages/UAEOpportunities';
import { IndiaExpansion } from './pages/IndiaExpansion';
import { Questionnaire } from './pages/Questionnaire';
import { Booking } from './pages/Booking';
import { Services } from './pages/Services';
import { AboutUs } from './pages/AboutUs';
import { MarketInsights } from './pages/MarketInsights';
import { MarketCatalog } from './pages/MarketCatalog';
import { SoutheastAsiaMarkets } from './pages/SoutheastAsiaMarkets';
import CityMicrosite from './pages/CityMicrosite';
import { NewsletterAdmin } from './pages/NewsletterAdmin';
import { CatalogAdmin } from './pages/CatalogAdmin';
import { InsightsAdmin } from './pages/InsightsAdmin';
import { MarketManagementAdmin } from './pages/MarketManagementAdmin';
import { PhotoAdmin } from './pages/PhotoAdmin';
import { Login } from './pages/Login';
import { Account } from './pages/Account';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { MarketProvider } from './contexts/MarketContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { StructuredData } from './components/StructuredData';

import { BackToTop } from './components/BackToTop';

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

  return (
    <LanguageProvider>
      <AuthProvider>
        <MarketProvider>
          <SiteSettingsProvider>
            <StructuredData data={websiteSchema} />
            <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/insights" element={<MarketInsights />} />
                  <Route path="/market-catalog" element={<MarketCatalog />} />
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
              </main>
              <Footer />
              <BackToTop />
            </div>
          </Router>
          </SiteSettingsProvider>
        </MarketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
