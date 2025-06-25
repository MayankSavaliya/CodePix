import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

const googleProvider = new GoogleAuthProvider();

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      isAuthenticated: false,      // Initialize auth state listener
      initializeAuth: () => {
        return onAuthStateChanged(auth, async (user) => {
          set({ loading: true });
          if (user) {
            // User is signed in
            try {
              const userProfile = await get().getUserProfile(user.uid);
              set({ 
                user: {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                  ...userProfile
                }, 
                isAuthenticated: true,
                loading: false 
              });
            } catch (error) {
              console.error('Error loading user profile:', error);
              set({ 
                user: {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL
                }, 
                isAuthenticated: true,
                loading: false 
              });
            }
          } else {
            // User is signed out
            set({ user: null, isAuthenticated: false, loading: false });
          }
        });
      },

      // Sign up with email and password
      signUp: async (email, password, displayName) => {
        set({ loading: true });
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          
          // Update profile with display name
          await updateProfile(result.user, { displayName });
          
          // Create user document in Firestore
          await setDoc(doc(db, 'users', result.user.uid), {
            email,
            displayName,
            createdAt: new Date().toISOString(),
            snippetsCount: 0,
            plan: 'free'
          });
          
          toast.success('Account created successfully!');
          return result.user;
        } catch (error) {
          toast.error(error.message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Sign in with email and password
      signIn: async (email, password) => {
        set({ loading: true });
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          toast.success('Welcome back!');
          return result.user;
        } catch (error) {
          toast.error(error.message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Sign in with Google
      signInWithGoogle: async () => {
        set({ loading: true });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          
          // Check if user document exists, if not create it
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', result.user.uid), {
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              createdAt: new Date().toISOString(),
              snippetsCount: 0,
              plan: 'free'
            });
          }
          
          toast.success('Welcome!');
          return result.user;
        } catch (error) {
          toast.error(error.message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Sign out
      signOut: async () => {
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false });
          toast.success('Signed out successfully');
        } catch (error) {
          toast.error(error.message);
        }
      },

      // Get user profile from Firestore
      getUserProfile: async (uid) => {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            return userDoc.data();
          }
          return {};
        } catch (error) {
          console.error('Error getting user profile:', error);
          return {};
        }
      },

      // Update user profile
      updateUserProfile: async (updates) => {
        const { user } = get();
        if (!user) return;

        try {
          await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
          set({ user: { ...user, ...updates } });
          toast.success('Profile updated successfully');
        } catch (error) {
          toast.error(error.message);
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);
