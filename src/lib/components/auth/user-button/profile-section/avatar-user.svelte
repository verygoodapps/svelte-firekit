<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { firekitUser } from "$lib/firebase/auth/user.svelte.js";
  import { firekitUploadTask } from "$lib/firebase/storage/upload-task.svelte.js";
  import { getInitials } from "$lib/utils.js";

  function uploadPhoto() {
    // firekitUploadTask();
  }

  $effect(() => {
    if (uploadTask?.downloadURL) {
      console.log(uploadTask?.downloadURL);
      //   firekitUser.updateProfile({ photoURL: uploadTask?.downloadURL });
      firekitUser.updateUserData({ photoURL: uploadTask?.downloadURL });
      firekitUser.updateProfileInfo({
        displayName: firekitUser.displayName as string,
        photoURL: uploadTask?.downloadURL,
      });
    }
  });

  let progress: number = $derived(uploadTask?.progress || 0 * 1);

  let imageUrl: string = $state("");
  let selectedImage: File | null = $state(null);
  let uploadTask: any = $state(null);
  let inputfile: any;

  async function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = target.files?.[0] as File;

    if (file) {
      imageUrl = URL.createObjectURL(file);
      selectedImage = file;
    }

    uploadTask = firekitUploadTask(
      `users-profile/${firekitUser.uid}/profile`,
      file
    );
  }
</script>

<section class="space-y-5 border-t-slate-200 border-t-[2px] pt-4">
  <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
    <div class="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
      <p class="sm:mt-2.5 inline-block text-sm text-foreground-500">Profile</p>
    </div>

    <div class="sm:col-span-8 xl:col-span-9">
      <div class="flex flex-wrap justify-around items-center gap-3 sm:gap-5">
        <div class="flex gap-2 items-center">
          <button onclick={() => inputfile.click()}>
            <Avatar.Root class="size-[70px]">
              <Avatar.Image src={firekitUser.data?.photoURL} alt="Avatar" />
              <Avatar.Fallback>
                {getInitials(firekitUser.data?.displayName)}
              </Avatar.Fallback>
            </Avatar.Root>
            <!-- <Avatar.Root class="size-[70px]">
              {#if firekitUser.photoURL}
                <Avatar.Image src={firekitUser?.photoURL} alt="" />
              {:else}
                <Avatar.Fallback class="text-2xl"
                  >{getInitials(firekitUser?.displayName)}</Avatar.Fallback
                >
              {/if}
            </Avatar.Root> -->
          </button>
          <input
            bind:this={inputfile}
            onchange={handleImageUpload}
            type="file"
            accept="image/*"
            class="hidden"
          />
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{firekitUser.displayName}</span
            >
            <span class="truncate text-sm text-slate-400"
              >{firekitUser.email}</span
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
              <p class="text-sm text-gray-500 mt-1">
                Progreso: {progress.toFixed(2)}%
              </p>
            {/if}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</section>
