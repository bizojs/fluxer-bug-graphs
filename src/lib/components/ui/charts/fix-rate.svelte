<script lang="ts">
    import { type ChartConfig, Tooltip }  from "@components/chart"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import * as Chart from "@components/charts/base"
    import type { BugReportData } from "@types"
    import { PieChart, Text } from "layerchart"
    import { settings } from "@localstorage"

    let { data }: { data: BugReportData[] } = $props()

    const fixRate = $derived(BugReportHelper.getFixRate(data))
    let percentage = $derived.by(() => {
        let fixed = fixRate.find((item) => item.key.toLowerCase() === "fixed")?.value ?? 0
        let not_fixed = fixRate.find((item) => item.key.toLowerCase() === "not fixed")?.value ?? 0
        return parseFloat(((fixed / (fixed + not_fixed)) * 100).toFixed(1))
    })
    let width = $state(0)

    const chartConfig = {
        fixed: {
            label: "Not Fixed",
            color: "var(--status-success)",
        },
        not_fixed: {
            label: "Fixed",
            color: "var(--status-danger)",
        },
        maybe_fixed: {
            label: "Undetermined",
            color: "var(--status-undetermined)",
        },
    } satisfies ChartConfig
</script>

<Chart.Root class="md:col-span-2 col-span-1">
    <Chart.Title
        title="Fix rate"
        description="How many bug are reported as fixed, not fixed or undetermined"
    />
    <Chart.Content {chartConfig} bind:width class="h-37.5">
        <PieChart
            class="mx-auto"
            data={fixRate as any}
            legend={!!settings.state.legends}
            innerRadius={-15}
            cornerRadius={6}
            padAngle={0.03}
            key="key"
            value="value"
            c="color"
            cRange={Object.values(chartConfig).map((item) => item.color)}
            height={150}
            {width}
            props={{
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
            {#snippet aboveMarks()}
                {#if settings.state.values}
                    <Text
                        value="{percentage}%"
                        textAnchor="middle"
                        verticalAnchor="middle"
                        class="text-2xl! font-bold!"
                        dy={3}
                    />
                {/if}
            {/snippet}
            {#snippet tooltip()}
                <Tooltip label="Bug Reports" />
            {/snippet}
        </PieChart>
    </Chart.Content>
</Chart.Root>
