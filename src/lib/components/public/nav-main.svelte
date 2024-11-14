<script lang="ts">
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Menu } from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import DarkModeToggle from "../nav/dark-mode-toggle.svelte";
    import type { NavItem } from "$lib/types/nav.js";

    let isNavOpen = false;
    const siteConfig = {
        title: "Svelte Firekit",
        description: "Firebase Toolkit for SvelteKit",
        logo: "/logo.svg",
        logoDark: "/logo-white.svg",
        favicon: "/favicon.png",
        onboarding: true,
    };
    const publicNav: NavItem[] = [
        {
            title: "Docs",
            href: "/docs",
        },
        {
            title: "Contact",
            href: "/contact",
        },
        {
            title: "Blog",
            href: "/blog",
        },
    ];
</script>

<header
    class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
    <nav
        class="relative mx-auto w-full max-w-[85rem] px-4 py-4 sm:px-6 md:flex md:items-center md:justify-between md:gap-3 lg:px-8"
    >
        <!-- Logo w/ Collapse Button -->
        <div class="flex items-center justify-between">
            <a href="/">
                <img
                    src={siteConfig.logo}
                    alt={siteConfig.title}
                    class="h-6 dark:hidden"
                />
                <img
                    src={siteConfig.logoDark}
                    alt={siteConfig.title}
                    class="hidden h-6 dark:block"
                />
            </a>

            <div class="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    class="md:hidden"
                    onclick={() => (isNavOpen = !isNavOpen)}
                >
                    <Menu /> <span class="sr-only">Toggle navigation</span>
                </Button>
                <!-- End Collapse Button -->
                <div class="md:hidden">
                    <DarkModeToggle />
                </div>
            </div>
            <!-- Collapse Button -->
        </div>
        <!-- End Logo w/ Collapse Button -->

        <!-- Collapse -->
        <div
            class={`${
                isNavOpen ? "block" : "hidden"
            } grow basis-full overflow-hidden transition-all duration-300 md:block`}
            aria-labelledby="header-collapse"
        >
            <div
                class="max-h-[75vh] overflow-hidden overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2"
            >
                <div
                    class="flex flex-col gap-0.5 py-2 md:flex-row md:items-center md:justify-end md:gap-1 md:py-0"
                >
                    {#each publicNav as item}
                        {#if item.items && item.items?.length > 0}
                            <!-- Dropdown for items with sub-items -->
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger
                                    class="
                                    {buttonVariants({
                                        variant: 'ghost',
                                    })} text-base font-normal"
                                >
                                    {item.title}
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Group>
                                        {#each item.items as subItem}
                                            <DropdownMenu.Item>
                                                <a href={subItem.href}
                                                    >{subItem.title}</a
                                                >
                                            </DropdownMenu.Item>
                                        {/each}
                                    </DropdownMenu.Group>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        {:else}
                            <!-- Regular Button for single items -->
                            <Button
                                variant="ghost"
                                href={item.href}
                                class="text-base font-normal"
                            >
                                {#if item.icon}
                                    <item.icon />
                                {/if}
                                {item.title}
                            </Button>
                        {/if}
                    {/each}
                    <Separator
                        orientation="vertical"
                        class="mr-2 hidden h-5 md:block"
                    />
                    <div class="hidden md:block">
                        <DarkModeToggle />
                    </div>
                </div>
            </div>
        </div>
        <!-- End Collapse -->
    </nav>
</header>
