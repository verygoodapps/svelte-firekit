<script>
    import SignInPage from "$lib/auth/sign-in.svelte";
    import { firekitUser } from "$lib/firebase/auth/user.svelte";
    let isLoggedin = $derived(firekitUser.isLoggedIn);
</script>

{isLoggedin}
<SignInPage />
