<script lang="ts">
    import { page } from "$app/stores";
    import { derived } from "svelte/store";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

    // Create a derived store to get breadcrumb items from the URL
    const breadcrumbs = derived(page, ($page) => {
        const path = $page.url.pathname;
        const segments = path.split("/").filter(Boolean); // split path and remove empty segments
        const breadcrumbItems = segments.map((segment, index) => {
            // Construct the path up to this segment
            const href = "/" + segments.slice(0, index + 1).join("/");
            return {
                name: segment
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase()),
                href,
            };
        });
        return breadcrumbItems;
    });
</script>

<Breadcrumb.Root>
    <Breadcrumb.List>
        {#each $breadcrumbs as breadcrumb, i}
            {#if i > 0}
                <Breadcrumb.Separator class="hidden md:block" />
            {/if}
            <Breadcrumb.Item>
                <!-- Check if it's the last breadcrumb item to render as Page instead of Link -->
                {#if i === $breadcrumbs.length - 1}
                    <Breadcrumb.Page>{breadcrumb.name}</Breadcrumb.Page>
                {:else}
                    <Breadcrumb.Link href={breadcrumb.href}
                        >{breadcrumb.name}</Breadcrumb.Link
                    >
                {/if}
            </Breadcrumb.Item>
        {/each}
    </Breadcrumb.List>
</Breadcrumb.Root>
