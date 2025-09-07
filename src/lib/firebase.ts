import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

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

console.log('?? Firebase config status:', {
  projectId: firebaseConfig.projectId || '? MISSING',
  authDomain: firebaseConfig.authDomain || '? MISSING',
  hasApiKey: !!firebaseConfig.apiKey,
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
console.log('? Firebase app initialized successfully');

// Initialize Firestore
const db: Firestore = getFirestore(app);
console.log('? Firestore initialized successfully');

// Initialize Storage (optional)
const storage: FirebaseStorage = getStorage(app);
console.log('? Firebase Storage initialized successfully');

export { db, storage };
export default app;