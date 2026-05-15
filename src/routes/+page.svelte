<script lang="ts">
    import { LastUpdated } from "@components/last-updated"
    import { ThemeToggle } from "@components/theme-toggle"
    import { Settings } from "@components/settings"
    import { Warning } from "@components/warning"
    import * as Chart from "@components/charts"
    import { settings } from "@localstorage"
</script>

<div class="w-full flex flex-col gap-5 p-5">
    <div class="flex items-center justify-between">
        <LastUpdated />
        <div class="flex items-center gap-1">
            <Warning />
            <Settings />
            <ThemeToggle />
        </div>
    </div>
    <Chart.ReportsOverTime />
    <div class="grid 2xl:grid-cols-7 md:grid-cols-5 grid-cols-1 gap-5">
        <Chart.BugVsA11y />
        <Chart.ApprovalRate />
        <Chart.FixRate />
    </div>
    {#if settings.state.per_user !== false}
        <Chart.TotalSubmitted />
    {/if}
</div>
