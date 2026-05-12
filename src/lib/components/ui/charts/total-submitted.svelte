<script lang="ts">
    import { type ChartConfig, Tooltip }  from "@components/chart"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import * as Chart from "@components/charts/base"
    import type { BugReportData } from "@types"
    import { BarChart } from "layerchart"

    let { data }: { data: BugReportData[] } = $props()

    const totalSubmitted = $derived(BugReportHelper.getTotalReportsByUser(data, 2))
    let width = $state(0)

    const chartConfig = {
        bug: {
            label: "Bug",
            color: "var(--canary)",
        },
        a11y: {
            label: "A11y",
            color: "var(--a11y)",
        },
        total: {
            label: "Total",
            color: "var(--muted)",
        }
    } satisfies ChartConfig
</script>

<Chart.Root class="col-span-1">
    <Chart.Title
        title="Total per user"
        description="Total number of bug reports submitted by each user. Users with less than 3 reports are excluded"
    />
    <Chart.Content {chartConfig} bind:width>
        <BarChart
            class="mr-auto"
            data={totalSubmitted}
            labels={{ offset: 12, value: "total", seriesKey: "bug" }}
            orientation="horizontal"
            y="username"
            axis="y"
            x="total"
            rule
            legend
            series={[
                { key: "bug", label: "Bug", color: chartConfig.bug.color, selected: true },
                { key: "a11y", label: "A11y", color: chartConfig.a11y.color, selected: true },
            ]}
            seriesLayout="overlap"
            padding={{ right: 16 }}
            height={500}
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
                        textAnchor: "start",
                        dx: 6,
                        class: "fill-primary-foreground! font-semibold!",
                    }
                }
            }}
        >
            {#snippet tooltip()}
                <Tooltip label="Bug Reports" />
            {/snippet}
        </BarChart>
    </Chart.Content>
</Chart.Root>
