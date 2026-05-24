<script lang="ts">
    import * as Chart from "@components/chart"
    import type { Snippet } from "svelte"
    import { cn } from "$lib/utils"

    type ChartContentProps = {
        children: Snippet
        chartConfig: Chart.ChartConfig
        class?: string
        style?: string
        width: number
    }

    let { children, chartConfig, class: className, width = $bindable(), style }: ChartContentProps = $props()

    let containerEl: HTMLElement | null = $state(null)

    $effect(() => {
        if (!containerEl) return
        const observer = new ResizeObserver(([entry]) => {
            width = Math.floor(entry.contentRect.width)
        })
        observer.observe(containerEl)
        return () => observer.disconnect()
    })
</script>

<div bind:this={containerEl}>
    <Chart.Container config={chartConfig} class={cn(className, "w-fit")} {style}>
        {@render children?.()}
    </Chart.Container>
</div>
