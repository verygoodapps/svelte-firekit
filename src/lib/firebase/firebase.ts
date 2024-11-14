import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
    initializeFirestore,
    CACHE_SIZE_UNLIMITED,
    type Firestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    enablePersistentCacheIndexAutoCreation,
    getPersistentCacheIndexManager,
    writeBatch
} from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getFunctions, type Functions } from 'firebase/functions';
import { getDatabase, type Database } from 'firebase/database';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config.js';

class FirebaseService {
    private static instance: FirebaseService;
    private firebaseApp: FirebaseApp | null = null;
    private db: Firestore | null = null;
    private auth: Auth | null = null;
    private functions: Functions | null = null;
    private database: Database | null = null;
    private storage: FirebaseStorage | null = null;

    private readonly isBrowser = typeof window !== 'undefined';

    private constructor() {
    }

    static getInstance(): FirebaseService {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseService();
        }
        return FirebaseService.instance;
    }

    getFirebaseApp(): FirebaseApp {
        if (this.firebaseApp) return this.firebaseApp;

        const existingApps = getApps();
        if (existingApps.length) {
            this.firebaseApp = existingApps[0];
        } else {
            this.firebaseApp = initializeApp(firebaseConfig);
            console.log(`${firebaseConfig.projectId} initialized on ${this.isBrowser ? 'client' : 'server'}`);
        }

        this.initializeFirestoreInstance();
        return this.firebaseApp;
    }

    private initializeFirestoreInstance(): void {
        if (this.db || !this.isBrowser) return;

        this.db = initializeFirestore(this.firebaseApp as FirebaseApp, {
            localCache: persistentLocalCache({
                cacheSizeBytes: CACHE_SIZE_UNLIMITED,
                tabManager: persistentMultipleTabManager()
            }),
        });

        const indexManager = getPersistentCacheIndexManager(this.db);
        if (indexManager) {
            enablePersistentCacheIndexAutoCreation(indexManager);
            console.log('Firestore persistent cache indexing is enabled');
        } else {
            console.warn('Failed to initialize the Firestore cache index manager');
        }
    }

    getDb(): Firestore {
        if (!this.db) this.getFirebaseApp();
        return this.db as Firestore;
    }

    getAuthInstance(): Auth {
        if (!this.auth) this.auth = getAuth(this.getFirebaseApp());
        return this.auth;
    }

    getFunctionsInstance(): Functions {
        if (!this.functions) this.functions = getFunctions(this.getFirebaseApp());
        return this.functions;
    }

    getDatabaseInstance(): Database {
        if (!this.database) this.database = getDatabase(this.getFirebaseApp());
        return this.database;
    }

    getStorageInstance(): FirebaseStorage {
        if (!this.storage) this.storage = getStorage(this.getFirebaseApp());
        return this.storage;
    }

    getBatch() {
        return writeBatch(this.getDb());
    }
}

export const firebaseService = FirebaseService.getInstance();