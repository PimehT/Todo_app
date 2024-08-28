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
  sendPasswordResetEmail,
  updatePassword,
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

  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        setCurrentUser(user);
        throw new Error('Email not verified. Please verify your email before logging in.');
      }
      return userCredential;
    } catch (error) {
      if (!error.code) {
        throw new Error(error.message);
      } else {
        switch (error.code) {
          case 'auth/invalid-credential':
            throw new Error('Invalid email or password.');
          case 'auth/user-not-found':
            throw new Error('No user found with this email.');
          case 'auth/wrong-password':
            throw new Error('Incorrect password.');
          case 'auth/user-disabled':
            throw new Error('This user account has been disabled.');
          case 'auth/too-many-requests':
            throw new Error('Too many login attempts. Please try again later.');
          default:
            console.error('Error during login:', error);
            throw new Error(error.message);
        }
      }
    }
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

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = googleProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      return { user, token };
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = googleProvider.credentialFromError(error);
      console.log('Error during Google sign-in:', error);
      console.log('Error code:', errorCode);
      console.log('User email:', email);
      console.log('Credential error:', credential);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email) => {
    const actionCodeSettings = {
      url: 'http://172.26.175.207:3000/reset-password', // This should match your app's reset route
      handleCodeInApp: true, // Optional: if you want to handle the reset in the app
    };
    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      console.log('Password reset email sent successfully');
      return 'Password reset email sent. Check your inbox.';
    } catch (error) {
      console.error('Error sending password reset email:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No user found with this email address.');
        case 'auth/invalid-email':
          throw new Error('Invalid email address.');
        default:
          throw new Error('Failed to send password reset email.');
      }
    }
  };

  const doPasswordUpdate = (password) => {
    return updatePassword(auth.currentUser, password);
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
    isLoginModalOpen,
    signup,
    loginWithEmail,
    loginWithGoogle,
    doResendEmailVerification,
    doPasswordUpdate,
    resetPassword,
    setupRecaptcha,
    logout,
    openLoginModal,
    closeLoginModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
