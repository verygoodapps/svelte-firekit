/**
 * @module FirekitDownloadUrl
 */

import { ref, getDownloadURL, type StorageReference } from "firebase/storage";
import { browser } from "$app/environment";
import { firebaseService } from "../firebase.js";

/**
 * Manages Firebase Storage download URL fetching with reactive state
 * @class
 * 
 * @example
 * ```typescript
 * // Get download URL for image
 * const imageUrl = firekitDownloadUrl('images/photo.jpg');
 * 
 * // Access reactive state
 * if (imageUrl.loading) {
 *   console.log('Loading URL...');
 * } else if (imageUrl.url) {
 *   console.log('Download URL:', imageUrl.url);
 * }
 * ```
 */
class FirekitDownloadUrl {
    /** Current download URL */
    private _url = $state<string | null>(null);
    /** Loading state */
    private _loading = $state(true);
    /** Error state */
    private _error = $state<Error | null>(null);
    /** Storage reference */
    private storageRef: StorageReference | null = null;

    /**
     * Creates a download URL fetcher
     * @param {string} path Storage path to file
     * 
     * @example
     * ```typescript
     * const url = new FirekitDownloadUrl('documents/file.pdf');
     * ```
     */
    constructor(path: string) {
        if (browser) {
            this.initializeDownload(path);
        }
    }

    /**
     * Initializes download URL fetching
     * @private
     * @param {string} path Storage path
     */
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

    /** Gets current download URL */
    get url(): string | null {
        return this._url;
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
     * Refreshes download URL
     * Useful when file content has changed
     * 
     * @example
     * ```typescript
     * // Refresh URL after file update
     * await uploadNewVersion();
     * imageUrl.refresh();
     * ```
     */
    refresh(): void {
        if (this.storageRef) {
            this._loading = true;
            this._error = null;
            this.initializeDownload(this.storageRef.fullPath);
        }
    }
}

/**
 * Creates a download URL fetcher
 * @param {string} path Storage path to file
 * @returns {FirekitDownloadUrl} Download URL fetcher instance
 * 
 * @example
 * ```typescript
 * const imageUrl = firekitDownloadUrl('images/profile.jpg');
 * 
 * // Use in template
 * {#if imageUrl.loading}
 *   <p>Loading...</p>
 * {:else if imageUrl.url}
 *   <img src={imageUrl.url} alt="Profile" />
 * {/if}
 * ```
 */
export function firekitDownloadUrl(path: string): FirekitDownloadUrl {
    return new FirekitDownloadUrl(path);
}