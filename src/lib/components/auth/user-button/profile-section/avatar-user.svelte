<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte.js";

  import { firekitUploadTask } from "$lib/firebase/storage/upload-task.svelte.js";
  import { getInitials } from "$lib/utils.js";

  $effect(() => {
    console.log(progress);
    if (progress === 100 && uploadTask?.downloadURL) {
      console.log("updated data");
      firekitAuthManager.updateUserData({ photoURL: uploadTask?.downloadURL });
      firekitAuthManager.updateProfileInfo({
        displayName: firekitAuthManager.data?.displayName as string,
        photoURL: uploadTask?.downloadURL,
      });
      progress = 0;
    }
  });

  // $effect(()=>{
  //   console.log(uploadTask?.downloadURL)
  // })

  let uploadTask: any = $state(null);
  let progress: number = $derived(uploadTask?.progress || 0 * 1);
  let imageUrl: string = $state("");
  let selectedImage: File | null = $state(null);
  let inputfile: any;

  async function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files?.[0] as File;

    if (file) {
      imageUrl = URL.createObjectURL(file);
      selectedImage = file;
    }

    uploadTask = firekitUploadTask(
      `users-profile/${firekitAuthManager.uid}/profile`,
      file
    );
    

    // firekitAuthManager.updateUserData({ photoURL: uploadTask?.downloadURL });
    // firekitAuthManager.updateProfileInfo({
    //   displayName: firekitAuthManager.data?.displayName as string,
    //   photoURL: uploadTask?.downloadURL,
    // });
  }
</script>

<section class="space-y-5 border-t-slate-200 border-t-[2px] pt-4">
  <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
    <div class="sm:col-span-4 xl:col-span-3">
      <p class="sm:mt-2.5 inline-block text-sm text-foreground-500">Profile</p>
    </div>

    <div class="sm:col-span-8 xl:col-span-9">
      <div class="flex flex-wrap justify-around items-center gap-3 sm:gap-5">
        <div class="flex gap-2 items-center">
          <button onclick={() => inputfile.click()}>
            <Avatar.Root class="size-[70px]">
              <Avatar.Image
                src={firekitAuthManager.data?.photoURL}
                alt="Avatar"
              />
              <Avatar.Fallback>
                {getInitials(firekitAuthManager.data?.displayName)}
              </Avatar.Fallback>
            </Avatar.Root>
          </button>
          <input
            bind:this={inputfile}
            onchange={handleImageUpload}
            type="file"
            accept="image/*"
            class="hidden"
          />
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold"
              >{firekitAuthManager.data?.displayName}</span
            >
            <span class="truncate text-sm text-slate-400"
              >{firekitAuthManager.data?.email}</span
            >
            {#if progress > 0 && !uploadTask?.completed}
              <div
                class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
              >
                <div
                  class="bg-blue-600 h-2.5 rounded-full"
                  style="width: {progress}%"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Progress: {progress.toFixed(2)}%
              </p>
            {/if}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</section>
