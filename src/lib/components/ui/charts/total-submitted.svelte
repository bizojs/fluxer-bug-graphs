<script lang="ts">
    import { type ChartConfig, Tooltip }  from "@components/chart"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import { IsMobile } from "$lib/hooks/is-mobile.svelte"
    import * as Chart from "@components/charts/base"
    import * as Select from "@components/select"
    import type { BugReportData } from "@types"
    import { settings } from "@localstorage"
    import { BarChart } from "layerchart"

    const dataTypes = [
        { value: "bug", label: "Bug" },
        { value: "a11y", label: "A11y" },
        { value: "video", label: "Video" },
    ]

    let selected = $state("bug")
    let isMobile = new IsMobile()

    let details = $derived.by(() => {
        switch (selected) {
            case "bug":
                return {
                    title: "Total per user",
                    description: "Total number of normal bug reports submitted by each user"
                }
            case "a11y":
                return {
                    title: "Total per user",
                    description: "Total number of a11y bug reports submitted by each user"
                }
            case "video":
                return {
                    title: "Total per user",
                    description: "Total number of voice and video bug reports submitted by each user"
                }
            default:
                return {
                    title: "Total per user",
                    description: "Total number of normal bug reports submitted by each user"
                }
        }
    })
    const triggerContent = $derived(
        dataTypes.find((f) => f.value === selected)?.label ?? "Bug"
    )

    const total = $derived(
        BugReportHelper.getTotalReportsByUser(
            selected === "bug" ? 2 : 0,
            selected as BugReportData["type"]
        )
    )
    let width = $state(0)
    let height = $derived(total.length * (selected === "bug" ? 30 : 40))

    const chartConfig = {
        bug: {
            label: "Bug",
            color: "var(--canary)",
        },
        a11y: {
            label: "A11y",
            color: "var(--a11y)",
        },
        video: {
            label: "Video",
            color: "var(--video)",
        },
        total: {
            label: "Total",
            color: "var(--muted)",
        }
    } satisfies ChartConfig
</script>

<Chart.Root class="col-span-1">
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
    <Chart.Content {chartConfig} bind:width style="height: {height + 20}px;">
        <BarChart
            class="mr-auto"
            data={total}
            labels={settings.state.values ? { offset: 8, value: "count", seriesKey: "count" } : false}
            orientation="horizontal"
            y="username"
            axis={!!settings.state.labels}
            rule
            legend={!!settings.state.legends}
            series={[
                { key: "count", label: "Count", color: chartConfig[selected as BugReportData["type"]].color, selected: true }
            ]}
            padding={{ right: 32, left: settings.state.labels ? 100 : 0, bottom: settings.state.legends ? 48 : 0 }}
            {height}
            {width}
            props={{
                bars: {
                    stroke: "none",
                    radius: 6,
                    height: 18,
                    rounded: "all"
                },
                highlight: { area: settings.state.highlights ? true : { fill: "none" } },
                yAxis: {
                    tickLabelProps: {
                        textAnchor: "end",
                        class: "fill-primary! font-semibold!",
                    },
                    tickLength: 8,
                },
            }}
        >
            {#snippet tooltip()}
                <Tooltip mode="y" />
            {/snippet}
        </BarChart>
    </Chart.Content>
</Chart.Root>
