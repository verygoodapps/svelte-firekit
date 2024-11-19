import { browser } from "$app/environment";
import { firebaseService } from "$lib/firebase/firebase.js";
import {
  onAuthStateChanged,
  updateCurrentUser,
  updateEmail,
  updatePassword,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";

interface UserClaims {
  [key: string]: any;
  admin?: boolean;
  premium?: boolean;
}

interface UserData extends DocumentData {
  displayName?: string;
  email?: string;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isProfileComplete?: boolean;
  role?: string;
  settings?: Record<string, any>;
  [key: string]: any;
}

export class FirekitUser {
  private static instance: FirekitUser;
  private _user: User | null | undefined = $state();
  private _userData: UserData | null = $state(null);
  private _claims: UserClaims = $state({});
  private _initialized = $state(false);
  readonly isLoggedIn = $derived(Boolean(this._user));
  readonly uid = $derived(this._user?.uid);
  readonly email = $derived(this._user?.email);
  readonly displayName = $derived(this._user?.displayName);
  readonly photoURL = $derived(this._user?.photoURL);
  readonly emailVerified = $derived(this._user?.emailVerified);
  readonly claims = $derived(this._claims);
  readonly data = $derived(this._userData);
  private _initPromise: Promise<void> | null = null;

  constructor() {
    if (browser) {
      // Add this check
      this.initialize();
    }
  }

  private async initialize(): Promise<void> {
    if (this._initialized) return;
    return new Promise((resolve) => {
      onAuthStateChanged(firebaseService.getAuthInstance(), async (user) => {
        this._user = user;
        if (user) {
          await Promise.all([this.loadUserData(), this.loadUserClaims()]);
        } else {
          this._userData = null;
          this._claims = {};
        }
        this._initialized = true;
        resolve();
      });
    });
  }

  async waitForInit(): Promise<void> {
    if (this._initialized) return;
    return this._initPromise || Promise.resolve();
  }
  static getInstance(): FirekitUser {
    if (!FirekitUser.instance) {
      FirekitUser.instance = new FirekitUser();
    }
    return FirekitUser.instance;
  }

  private async loadUserData() {
    if (!this._user?.uid) return;

    const docRef = doc(firebaseService.getDb(), "users", this._user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this._userData = docSnap.data() as UserData;
    } else {
      // Initialize user document if it doesn't exist
      const initialData: UserData = {
        displayName: this._user.displayName || "",
        email: this._user.email || "",
        photoURL: this._user.photoURL || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        isProfileComplete: false,
      };
      await this.saveUserData(initialData);
    }
  }

  private async loadUserClaims() {
    if (!this._user) return;

    const tokenResult = await this._user.getIdTokenResult();
    this._claims = tokenResult.claims as UserClaims;
  }

  get user(): User | null | undefined {
    return this._user;
  }

  async updateEmail(email: string) {
    if (!this._user) throw new Error("No authenticated user");
    await updateEmail(this._user, email);
  }

  async updatePassword(password: string) {
    if (!this._user) throw new Error("No authenticated user");
    await updatePassword(this._user, password);
  }

  async updateProfileInfo({
    displayName,
    photoURL,
  }: {
    displayName?: string;
    photoURL?: string;
  }) {
    if (!this._user) throw new Error("No authenticated user");
    if (!displayName && !photoURL) return;
    if (displayName) await updateProfile(this._user, { displayName });
    if (photoURL) await updateProfile(this._user, { photoURL });
  }

  async updateUserData(data: Partial<UserData>) {
    if (!this._user?.uid) throw new Error("No authenticated user");

    const docRef = doc(firebaseService.getDb(), "users", this._user.uid);
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    await updateDoc(docRef, updateData);
    await this.loadUserData(); // Reload user data
  }

  async saveUserData(data: UserData) {
    if (!this._user?.uid) throw new Error("No authenticated user");

    const docRef = doc(firebaseService.getDb(), "users", this._user.uid);
    const saveData = {
      ...data,
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await setDoc(docRef, saveData);
    await this.loadUserData(); // Reload user data
  }

  hasRequiredClaims(requiredClaims: string[]): boolean {
    return requiredClaims.every((claim) => this._claims[claim]);
  }

  isAdmin(): boolean {
    return Boolean(this._claims.admin);
  }

  isPremium(): boolean {
    return Boolean(this._claims.premium);
  }
}

export const firekitUser = FirekitUser.getInstance();
