import { collection, query, onSnapshot, type Query, type CollectionReference, type DocumentData, type QueryConstraint } from "firebase/firestore";
import { firebaseService } from "../firebase.js";
import { browser } from "$app/environment";

class FirekitCollection<T> {
    private _data = $state<T[]>([]);
    private _loading = $state(true);
    private _error = $state<Error | null>(null);
    private colRef: CollectionReference<T> | null = null;
    private queryRef: Query<T> | null = null;

    constructor(path: string, ...queryConstraints: QueryConstraint[]) {
        if (browser) {
            try {
                const firestore = firebaseService.getDb();
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

    get data() {
        return this._data;
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }

    get empty() {
        return this._data.length === 0;
    }

    get size() {
        return this._data.length;
    }

    get ref() {
        if (!this.colRef) {
            throw new Error("Collection reference is not available");
        }
        return this.colRef;
    }
}

export function firekitCollection<T extends DocumentData>(path: string, ...queryConstraints: QueryConstraint[]) {
    return new FirekitCollection<T>(path, ...queryConstraints);
}