/**
 * @module FirekitCollectionGroup
 */

import {
    collectionGroup,
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
 * Manages real-time Firestore collection group subscriptions with reactive state
 * @class
 * @template T Collection document type
 * 
 * @example
 * ```typescript
 * interface Task {
 *   id: string;
 *   title: string;
 *   status: string;
 * }
 * 
 * // Create collection group subscription
 * const allTasks = firekitCollectionGroup<Task>('tasks', 
 *   where('status', '==', 'active'),
 *   orderBy('title')
 * );
 * ```
 */
class FirekitCollectionGroup<T> {
    /** Current collection group data */
    private _data = $state<T[]>([]);
    /** Loading state */
    private _loading = $state(true);
    /** Error state */
    private _error = $state<Error | null>(null);
    /** Query reference */
    private queryRef: Query<T> | null = null;

    /**
     * Creates a collection group subscription
     * @param {string} collectionId Collection ID to query across all documents
     * @param {...QueryConstraint[]} queryConstraints Query constraints (where, orderBy, limit, etc.)
     */
    constructor(collectionId: string, ...queryConstraints: QueryConstraint[]) {
        if (browser) {
            try {
                const firestore = firebaseService.getDbInstance();
                const groupRef = collectionGroup(firestore, collectionId);
                this.queryRef = query(groupRef as Query<T>, ...queryConstraints);

                onSnapshot(
                    this.queryRef,
                    (snapshot) => {
                        this._data = snapshot.docs.map(doc => ({
                            id: doc.id,
                            path: doc.ref.path,
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

    /** Gets current collection group data */
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

    /** Checks if collection group is empty */
    get empty(): boolean {
        return this._data.length === 0;
    }

    /** Gets number of documents in collection group */
    get size(): number {
        return this._data.length;
    }

    /**
     * Gets query reference
     * @throws {Error} If query reference is not available
     */
    get ref(): Query<T> {
        if (!this.queryRef) {
            throw new Error("Query reference is not available");
        }
        return this.queryRef;
    }
}

/**
 * Creates a collection group subscription
 * @template T Collection document type
 * @param {string} collectionId Collection ID to query across all documents
 * @param {...QueryConstraint[]} queryConstraints Query constraints
 * @returns {FirekitCollectionGroup<T>} Collection group subscription instance
 * 
 * @example
 * ```typescript
 * interface Comment {
 *   id: string;
 *   text: string;
 *   userId: string;
 * }
 * 
 * const allComments = firekitCollectionGroup<Comment>('comments',
 *   where('userId', '==', currentUserId),
 *   orderBy('createdAt', 'desc')
 * );
 * ```
 */
export function firekitCollectionGroup<T extends DocumentData>(
    collectionId: string,
    ...queryConstraints: QueryConstraint[]
): FirekitCollectionGroup<T> {
    return new FirekitCollectionGroup<T>(collectionId, ...queryConstraints);
}