/**
 * @module FirekitCollection
 */

import {
    collection,
    query,
    onSnapshot,
    type Query,
    type CollectionReference,
    type DocumentData,
    type QueryConstraint
} from "firebase/firestore";
import { firebaseService } from "../firebase.js";
import { browser } from "$app/environment";

/**
 * Manages real-time Firestore collection subscriptions with reactive state
 * @class
 * @template T Collection document type
 * 
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 * 
 * // Create collection subscription
 * const users = firekitCollection<User>('users', 
 *   where('active', '==', true),
 *   orderBy('name')
 * );
 * 
 * // Access reactive state
 * console.log(users.data);    // Array of documents
 * console.log(users.loading); // Loading state
 * console.log(users.error);   // Error state
 * console.log(users.empty);   // Whether collection is empty
 * console.log(users.size);    // Number of documents
 * ```
 */
class FirekitCollection<T> {
    /** Current collection data */
    private _data = $state<T[]>([]);
    /** Loading state */
    private _loading = $state(true);
    /** Error state */
    private _error = $state<Error | null>(null);
    /** Collection reference */
    private colRef: CollectionReference<T> | null = null;
    /** Query reference */
    private queryRef: Query<T> | null = null;

    /**
     * Creates a collection subscription
     * @param {string} path Collection path
     * @param {...QueryConstraint[]} queryConstraints Query constraints (where, orderBy, limit, etc.)
     * 
     * @example
     * ```typescript
     * const collection = new FirekitCollection('users',
     *   where('age', '>=', 18),
     *   orderBy('name', 'asc'),
     *   limit(10)
     * );
     * ```
     */
    constructor(path: string, ...queryConstraints: QueryConstraint[]) {
        if (browser) {
            try {
                const firestore = firebaseService.getDbInstance();
                this.colRef = collection(firestore, path) as CollectionReference<T>;
                this.queryRef = query(this.colRef, ...queryConstraints);

                onSnapshot(
                    this.queryRef,
                    (snapshot) => {
                        this._data = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        })) as T[];
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

    /** Gets current collection data */
    get data(): T[] {
        return this._data;
    }

    /** Gets loading state */
    get loading(): boolean {
        return this._loading;
    }

    /** Gets error state */
    get error(): Error | null {
        return this._error;
    }

    /** Checks if collection is empty */
    get empty(): boolean {
        return this._data.length === 0;
    }

    /** Gets number of documents in collection */
    get size(): number {
        return this._data.length;
    }

    /**
     * Gets collection reference
     * @throws {Error} If collection reference is not available
     */
    get ref(): CollectionReference<T> {
        if (!this.colRef) {
            throw new Error("Collection reference is not available");
        }
        return this.colRef;
    }
}

/**
 * Creates a collection subscription
 * @template T Collection document type
 * @param {string} path Collection path
 * @param {...QueryConstraint[]} queryConstraints Query constraints
 * @returns {FirekitCollection<T>} Collection subscription instance
 * 
 * @example
 * ```typescript
 * interface Post {
 *   id: string;
 *   title: string;
 *   authorId: string;
 * }
 * 
 * const posts = firekitCollection<Post>('posts',
 *   where('authorId', '==', currentUserId),
 *   orderBy('createdAt', 'desc')
 * );
 * ```
 */
export function firekitCollection<T extends DocumentData>(
    path: string,
    ...queryConstraints: QueryConstraint[]
): FirekitCollection<T> {
    return new FirekitCollection<T>(path, ...queryConstraints);
}