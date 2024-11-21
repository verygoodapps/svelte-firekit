<script lang="ts">
  import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte.js";

  import AvatarUser from "./avatar-user.svelte";
  import ConnectUser from "./connect-user.svelte";
  import EmailUser from "./email-user.svelte";
  import PhoneUser from "./phone-user.svelte";
</script>

<h2 class=" pb-3 text-lg font-semibold">Profile Details</h2>

<AvatarUser></AvatarUser>
{#if firekitAuthManager.user?.providerData[0]?.providerId !== "google.com"}
  <EmailUser></EmailUser>
{/if}
<PhoneUser></PhoneUser>
<ConnectUser></ConnectUser>
