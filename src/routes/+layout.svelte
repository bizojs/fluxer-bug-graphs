<script lang="ts">
	import "./layout.css"
    import "@fontsource-variable/ibm-plex-sans/wght.css"
    import * as Tooltip from "@components/tooltip"
    import { ModeWatcher } from "mode-watcher"
    import { page } from "$app/state"

	let { children } = $props()
</script>

<ModeWatcher />

<svelte:head>
    <meta name="description" content="Fluxer Testers bug report data visualized into graphs/charts" />
    <meta property="og:title" content="Fluxer Canary" />
    <meta property="og:description" content="Fluxer Testers bug report data visualized into graphs/charts" />
    <meta property="og:image:type" content="image/jpeg">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:image:width" content="860">
    <meta property="og:image:height" content="388">
    <meta property="og:image" content={page.url.origin + "/demo.png"} />
    <meta property="og:url" content={page.url.href}>
</svelte:head>

<Tooltip.Provider>
    <div class="w-dvw min-h-screen overflow-x-hidden">
        {@render children()}
    </div>
</Tooltip.Provider>
