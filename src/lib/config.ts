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

class FirebaseConfig {
    private static instance: FirebaseConfig;
    private readonly config: FirebaseOptions;

    private constructor() {
        const missingVars = this.getMissingFirebaseConfigVars();
        if (missingVars.length > 0) {
            throw Error(`The following Firebase configuration variables are missing: ${missingVars.join(', ')}`);
        }

        this.config = {
            apiKey: PUBLIC_FIREBASE_API_KEY,
            authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: PUBLIC_FIREBASE_APP_ID,
            measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
        };
    }

    private getMissingFirebaseConfigVars(): string[] {
        const requiredVars = {
            'PUBLIC_FIREBASE_API_KEY': PUBLIC_FIREBASE_API_KEY,
            'PUBLIC_FIREBASE_AUTH_DOMAIN': PUBLIC_FIREBASE_AUTH_DOMAIN,
            'PUBLIC_FIREBASE_PROJECT_ID': PUBLIC_FIREBASE_PROJECT_ID,
            'PUBLIC_FIREBASE_STORAGE_BUCKET': PUBLIC_FIREBASE_STORAGE_BUCKET,
            'PUBLIC_FIREBASE_MESSAGING_SENDER_ID': PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            'PUBLIC_FIREBASE_APP_ID': PUBLIC_FIREBASE_APP_ID,
            'PUBLIC_FIREBASE_MEASUREMENT_ID': PUBLIC_FIREBASE_MEASUREMENT_ID
        };

        return Object.entries(requiredVars)
            .filter(([_, value]) => !value)
            .map(([key]) => key);
    }

    static getInstance(): FirebaseConfig {
        if (!FirebaseConfig.instance) {
            FirebaseConfig.instance = new FirebaseConfig();
        }
        return FirebaseConfig.instance;
    }

    getConfig(): FirebaseOptions {
        return this.config;
    }
}

export const firebaseConfig = FirebaseConfig.getInstance().getConfig();