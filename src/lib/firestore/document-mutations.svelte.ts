/**
 * @module FirekitDocumentMutations
 */

import {
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  collection,
  serverTimestamp,
  type DocumentData,
  type WithFieldValue,
  type PartialWithFieldValue,
  type DocumentReference,
} from "firebase/firestore";
import { firebaseService } from "../firebase.js";
import { firekitUser } from "../auth/user.svelte.js";

/**
 * Response structure for document mutations
 * @interface MutationResponse
 * @template T Document data type
 */
interface MutationResponse<T> {
  /** Operation success status */
  success: boolean;
  /** Document data */
  data?: T;
  /** Document ID */
  id?: string;
  /** Error details if operation failed */
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Options for document mutations
 * @interface MutationOptions
 */
interface MutationOptions {
  /** Whether to include timestamp fields */
  timestamps?: boolean;
  /** Whether to merge data in set operations */
  merge?: boolean;
  /** Custom document ID for add operations */
  customId?: string;
}

/**
 * Manages Firestore document mutations with automatic timestamps and error handling
 * @class
 * @example
 * ```typescript
 * // Add a new document
 * const result = await firekitDocMutations.add('users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 * 
 * // Update a document
 * await firekitDocMutations.update('users/123', {
 *   name: 'Jane Doe'
 * });
 * 
 * // Delete a document
 * await firekitDocMutations.delete('users/123');
 * ```
 */
class FirekitDocumentMutations {
  /**
   * Generates timestamp data for document mutations
   * @private
   * @param {boolean} [isNew=true] Whether this is a new document
   * @returns {Record<string, any>} Timestamp data
   */
  private getTimestampData(isNew: boolean = true) {
    const timestamps: Record<string, any> = {
      updatedAt: serverTimestamp(),
      updatedBy: firekitUser.uid,
    };

    if (isNew) {
      timestamps.createdAt = serverTimestamp();
      timestamps.createdBy = firekitUser.uid;
    }

    return timestamps;
  }

  /**
   * Handles and formats mutation errors
   * @private
   * @param {any} error Error object
   * @returns {MutationResponse<never>} Formatted error response
   */
  private handleError(error: any): MutationResponse<never> {
    console.error('Firestore mutation error:', error);
    return {
      success: false,
      error: {
        code: error.code || 'unknown_error',
        message: error.message || 'An unknown error occurred'
      }
    };
  }

