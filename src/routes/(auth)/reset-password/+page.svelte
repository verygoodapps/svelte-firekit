<script lang="ts">
  import ResetPassword from "$lib/auth/reset-password.svelte";
  import { firekitUser } from "$lib/firebase/auth/user.svelte";
  let isLoggedin = $derived(firekitUser.isLoggedIn);
</script>

<ResetPassword
  title="Forgot password?"
  subtitle="Remember your password?"
  labelLink="Sign in here"
  link="/sign-in"
  redirect="/sign-in"
/>
