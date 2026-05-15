<script lang="ts">
	import "./layout.css"
    import "@fontsource-variable/ibm-plex-sans/wght.css"
    import { ModeWatcher } from "mode-watcher"

	let { children } = $props()
</script>

<ModeWatcher />

<div class="w-dvw min-h-screen overflow-x-hidden">
    {@render children()}
</div>
