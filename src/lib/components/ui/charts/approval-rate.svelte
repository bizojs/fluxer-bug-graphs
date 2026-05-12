<script lang="ts">
    import { type ChartConfig, Tooltip }  from "@components/chart"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import * as Chart from "@components/charts/base"
    import type { BugReportData } from "@types"
    import { PieChart, Text } from "layerchart"

    let { data }: { data: BugReportData[] } = $props()

    const approvalRate = $derived(BugReportHelper.getApprovalRate(data))
    let percentage = $derived.by(() => {
        let approved = approvalRate.find((item) => item.key.toLowerCase() === "approved")?.value ?? 0
        let not_approved = approvalRate.find((item) => item.key.toLowerCase() === "not approved")?.value ?? 0
        return ((approved / (approved + not_approved)) * 100).toFixed(0)
    })
    let width = $state(0)

    const chartConfig = {
        approved: {
            label: "Approved",
            color: "var(--approved)",
        },
        not_approved: {
            label: "Not Approved",
            color: "var(--not-approved)",
        }
    } satisfies ChartConfig
</script>

<Chart.Root class="md:col-span-2 col-span-1">
    <Chart.Title
        title="Approval rate"
        description="How many bug reports are currently approved vs still in the approval queue"
    />
    <Chart.Content {chartConfig} bind:width class="h-37.5">
        <PieChart
            class="mx-auto"
            data={approvalRate as any}
            legend
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
                <Text
                    value="{percentage}%"
                    textAnchor="middle"
                    verticalAnchor="middle"
                    class="text-2xl! font-bold!"
                    dy={3}
                />
            {/snippet}
            {#snippet tooltip()}
                <Tooltip label="Bug Reports" />
            {/snippet}
        </PieChart>
    </Chart.Content>
</Chart.Root>

<!-- <div class="flex flex-col gap-4 p-4 rounded-3xl bg-primary/5 dark:bg-primary/2 border md:col-span-2 col-span-1">
    <div class="flex flex-col">
        <p class="text-lg font-bold">Approval rate</p>
        <p class="text-sm text-muted-foreground">How many bug reports are currently approved vs still in the approval queue</p>
    </div>
    <div bind:this={containerEl}>
        <Chart.Container config={chartConfig} class="h-37.5">
            <PieChart
                class="mx-auto"
                data={approvalRate as any}
                legend
                innerRadius={-15}
                cornerRadius={6}
                padAngle={0.03}
                key="key"
                value="value"
                c="color"
                cRange={Object.values(chartConfig).map((item) => item.color)}
                height={150}
                width={chartWidth}
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
                    <Text
                        value="{percentage}%"
                        textAnchor="middle"
                        verticalAnchor="middle"
                        class="text-2xl! font-bold!"
                        dy={3}
                    />
                {/snippet}
                {#snippet tooltip()}
                    <Chart.Tooltip label="Bug Reports" />
                {/snippet}
            </PieChart>
        </Chart.Container>
    </div>
</div> -->
