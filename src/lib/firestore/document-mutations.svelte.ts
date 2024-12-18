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
import { firekitUser } from "$lib/auth/user.svelte.js";

interface MutationResponse<T> {
  success: boolean;
  data?: T;
  id?: string;
  error?: {
    code: string;
    message: string;
  };
}

interface MutationOptions {
  timestamps?: boolean;
  merge?: boolean;
  customId?: string;
}

class FirekitDocumentMutations {
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
        dataToAdd = { ...dataToAdd, id: docRef.id }; // Agregar el id al documento
        await setDoc(docRef, dataToAdd);
      } else {
        docRef = await addDoc(colRef, dataToAdd) as DocumentReference<T>;
        dataToAdd = { ...dataToAdd, id: docRef.id }; // Agregar el id al documento
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

export const firekitDocMutations = new FirekitDocumentMutations();