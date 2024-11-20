<script lang="ts">
  import { firekitUser } from "$lib/firebase/auth/user.svelte.js";
  import AvatarUser from "./avatar-user.svelte";
  import ConnectUser from "./connect-user.svelte";
  import EmailUser from "./email-user.svelte";
  import PhoneUser from "./phone-user.svelte";
</script>

<h2 class=" pb-3 text-lg font-semibold">Profile Details</h2>

<AvatarUser></AvatarUser>
<!-- {#if firekitUser.user?.providerData[0]?.providerId !== "google.com"} -->
  <EmailUser></EmailUser>
<!-- {/if} -->
<PhoneUser></PhoneUser>
<ConnectUser></ConnectUser>
