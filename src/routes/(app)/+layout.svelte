<script lang="ts">
  import { goto } from "$app/navigation";
  import AppSidebar from "$lib/components/app/nav/app-sidebar.svelte";
  import Breadcrumb from "$lib/components/nav/breadcrumb.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte.js";

  import { onMount } from "svelte";
  const { children } = $props();

  let loading = $derived(firekitAuthManager.loading);
  let isInitialized: boolean = $state(false);

  $effect(() => {
    console.log("------------------------------------------");
    console.log("APP");
    console.log("loading:", loading);
    console.log("initialized:", firekitAuthManager.initialized);
    console.log("isLoggedIn:", firekitAuthManager.isLoggedIn);
    if (firekitAuthManager.initialized && !firekitAuthManager.isLoggedIn) {
      console.log("REDIRECT TO /SIGN-IN");
      goto("/sign-in");
    }
    console.log("------------------------------------------");
  });
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header
      class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb />
      </div>
    </header>
    <div class="flex flex-col gap-4 p-4 pt-0">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
