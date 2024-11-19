<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { firekitUser } from "$lib/firebase/auth/user.svelte.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { toast } from "svelte-sonner";

  let email:string = $state("");
  let haserror = $state(false);

  $effect(() => {
    email = firekitUser.user?.email as string;
  });

  function handleChangeEmail() {
    console.log(email);
    haserror = false;
    console.log(firekitUser.user?.email);
    if (email === firekitUser.user?.email) {
      toast.error("The email is the same as your current email.");
      haserror = true;
      return;
    }

    if (!isValidEmail()) {
      toast.error("Please enter a valid email address.");
      haserror = true;
      return;
    }
  }

  function isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
</script>

<section class="space-y-5 border-t-slate-200 border-t-[2px] pt-4">
  <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
    <div class="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
      <p class="sm:mt-2.5 inline-block text-sm  {haserror ? "text-red-500" : "text-foreground-500"}">
        Email address
      </p>
    </div>

    <div class="sm:col-span-8 xl:col-span-9">
      <div class="flex flex-wrap justify-around items-center gap-3 sm:gap-5">
        <div class="flex gap-2 items-center">
          <div class="flex flex-col gap-2 text-sm leading-tight">
            <div class=" space-y-1 my-2">
              <!-- <Label class={haserror ? "text-red-500" : ""}>Email:</Label> -->
              <Input
                class="h-[30px] {haserror ? 'border border-red-500' : ''}"
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
