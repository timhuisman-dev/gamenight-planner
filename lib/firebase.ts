import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmyOoj45AQNXaNdTj2x2iuCYSbXInC9bI",
  authDomain: "game-night-dashboard.firebaseapp.com",
  projectId: "game-night-dashboard",
  storageBucket: "game-night-dashboard.firebasestorage.app",
  messagingSenderId: "946308799884",
  appId: "1:946308799884:web:a7127087c5751d08c58aa9",
  measurementId: "G-0MV6KN078E"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics in client-side only
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export { auth, app, analytics, db }; 