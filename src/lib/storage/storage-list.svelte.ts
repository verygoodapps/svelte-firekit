import { ref, listAll, type StorageReference, type ListResult } from "firebase/storage";
import { browser } from "$app/environment";
import { firebaseService } from "../firebase.js";

class FirekitStorageList {
    private _items = $state<StorageReference[]>([]);
    private _prefixes = $state<StorageReference[]>([]);
    private _loading = $state(true);
    private _error = $state<Error | null>(null);
    private storageRef: StorageReference | null = null;

    constructor(path: string) {
        if (browser) {
            this.initializeList(path);
        }
    }

    private async initializeList(path: string) {
        try {
            const storage = firebaseService.getStorageInstance();
            this.storageRef = ref(storage, path);
            const result: ListResult = await listAll(this.storageRef);

            this._items = result.items;
            this._prefixes = result.prefixes;
            this._loading = false;
        } catch (error) {
            this._error = error as Error;
            this._loading = false;
        }
    }

    get items() {
        return this._items;
    }

    get prefixes() {
        return this._prefixes;
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }

    refresh() {
        if (this.storageRef) {
            this._loading = true;
            this._error = null;
            this.initializeList(this.storageRef.fullPath);
        }
    }
}

export function firekitStorageList(path: string) {
    return new FirekitStorageList(path);
}