<script>
  import { goto } from "$app/navigation";
  import { firekitAuthGuard } from "$lib/firebase/auth/auth-guard.svelte";
  import { firekitUser } from "$lib/firebase/auth/user.svelte";
  import { onMount } from "svelte";

  let { children } = $props();
  let loading = $derived(firekitAuthGuard.loading);

  $effect(() => {
    console.log("------------------------------------------");
    console.log("AUTH");
    console.log("loading:", loading);
    console.log("firekitUser:", firekitUser.isLoggedIn);
    if (!loading || firekitUser.isLoggedIn) {
      console.log("REDIRECT TO /DASHBOARD");
      goto("/dashboard");
    }
    console.log("------------------------------------------");
  });
</script>

<main class="flex h-[100dvh] flex-col items-center justify-center">
  {@render children()}
</main>
