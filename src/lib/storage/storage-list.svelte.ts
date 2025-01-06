/**
 * @module FirekitStorageList
 */

import { ref, listAll, type StorageReference, type ListResult } from "firebase/storage";
import { browser } from "$app/environment";
import { firebaseService } from "../firebase.js";

/**
 * Manages Firebase Storage directory listing with reactive state
 * @class
 * 
 * @example
 * ```typescript
 * // List contents of images directory
 * const imagesList = firekitStorageList('images');
 * 
 * // Access items and folders
 * console.log('Files:', imagesList.items);
 * console.log('Folders:', imagesList.prefixes);
 * ```
 */
class FirekitStorageList {
    /** List of files in directory */
    private _items = $state<StorageReference[]>([]);
    /** List of subdirectories */
    private _prefixes = $state<StorageReference[]>([]);
    /** Loading state */
    private _loading = $state(true);
    /** Error state */
    private _error = $state<Error | null>(null);
    /** Storage reference */
    private storageRef: StorageReference | null = null;

    /**
     * Creates a storage directory lister
     * @param {string} path Storage directory path
     * 
     * @example
     * ```typescript
     * const list = new FirekitStorageList('uploads/2024');
     * ```
     */
    constructor(path: string) {
        if (browser) {
            this.initializeList(path);
        }
    }

    /**
     * Initializes directory listing
     * @private
     * @param {string} path Storage directory path
     */
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

    /** Gets list of files */
    get items(): StorageReference[] {
        return this._items;
    }

    /** Gets list of subdirectories */
    get prefixes(): StorageReference[] {
        return this._prefixes;
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
     * Refreshes directory listing
     * Useful when directory contents have changed
     * 
     * @example
     * ```typescript
     * // Refresh after upload
     * await uploadFile('images/new.jpg');
     * imagesList.refresh();
     * ```
     */
    refresh(): void {
        if (this.storageRef) {
            this._loading = true;
            this._error = null;
            this.initializeList(this.storageRef.fullPath);
        }
    }
}

/**
 * Creates a storage directory lister
 * @param {string} path Storage directory path
 * @returns {FirekitStorageList} Storage list instance
 * 
 * @example
 * ```typescript
 * const documents = firekitStorageList('documents');
 * 
 * // Use in template
 * {#if documents.loading}
 *   <p>Loading...</p>
 * {:else}
 *   <ul>
 *     {#each documents.items as item}
 *       <li>{item.name}</li>
 *     {/each}
 *   </ul>
 * {/if}
 * ```
 */
export function firekitStorageList(path: string): FirekitStorageList {
    return new FirekitStorageList(path);
}