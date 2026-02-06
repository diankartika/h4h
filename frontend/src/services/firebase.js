// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Google Sign-in
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists, if not create user document
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Assign random study group (A, B, or C)
      const groups = ['control', 'markers_scores', 'markers_footnotes'];
      const randomGroup = groups[Math.floor(Math.random() * groups.length)];
      
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        studyGroup: randomGroup,
        questionsAsked: 0,
        createdAt: serverTimestamp(),
        lastSessionDate: null,
        completedEvaluation: false,
      });
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get user data
export const getUserData = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};

// Check if user can ask more questions (5 per 24h)
export const canAskQuestion = async (userId) => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const questionsRef = collection(db, 'questions');
  const q = query(
    questionsRef,
    where('userId', '==', userId),
    where('timestamp', '>', last24h)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.size < 5;
};

// Get questions asked count in last 24h
export const getQuestionsCount = async (userId) => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const questionsRef = collection(db, 'questions');
  const q = query(
    questionsRef,
    where('userId', '==', userId),
    where('timestamp', '>', last24h)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.size;
};

// Save question and answer
export const saveQuestion = async (userId, questionData) => {
  try {
    const questionsRef = collection(db, 'questions');
    await addDoc(questionsRef, {
      userId,
      ...questionData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving question:', error);
    throw error;
  }
};

// Save evaluation
export const saveEvaluation = async (userId, evaluationData) => {
  try {
    const evaluationsRef = collection(db, 'evaluations');
    await addDoc(evaluationsRef, {
      userId,
      ...evaluationData,
      timestamp: serverTimestamp(),
    });
    
    // Update user's completedEvaluation flag
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { completedEvaluation: true }, { merge: true });
  } catch (error) {
    console.error('Error saving evaluation:', error);
    throw error;
  }
};

// Get user's question history
export const getUserQuestions = async (userId) => {
  const questionsRef = collection(db, 'questions');
  const q = query(
    questionsRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
