<script>
  import SignInPage from "$lib/auth/sign-in.svelte";
  import { firekitUser } from "$lib/firebase/auth/user.svelte";
  let isLoggedin = $derived(firekitUser.isLoggedIn);
</script>

<SignInPage
  title="Sign in"
  subtitle="Don't have an account yet?"
  textLink="Sign up here"
  link="/sign-up"
  labelBtnGoogle="Sign in with"
  labelEmail="Email"
  labelPassword="Password"
  labellLinkEmailForm="I forgot my password"
  linkForgetPassword="/reset-password"
  labelBtnFormEmail="Sign"
  labelDivider="Or"
/>
