<script>
  import { goto } from "$app/navigation";
  import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte";
  import { onMount } from "svelte";

  let { children } = $props();
  let loading = $derived(firekitAuthManager?.loading);

  $effect(() => {
    console.log("------------------------------------------");
    console.log("AUTH");
    console.log("initialized:", firekitAuthManager?.initialized);
    console.log("isLoggedIn:", firekitAuthManager?.isLoggedIn);
    if (firekitAuthManager?.initialized && firekitAuthManager?.isLoggedIn) {
      console.log("REDIRECT TO /DASHBOARD");
      goto("/dashboard");
    }
    console.log("------------------------------------------");
  });
</script>

<main class="flex h-[100dvh] flex-col items-center justify-center">
  {@render children()}
</main>
