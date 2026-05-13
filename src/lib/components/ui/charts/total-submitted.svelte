<script lang="ts">
    import { type ChartConfig, Tooltip }  from "@components/chart"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import type { BugReportData, Settings } from "@types"
    import * as Chart from "@components/charts/base"
    import { settings } from "@localstorage"
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
        description="Total number of bug reports submitted by each user"
    />
    <Chart.Content {chartConfig} bind:width>
        <BarChart
            class="mr-auto"
            data={totalSubmitted}
            labels={settings.state.values ? { offset: 12, value: "total", seriesKey: "bug" } : false}
            orientation="horizontal"
            y="username"
            x="total"
            axis={!!settings.state.labels}
            rule
            legend={!!settings.state.legends}
            series={[
                { key: "bug", label: "Bug", color: chartConfig.bug.color, selected: true },
                { key: "a11y", label: "A11y", color: chartConfig.a11y.color, selected: true },
            ]}
            seriesLayout="overlap"
            padding={{ right: 16, left: settings.state.labels ? 130 : 0, bottom: settings.state.legends ? 42 : 0 }}
            height={500}
            {width}
            props={{
                bars: {
                    stroke: "none",
                    radius: 6,
                    height: 20,
                    rounded: "all"
                },
                highlight: { area: settings.state.highlights ? true : { fill: "none" } },
                yAxis: {
                    tickLabelProps: {
                        textAnchor: "end",
                        class: "fill-primary! font-semibold!",
                    },
                    tickLength: 10,
                },
            }}
        >
            {#snippet tooltip(context)}
                <Tooltip
                    labelFormatter={(v: string) => context.context.data.username}
                />
            {/snippet}
        </BarChart>
    </Chart.Content>
</Chart.Root>
