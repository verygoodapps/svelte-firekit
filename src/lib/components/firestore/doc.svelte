<script lang="ts" generics="Data extends DocumentData">
    import { firekitDoc } from "$lib/firebase/firestore/doc.svelte.js";
    import type { DocumentData, DocumentReference } from "firebase/firestore";
    import type { Snippet } from "svelte";

    let {
        ref,
        startWith,
        children,
        loading,
        error,
    }: {
        ref: string | DocumentReference<Data>;
        startWith?: Data | undefined;
        children?: Snippet<[data: Data, ref: DocumentReference<Data>]>;
        loading?: Snippet;
        error?: Snippet<[error: Error]>;
    } = $props();

    let doc = firekitDoc<Data>(ref, startWith);
</script>

{#if doc.loading}
    {#if loading}
        {@render loading()}
    {:else}
        <div>Loading...</div>
    {/if}
{:else if doc.error}
    {#if error}
        {@render error(doc.error)}
    {:else}
        <div>Error: {doc.error.message}</div>
    {/if}
{:else if doc.data}
    {#if children}
        {@render children(doc.data, doc.ref)}
    {/if}
{/if}
