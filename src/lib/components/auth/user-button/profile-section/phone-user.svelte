<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { firekitUser } from "$lib/firebase/auth/user.svelte.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { toast } from "svelte-sonner";
  import intlTelInput from "intl-tel-input";
  import { onMount } from "svelte";

  let phoneNumber = $state("");
  let haserror = $state(false);
  let it: any = null;
  let _phone: any = { valid: false, value: "", error: "" };

  onMount(() => {
    const input: any = document.querySelector(`#phonenumberuser`);
    console.log(input);

    //   it = intlTelInput(input, {
    //     utilsScript: "./intl-tel-input/build/js/utils.js",
    //     separateDialCode: true,
    //   });
    it = intlTelInput(input, {
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@24.7.0/build/js/utils.js",
      separateDialCode: true,
    });
    console.log(it.getNumber());
  });

  $effect(() => {
    phoneNumber = firekitUser.user?.phoneNumber as string;
  });

  function handleChangePhoneNumber() {
   if (it) {
      _phone.value = it.getNumber();
      _phone.error = it.getValidationError();
      _phone.valid = it.isValidNumber();
    }
    // console.log(it .isValidNumber())
    if (it.isValidNumber()) {
      it.setNumber(phoneNumber);
    }
    console.log(phoneNumber);
    haserror = false;
    console.log(firekitUser.user?.phoneNumber);
    console.log(_phone.value);
    if (phoneNumber === firekitUser.user?.phoneNumber) {
      toast.error("The email is the same as your current email.");
      haserror = true;
      return;
    }
  }

  function changePhone() {
    // if (it) {
    //   _phone.value = it.getNumber();
    //   _phone.error = it.getValidationError();
    //   _phone.valid = it.isValidNumber();
    // }
    // // console.log(it .isValidNumber())
    // if (it.isValidNumber()) {
    //   it.setNumber(phoneNumber);
    // }
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
        Phone number
      </p>
    </div>

    <div class="sm:col-span-8 xl:col-span-9">
      <div class="flex flex-wrap justify-around items-center gap-3 sm:gap-5">
        <div class="flex gap-2 items-center">
          <div class="flex flex-col gap-2 text-sm leading-tight">
            <div class=" space-y-1 my-2">
              <!-- <Label class={haserror ? "text-red-500" : ""}>Phone number:</Label
              > -->
              <Input
                id={"phonenumberuser"}
                bind:value={phoneNumber}
                name="phone"
                type="tel"
                class="input input-bordered input-sm w-full rounded  bg-transparent px-3  text-md {_phone.valid
                  ? 'border-[#DBDEE2]'
                  : 'border-red-700'}"
                oninput={changePhone}
                onbeforeinput={(e) => {
                  if (
                    !/^\d*$/.test(e.data) &&
                    e.inputType !== "deleteContentBackward" &&
                    e.inputType !== "deleteContentForward"
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="Phone number"
              />
            </div>
            <Button
              onclick={handleChangePhoneNumber}
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
