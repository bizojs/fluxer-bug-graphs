<script lang="ts">
    import { type ChartConfig, Tooltip }  from "@components/chart"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import * as Chart from "@components/charts/base"
    import type { BugReportData } from "@types"
    import { BarChart } from "layerchart"

    let { data }: { data: BugReportData[] } = $props()

    const difference = $derived(BugReportHelper.getBugVsA11y(data))
    let width = $state(0)

    const chartConfig = {
        bug: {
            label: "Bug",
            color: "var(--canary)",
        },
        a11y: {
            label: "A11y",
            color: "var(--a11y)",
        }
    } satisfies ChartConfig
</script>

<Chart.Root class="md:col-span-4 col-span-1">
    <Chart.Title
        title="Bug <-> A11y"
        description="The difference between regular bug reports and accessibility reports"
    />
    <Chart.Content {chartConfig} bind:width class="h-37.5">
        <BarChart
            data={difference}
            labels={{ offset: 12 }}
            orientation="horizontal"
            y="type"
            axis="y"
            series={[{ key: "count", label: "Count" }]}
            padding={{ left: 38, right: 28 }}
            height={100}
            {width}
            props={{
                bars: {
                    stroke: "none",
                    radius: 6,
                    height: 24,
                    rounded: "all"
                },
                highlight: { area: { fill: "none" } },
                yAxis: {
                    tickLabelProps: {
                        dx: -12,
                        class: "fill-primary!",
                    },
                    tickLength: 0,
                },
            }}
        >
            {#snippet tooltip()}
                <Tooltip label="Bug Reports" />
            {/snippet}
        </BarChart>
    </Chart.Content>
</Chart.Root>

<!-- <div class="flex flex-col gap-4 p-4 rounded-3xl bg-primary/5 dark:bg-primary/2 border md:col-span-4 col-span-1">
    <div class="flex flex-col">
        <p class="text-lg font-bold">Bug {"<->"} A11y</p>
        <p class="text-sm text-muted-foreground">The difference between normal bug reports and a11y (accessibility) reports</p>
    </div>
    <div class="flex items-start justify-start" bind:this={containerEl}>
        <Chart.Container config={chartConfig} class="h-25">
            <BarChart
                data={difference}
                labels={{ offset: 12 }}
                orientation="horizontal"
                y="type"
                axis="y"
                series={[{ key: "count", label: "Count" }]}
                padding={{ left: 38, right: 28 }}
                height={100}
                width={chartWidth}
                props={{
                    bars: {
                        stroke: "none",
                        radius: 6,
                        height: 24,
                        rounded: "all"
                    },
                    highlight: { area: { fill: "none" } },
                    yAxis: {
                        tickLabelProps: {
                            dx: -12,
                            class: "fill-primary!",
                        },
                        tickLength: 0,
                    },
                }}
            >
                {#snippet tooltip()}
                    <Chart.Tooltip label="Bug Reports" />
                {/snippet}
            </BarChart>
        </Chart.Container>
    </div>
</div> -->
