// firebaseAuthService.ts
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuthInstance, getDb } from './firebase.js';
import { goto } from '$app/navigation';

const auth = getAuthInstance();
const firestore = getDb();

/**
 * Handles Google Sign-In.
 */
export async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await updateUserInFirestore(result.user);
}

/**
 * Signs in with email and password.
 */
export async function signInWithEmail(email: string, password: string): Promise<void> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await updateUserInFirestore(result.user);
}

/**
 * Registers a new user and updates Firestore.
 */
export async function registerWithEmail(
    email: string,
    password: string,
    displayName: string
): Promise<void> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    if (user) {
        await updateProfile(user, { displayName });
        await updateUserInFirestore(user);
        await sendEmailVerification(user);
    }
}

/**
 * Updates Firestore with user data.
 */
async function updateUserInFirestore(user: User): Promise<void> {
    const ref = doc(firestore, 'users', user.uid);
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

/**
 * Signs out the user and redirects.
 */
export async function logOut(): Promise<void> {
    await signOut(auth);
    goto('/sign-in');
}

/**
 * Sends a password reset email.
 */
export async function sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
}

/**
 * Verifies email for current user.
 */
export async function sendEmailVerificationToUser(): Promise<void> {
    if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
    }
}

/**
 * Updates user profile with display name and photo URL.
 */
export async function updateUserProfile(profile: { displayName?: string; photoURL?: string }): Promise<void> {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, profile);
        await updateUserInFirestore(auth.currentUser);
    }
}

/**
 * Updates password for current user.
 */
export async function updateUserPassword(newPassword: string): Promise<void> {
    if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
    }
}


/**
 * Checks onboarding completion by verifying profile data.
 */
export async function checkOnboardingCompletion(uid: string): Promise<void> {
    const profileDoc = await getDoc(doc(firestore, 'profiles', uid));
    if (!profileDoc.exists() || !profileDoc.data()?.username) {
        alert("Please complete onboarding");
        goto('/onboarding');
    }
}
