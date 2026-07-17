/**
 * Firebase Singleton — initialized once per process.
 * Prevents "Firebase App named '[DEFAULT]' already exists" on hot reload.
 */
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableNetwork, disableNetwork, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY     || 'AIzaSyCxuP9VVBeMq-9tIgq_fh_PIDNpK6GIoxY',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'medicine-app-2673c.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID  || 'medicine-app-2673c',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE     || 'medicine-app-2673c.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID   || '695143432697',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID      || '1:695143432697:web:7ab47a0aff1afe77736979',
};

// Singleton pattern — safe for Next.js hot reload and Vercel serverless
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// Connect to emulator in development only
if (
  typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_EMULATOR === 'true'
) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export default app;
