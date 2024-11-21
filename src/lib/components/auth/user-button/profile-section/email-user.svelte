<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { firekitUser } from "$lib/firebase/auth/user.svelte.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { toast } from "svelte-sonner";
  import { firekitAuth } from "$lib/firebase/auth/auth.js";

  let email: string = $state("");
  let haserror = $state(false);

  $effect(() => {
    email = firekitUser.data?.email as string;
  });

  async function handleChangeEmail() {
    console.log(email);
    haserror = false;
    console.log(firekitUser.data?.email);
    if (email === firekitUser.data?.email) {
      toast.error("The email is the same as your current email.");
      haserror = true;
      return;
    }

    if (!isValidEmail()) {
      toast.error("Please enter a valid email address.");
      haserror = true;
      return;
    }

    await firekitUser.updateEmailUser(email);
    // toast.success("Email updated successfully!");
    // setTimeout(async () => {
    //   await firekitAuth.logOut();
    // }, 4500);
  }

  function isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
</script>

<section class="space-y-5 border-t-slate-200 border-t-[2px] pt-4">
  <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
    <div class="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
      <p
        class="sm:mt-2.5 inline-block text-sm {haserror
          ? 'text-red-500'
          : 'text-foreground-500'}"
      >
        Email address
      </p>
    </div>

    <div class="sm:col-span-8 xl:col-span-9">
      <div class="flex flex-wrap  items-center gap-3 sm:gap-5 ">
        <div class="flex gap-2 items-center w-full  ">
          <div class="flex flex-col gap-2 text-sm leading-tight  w-full ">
            <div class=" space-y-1 my-2 w-full ">
              <!-- <Label class={haserror ? "text-red-500" : ""}>Email:</Label> -->
              <Input
                class="  {haserror ? 'border border-red-500' : ''}"
                bind:value={email}
                placeholder="Introduce email"
              />
            </div>
            <Button
              onclick={handleChangeEmail}
              variant="default"
              class="bg-blue-500 hover:bg-blue-600 text-white block ml-auto"
            >
              Save
            </Button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</section>
