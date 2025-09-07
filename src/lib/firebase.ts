import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate configuration
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('? Missing required Firebase environment variables:', missingVars);
  console.error('?? Please check your deployment environment variables configuration');
  console.error('?? Expected variables:', requiredEnvVars);
} else {
  console.log('? All Firebase environment variables are present');
}

console.log('Firebase config status:', {
  projectId: firebaseConfig.projectId || '? MISSING',
  authDomain: firebaseConfig.authDomain || '? MISSING',
  hasApiKey: !!firebaseConfig.apiKey,
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('? Firebase app initialized successfully');
} catch (error) {
  console.error('? Firebase initialization failed:', error);
  throw new Error(`Firebase initialization failed: ${error}`);
}

// Initialize Firestore
let db;
try {
  db = getFirestore(app);
  console.log('? Firestore initialized successfully');
} catch (error) {
  console.error('? Firestore initialization failed:', error);
  throw new Error(`Firestore initialization failed: ${error}`);
}

// Initialize Storage
let storage;
try {
  storage = getStorage(app);
  console.log('? Firebase Storage initialized successfully');
} catch (error) {
  console.error('? Firebase Storage initialization failed:', error);
  // Storage is optional for this app, so don't throw
}

export { db, storage };
export default app;