  /**
   * Adds a new document to a collection
   * @template T Document data type
   * @param {string} collectionPath Collection path
   * @param {WithFieldValue<T>} data Document data
   * @param {MutationOptions} [options] Mutation options
   * @returns {Promise<MutationResponse<T>>} Mutation response
   * 
   * @example
   * ```typescript
   * const result = await firekitDocMutations.add('users', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * }, { timestamps: true, customId: 'custom-id' });
   * ```
   */
  async add<T extends DocumentData>(
    collectionPath: string,
    data: WithFieldValue<T>,
    options: MutationOptions = { timestamps: true }
  ): Promise<MutationResponse<T>> {
    try {
      const firestore = firebaseService.getDbInstance();
      const colRef = collection(firestore, collectionPath);

      let dataToAdd = {
        ...data,
        ...(options.timestamps && this.getTimestampData()),
      };

      let docRef: DocumentReference<T>;
      if (options.customId) {
        docRef = doc(colRef, options.customId) as DocumentReference<T>;
        dataToAdd = { ...dataToAdd, id: docRef.id };
        await setDoc(docRef, dataToAdd);
      } else {
        docRef = await addDoc(colRef, dataToAdd) as DocumentReference<T>;
        dataToAdd = { ...dataToAdd, id: docRef.id };
        await setDoc(docRef, dataToAdd);
      }

      return {
        success: true,
        id: docRef.id,
        data: { ...dataToAdd, id: docRef.id } as T
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Sets document data at specified path
   * @template T Document data type
   * @param {string} path Document path
   * @param {WithFieldValue<T>} data Document data
   * @param {MutationOptions} [options] Mutation options
   * @returns {Promise<MutationResponse<T>>} Mutation response
   * 
   * @example
   * ```typescript
   * const result = await firekitDocMutations.set('users/123', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * }, { merge: true });
   * ```
   */
  async set<T extends DocumentData>(
    path: string,
    data: WithFieldValue<T>,
    options: MutationOptions = { merge: false, timestamps: true }
  ): Promise<MutationResponse<T>> {
    try {
      const firestore = firebaseService.getDbInstance();

      let docRef: DocumentReference<T>;
      if (path.includes('/')) {
        docRef = doc(firestore, path) as DocumentReference<T>;
      } else {
        const [collectionPath, documentId] = path.split('/');
        docRef = doc(collection(firestore, collectionPath), documentId) as DocumentReference<T>;
      }

      const dataToSet = {
        ...data,
        ...(options.timestamps && this.getTimestampData()),
        id: docRef.id,
      } as WithFieldValue<T>;

      await setDoc(docRef, dataToSet, { merge: options.merge });

      return {
        success: true,
        id: docRef.id,
        data: dataToSet as T
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Updates a document at specified path
   * @template T Document data type
   * @param {string} path Document path
   * @param {PartialWithFieldValue<T>} data Update data
   * @param {MutationOptions} [options] Mutation options
   * @returns {Promise<MutationResponse<Partial<T>>>} Mutation response
   * 
   * @example
   * ```typescript
   * const result = await firekitDocMutations.update('users/123', {
   *   name: 'Jane Doe'
   * });
   * ```
   */
  async update<T extends DocumentData>(
    path: string,
    data: PartialWithFieldValue<T>,
    options: MutationOptions = { timestamps: true }
  ): Promise<MutationResponse<Partial<T>>> {
    try {
      const firestore = firebaseService.getDbInstance();
      const docRef = doc(firestore, path) as DocumentReference<T>;

      const dataToUpdate = {
        ...data,
        ...(options.timestamps && this.getTimestampData(false)),
      } as PartialWithFieldValue<T>;

      await updateDoc(docRef, dataToUpdate);

      return {
        success: true,
        id: docRef.id,
        data: dataToUpdate
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Deletes a document at specified path
   * @param {string} path Document path
   * @returns {Promise<MutationResponse<void>>} Mutation response
   * 
   * @example
   * ```typescript
   * const result = await firekitDocMutations.delete('users/123');
   * ```
   */
  async delete(path: string): Promise<MutationResponse<void>> {
    try {
      const firestore = firebaseService.getDbInstance();
      const docRef = doc(firestore, path);
      await deleteDoc(docRef);

      return {
        success: true,
        id: docRef.id
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Checks if a document exists at specified path
   * @param {string} path Document path
   * @returns {Promise<boolean>} Whether document exists
   * 
   * @example
   * ```typescript
   * const exists = await firekitDocMutations.exists('users/123');
   * ```
   */
  async exists(path: string): Promise<boolean> {
    try {
      const firestore = firebaseService.getDbInstance();
      const docRef = doc(firestore, path);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking document existence:', error);
      return false;
    }
  }

  /**
   * Gets a document at specified path
   * @template T Document data type
   * @param {string} path Document path
   * @returns {Promise<MutationResponse<T>>} Mutation response with document data
   * 
   * @example
   * ```typescript
   * const result = await firekitDocMutations.getDoc<UserData>('users/123');
   * if (result.success) {
   *   console.log(result.data);
   * }
   * ```
   */
  async getDoc<T extends DocumentData>(path: string): Promise<MutationResponse<T>> {
    try {
      const firestore = firebaseService.getDbInstance();
      const docRef = doc(firestore, path) as DocumentReference<T>;
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'not_found',
            message: 'Document does not exist'
          }
        };
      }

      return {
        success: true,
        id: docSnap.id,
        data: { id: docSnap.id, ...docSnap.data() } as T
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

/**
 * Pre-initialized instance of FirekitDocumentMutations
 * @const
 * @type {FirekitDocumentMutations}
 */
export const firekitDocMutations = new FirekitDocumentMutations();