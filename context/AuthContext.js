import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    let timeoutId;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log('User logged in:', user.email);
          setUser(user);
          // Fetch user profile from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              console.log('User profile found:', userDoc.data());
              setUserProfile(userDoc.data());
            } else {
              // If profile doesn't exist, create a default one
              console.warn('User profile not found, creating default profile');
              const defaultProfile = { email: user.email, role: 'student', createdAt: new Date() };
              setUserProfile(defaultProfile);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Set default profile even if Firestore fails
            setUserProfile({ email: user.email, role: 'student', createdAt: new Date() });
          }
        } else {
          console.log('User logged out');
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
      }
    });

    // Safety timeout - if loading takes more than 5 seconds, force it off
    timeoutId = setTimeout(() => {
      console.warn('Auth check timeout - proceeding without profile');
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const signup = async (email, password, role, additionalData = {}) => {
    try {
      // Validate campus email
      if (!email.includes('@') || !email.includes('.edu')) {
        throw new Error('Please use a valid campus email address');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userData = {
        email: user.email,
        role: role,
        createdAt: new Date(),
        ...additionalData
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      setUserProfile(userData);

      return user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    userRole: userProfile?.role || null,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
