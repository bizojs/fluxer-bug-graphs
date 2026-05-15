<script lang="ts">
    import { IsMobile } from "$lib/hooks/is-mobile.svelte"
    import InfoIcon from "@lucide/svelte/icons/info"
    import * as Tooltip from "@components/tooltip"
    import * as Popover from "@components/popover"
    import type { Snippet } from "svelte"

    let open = $state(false)
    let isMobile = new IsMobile()

    type InfoTooltipAsChild = {
        content?: never
        children: Snippet
    }

    type InfoTooltipAsProp = {
        content: string
        children?: never
    }

    type InfoTooltipProps = InfoTooltipAsChild | InfoTooltipAsProp

    let { content, children }: InfoTooltipProps = $props()
</script>

{#if isMobile.current}
    <Popover.Root>
        <Popover.Trigger class="stroke-muted-foreground hover:stroke-primary transition-all">
            <InfoIcon class="size-4.5 stroke-inherit" />
        </Popover.Trigger>
        <Popover.Content side="top" class="p-2 min-w-[80dvw]">
            {#if content}
                <p class="text-xs">{@html content}</p>
            {:else}
                {@render children?.()}
            {/if}
        </Popover.Content>
    </Popover.Root>
{:else}
    <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger class="stroke-muted-foreground hover:stroke-primary transition-all">
            <InfoIcon class="size-4.5 stroke-inherit" />
        </Tooltip.Trigger>
        <Tooltip.Content class="bg-popover text-primary border p-3 rounded-2xl min-w-90" arrowClasses="bg-popover">
            {#if content}
                <p class="text-xs">{@html content}</p>
            {:else}
                {@render children?.()}
            {/if}
        </Tooltip.Content>
    </Tooltip.Root>
{/if}
