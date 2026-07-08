import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

// Pre-packaged high-quality default images matching original templates
export const DEFAULT_PHOTOS = {
  // Page Heroes
  hero_uae_col: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2070",
  hero_india_col: "https://images.unsplash.com/photo-1562654501-a0ccc0af3fb1?auto=format&fit=crop&q=80&w=2070",
  hero_seasia_col: "https://images.unsplash.com/photo-1525596662741-e94ff9926de3?auto=format&fit=crop&q=80&w=2070",
  
  about_hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2669",
  about_why: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
  about_approach: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
  about_vision1: "https://images.unsplash.com/photo-1549423168-356499889410?auto=format&fit=crop&q=80&w=1000",
  about_vision2: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1000",
  about_vision3: "https://images.unsplash.com/photo-1454165833767-027ffea9e61c?auto=format&fit=crop&q=80&w=1000",
  about_vision4: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1000",
  
  services_hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
  link_hero: "https://images.unsplash.com/photo-1454165833767-027ffea9e61c?auto=format&fit=crop&q=80&w=2000",
  questionnaire_hero: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2070",
  catalog_hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
  insights_hero: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000",
  
  uae_microsite_hero: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2070",
  india_microsite_hero: "https://images.unsplash.com/photo-1562654501-a0ccc0af3fb1?auto=format&fit=crop&q=80&w=2070",
  seasia_microsite_hero: "https://images.unsplash.com/photo-1525596662741-e94ff9926de3?auto=format&fit=crop&q=80&w=2070",

  // Core Markets section (on Home Page under Services)
  // UAE Core Market Slider
  market_uae_slide1: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&q=80&w=2070",
  market_uae_slide2: "https://images.unsplash.com/photo-1512453979798-5eaad0ff3b03?auto=format&fit=crop&q=80&w=2070",
  market_uae_slide3: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=2070",

  // India Core Market Slider
  market_india_slide1: "https://images.unsplash.com/photo-1562654501-a0ccc0af3fb1?auto=format&fit=crop&q=80&w=2070",
  market_india_slide2: "https://images.unsplash.com/photo-1596422846543-75c6fc183f23?auto=format&fit=crop&q=80&w=2070",
  market_india_slide3: "https://images.unsplash.com/photo-1570160897042-da3983fd58d3?auto=format&fit=crop&q=80&w=2070",

  // Southeast Asia Core Market Slider
  market_seasia_slide1: "https://images.unsplash.com/photo-1525596662741-e94ff9926de3?auto=format&fit=crop&q=80&w=2070",
  market_seasia_slide2: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2070",
  market_seasia_slide3: "https://images.unsplash.com/photo-1508009603885-50cf7c579367?auto=format&fit=crop&q=80&w=2070"
};

export type PhotosMap = typeof DEFAULT_PHOTOS;

interface SiteSettingsContextType {
  photos: PhotosMap;
  loading: boolean;
  updatePhotos: (newPhotos: Partial<PhotosMap>) => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<PhotosMap>(DEFAULT_PHOTOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read from /site_settings/photos doc
    const unsubscribe = onSnapshot(doc(db, 'site_settings', 'photos'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.photos) {
          // Merge with defaults in case of missing keys
          setPhotos({
            ...DEFAULT_PHOTOS,
            ...data.photos
          });
        }
      }
      setLoading(false);
    }, (error) => {
      console.warn("Using preset high-quality website photographs. Optional remote settings fetch status:", error.message || error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updatePhotos = async (newPhotos: Partial<PhotosMap>) => {
    const updated = {
      ...photos,
      ...newPhotos
    };
    try {
      await setDoc(doc(db, 'site_settings', 'photos'), {
        photos: updated
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_settings/photos');
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ photos, loading, updatePhotos }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
