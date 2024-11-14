import { ref, uploadBytesResumable, getDownloadURL, type StorageReference, type UploadTask, type UploadTaskSnapshot } from "firebase/storage";

import { browser } from "$app/environment";
import { firebaseService } from "../firebase.js";

class FirekitUploadTask {
    private _progress = $state(0);
    private _error = $state<Error | null>(null);
    private _snapshot = $state<UploadTaskSnapshot | null>(null);
    private _downloadURL = $state<string | null>(null);
    private _completed = $state(false);
    private uploadTask: UploadTask | null = null;
    private storageRef: StorageReference | null = null;

    constructor(path: string, file: File) {
        if (browser) {
            this.initializeUpload(path, file);
        }
    }

    private initializeUpload(path: string, file: File) {
        try {
            const storage = firebaseService.getStorageInstance();
            this.storageRef = ref(storage, path);
            this.uploadTask = uploadBytesResumable(this.storageRef, file);

            this.uploadTask.on(
                'state_changed',
                (snapshot) => {
                    this._snapshot = snapshot;
                    this._progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    this._error = error;
                },
                async () => {
                    if (this.storageRef) {
                        this._downloadURL = await getDownloadURL(this.storageRef);
                        this._completed = true;
                    }
                }
            );
        } catch (error) {
            this._error = error as Error;
        }
    }

    pause() {
        this.uploadTask?.pause();
    }

    resume() {
        this.uploadTask?.resume();
    }

    cancel() {
        this.uploadTask?.cancel();
    }

    get progress() {
        return this._progress;
    }

    get error() {
        return this._error;
    }

    get snapshot() {
        return this._snapshot;
    }

    get downloadURL() {
        return this._downloadURL;
    }

    get completed() {
        return this._completed;
    }
}

export function firekitUploadTask(path: string, file: File) {
    return new FirekitUploadTask(path, file);
}