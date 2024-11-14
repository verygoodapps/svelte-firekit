<script lang="ts">
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import type { PageData } from "./$types.js";
	let { data }: { data: PageData } = $props();
</script>

{#if data}
	<div class="space-y02">
		<p
			class="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-500 capitalize"
		>
			{data.metadata.slug}
		</p>

		<h1
			class="block text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white"
		>
			{data.title}
		</h1>
		<p class="mt-2 sm:text-lg text-gray-800 dark:text-neutral-400">
			{data.metadata.description}
		</p>
	</div>
	<Separator />
	<article class="prose">
		<data.component />
	</article>
{/if}
