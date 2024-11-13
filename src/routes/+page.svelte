<script lang="ts">
    import SignIn from "$lib/auth/sign-in.svelte";
    import UserButton from "$lib/auth/user-button.svelte";
  import Collection from "$lib/firestore/Collection.svelte";

  import { limit, orderBy } from 'firebase/firestore';

   const preloadedMessages: any[] = [{ text: 'preloadedMessage from the server' }];


  let log = true;
</script>

<UserButton />

<SignIn />


<!-- <Collection path="projects" queryConstraints={[limit(5), orderBy('updatedAt', 'desc')]} >
  <div slot="fallback">No messages found</div>
  
</Collection> -->

<Collection path="projects" queryConstraints={[limit(20), orderBy('created', 'desc')]} startWith={preloadedMessages} {log}>
<!-- <Collection path="projects" queryConstraints={[limit(5), orderBy('created', 'desc')]} startWith={preloadedMessages} {log}> -->
</Collection>