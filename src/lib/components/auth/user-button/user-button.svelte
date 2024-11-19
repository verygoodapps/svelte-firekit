<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { getInitials } from "$lib/utils.js";
    import type { NavItem } from "$lib/types/nav.js";
    let { nav }: { nav?: NavItem[] } = $props();
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { firekitUser } from "$lib/firebase/auth/user.svelte.js";
    import { firekitAuth } from "$lib/firebase/auth/auth.js";
    import { LogOut } from "lucide-svelte";
    import SettingsDialog from "./settings-dialog.svelte";
    let isOpen = $state(false);

    async function handleLogout() {
        await firekitAuth.logOut();
    }
</script>

{#if firekitUser.user}
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <Avatar.Root>
                <Avatar.Image src={firekitUser.data?.photoURL} alt="Avatar" />
                <Avatar.Fallback>
                    {getInitials(firekitUser.data?.displayName)}
                </Avatar.Fallback>
            </Avatar.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Group>
                <DropdownMenu.GroupHeading>
                    <div class="flex items-center gap-3">
                        <Avatar.Root>
                            <Avatar.Image
                                src={firekitUser.data?.photoURL}
                                alt="Avatar"
                            />
                            <Avatar.Fallback>
                                {getInitials(firekitUser.data?.displayName)}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <div class="grow">
                            <span
                                class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
                            >
                                {firekitUser.data?.displayName}
                            </span>
                            <p class="text-xs text-foreground-500">
                                {firekitUser.data?.email}
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
                                    src={firekitUser.photoURL}
                                    alt="Avatar"
                                />
                                <Avatar.Fallback>
                                    {getInitials(firekitUser.displayName)}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div class="grow">
                                <span
                                    class="block font-medium text-sm text-gray-800 dark:text-neutral-200"
                                >
                                    {firekitUser.displayName}
                                </span>
                                <p class="text-xs text-foreground-500">
                                    {firekitUser.email}
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
