<script lang="ts">
    import type { Snippet } from "svelte"

    type ChartTitleAsChild = {
        children: Snippet
        title?: never
        description?: never
    }
    type ChartTitleAsProps = {
        children?: never
        title: string
        description: string
    }
    type ChartTitleProps = ChartTitleAsChild | ChartTitleAsProps

    let { children, title, description }: ChartTitleProps = $props()
</script>

<div class="flex md:flex-row flex-col items-start w-full justify-between gap-2">
    {#if children}
        {@render children?.()}
    {:else}
        <div class="flex flex-col">
            <p class="text-lg font-bold">{title}</p>
            <p class="text-sm text-muted-foreground">{description}</p>
        </div>
    {/if}
</div>
