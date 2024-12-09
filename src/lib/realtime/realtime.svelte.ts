import { ref, onValue, push, set, update, remove, type DatabaseReference, type DataSnapshot } from "firebase/database";
import { firebaseService } from "../firebase.js";
import { browser } from "$app/environment";

class FirekitRealtimeDB<T> {
    private _data = $state<T | null>(null);
    private _loading = $state(true);
    private _error = $state<Error | null>(null);
    private dbRef: DatabaseReference | null = null;
    private unsubscribe: (() => void) | null = null;

    constructor(path: string, startWith?: T) {
        this._data = startWith ?? null;

        if (browser) {
            this.initializeRealtimeDB(path);
        }
    }

    private initializeRealtimeDB(path: string) {
        try {
            const database = firebaseService.getDatabaseInstance();
            this.dbRef = ref(database, path);

            this.unsubscribe = onValue(
                this.dbRef,
                (snapshot: DataSnapshot) => {
                    this._data = snapshot.val();
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

    // Push new data to the list
    async push(data: T): Promise<string | null> {
        if (!this.dbRef) return null;
        const newRef = push(this.dbRef);
        await set(newRef, data);
        return newRef.key;
    }

    // Set data at the reference
    async set(data: T): Promise<void> {
        if (!this.dbRef) return;
        await set(this.dbRef, data);
    }

    // Update data at the reference
    async update(data: Partial<T>): Promise<void> {
        if (!this.dbRef) return;
        await update(this.dbRef, data);
    }

    // Remove data at the reference
    async remove(): Promise<void> {
        if (!this.dbRef) return;
        await remove(this.dbRef);
    }

    // Getters for reactive state
    get data() {
        return this._data;
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }

    get ref() {
        if (!this.dbRef) {
            throw new Error("Database reference is not available");
        }
        return this.dbRef;
    }

    // Cleanup subscription
    dispose() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

/**
 * Creates a reactive Realtime Database reference
 * @param path Database path
 * @param startWith Optional initial data
 * @returns FirekitRealtimeDB instance
 */
export function firekitRealtimeDB<T>(path: string, startWith?: T) {
    return new FirekitRealtimeDB<T>(path, startWith);
}

/**
 * Creates a reactive Realtime Database list reference
 * Automatically converts the data into an array format
 * @param path Database path
 * @param startWith Optional initial array data
 * @returns FirekitRealtimeDB instance with array data
 */
export function firekitRealtimeList<T>(path: string, startWith: T[] = []) {
    // Convert initial array to Record format
    const startWithRecord = startWith.reduce((acc, item, index) => {
        acc[`key${index}`] = item;
        return acc;
    }, {} as Record<string, T>);

    return new class extends FirekitRealtimeDB<Record<string, T>> {
        private _list = $derived(
            this.data
                ? Object.entries(this.data).map(([key, value]) => ({
                    id: key,
                    ...value,
                }))
                : []
        );

        get list() {
            return this._list;
        }
    }(path, startWithRecord);
}