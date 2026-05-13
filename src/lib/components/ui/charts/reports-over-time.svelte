<script lang="ts">
    import { type ChartConfig, Tooltip }  from "@components/chart"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import { IsMobile } from "$lib/hooks/is-mobile.svelte"
    import * as Chart from "@components/charts/base"
    import * as Select from "@components/select"
    import type { BugReportData } from "@types"
    import { settings } from "@localstorage"
    import { LineChart } from "layerchart"
    import { curveBumpX } from "d3-shape"
    import { scaleUtc } from "d3-scale"
    import { cn } from "@utils"

    let { data }: { data: BugReportData[] } = $props()

    const dataTypes = [
        { value: "per-day", label: "Per day" },
        { value: "over-time", label: "Over time" }
    ]

    let selected = $state("per-day")
    let isMobile = new IsMobile()

    let details = $derived(
        selected === "per-day"
            ? {
                title: "Reports per day",
                description: "Daily report submissions since the first report"
            }
            : {
                title: "Reports over time",
                description: "Cumulative report submissions since the first report"
            }
    )

    const triggerContent = $derived(
        dataTypes.find((f) => f.value === selected)?.label ?? "Per day"
    )

    const total = $derived(
        selected === "per-day"
            ? BugReportHelper.getReportsByDate(data)
            : BugReportHelper.getBugReportsOverTime(data)
    )

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

<Chart.Root class={cn(settings.state.per_user ? "col-span-1" : "col-span-2")}>
    <Chart.Title>
        <div class="flex flex-col">
            <p class="text-lg font-bold">{details.title}</p>
            <p class="text-sm text-muted-foreground">{details.description}</p>
        </div>
        <Select.Root type="single" name="data-type" bind:value={selected}>
            <Select.Trigger class="w-fit text-xs" size="sm">
                {triggerContent}
            </Select.Trigger>
            <Select.Content align={isMobile.current ? "start" : "end"} class="min-w-38">
                {#each dataTypes as type (type.value)}
                    <Select.Item
                        value={type.value}
                        label={type.label}
                    >
                        {type.label}
                    </Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
    </Chart.Title>
    <Chart.Content {chartConfig} bind:width class={cn(settings.state.per_user ? "h-125" : "h-75")}>
        <LineChart
            data={total}
            legend={!!settings.state.legends}
            labels={!!settings.state.values}
            points={settings.state.values ? { r: 3, fill: "var(--primary)", stroke: "none" } : false}
            padding={{ top: 24, right: 24, bottom: settings.state.legends ? 42 : 0, left: 24 }}
            x="date"
            y="total"
            axis={!!settings.state.labels}
            xScale={scaleUtc()}
            series={[
                {
                    key: "bug",
                    label: "Bug",
                    color: chartConfig.bug.color
                },
                {
                    key: "a11y",
                    label: "A11y",
                    color: chartConfig.a11y.color
                },
            ]}
            class="mr-auto pr-4"
            height={settings.state.per_user ? 500 : 300}
            {width}
            props={{
                spline: { curve: curveBumpX, strokeWidth: 3 },
                xAxis: {
                    ticks: undefined,
                    format: (v: Date) => {
                        return v.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    },
                },
                highlight: { points: settings.state.highlights ? { r: 6 } : false },
            }}
        >
            {#snippet tooltip()}
                <Tooltip
                    labelFormatter={(v: Date) => {
                        return v.toLocaleDateString("en-US", { month: "long", day: "numeric" })
                    }}
                />
            {/snippet}
        </LineChart>
    </Chart.Content>
</Chart.Root>
