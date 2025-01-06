/**
 * @module FirekitDoc
 */

import { doc, DocumentReference, onSnapshot } from "firebase/firestore";
import { firebaseService } from "../firebase.js";
import { browser } from "$app/environment";

/**
 * Manages real-time Firestore document subscriptions with reactive state
 * @class
 * @template T Document data type
 * 
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 * 
 * // Create document subscription
 * const userDoc = firekitDoc<User>('users/123', {
 *   id: '123',
 *   name: 'Loading...',
 *   email: ''
 * });
 * ```
 */
class FirekitDoc<T> {
    /** Current document data */
    private _data: T | null = $state(null);
    /** Loading state */
    private _loading = $state(true);
    /** Error state */
    private _error = $state<Error | null>(null);
    /** Document reference */
    private docRef: DocumentReference<T> | null = null;

    /**
     * Creates a document subscription
     * @param {string | DocumentReference<T>} ref Document path or reference
     * @param {T} [startWith] Initial data before fetch completes
     * 
     * @example
     * ```typescript
     * const doc = new FirekitDoc('users/123', defaultUser);
     * // or
     * const doc = new FirekitDoc(docRef, defaultUser);
     * ```
     */
    constructor(ref: string | DocumentReference<T>, startWith?: T) {
        this._data = startWith ?? null;

        if (browser) {
            try {
                const firestore = firebaseService.getDbInstance();
                this.docRef = typeof ref === "string"
                    ? (doc(firestore, ref) as DocumentReference<T>)
                    : ref;
                onSnapshot(
                    this.docRef,
                    (snapshot) => {
                        const data = snapshot.data() as T | null;
                        this._data = data ? { ...data, id: snapshot.id } : null;
                        this._loading = false;
                        this._error = null;
                    },
                    (error) => {
                        this._error = error;
                        this._loading = false;
                    }
                );
            } catch (error) {
                this._error = error as Error;
                this._loading = false;
            }
        }
    }

    /** Gets current document data */
    get data(): T | null {
        return this._data;
    }

    /** Gets document ID */
    get id(): string {
        return this.docRef?.id ?? '';
    }

    /** Gets loading state */
    get loading(): boolean {
        return this._loading;
    }

    /** Gets error state */
    get error(): Error | null {
        return this._error;
    }

    /**
     * Gets document reference
     * @throws {Error} If document reference is not available
     */
    get ref(): DocumentReference<T> {
        if (this.docRef === null) {
            throw new Error("Document reference is not available yet.");
        }
        return this.docRef;
    }

    /** Checks if document exists */
    get exists(): boolean {
        return this._data !== null;
    }
}

/**
 * Creates a document subscription
 * @template T Document data type
 * @param {string | DocumentReference<T>} ref Document path or reference
 * @param {T} [startWith] Initial data before fetch completes
 * @returns {FirekitDoc<T>} Document subscription instance
 * 
 * @example
 * ```typescript
 * const userDoc = firekitDoc<User>('users/123', {
 *   id: '123',
 *   name: 'Loading...',
 *   email: ''
 * });
 * 
 * // Access reactive state
 * if (userDoc.loading) {
 *   console.log('Loading...');
 * } else if (userDoc.error) {
 *   console.error(userDoc.error);
 * } else if (userDoc.exists) {
 *   console.log(userDoc.data);
 * }
 * ```
 */
export function firekitDoc<T>(
    ref: string | DocumentReference<T>,
    startWith?: T
): FirekitDoc<T> {
    return new FirekitDoc(ref, startWith);
}