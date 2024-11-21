<script lang="ts">
  import ResetPassword from "$lib/auth/reset-password.svelte";
  import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte.js";
  let isLoggedin = $derived(firekitAuthManager.isLoggedIn);
</script>

<ResetPassword
  title="Forgot password?"
  subtitle="Remember your password?"
  labelLink="Sign in here"
  link="/sign-in"
  redirect="/sign-in"
/>
