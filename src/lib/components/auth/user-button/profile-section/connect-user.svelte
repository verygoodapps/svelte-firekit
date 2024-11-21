<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
    import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte.js";

  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Plus } from "lucide-svelte";
  import TypeAccount from "../type-account.svelte";
</script>

<section class="space-y-5 border-t-slate-200 border-t-[2px] pt-4">
  <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
    <div class="sm:col-span-4 xl:col-span-3 ">
      <p class="sm:mt-2.5 inline-block text-sm text-foreground-500">
        Connected accounts
      </p>
    </div>

    <div class="sm:col-span-8 xl:col-span-9">
      <div class="flex flex-wrap justify-around items-center gap-3 sm:gap-5">
        <div class="flex flex-col gap-2 text-sm leading-tight items-start">
          <div class="flex gap-2 items-center">
            <TypeAccount
              account={firekitAuthManager?.user?.providerData[0]?.providerId || "None"}
            ></TypeAccount>

            <span class="truncate text-xs text-slate-600"
              >{firekitAuthManager.email}</span
            >

            <Badge variant="outline">Primary</Badge>
          </div>
          <Button
            variant="none"
            class="flex justify-start px-0 hover:border-b-slate-500 hover:border-b-[2px] rounded-none"
          >
            <Plus class="size-4"></Plus>
            Connect account
          </Button>
        </div>
        <!-- <Button variant="ghost" size="sm">Edit Profile</Button> -->
        <div></div>
      </div>
    </div>
  </div>
</section>
