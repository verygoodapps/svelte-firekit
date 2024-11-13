<script lang="ts">
  import { onDestroy, onMount, createEventDispatcher, type Snippet } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import type {
    CollectionReference,
    QueryConstraint,
  } from "firebase/firestore";
  import { collectionStore } from "./collection.svelte.js";
  
  type T = $$Generic;

  // export let path: CollectionReference<T> | string;
  // export let queryConstraints: QueryConstraint[] = []; // usage example: [where('role', '==', 'contributor'), orderBy("name")];
  // export let traceId = "";
  // export let log = false;
  // export let startWith: T[] = undefined
  // export let maxWait = 10000;
  // export let once = false;
  // export let refField: string = undefined;

  let {
    path,
    queryConstraints = [] as QueryConstraint[],
    traceId = "",
    log = false,
    startWith = undefined,
    maxWait = 10000,
    once = false,
    refField = undefined,
  } = $props() as {
    path: CollectionReference<T> | string;
    queryConstraints: QueryConstraint[];
    traceId: string;
    log: boolean;
    startWith: T[];
    maxWait: number;
    once: boolean;
    refField: string;
  };

    const opts = {
    startWith,
    traceId,
    log,
    maxWait,
    once,
    refField,
  };


  // let store = collectionStore<T>(path, queryConstraints, opts);

  let store: any = $state(collectionStore<T>(path, queryConstraints, opts || {}));



  const dispatch = createEventDispatcher<{
    ref: { ref: CollectionReference<T> };
    data: { data: T[] };
  }>();

  let unsub: Unsubscriber;


  // Props changed
  // $: {
  //   if (typeof window !== 'undefined') {
  //     if (unsub) {
  //       unsub();
  //       const updatedOpts = { ...opts, traceId, log, maxWait, once, refField };
  //       store = collectionStore(path, queryConstraints, updatedOpts);
  //       dispatch('ref', { ref: store.ref });
  //     }

  //     unsub = store.subscribe((data) => {
  //       dispatch('data', {
  //         data,
  //       });
  //     });
  //   }
  // }



  $effect(() => {
    console.log("effect");
    if (typeof window !== "undefined") {

      if (unsub && typeof unsub === "function") {
        unsub();
        
        // Initialize opts with a fallback to an empty object
        const updatedOpts = { ...opts || {}, traceId, log, maxWait, once, refField };
        
        store = collectionStore(path, queryConstraints, updatedOpts);
        dispatch("ref", { ref: store.ref });
      }

      store.subscribe((data) => {
        dispatch("data", { data: data });
      });
    }
  });


  onMount(() => dispatch("ref", { ref: store.ref }));
  onDestroy(() => unsub && unsub());
</script>


{#snippet before(message)}
  <h3>{message}</h3>
{/snippet}

{#snippet done(response)}
<h3 class="text-blue-500 text-xl ">Proyects: {response.data?.length || 0}</h3>
<div class="bg-slate-200 max-h-[300px] overflow-y-auto text-black w-[800px] my-4">
  <pre>{JSON.stringify(response.data, null, 2)}</pre>
</div>
{/snippet}
{#snippet loading(message)}
  <h3>{message}</h3>
{/snippet}

{#snippet empty(message)}
  <h3>{message}</h3>
{/snippet}
{#snippet after(message)}
  <h3>{message}</h3>
{/snippet}


{@render before("Ready to Start")}
{#if store}
  {@render done({data: $store,
    ref: store.ref,
    error: store.error,
    first: store.meta.first,
    last: store.meta.last})}

{:else if $store.loading}
  {@render loading("Loading Data")}
{:else}
  {@render empty("No found result")}
{/if}
  
{@render after("Finish")}
  