<script lang="ts">
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { navMain } from "$lib/config.js";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
</script>

{#if navMain}
  {#each navMain as nav}
    <Sidebar.Group>
      <Sidebar.GroupLabel class="capitalize">{nav.title}</Sidebar.GroupLabel>
      <Sidebar.Menu>
        {#each nav.items as mainItem (mainItem.title)}
          {#if mainItem.items && mainItem.items.length > 0}
            <Collapsible.Root class="group/collapsible">
              {#snippet child({ props })}
                <Sidebar.MenuItem {...props}>
                  <Collapsible.Trigger>
                    {#snippet child({ props })}
                      <Sidebar.MenuButton {...props}>
                        {#snippet tooltipContent()}
                          {mainItem.title}
                        {/snippet}
                        {#if mainItem.icon}
                          <mainItem.icon />
                        {/if}
                        <span>{mainItem.title}</span>
                        <ChevronRight
                          class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                        />
                      </Sidebar.MenuButton>
                    {/snippet}
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    {#if mainItem.items}
                      <Sidebar.MenuSub>
                        {#each mainItem.items as subItem (subItem.title)}
                          <Sidebar.MenuSubItem>
                            <Sidebar.MenuSubButton>
                              {#snippet child({ props })}
                                <a href={subItem.href} {...props}>
                                  <span>{subItem.title}</span>
                                </a>
                              {/snippet}
                            </Sidebar.MenuSubButton>
                          </Sidebar.MenuSubItem>
                        {/each}
                      </Sidebar.MenuSub>
                    {/if}
                  </Collapsible.Content>
                </Sidebar.MenuItem>
              {/snippet}
            </Collapsible.Root>
          {:else}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={mainItem.href} {...props}>
                    <mainItem.icon />
                    <span>{mainItem.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/if}
        {/each}
      </Sidebar.Menu>
    </Sidebar.Group>
  {/each}
{/if}
