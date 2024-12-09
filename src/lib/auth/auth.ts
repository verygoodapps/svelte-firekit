import {
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    updatePassword,
    type User,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { firebaseService } from '../firebase.js';
import { firekitDocMutations } from '$lib/firestore/document-mutations.svelte.js';
 import { get, ref, set, update } from 'firebase/database';

class FirekitAuth {
    private static instance: FirekitAuth;
    private auth = firebaseService.getAuthInstance();
    private firestore = firebaseService.getDbInstance();

    private constructor() { }

    static getInstance(): FirekitAuth {
        if (!FirekitAuth.instance) {
            FirekitAuth.instance = new FirekitAuth();
        }
        return FirekitAuth.instance;
    }

   

    async signInWithGoogle(): Promise<void> {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(this.auth, provider);
        await this.updateUserInFirestore(result.user);
    }

    async signInWithEmail(email: string, password: string): Promise<void> {
        const result = await signInWithEmailAndPassword(this.auth, email, password);
        await this.updateUserInFirestore(result.user);
    }

    async registerWithEmail(email: string, password: string, displayName: string): Promise<void> {
        const result = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = result.user;
        if (user) {
            await updateProfile(user, { displayName });
            await this.updateUserInFirestore(user);
            await sendEmailVerification(user);
        }
    }

    private async updateUserInFirestore(user: User): Promise<void> {
        const ref = doc(this.firestore, 'users', user.uid);
        const userData = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
            providerId: user.providerId,
            providerData: user.providerData,
        };
        await setDoc(ref, userData, { merge: true });
    }

    async logOut(): Promise<void> {
        await signOut(this.auth);
    }

    async sendPasswordReset(email: string): Promise<void> {
        await sendPasswordResetEmail(this.auth, email);
    }

    async sendEmailVerificationToUser(): Promise<void> {
        if (this.auth.currentUser) {
            await sendEmailVerification(this.auth.currentUser);
        }
    }

    async updateUserProfile(profile: { displayName?: string; photoURL?: string }): Promise<void> {
        if (this.auth.currentUser) {
            await updateProfile(this.auth.currentUser, profile);
            await this.updateUserInFirestore(this.auth.currentUser);
        }
    }

   async updateUserPassword(newPassword: string, currentPassword: string) {
        if (!this.auth.currentUser) {
            throw new Error('No authenticated user found.');
        }

        try {
            await this.reauthenticateUser(currentPassword);

            await updatePassword(this.auth.currentUser, newPassword);

            return { success: true, message: 'Password successfully updated.' };
        } catch (error: any) {
            if (error.code === 'auth/wrong-password') {
                return { success: false, code: error.code, message: 'Reauthentication failed: incorrect password.' };
            }
            return { success: false, code: error.code || 'unknown_error', message: `Failed to update password: ${error.message || 'Unknown error occurred.'}` };
        }
    }

    async reauthenticateUser(currentPassword: string) {
        if (!this.auth.currentUser || !this.auth.currentUser.email) {
            throw new Error('No authenticated user or email unavailable.');
        }

        const credential = EmailAuthProvider.credential(
            this.auth.currentUser.email,
            currentPassword
        );

        try {
            await reauthenticateWithCredential(this.auth.currentUser, credential);
        } catch (error: any) {
            throw new Error(`Reauthentication failed: ${error.message || 'Unknown error occurred.'}`);
        }
    }

    async deleteUserAccount(): Promise<{ success: boolean; message: string }> {
        if (!this.auth.currentUser) {
            throw new Error('No authenticated user found.');
        }

        try {
            firekitDocMutations.delete(`users/${this.auth.currentUser.uid}`)
            await this.auth.currentUser.delete();
            return { success: true, message: 'Account successfully deleted.' };
        } catch (error: any) {
           throw new Error(error.message)
        }
    }


}

export const firekitAuth = FirekitAuth.getInstance();