<script lang="ts">
    import type { PageData } from "./$types.js";
    let { data }: { data: PageData } = $props();
</script>

{#if data}
    <p>{data.metadata.slug}</p>
    <article>
        <h1>{data.title}</h1>
    </article>
    <data.component />
{/if}
