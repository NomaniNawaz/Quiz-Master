import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEMjRrOUvzNOAUmLk0aTpXUnHi_nKwCkI",
  authDomain: "min-test-e7a79.firebaseapp.com",
  projectId: "min-test-e7a79",
  storageBucket: "min-test-e7a79.firebasestorage.app",
  messagingSenderId: "652191397549",
  appId: "1:652191397549:web:75105a1be633117d6a3824",
  measurementId: "G-CV8JX5MV29"
};

// Validate Firebase configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('Missing Firebase configuration fields:', missingFields);
  throw new Error(`Firebase configuration is incomplete. Missing: ${missingFields.join(', ')}`);
}

console.log('Firebase config validation passed');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);