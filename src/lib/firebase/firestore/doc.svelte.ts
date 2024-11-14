import { doc, DocumentReference, onSnapshot } from "firebase/firestore";
import { firebaseService } from "../firebase.js";
import { browser } from "$app/environment";

class FirekitDoc<T> {
    private _data: T | null = $state(null);
    private _loading = $state(true);
    private _error = $state<Error | null>(null);
    private docRef: DocumentReference<T> | null = null;

    constructor(ref: string | DocumentReference<T>, startWith?: T) {
        this._data = startWith ?? null;

        if (browser) {
            try {
                const firestore = firebaseService.getDb();
                this.docRef = typeof ref === "string"
                    ? (doc(firestore, ref) as DocumentReference<T>)
                    : ref;
                onSnapshot(
                    this.docRef,
                    (snapshot) => {
                        this._data = (snapshot.data() as T) ?? null;
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

    get id() {
        return this.docRef?.id ?? '';
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }

    get ref() {
        if (this.docRef === null) {
            throw new Error("Document reference is not available yet.");
        }
        return this.docRef;
    }

    get exists() {
        return this._data !== null;
    }

}

export function firekitDoc<T>(ref: string | DocumentReference<T>, startWith?: T) {
    return new FirekitDoc(ref, startWith);
}