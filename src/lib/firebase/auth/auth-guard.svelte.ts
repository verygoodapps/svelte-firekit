import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import type { DocumentData } from "firebase/firestore";
import { firekitUser } from "./user.svelte.js";

type GuardConfig = {
    authRequired?: boolean;
    redirectTo?: string;
    requiredClaims?: string[];
    requiredData?: (data: DocumentData | null) => boolean;
    allowIf?: (user: typeof firekitUser) => boolean;
};

export class FirekitAuthGuard {
    private static instance: FirekitAuthGuard;
    private _loading = $state(true);
    private _error = $state<Error | null>(null);

    private constructor() { }

    static getInstance(): FirekitAuthGuard {
        if (!FirekitAuthGuard.instance) {
            FirekitAuthGuard.instance = new FirekitAuthGuard();
        }
        return FirekitAuthGuard.instance;
    }

    async validateAuth({
        authRequired = true,
        redirectTo = '/login',
        requiredClaims = [],
        requiredData,
        allowIf
    }: GuardConfig = {}) {
        if (!browser) return;

        try {
            this._loading = true;
            this._error = null;

            // Wait for auth state to be determined
            // if (firekitUser.loading) {
            //     await new Promise((resolve) => setTimeout(resolve, 100));
            // }

            const isAuthenticated = firekitUser.isLoggedIn;

            // Handle authentication requirement
            if (authRequired && !isAuthenticated) {
                await goto(redirectTo);
                return false;
            }

            // Handle custom conditions if provided
            if (allowIf && !allowIf(firekitUser)) {
                await goto(redirectTo);
                return false;
            }

            // Handle required claims if any
            if (requiredClaims.length > 0) {
                const userClaims = await firekitUser.user?.getIdTokenResult();
                const hasClaims = requiredClaims.every(
                    (claim) => userClaims?.claims[claim]
                );
                if (!hasClaims) {
                    await goto(redirectTo);
                    return false;
                }
            }

            // Handle required data validation if provided
            if (requiredData && !requiredData(firekitUser.data)) {
                await goto(redirectTo);
                return false;
            }

            return true;
        } catch (error) {
            this._error = error as Error;
            return false;
        } finally {
            this._loading = false;
        }
    }

    async requireAuth(redirectTo = '/login') {
        return this.validateAuth({ authRequired: true, redirectTo });
    }

    async requireNoAuth(redirectTo = '/dashboard') {
        return this.validateAuth({ authRequired: false, redirectTo });
    }

    async requireClaims(claims: string[], redirectTo = '/login') {
        return this.validateAuth({ requiredClaims: claims, redirectTo });
    }

    async requireData(
        validator: (data: DocumentData | null) => boolean,
        redirectTo = '/login'
    ) {
        return this.validateAuth({ requiredData: validator, redirectTo });
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }
}

export const firekitAuthGuard = FirekitAuthGuard.getInstance();