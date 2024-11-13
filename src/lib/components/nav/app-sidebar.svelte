<script lang="ts">
	import SearchForm from "./search-form.svelte";
	import VersionSwitcher from "./version-switcher.svelte";
	import * as Sidebar from "../ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import { nav } from "./nav.js";

	let {
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<VersionSwitcher
			versions={nav.versions}
			defaultVersion={nav.versions[0]}
		/>
		<SearchForm />
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each nav.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={item.isActive}>
									{#snippet child({ props })}
										<a href={item.url} {...props}
											>{item.title}</a
										>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
