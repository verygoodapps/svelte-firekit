<script lang="ts">
    import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte.js";

    interface Props {
        redirectTo?: string;
        redirectParams?: Record<string, string>;
        children: () => any;
    }

    let {
        redirectTo = "/dashboard",
        redirectParams,
        children,
    }: Props = $props();

    let isAuthorized = $state(false);
    let isValidating = $state(true);

    async function validateAccess() {
        isValidating = true;
        isAuthorized = await firekitAuthManager.validateAuth({
            authRequired: false,
            redirectTo,
            redirectParams,
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
