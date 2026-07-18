/**
 * Firebase Singleton — client-side only initialization.
 *
 * Firebase SDK is browser-only. During Next.js static generation the code
 * runs on the server (no browser), causing "Service firestore is not available".
 * We guard all initialization with `typeof window !== 'undefined'` so the
 * server gets safe null-casted stubs while the browser gets real instances.
 * All actual Firebase usage is inside useEffect hooks (client-only), so the
 * null stubs are never actually called on the server.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY     || 'AIzaSyCxuP9VVBeMq-9tIgq_fh_PIDNpK6GIoxY',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'medicine-app-2673c.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID  || 'medicine-app-2673c',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE     || 'medicine-app-2673c.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID   || '695143432697',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID      || '1:695143432697:web:7ab47a0aff1afe77736979',
};

// Only initialize Firebase on the client — server gets null stubs
const isClient = typeof window !== 'undefined';

const app: FirebaseApp = isClient
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : (null as unknown as FirebaseApp);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: Firestore = isClient ? getFirestore(app) : (null as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth: Auth    = isClient ? getAuth(app)      : (null as any);

export default app;

