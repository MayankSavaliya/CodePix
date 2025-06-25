import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

export const useSnippetStore = create((set, get) => ({
  snippets: [],
  loading: false,
  currentSnippet: null,

  // Save current snippet to Firebase
  saveSnippet: async (user, snippetData, title = 'Untitled') => {
    if (!user) {
      toast.error('Please sign in to save snippets');
      return;
    }

    set({ loading: true });
    try {
      const snippetToSave = {
        ...snippetData,
        title,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        likes: 0,
        views: 0
      };

      const docRef = await addDoc(collection(db, 'snippets'), snippetToSave);
      
      // Update local state
      const newSnippet = { id: docRef.id, ...snippetToSave };
      set(state => ({ 
        snippets: [newSnippet, ...state.snippets],
        currentSnippet: newSnippet
      }));
      
      toast.success('Snippet saved successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error saving snippet:', error);
      toast.error('Failed to save snippet');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Load user's snippets
  loadUserSnippets: async (userId) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'snippets'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const snippets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      set({ snippets });
      return snippets;
    } catch (error) {
      console.error('Error loading snippets:', error);
      toast.error('Failed to load snippets');
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // Update snippet
  updateSnippet: async (snippetId, updates) => {
    set({ loading: true });
    try {
      const snippetRef = doc(db, 'snippets', snippetId);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(snippetRef, updateData);
      
      // Update local state
      set(state => ({
        snippets: state.snippets.map(snippet =>
          snippet.id === snippetId 
            ? { ...snippet, ...updateData }
            : snippet
        ),
        currentSnippet: state.currentSnippet?.id === snippetId 
          ? { ...state.currentSnippet, ...updateData }
          : state.currentSnippet
      }));
      
      toast.success('Snippet updated!');
    } catch (error) {
      console.error('Error updating snippet:', error);
      toast.error('Failed to update snippet');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete snippet
  deleteSnippet: async (snippetId) => {
    set({ loading: true });
    try {
      await deleteDoc(doc(db, 'snippets', snippetId));
      
      // Update local state
      set(state => ({
        snippets: state.snippets.filter(snippet => snippet.id !== snippetId),
        currentSnippet: state.currentSnippet?.id === snippetId 
          ? null 
          : state.currentSnippet
      }));
      
      toast.success('Snippet deleted');
    } catch (error) {
      console.error('Error deleting snippet:', error);
      toast.error('Failed to delete snippet');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Load public snippets for gallery
  loadPublicSnippets: async (limitCount = 20) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'snippets'),
        where('isPublic', '==', true),
        orderBy('likes', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const publicSnippets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return publicSnippets;
    } catch (error) {
      console.error('Error loading public snippets:', error);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // Set current snippet
  setCurrentSnippet: (snippet) => {
    set({ currentSnippet: snippet });
  },

  // Clear snippets (on logout)
  clearSnippets: () => {
    set({ snippets: [], currentSnippet: null });
  }
}));
