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

// Declare Firebase instances as nullable, allowing lazy initialization
let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let functions: Functions | null = null;
let database: Database | null = null;
let storage: FirebaseStorage | null = null;

// Detect if the code is running in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Initializes and returns the Firebase app instance.
 * Ensures only one app instance is created and reused across invocations.
 * @returns {FirebaseApp} The initialized Firebase application.
 */
export function getFirebaseApp(): FirebaseApp {
    if (firebaseApp) return firebaseApp;

    const existingApps = getApps();
    if (existingApps.length) {
        firebaseApp = existingApps[0];
    } else {
        firebaseApp = initializeApp(firebaseConfig);
        console.log(`${firebaseConfig.projectId} initialized on ${isBrowser ? 'client' : 'server'}`);
    }

    initializeFirestoreInstance(); // Ensure Firestore is also initialized
    return firebaseApp;
}

/**
 * Initializes the Firestore instance with a persistent cache if in the browser.
 * Configures the Firestore cache to be unlimited and manages multi-tab synchronization.
 */
function initializeFirestoreInstance() {
    if (db || !isBrowser) return;

    db = initializeFirestore(firebaseApp as FirebaseApp, {
        localCache: persistentLocalCache({
            cacheSizeBytes: CACHE_SIZE_UNLIMITED,
            tabManager: persistentMultipleTabManager()
        }),
    });

    const indexManager = getPersistentCacheIndexManager(db);
    if (indexManager) {
        enablePersistentCacheIndexAutoCreation(indexManager);
        console.log('Firestore persistent cache indexing is enabled');
    } else {
        console.warn('Failed to initialize the Firestore cache index manager');
    }
}

/**
 * Retrieves the Firestore database instance.
 * Calls `getFirebaseApp` to ensure the app and Firestore are initialized.
 * @returns {Firestore} The Firestore instance.
 */
export function getDb(): Firestore {
    if (!db) getFirebaseApp();
    return db as Firestore;
}

/**
 * Retrieves the Auth instance, initializing it if needed.
 * @returns {Auth} The Auth instance.
 */
export function getAuthInstance(): Auth {
    if (!auth) auth = getAuth(getFirebaseApp());
    return auth;
}

/**
 * Retrieves the Functions instance, initializing it if needed.
 * @returns {Functions} The Functions instance.
 */
export function getFunctionsInstance(): Functions {
    if (!functions) functions = getFunctions(getFirebaseApp());
    return functions;
}

/**
 * Retrieves the Database instance, initializing it if needed.
 * @returns {Database} The Database instance.
 */
export function getDatabaseInstance(): Database {
    if (!database) database = getDatabase(getFirebaseApp());
    return database;
}

/**
 * Retrieves the Storage instance, initializing it if needed.
 * @returns {FirebaseStorage} The Storage instance.
 */
export function getStorageInstance(): FirebaseStorage {
    if (!storage) storage = getStorage(getFirebaseApp());
    return storage;
}

/**
 * Creates a new Firestore batch instance for performing atomic writes.
 * @returns {WriteBatch} A new write batch instance.
 */
export function getBatch() {
    return writeBatch(getDb());
}
