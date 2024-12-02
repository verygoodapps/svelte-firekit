<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  import Lock from "lucide-svelte/icons/lock";
  import { User2 } from "lucide-svelte";
  import ProfileSection from "./profile-section/profile-section.svelte";

  const data = {
    nav: [
      { name: "Profile", icon: User2 },
      { name: "Security", icon: Lock },
    ],
  };

  let open = $state(false);
  let section = $state("Profile");
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button size="sm" {...props}>Profile</Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content
    class="overflow-y-auto md:overflow-hidden p-0 max-h-[80dvh] md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]"
  >
    <Dialog.Title class="sr-only">Settings</Dialog.Title>
    <Dialog.Description class="sr-only"
      >Customize your settings here.</Dialog.Description
    >
    <Sidebar.Provider class="items-start">
      <Sidebar.Root collapsible="none" class="hidden md:flex">
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {#each data.nav as item (item.name)}
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton
                      isActive={item.name === section}
                      onclick={() => (section = item.name)}
                    >
                      {#snippet child({ props })}
                        <a href="##" {...props}>
                          <item.icon />
                          <span>{item.name}</span>
                        </a>
                      {/snippet}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                {/each}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.Root>
      <main class="flex sm:h-auto md:h-[480px]  flex-1 flex-col overflow-hidden">
        <header
          class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <div class="flex items-center gap-2 px-4">
            <Breadcrumb.Root>
              <Breadcrumb.List>
                <Breadcrumb.Item class="hidden md:block">
                  <Breadcrumb.Link href="#">Settings</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator class="hidden md:block" />
                <Breadcrumb.Item>
                  <Breadcrumb.Page>{section}</Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </div>
        </header>
        <div class="flex flex-1 flex-col gap-4 overflow-y-auto  p-4 pt-0 ">
          {#if section === "Profile"}
            <ProfileSection></ProfileSection>
          {/if}
          
        </div>
      </main>
    </Sidebar.Provider>
  </Dialog.Content>
</Dialog.Root>
