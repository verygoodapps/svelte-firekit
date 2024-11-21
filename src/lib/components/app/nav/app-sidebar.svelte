<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { ComponentProps } from "svelte";
  // import SidebarOptInForm from "./sidebar-opt-in-form.svelte";
  import { firekitUser } from "$lib/firebase/auth/user.svelte.js";
  import UserButton from "$lib/components/auth/user-button/user-button.svelte";
  import NavMain from "$lib/components/nav/nav-main.svelte";

  let {
    ref = $bindable(null),
    collapsible = "icon",
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
  <Sidebar.Header>
	<section class="flex justify-center items-center gap-2 my-4">
		<UserButton></UserButton> 
		<div class="flex flex-col">
			<small>{firekitUser.data?.displayName}</small>
			<small>{firekitUser.data?.email}</small>

		</div>
	</section>
  </Sidebar.Header>
  <Sidebar.Content>
    <NavMain />
  </Sidebar.Content>
  <Sidebar.Footer>
    <div class="p-1">
      <!-- <SidebarOptInForm /> -->
    </div>
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
