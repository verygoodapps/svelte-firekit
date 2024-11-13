<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import "../app.css";
	let { children } = $props();
	import { ModeWatcher } from "mode-watcher";
</script>

<ModeWatcher />
<Toaster />
{@render children()}
