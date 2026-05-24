<script lang="ts">
    import { type ChartConfig, Tooltip }  from "@components/chart"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import * as Chart from "@components/charts/base"
    import { PieChart, Text } from "layerchart"
    import { settings } from "@localstorage"

    const states = $derived(BugReportHelper.getReportStates())
    let width = $state(0)

    const chartConfig = {
        waiting_approval: {
            label: "Waiting Approval",
            color: "#EAB308",
        },
        confirmed: {
            label: "Confirmed",
            color: "#3B82F6",
        },
        claimed_fixed: {
            label: "Claimed Fixed",
            color: "#F97316",
        },
        fixed: {
            label: "Fixed",
            color: "var(--status-success)",
        },
        denied: {
            label: "Denied",
            color: "var(--status-danger)",
        },
    } satisfies ChartConfig
</script>

<Chart.Root class="col-span-1">
    <Chart.Title
        title="Report status"
        description="Breakdown of bug reports by their current status"
        tooltip="Each report is assigned a status based on which channel it resides in:<br />- <b>Waiting Approval</b>: The report is pending review in <code class='text-[11px]'>#Approval Queue</code><br />- <b>Confirmed</b>: The report has been approved and is awaiting a fix<br />- <b>Claimed Fixed</b>: The report has been moved to <code class='text-[11px]'>#Claimed Fixed</code> but not yet verified<br />- <b>Fixed</b>: The report has been resolved and moved to <code class='text-[11px]'>#Fixed Bugs</code><br />- <b>Denied</b>: The report was rejected and moved to <code class='text-[11px]'>#Denied Reports</code>"
    />
    <Chart.Content {chartConfig} bind:width class="h-37.5">
        <PieChart
            class="mx-auto"
            data={states as any}
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
                bars: {
                    stroke: "none",
                    radius: 6,
                    height: 24,
                    rounded: "all"
                },
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
                <Tooltip label="Bug Reports" />
            {/snippet}
        </PieChart>
    </Chart.Content>
</Chart.Root>
