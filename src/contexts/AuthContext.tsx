import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signInWithGoogle: (subscribe?: boolean) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string, subscribe?: boolean) => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingSubscribe, setPendingSubscribe] = useState(false);
  const unsubscribeProfileRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (unsubscribeProfileRef.current) {
        unsubscribeProfileRef.current();
        unsubscribeProfileRef.current = null;
      }

      if (authUser) {
        const userDocRef = doc(db, 'users', authUser.uid);
        
        // Use onSnapshot for real-time profile updates
        unsubscribeProfileRef.current = onSnapshot(userDocRef, async (docSnap) => {
          if (!docSnap.exists()) {
            // First time login - profile doesn't exist yet
            const isAdminEmail = authUser.email === 'univueconsultants@gmail.com' || authUser.email === 'schousasja@gmail.com';
            const newProfile = {
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName || authUser.email?.split('@')[0],
              photoURL: authUser.photoURL || `https://ui-avatars.com/api/?name=${authUser.email?.split('@')[0]}&background=0B1F3A&color=C8A96A`,
              role: isAdminEmail ? 'admin' : 'client',
              isSubscribed: pendingSubscribe,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            try {
              // Creating initial profile
              await setDoc(userDocRef, newProfile);
              // Profile state will be updated by the next snapshot trigger
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${authUser.uid}`);
            }
          } else {
            setProfile(docSnap.data());
          }
          setLoading(false);
        }, (error) => {
          // Ignore permission-denied / cancel errors on logout to avoid breaking the application flow.
          const isPermissionDenied = error.message?.toLowerCase().includes('permission') || 
                                     (error as any).code?.includes('permission') || 
                                     error.message?.includes('permission-denied') || 
                                     (error as any).code === 'permission-denied';
          if (!auth.currentUser || isPermissionDenied) {
            console.warn("Firestore onSnapshot error ignored during logout:", error);
            setLoading(false);
            return;
          }
          handleFirestoreError(error, OperationType.GET, `users/${authUser.uid}`);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfileRef.current) {
        unsubscribeProfileRef.current();
        unsubscribeProfileRef.current = null;
      }
    };
  }, []);

  const signInWithGoogle = async (subscribe = false) => {
    const provider = new GoogleAuthProvider();
    setPendingSubscribe(subscribe);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const signUpEmail = async (email: string, pass: string, name: string, subscribe = false) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0B1F3A&color=C8A96A`;
      
      await updateProfile(res.user, { 
        displayName: name,
        photoURL: photoURL
      });
      
      const userDocRef = doc(db, 'users', res.user.uid);
      const isAdminEmail = res.user.email === 'univueconsultants@gmail.com' || res.user.email === 'schousasja@gmail.com';
      const newProfile = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: name,
        photoURL: photoURL,
        role: isAdminEmail ? 'admin' : 'client',
        isSubscribed: subscribe,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      try {
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${res.user.uid}`);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const signInEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (unsubscribeProfileRef.current) {
        unsubscribeProfileRef.current();
        unsubscribeProfileRef.current = null;
      }
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signUpEmail, signInEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
