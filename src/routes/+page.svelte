<script lang="ts">
    import * as Chart from "@components/charts"
    import { settings } from "@localstorage"
    import { Nav } from "@components/nav"
</script>

<div class="w-full flex flex-col">
    <Nav />
    <div class="w-full flex flex-col gap-5 p-5 mt-20">
        <Chart.ReportsOverTime />
        <div class="grid md:grid-cols-2 grid-cols-1 gap-5">
            <Chart.BugVsA11y />
            <Chart.ReportStates />
        </div>
        <div class="grid md:grid-cols-4 grid-cols-1 gap-5">
            <Chart.ApprovalRate />
            <Chart.FixRate />
        </div>
        {#if settings.state.per_user !== false}
            <Chart.TotalSubmitted />
        {/if}
    </div>
</div>
