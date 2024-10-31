import { getAuthInstance } from "$lib/firebase.js";
import { onAuthStateChanged, type User } from "firebase/auth";

export class FirebaseAuthUser {
    #currentUser: User | null | undefined = $state();

    constructor() {
        onAuthStateChanged(getAuthInstance(), (user) => this.#currentUser = user);
    }

    get isAuthenticated() {
        return this.currentUser !== null;
    }
    get isAnonymousUser() {
        return this.currentUser?.isAnonymous;
    }
    get userId() {
        return this.currentUser?.uid;
    }
    get currentUser() {
        return this.#currentUser;
    }
}

export const authUser = new FirebaseAuthUser();
