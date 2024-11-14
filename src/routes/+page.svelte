<!-- <script lang="ts">
    import SignIn from "$lib/auth/sign-in.svelte";
    import UserButton from "$lib/components/auth/user-button.svelte";
    import Collection from "$lib/components/firestore/collection.svelte";
    import Doc from "$lib/components/firestore/doc.svelte";
    import Upload from "$lib/components/storage/upload.svelte";
    import { firekitCollection } from "$lib/firebase/firestore/collection.svelte.js";
    import { firekitDoc } from "$lib/firebase/firestore/doc.svelte.js";
    interface Post {
        id?: string;
        title?: string;
        content?: string;
    }
    let chat = firekitDoc<Post>("chats/1dhmKsNwTkt4lPIOqgfq", {});
    let chats = firekitCollection<Post[]>("chats");
</script>

<UserButton />

<SignIn />
{#if chat && chat.data}
    {chat.loading ? "Loading..." : chat.data.title}
    {chat.data.id}
{/if}
{#if chats && chats.data}
    {chats.loading ? "Loading..." : chats.data.length}
{/if}

<Doc ref="chats/1dhmKsNwTkt4lPIOqgfq">
    {#snippet children(data, ref)}
        <p>Id: {data.id}</p>
    {/snippet}
</Doc>

<Collection path="chats">
    {#snippet children(data, ref)}
        <p>{data.length}</p>
        {#each data as data}
            <p>Id: {data.id}</p>
        {/each}
    {/snippet}
</Collection>

<Upload path="uploads" /> -->
