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
} from "firebase/firestore";
import { firebaseService } from "../firebase.js";
import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte.js";

class FirekitDocumentMutations {
  constructor() {}

  async add<T extends DocumentData>(
    collectionPath: string,
    data: WithFieldValue<T>,
    options: { timestamps?: boolean } = { timestamps: true }
  ) {
    const firestore = firebaseService.getDb();
    const colRef = collection(firestore, collectionPath);

    const dataToAdd = {
      ...data,
      ...(options.timestamps && {
        createdAt: serverTimestamp(),
        createdBy: firekitAuthManager.uid,
        updatedAt: serverTimestamp(),
        updatedBy: firekitAuthManager.uid,
      }),
    };

    return addDoc(colRef, dataToAdd);
  }

  async set<T extends DocumentData>(
    path: string,
    data: WithFieldValue<T>,
    options: { merge?: boolean; timestamps?: boolean } = {
      merge: false,
      timestamps: true,
    }
  ) {
    const firestore = firebaseService.getDb();
    const docRef = doc(collection(firestore, path));

    const dataToSet = {
      ...data,
      ...(options.timestamps && {
        createdAt: serverTimestamp(),
        createdBy: firekitAuthManager.uid,
        updatedAt: serverTimestamp(),
        updatedBy: firekitAuthManager.uid,
      }),
      uid: docRef.id,
    };

    await setDoc(docRef, dataToSet, { merge: options.merge });
    return docRef.id;
  }

  async update<T extends DocumentData>(
    path: string,
    data: PartialWithFieldValue<T>,
    options: { timestamps?: boolean } = { timestamps: true }
  ) {
    const firestore = firebaseService.getDb();
    const docRef = doc(firestore, path);

    const dataToUpdate = {
      ...data,
      ...(options.timestamps && {
        updatedAt: serverTimestamp(),
        updatedBy: firekitAuthManager.uid,
      }),
    };

    return updateDoc(docRef, dataToUpdate);
  }

  async delete(path: string) {
    const firestore = firebaseService.getDb();
    const docRef = doc(firestore, path);
    return deleteDoc(docRef);
  }

  async exists(path: string): Promise<boolean> {
    const firestore = firebaseService.getDb();
    const docRef = doc(firestore, path);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }
}

export const firekitDocMutations = new FirekitDocumentMutations();
