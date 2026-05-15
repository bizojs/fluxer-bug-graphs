<script lang="ts">
    import { InfoTooltip } from "@components/info-tooltip"
    import type { Snippet } from "svelte"

    type ChartTitleAsChild = {
        children: Snippet
        title?: never
        description?: never
        tooltip?: never
    }
    type ChartTitleAsProps = {
        children?: never
        title: string
        description: string
        tooltip?: string
    }
    type ChartTitleProps = ChartTitleAsChild | ChartTitleAsProps

    let { children, title, description, tooltip }: ChartTitleProps = $props()
</script>

<div class="flex md:flex-row flex-col items-start w-full justify-between gap-2">
    {#if children}
        {@render children?.()}
    {:else}
        <div class="w-full flex items-start justify-between">
            <div class="flex flex-col">
                <p class="text-lg font-bold">{title}</p>
                <p class="text-sm text-muted-foreground">{description}</p>
            </div>
            {#if tooltip}
                <InfoTooltip content={tooltip} />
            {/if}
        </div>
    {/if}
</div>
