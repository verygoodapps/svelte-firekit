import { ref, getDownloadURL, type StorageReference } from "firebase/storage";
import { browser } from "$app/environment";
import { firebaseService } from "../firebase.js";

class FirekitDownloadUrl {
    private _url = $state<string | null>(null);
    private _loading = $state(true);
    private _error = $state<Error | null>(null);
    private storageRef: StorageReference | null = null;

    constructor(path: string) {
        if (browser) {
            this.initializeDownload(path);
        }
    }

    private async initializeDownload(path: string) {
        try {
            const storage = firebaseService.getStorageInstance();
            this.storageRef = ref(storage, path);
            this._url = await getDownloadURL(this.storageRef);
            this._loading = false;
        } catch (error) {
            this._error = error as Error;
            this._loading = false;
        }
    }

    get url() {
        return this._url;
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
            this.initializeDownload(this.storageRef.fullPath);
        }
    }
}

export function firekitDownloadUrl(path: string) {
    return new FirekitDownloadUrl(path);
}