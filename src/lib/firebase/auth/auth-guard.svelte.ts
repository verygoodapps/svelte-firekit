import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import type { DocumentData } from "firebase/firestore";
import { firekitUser } from "./user.svelte.js";

type UserClaims = Record<string, any>;

interface GuardConfig {
    authRequired?: boolean;
    redirectTo?: string;
    requiredClaims?: string[];
    requiredData?: (data: DocumentData | null) => boolean;
    allowIf?: (user: typeof firekitUser) => boolean;
    redirectParams?: Record<string, string>;
}

export class FirekitAuthGuard {
    private static instance: FirekitAuthGuard;
    private _loading = $state(true);
    private _error = $state<Error | null>(null);
    private _lastValidationTime = 0;
    private readonly VALIDATION_THROTTLE = 1000; // 1 second

    private constructor() { }

    static getInstance(): FirekitAuthGuard {
        if (!FirekitAuthGuard.instance) {
            FirekitAuthGuard.instance = new FirekitAuthGuard();
        }
        return FirekitAuthGuard.instance;
    }

    private shouldThrottleValidation(): boolean {
        const now = Date.now();
        if (now - this._lastValidationTime < this.VALIDATION_THROTTLE) {
            return true;
        }
        this._lastValidationTime = now;
        return false;
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

    private async validateClaims(requiredClaims: string[], userClaims?: UserClaims): Promise<boolean> {
        if (!requiredClaims.length) return true;
        if (!userClaims) return false;

        return requiredClaims.every(claim => userClaims[claim]);
    }

    async validateAuth({
        authRequired = true,
        redirectTo = '/login',
        requiredClaims = [],
        requiredData,
        allowIf,
        redirectParams
    }: GuardConfig = {}): Promise<boolean> {
        if (!browser) return true;
        if (this.shouldThrottleValidation()) return true;

        try {
            this._loading = true;
            this._error = null;
            await firekitUser.waitForInit();

            const isAuthenticated = firekitUser.isLoggedIn;

            if (authRequired && !isAuthenticated) {
                await this.handleRedirect(redirectTo, {
                    ...redirectParams,
                    returnTo: window.location.pathname
                });
                return false;
            }

            if (allowIf && !allowIf(firekitUser)) {
                await this.handleRedirect(redirectTo, redirectParams);
                return false;
            }

            if (requiredClaims.length > 0) {
                const userClaims = await firekitUser.user?.getIdTokenResult();
                const hasClaims = await this.validateClaims(requiredClaims, userClaims?.claims);
                if (!hasClaims) {
                    await this.handleRedirect(redirectTo, redirectParams);
                    return false;
                }
            }

            if (requiredData && !requiredData(firekitUser.data)) {
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

    async requireAuth(redirectTo = '/login', redirectParams?: Record<string, string>) {
        return this.validateAuth({ authRequired: true, redirectTo, redirectParams });
    }

    async requireNoAuth(redirectTo = '/dashboard', redirectParams?: Record<string, string>) {
        return this.validateAuth({ authRequired: false, redirectTo, redirectParams });
    }

    async requireClaims(claims: string[], redirectTo = '/login', redirectParams?: Record<string, string>) {
        return this.validateAuth({ requiredClaims: claims, redirectTo, redirectParams });
    }

    async requireData(
        validator: (data: DocumentData | null) => boolean,
        redirectTo = '/login',
        redirectParams?: Record<string, string>
    ) {
        return this.validateAuth({ requiredData: validator, redirectTo, redirectParams });
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }
}

export const firekitAuthGuard = FirekitAuthGuard.getInstance();