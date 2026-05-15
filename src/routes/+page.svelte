<script lang="ts">
    import { LastUpdated } from "@components/last-updated"
    import { ThemeToggle } from "@components/theme-toggle"
    import { Settings } from "@components/settings"
    import * as Chart from "@components/charts"
    import type { BugReportData } from "@types"
    import { settings } from "@localstorage"
    import data from "@generator/data.json"

    let d = data as BugReportData[]
</script>

<div class="w-full flex flex-col gap-5 p-5">
    <div class="flex items-center justify-between">
        <LastUpdated />
        <div class="flex items-center gap-1">
            <Settings />
            <ThemeToggle />
        </div>
    </div>
    <div class="grid md:grid-cols-2 grid-cols-1 w-full gap-5">
        {#if settings.state.per_user !== false}
            <Chart.TotalSubmitted data={d} />
        {/if}
        <Chart.ReportsOverTime data={d} />
    </div>
    <div class="grid 2xl:grid-cols-7 md:grid-cols-5 grid-cols-1 gap-5">
        <Chart.BugVsA11y data={d} />
        <Chart.ApprovalRate data={d} />
        <Chart.FixRate data={d} />
    </div>
</div>
