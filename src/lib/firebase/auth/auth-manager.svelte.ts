import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { firebaseService } from "$lib/firebase/firebase.js";
import { toast } from "svelte-sonner";
import {
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  updateProfile,
  sendEmailVerification,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";

// Types
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

interface AuthSession {
  lastActivity: number;
  deviceId: string;
  platform: string;
}

class AuthError extends Error {
  constructor(
    message: string,
    public code: string = 'unknown',
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class FirekitAuthManager {
  private static instance: FirekitAuthManager;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private activityInterval: ReturnType<typeof setInterval> | null = null;
  private _initPromise: Promise<void> | null = null;

  // State using Svelte 5 runes
  private _user: User | null | undefined = $state();
  private _userData: UserData | null = $state(null);
  private _claims: UserClaims = $state({});
  private _initialized = $state(false);
  private _loading = $state(true);
  private _error = $state<Error | null>(null);
  private _currentSession: AuthSession | null = $state(null);
  private _lastValidationTime = $state(0);

  // Derived state
  readonly isLoggedIn = $derived(Boolean(this._user));
  readonly uid = $derived(this._user?.uid);
  readonly email = $derived(this._user?.email);
  readonly displayName = $derived(this._user?.displayName);
  readonly photoURL = $derived(this._user?.photoURL);
  readonly emailVerified = $derived(this._user?.emailVerified);
  readonly claims = $derived(this._claims);
  readonly data = $derived(this._userData);
  readonly initialized = $derived(this._initialized);
  readonly loading = $derived(this._loading);
  readonly error = $derived(this._error);
  readonly sessionActive = $derived(Boolean(this._currentSession));

  private constructor() {
    if (browser) {
      this.initialize();
      this.setupActivityTracking();
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
      const auth = firebaseService.getAuthInstance();
      if (!auth) throw new AuthError('Firebase Auth not initialized', 'init_failed');

      onAuthStateChanged(auth, async (user) => {
        await this.handleAuthStateChange(user);
        resolve();
      });
    });
  }

  async waitForInit(): Promise<void> {
    if (this._initialized) return;
    return this._initPromise || Promise.resolve();
  }

  private async handleAuthStateChange(user: User | null): Promise<void> {
    this._loading = true;

    try {
      if (user) {
        this._user = user;
        await Promise.all([
          this.loadUserData(user.uid),
          this.loadUserClaims(user)
        ]);
        this.initializeSession();
      } else {
        this._user = null;
        this._userData = null;
        this._claims = {};
        this.clearSession();
      }

      this._initialized = true;
      this._error = null;
    } catch (error) {
      this.handleError(error);
    } finally {
      this._loading = false;
    }
  }

  private async loadUserData(uid: string): Promise<void> {
    const docRef = doc(firebaseService.getDb(), "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this._userData = docSnap.data() as UserData;
    } else {
      const initialData: UserData = {
        displayName: this._user?.displayName || "",
        email: this._user?.email || "",
        photoURL: this._user?.photoURL || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        isProfileComplete: false,
      };
      await this.saveUserData(initialData);
    }
  }

  private async loadUserClaims(user: User): Promise<void> {
    const tokenResult = await user.getIdTokenResult();
    this._claims = tokenResult.claims as UserClaims;
  }

  private setupActivityTracking(): void {
    if (browser) {
      ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(eventName => {
        window.addEventListener(eventName, () => this.updateLastActivity());
      });

      this.activityInterval = setInterval(() => this.checkSession(), 60000);
    }
  }

  private initializeSession(): void {
    this._currentSession = {
      lastActivity: Date.now(),
      deviceId: this.generateDeviceId(),
      platform: this.getPlatformInfo()
    };
  }

  private updateLastActivity(): void {
    if (this._currentSession) {
      this._currentSession.lastActivity = Date.now();
    }
  }

  private async checkSession(): Promise<void> {
    if (!this._currentSession) return;

    const inactiveTime = Date.now() - this._currentSession.lastActivity;
    if (inactiveTime > this.SESSION_TIMEOUT) {
      await this.handleSessionTimeout();
    }
  }

  private async handleSessionTimeout(): Promise<void> {
    toast.warning('Session expired due to inactivity', {
      description: 'Please log in again to continue.',
      duration: 5000
    });
    await this.logOut();
  }

  private clearSession(): void {
    this._currentSession = null;
    if (this.activityInterval) {
      clearInterval(this.activityInterval);
      this.activityInterval = null;
    }
  }

  private handleError(error: unknown): void {
    const authError = error instanceof AuthError
      ? error
      : new AuthError(
        error instanceof Error ? error.message : 'An unknown error occurred',
        'unknown',
        error instanceof Error ? error : undefined
      );

    this._error = authError;
    this._loading = false;

    console.error('[FirekitAuthManager]', authError);
  }

  private generateDeviceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getPlatformInfo(): string {
    if (!browser) return 'server';
    return `${navigator.platform} - ${navigator.userAgent}`;
  }

  private validateClaims(requiredClaims: string[], userClaims: UserClaims): boolean {
    return requiredClaims.every(claim => userClaims[claim]);
  }

  private async handleRedirect(redirectTo: string, params?: Record<string, string>): Promise<void> {
    const url = new URL(redirectTo, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    await goto(url.toString());
  }

  // Public Methods
  async validateAuth({
    authRequired = true,
    redirectTo = "/login",
    requiredClaims = [],
    requiredData,
    allowIf,
    redirectParams,
  }: GuardConfig = {}): Promise<boolean> {
    if (!browser) return true;

    const now = Date.now();
    if (now - this._lastValidationTime < 1000) return false;
    this._lastValidationTime = now;

    try {
      this._loading = true;
      this._error = null;
      await this.waitForInit();

      // Basic auth validation
      if (authRequired && !this._user) {
        await this.handleRedirect(redirectTo, {
          ...redirectParams,
          returnTo: window.location.pathname,
        });
        return false;
      }

      if (!authRequired && this._user) {
        await this.handleRedirect(redirectTo, redirectParams);
        return false;
      }

      // Custom conditions
      if (allowIf && !allowIf(this)) {
        await this.handleRedirect(redirectTo, redirectParams);
        return false;
      }

      // Claims validation
      if (requiredClaims.length > 0 && !this.validateClaims(requiredClaims, this._claims)) {
        await this.handleRedirect(redirectTo, redirectParams);
        return false;
      }

      // Data validation
      if (requiredData && !requiredData(this._userData)) {
        await this.handleRedirect(redirectTo, redirectParams);
        return false;
      }

      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    } finally {
      this._loading = false;
    }
  }

  async updateEmailUser(email: string) {
    if (!this._user) throw new AuthError("No authenticated user", "no_user");
    try {
      await updateEmail(this._user, email);
      await this.updateUserData({ email });

      toast.success("Email updated successfully!", {
        description:
          "Please note that you will be logged out, and you will need to log in again using your new email address.",
      });
      setTimeout(async () => {
        await this.logOut();
      }, 4500);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updatePassword(password: string) {
    if (!this._user) throw new AuthError("No authenticated user", "no_user");
    try {
      await updatePassword(this._user, password);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateProfileInfo({
    displayName,
    photoURL,
  }: {
    displayName?: string;
    photoURL?: string;
  }) {
    if (!this._user) throw new AuthError("No authenticated user", "no_user");
    if (!displayName && !photoURL) return;

    try {
      if (displayName) await updateProfile(this._user, { displayName });
      if (photoURL) await updateProfile(this._user, { photoURL });
      await this.updateUserData({ displayName, photoURL });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateUserData(data: Partial<UserData>) {
    if (!this._user?.uid) throw new AuthError("No authenticated user", "no_user");

    try {
      const docRef = doc(firebaseService.getDb(), "users", this._user.uid);
      const updateData = { ...data, updatedAt: new Date() };

      await updateDoc(docRef, updateData);
      await this.loadUserData(this._user.uid);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async saveUserData(data: UserData) {
    if (!this._user?.uid) throw new AuthError("No authenticated user", "no_user");

    try {
      const docRef = doc(firebaseService.getDb(), "users", this._user.uid);
      const saveData = {
        ...data,
        createdAt: data.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await setDoc(docRef, saveData);
      await this.loadUserData(this._user.uid);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async sendVerificationEmail(): Promise<void> {
    if (!this._user) throw new AuthError('No authenticated user', 'no_user');

    try {
      await sendEmailVerification(this._user);
      toast.success('Verification email sent!');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async refreshUserData(): Promise<void> {
    if (!this._user) return;

    try {
      await Promise.all([
        this.loadUserData(this._user.uid),
        this.loadUserClaims(this._user)
      ]);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Helper methods
  hasRequiredClaims(requiredClaims: string[]): boolean {
    return requiredClaims.every((claim) => this._claims[claim]);
  }

  isAdmin(): boolean {
    return Boolean(this._claims.admin);
  }

  isPremium(): boolean {
    return Boolean(this._claims.premium);
  }

  // Convenience methods for route guards
  async requireAuth(redirectTo = "/login", redirectParams?: Record<string, string>) {
    return this.validateAuth({
      authRequired: true,
      redirectTo,
      redirectParams,
    });
  }

  async requireNoAuth(redirectTo = "/dashboard", redirectParams?: Record<string, string>) {
    return this.validateAuth({
      authRequired: false,
      redirectTo,
      redirectParams,
    });
  }

  async requireClaims(claims: string[], redirectTo = "/login", redirectParams?: Record<string, string>) {
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

  async logOut() {
    try {
      await firebaseService.getAuthInstance().signOut();
      this.clearSession();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Cleanup
  destroy(): void {
    this.clearSession();
    // Additional cleanup if needed
  }
}

export const firekitAuthManager = FirekitAuthManager.getInstance();