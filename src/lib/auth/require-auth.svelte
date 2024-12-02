<script lang="ts">
    import type { DocumentData } from "firebase/firestore";
    import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte.js";

    interface Props {
        redirectTo?: string;
        redirectParams?: Record<string, string>;
        requiredClaims?: string[];
        requiredData?: (data: DocumentData | null) => boolean;
        allowIf?: (manager: typeof firekitAuthManager) => boolean;
        children: () => any;
    }

    let {
        redirectTo = "/login",
        redirectParams,
        requiredClaims = [],
        requiredData,
        allowIf,
        children,
    }: Props = $props();

    let isAuthorized = $state(false);
    let isValidating = $state(true);

    async function validateAccess() {
        isValidating = true;
        isAuthorized = await firekitAuthManager.validateAuth({
            authRequired: true,
            redirectTo,
            redirectParams,
            requiredClaims,
            requiredData,
            allowIf,
        });
        isValidating = false;
    }

    $effect(() => {
        if (firekitAuthManager.initialized) {
            validateAccess();
        }
    });
</script>

{#if isValidating || firekitAuthManager.loading}
    <div class="flex items-center justify-center p-4">
        <span class="text-gray-500">Loading...</span>
    </div>
{:else if isAuthorized}
    {@render children()}
{/if}
