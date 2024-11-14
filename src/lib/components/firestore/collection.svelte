<script lang="ts" generics="Data extends DocumentData">
    import { firekitCollection } from "$lib/firebase/firestore/collection.svelte.js";
    import type {
        CollectionReference,
        DocumentData,
        QueryConstraint,
    } from "firebase/firestore";
    import type { Snippet } from "svelte";

    let {
        path,
        queryConstraints,
        children,
        loading,
        error,
    }: {
        path: string;
        queryConstraints?: QueryConstraint[];
        children?: Snippet<[data: Data[], ref: CollectionReference]>;
        loading?: Snippet;
        error?: Snippet<[error: Error]>;
    } = $props();

    let collection = queryConstraints
        ? firekitCollection<Data>(path, ...queryConstraints)
        : firekitCollection<Data>(path);
</script>

{#if collection.loading}
    {#if loading}
        {@render loading()}
    {:else}
        <div>Loading...</div>
    {/if}
{:else if collection.error}
    {#if error}
        {@render error(collection.error)}
    {:else}
        <div>Error: {collection.error.message}</div>
    {/if}
{:else if collection.data}
    {#if children}
        {@render children(collection.data, collection.ref)}
    {/if}
{/if}
