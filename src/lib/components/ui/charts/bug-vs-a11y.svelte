<script lang="ts">
    import { type ChartConfig, Tooltip }  from "@components/chart"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import * as Chart from "@components/charts/base"
    import type { BugReportData } from "@types"
    import { settings } from "@localstorage"
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

<Chart.Root class="md:col-span-3 col-span-1">
    <Chart.Title
        title="Bug <-> A11y"
        description="The difference between regular bug reports and accessibility reports"
    />
    <Chart.Content {chartConfig} bind:width class="h-37.5">
        <BarChart
            data={difference}
            labels={settings.state.values ? { offset: 12 } : false}
            orientation="horizontal"
            y="type"
            axis={settings.state.labels ? "y" : false}
            series={[{ key: "count", label: "Amount" }]}
            padding={{ left: settings.state.labels ? 38 : 0, right: 28 }}
            height={100}
            {width}
            props={{
                bars: {
                    stroke: "none",
                    radius: 6,
                    height: 24,
                    rounded: "all"
                },
                highlight: { area: settings.state.highlights ? true : { fill: "none" } },
                yAxis: {
                    tickLabelProps: {
                        dx: -12,
                        class: "fill-primary! font-semibold!",
                    },
                    tickLength: 0,
                },
            }}
        >
            {#snippet tooltip()}
                <Tooltip labelKey="type" />
            {/snippet}
        </BarChart>
    </Chart.Content>
</Chart.Root>
