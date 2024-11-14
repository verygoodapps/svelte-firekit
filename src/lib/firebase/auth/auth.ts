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
    type User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseService } from '../firebase.js';

class FirekitAuth {
    private static instance: FirekitAuth;
    private auth = firebaseService.getAuthInstance();
    private firestore = firebaseService.getDb();

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
            phoneNumber: user.phoneNumber,
            providerData: user.providerData
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

    async updateUserPassword(newPassword: string): Promise<void> {
        if (this.auth.currentUser) {
            await updatePassword(this.auth.currentUser, newPassword);
        }
    }
}

export const firekitAuth = FirekitAuth.getInstance();