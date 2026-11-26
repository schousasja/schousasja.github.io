import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc, 
  doc, 
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cities as initialCities, CityData } from '../constants/cities';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { useAuth } from './AuthContext';

export interface Market {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface City extends CityData {
  marketId: string;
}

interface MarketContextType {
  markets: Market[];
  cities: City[];
  loading: boolean;
  addMarket: (market: Omit<Market, 'id'>) => Promise<void>;
  updateMarket: (id: string, market: Partial<Market>) => Promise<void>;
  deleteMarket: (id: string) => Promise<void>;
  addCity: (city: Omit<City, 'id'>) => Promise<void>;
  updateCity: (id: string, city: Partial<City>) => Promise<void>;
  deleteCity: (id: string) => Promise<void>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const INITIAL_MARKETS: Market[] = [
  { id: 'uae', name: 'UAE', slug: 'uae', order: 1 },
  { id: 'india', name: 'India', slug: 'india', order: 2 },
  { id: 'se-asia', name: 'Southeast Asia', slug: 'southeast-asia', order: 3 },
];

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const isAdmin = user?.email === 'univueconsultants@gmail.com' ||
                  user?.email === 'schousasja@gmail.com' ||
                  profile?.role === 'admin';

  // 1. Core data loading (Unconditional & read-only listeners)
  useEffect(() => {
    const unsubscribeMarkets = onSnapshot(
      query(collection(db, 'markets'), orderBy('order', 'asc')),
      (snap) => {
        const marketList = snap.docs.map(doc => ({ ...doc.data() } as Market));
        setMarkets(marketList);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'markets')
    );

    const unsubscribeCities = onSnapshot(
      collection(db, 'cities'),
      (snap) => {
        const cityList = snap.docs.map(doc => ({ ...doc.data() } as City));
        setCities(cityList);
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'cities')
    );

    return () => {
      unsubscribeMarkets();
      unsubscribeCities();
    };
  }, []);

  // 2. Database seeding and sync (Admin only)
  useEffect(() => {
    if (!isAdmin) return;

    const initializeData = async () => {
      try {
        const marketsSnap = await getDocs(collection(db, 'markets'));
        if (marketsSnap.empty) {
          console.log('Initializing markets...');
          for (const m of INITIAL_MARKETS) {
            await setDoc(doc(db, 'markets', m.id), m);
          }
        }

        const citiesSnap = await getDocs(collection(db, 'cities'));
        const existingCityIds = new Set(citiesSnap.docs.map(doc => doc.id));

        console.log('Seeding missing or custom requested cities...');
        for (const c of initialCities) {
          if (!existingCityIds.has(c.id)) {
            let marketId = 'uae';
            if (c.country === 'India') marketId = 'india';
            if (c.country === 'Southeast Asia') marketId = 'se-asia';
            
            await setDoc(doc(db, 'cities', c.id), { ...c, marketId });
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'markets/cities initialization');
      }
    };

    initializeData();
  }, [isAdmin]);

  const addMarket = async (market: Omit<Market, 'id'>) => {
    try {
      const id = market.name.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'markets', id), { ...market, id });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'markets');
    }
  };

  const updateMarket = async (id: string, market: Partial<Market>) => {
    try {
      await setDoc(doc(db, 'markets', id), market, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `markets/${id}`);
    }
  };

  const deleteMarket = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'markets', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `markets/${id}`);
    }
  };

  const addCity = async (city: Omit<City, 'id'>) => {
    try {
      const id = city.name.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'cities', id), { ...city, id });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'cities');
    }
  };

  const updateCity = async (id: string, city: Partial<City>) => {
    try {
      await setDoc(doc(db, 'cities', id), city, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `cities/${id}`);
    }
  };

  const deleteCity = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'cities', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `cities/${id}`);
    }
  };

  return (
    <MarketContext.Provider value={{ 
      markets, 
      cities, 
      loading, 
      addMarket, 
      updateMarket, 
      deleteMarket,
      addCity,
      updateCity,
      deleteCity
    }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarkets = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarkets must be used within a MarketProvider');
  }
  return context;
};
