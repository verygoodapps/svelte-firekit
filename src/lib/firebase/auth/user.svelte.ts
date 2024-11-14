import { firebaseService } from '$lib/firebase/firebase.js';
import { onAuthStateChanged, type User } from "firebase/auth";


export class FirekitUser {
    private static instance: FirekitUser;
    private _user: User | null | undefined = $state();
    readonly isLoggedIn = $derived(Boolean(this._user));
    readonly uid = $derived(this._user?.uid);
    readonly email = $derived(this._user?.email);
    readonly displayName = $derived(this._user?.displayName);
    readonly photoURL = $derived(this._user?.photoURL);
    readonly emailVerified = $derived(this._user?.emailVerified);
    constructor() {
        onAuthStateChanged(firebaseService.getAuthInstance(), (user) => (this._user = user));
    }

    static getInstance(): FirekitUser {
        if (!FirekitUser.instance) {
            FirekitUser.instance = new FirekitUser();
        }
        return FirekitUser.instance;
    }

    get user(): User | null | undefined {
        return this._user;
    }

}

export const firekitUser = new FirekitUser();