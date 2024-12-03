import { doc, getDoc, onSnapshot, type DocumentReference, type DocumentData } from "firebase/firestore";
import { firebaseService } from "../firebase.js";
import { browser } from "$app/environment";

class FirekitAwaitableDoc<T> {
    private _data = $state<T | null>(null);
    private _loading = $state(true);
    private _error = $state<Error | null>(null);
    private docRef: DocumentReference<T> | null = null;

    constructor(ref: string | DocumentReference<T>, startWith?: T) {
        this._data = startWith ?? null;

        if (browser) {
            this.initializeDoc(ref);
        }
    }

    private async initializeDoc(ref: string | DocumentReference<T>,) {
        try {
            const firestore = firebaseService.getDbInstance();
            this.docRef = typeof ref === "string"
                ? (doc(firestore, ref) as DocumentReference<T>)
                : ref;

            // Initial fetch
            const snapshot = await getDoc(this.docRef);
            this._data = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as T : null;

            // Setup real-time updates
            onSnapshot(
                this.docRef,
                (snapshot) => {
                    this._data = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as T : null;
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

    async getData(): Promise<T | null> {
        if (!this.docRef) return null;
        const snapshot = await getDoc(this.docRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as T : null;
    }

    get data() {
        return this._data;
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }

}

export function firekitAwaitableDoc<T extends DocumentData>(path: string, startWith?: T) {
    return new FirekitAwaitableDoc<T>(path, startWith);
}