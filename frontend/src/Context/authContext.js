import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, updateProfile } from '../firebase/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  RecaptchaVerifier,
  sendEmailVerification,
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserLoggedIn(!!user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, firstName, lastName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      await sendEmailVerification(user);
      return user;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  };

  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const doResendEmailVerification = async () => {
    try {
      await sendEmailVerification(currentUser);
      console.log('Verification email resent.');
      return ('Verification email resent');
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        return ('Too many requests. Try again later.');
      } else if (error.code === 'auth/user-not-found') {
        return ('User not found. Please register first.');
      } else {
        return ('Failed to resend verification email.');
      }
    }
  }

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const setupRecaptcha = (containerId) => {
    if (typeof window !== 'undefined') {
      window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
        'size': 'invisible',
        'callback': (response) => {
          console.log("Recaptcha verified");
        }
      }, auth);
    }
  };

  const logout = () => signOut(auth);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const value = {
    currentUser,
    userLoggedIn,
    signup,
    loginWithEmail,
    loginWithGoogle,
    doResendEmailVerification,
    setupRecaptcha,
    logout,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
