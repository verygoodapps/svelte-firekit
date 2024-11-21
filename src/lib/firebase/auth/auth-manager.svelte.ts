import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { firebaseService } from "$lib/firebase/firebase.js";
import { toast } from "svelte-sonner";
import {
  onAuthStateChanged,
  updateCurrentUser,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
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
import { firekitAuth } from "./auth.js";

type UserClaims = Record<string, any>;
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
interface GuardConfig {
  authRequired?: boolean;
  redirectTo?: string;
  requiredClaims?: string[];
  requiredData?: (data: DocumentData | null) => boolean;
  allowIf?: (manager: FirekitAuthManager) => boolean;
  redirectParams?: Record<string, string>;
}

export class FirekitAuthManager {
  private static instance: FirekitAuthManager;

  // User-related states
  private _user: User | null | undefined = $state();
  private _userData: UserData | null = $state(null);
  private _claims: UserClaims = $state({});
  private _initialized = $state(false);
  private _initPromise: Promise<void> | null = null;

  // Auth-Guard related states
  private _loading = $state(true);
  private _error = $state<Error | null>(null);
  private _lastValidationTime = 0;
  private readonly VALIDATION_THROTTLE = 1000; // 1 second

  // Derived states
  readonly isLoggedIn = $derived(Boolean(this._user));
  readonly uid = $derived(this._user?.uid);
  readonly email = $derived(this._user?.email);
  readonly displayName = $derived(this._user?.displayName);
  readonly photoURL = $derived(this._user?.photoURL);
  readonly emailVerified = $derived(this._user?.emailVerified);
  readonly claims = $derived(this._claims);
  readonly data = $derived(this._userData);
  readonly initialized = $derived(this._initialized);

  private constructor() {
    if (browser) {
      this.initialize();
    }
  }

  static getInstance(): FirekitAuthManager {
    if (!FirekitAuthManager.instance) {
      FirekitAuthManager.instance = new FirekitAuthManager();
    }
    return FirekitAuthManager.instance;
  }

  private async initialize(): Promise<void> {
    if (this._initialized) return;

    this._initPromise = new Promise((resolve) => {
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

  private async loadUserData() {
    if (!this._user?.uid) return;

    const docRef = doc(firebaseService.getDb(), "users", this._user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this._userData = docSnap.data() as UserData;
    } else {
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

  async updateEmailUser(email: string) {
    if (!this._user) throw new Error("No authenticated user");
    try {
      await updateEmail(this._user, email);
      await this.updateUserData({ email });

      toast.success("Email updated successfully!", {
        description:
          "Please note that you will be logged out, and you will need to log in again using your new email address.",
      });
      setTimeout(async () => {
        await firekitAuth.logOut();
      }, 4500);
    } catch (error) {
      toast.error(error.message);
    }
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
    const updateData = { ...data, updatedAt: new Date() };

    await updateDoc(docRef, updateData);
    await this.loadUserData();
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
    await this.loadUserData();
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

  private shouldThrottleValidation(): boolean {
    const now = Date.now();
    if (now - this._lastValidationTime < this.VALIDATION_THROTTLE) {
      return true;
    }
    this._lastValidationTime = now;
    return false;
  }

  private async handleRedirect(
    redirectTo: string,
    params?: Record<string, string>
  ): Promise<void> {
    const url = new URL(redirectTo, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    await goto(url.toString());
  }

  private async validateClaims(
    requiredClaims: string[],
    userClaims?: UserClaims
  ): Promise<boolean> {
    if (!requiredClaims.length) return true;
    if (!userClaims) return false;

    return requiredClaims.every((claim) => userClaims[claim]);
  }

  async validateAuth({
    authRequired = true,
    redirectTo = "/login",
    requiredClaims = [],
    requiredData,
    allowIf,
    redirectParams,
  }: GuardConfig = {}): Promise<boolean> {
    if (!browser) return true;
    if (this.shouldThrottleValidation()) return true;

    try {
      this._loading = true;
      this._error = null;
      await this.waitForInit();

      const isAuthenticated = this.isLoggedIn;

      if (authRequired && !isAuthenticated) {
        await this.handleRedirect(redirectTo, {
          ...redirectParams,
          returnTo: window.location.pathname,
        });
        return false;
      }

      if (allowIf && !allowIf(this)) {
        await this.handleRedirect(redirectTo, redirectParams);
        return false;
      }

      if (requiredClaims.length > 0) {
        const userClaims = await firekitAuthManager.user?.getIdTokenResult();
        const hasClaims = await this.validateClaims(
          requiredClaims,
          userClaims?.claims
        );
        if (!hasClaims) {
          await this.handleRedirect(redirectTo, redirectParams);
          return false;
        }
      }

      if (requiredData && !requiredData(this._userData)) {
        await this.handleRedirect(redirectTo, redirectParams);
        return false;
      }

      return true;
    } catch (error) {
      this._error = error instanceof Error ? error : new Error(String(error));
      return false;
    } finally {
      this._loading = false;
    }
  }

  async requireAuth(
    redirectTo = "/login",
    redirectParams?: Record<string, string>
  ) {
    return this.validateAuth({
      authRequired: true,
      redirectTo,
      redirectParams,
    });
  }

  async requireNoAuth(
    redirectTo = "/dashboard",
    redirectParams?: Record<string, string>
  ) {
    return this.validateAuth({
      authRequired: false,
      redirectTo,
      redirectParams,
    });
  }

  async requireClaims(
    claims: string[],
    redirectTo = "/login",
    redirectParams?: Record<string, string>
  ) {
    return this.validateAuth({
      requiredClaims: claims,
      redirectTo,
      redirectParams,
    });
  }

  async requireData(
    validator: (data: DocumentData | null) => boolean,
    redirectTo = "/login",
    redirectParams?: Record<string, string>
  ) {
    return this.validateAuth({
      requiredData: validator,
      redirectTo,
      redirectParams,
    });
  }

  get loading() {
    return this._loading;
  }

  get error() {
    return this._error;
  }
}

export const firekitAuthManager = FirekitAuthManager.getInstance();
