<script lang="ts">
  import SettingsDialog from "./settings-dialog.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { getInitials } from "$lib/utils.js";
  import type { NavItem } from "$lib/types/nav.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { firekitAuth } from "$lib/firebase/auth/auth.js";
  import { LogOut } from "lucide-svelte";
  import { firekitAuthManager } from "$lib/firebase/auth/auth-manager.svelte.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";

  let isOpen = $state(false);

  let { nav, redirectTo="/sign-in" }: { nav?: NavItem[], redirectTo:string } = $props();
  async function handleLogout() {
    await firekitAuth.logOut(redirectTo);
  }
</script>

{#if !firekitAuthManager.initialized}
  <div class="flex gap-2 items-center mx-4">
    <Skeleton class="size-12 rounded-full" />
    <div class="space-y-2">
      <Skeleton class="h-3 w-[100px]" />
      <Skeleton class="h-3 w-[150px]" />
    </div>
  </div>
{:else if firekitAuthManager.data}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Avatar.Root>
        <Avatar.Image src={firekitAuthManager.data?.photoURL} alt="Avatar" />
        <Avatar.Fallback>
          {getInitials(firekitAuthManager.data?.displayName)}
        </Avatar.Fallback>
      </Avatar.Root>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.GroupHeading>
          <div class="flex items-center gap-3">
            <Avatar.Root>
              <Avatar.Image
                src={firekitAuthManager.data?.photoURL}
                alt="Avatar"
              />
              <Avatar.Fallback>
                {getInitials(firekitAuthManager.data?.displayName)}
              </Avatar.Fallback>
            </Avatar.Root>
            <div class="grow">
              <span
                class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
              >
                {firekitAuthManager.data?.displayName}
              </span>
              <p class="text-xs text-foreground-500">
                {firekitAuthManager.data?.email}
              </p>
            </div>
          </div>
        </DropdownMenu.GroupHeading>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={() => (isOpen = true)}>
          {#snippet child({ props })}
            <SettingsDialog child({ props }) />
          {/snippet}
        </DropdownMenu.Item>
        {#if nav}
          {#each nav as { href, label }}
            <DropdownMenu.Item>
              <a {href}>
                {label}
              </a>
            </DropdownMenu.Item>
          {/each}
        {/if}

        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={handleLogout}>
          <LogOut /> Logout
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  <AlertDialog.Root bind:open={isOpen}>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <Avatar.Root>
                <Avatar.Image
                  src={firekitAuthManager.data?.photoURL}
                  alt="Avatar"
                />
                <Avatar.Fallback>
                  {getInitials(firekitAuthManager.data?.displayName)}
                </Avatar.Fallback>
              </Avatar.Root>
              <div class="grow">
                <span
                  class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
                >
                  {firekitAuthManager.data?.displayName}
                </span>
                <p class="text-xs text-foreground-500">
                  {firekitAuthManager.data?.email}
                </p>
              </div>
            </div>
            <Button onclick={handleLogout} variant="link">
              <LogOut />Logout
            </Button>
          </div>
        </AlertDialog.Title>
        <AlertDialog.Description>
          Manage your name, password and account settings.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action>Continue</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{:else}
  <Button href="/login">Login</Button>
{/if}
