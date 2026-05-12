<script lang="ts">
    import { LastUpdated } from "@components/last-updated"
    import { ThemeToggle } from "@components/theme-toggle"
    import * as Chart from "@components/charts"
    import type { BugReportData } from "@types"
    import data from "@generator/data.json"

    let d = data as BugReportData[]
</script>

<div class="w-full flex flex-col gap-5 p-5">
    <div class="flex items-center justify-between">
        <LastUpdated />
        <ThemeToggle />
    </div>
    <div class="grid md:grid-cols-2 grid-cols-1 w-full gap-5">
        <Chart.TotalSubmitted data={d} />
        <Chart.ReportsOverTime data={d} />
    </div>
    <div class="grid md:grid-cols-6 grid-cols-1 gap-5">
        <Chart.BugVsA11y data={d} />
        <Chart.ApprovalRate data={d} />
    </div>
</div>
