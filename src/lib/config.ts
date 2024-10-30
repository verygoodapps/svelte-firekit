import type { FirebaseOptions } from 'firebase/app';
import {
    PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_AUTH_DOMAIN,
    PUBLIC_FIREBASE_PROJECT_ID,
    PUBLIC_FIREBASE_STORAGE_BUCKET,
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    PUBLIC_FIREBASE_APP_ID,
    PUBLIC_FIREBASE_MEASUREMENT_ID
} from '$env/static/public';

/**
 * Checks for any missing Firebase environment variables and returns an array of missing variables.
 * @returns {string[]} An array of missing variable names. Empty if none are missing.
 */
function getMissingFirebaseConfigVars(): string[] {
    const missingVars: string[] = [];

    // Check each Firebase config variable and add to missingVars array if undefined
    if (!PUBLIC_FIREBASE_API_KEY) missingVars.push('PUBLIC_FIREBASE_API_KEY');
    if (!PUBLIC_FIREBASE_AUTH_DOMAIN) missingVars.push('PUBLIC_FIREBASE_AUTH_DOMAIN');
    if (!PUBLIC_FIREBASE_PROJECT_ID) missingVars.push('PUBLIC_FIREBASE_PROJECT_ID');
    if (!PUBLIC_FIREBASE_STORAGE_BUCKET) missingVars.push('PUBLIC_FIREBASE_STORAGE_BUCKET');
    if (!PUBLIC_FIREBASE_MESSAGING_SENDER_ID) missingVars.push('PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
    if (!PUBLIC_FIREBASE_APP_ID) missingVars.push('PUBLIC_FIREBASE_APP_ID');
    if (!PUBLIC_FIREBASE_MEASUREMENT_ID) missingVars.push('PUBLIC_FIREBASE_MEASUREMENT_ID'); // Optional but included for clarity

    return missingVars;
}

// Use the function to check for missing variables and throw an error if any are missing
const missingVars = getMissingFirebaseConfigVars();
if (missingVars.length > 0) {
    throw Error(`The following Firebase configuration variables are missing: ${missingVars.join(', ')}`);
}

// Define Firebase configuration
export const firebaseConfig: FirebaseOptions = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};
