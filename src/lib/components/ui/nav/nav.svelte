<script lang="ts">
    import { LastUpdated } from "@components/last-updated"
    import { ThemeToggle } from "@components/theme-toggle"
    import { Settings } from "@components/settings"
    import { Warning } from "@components/warning"
</script>

<div class="fixed top-0 border-b bg-primary/2 border-border/60 w-full flex items-center justify-between backdrop-blur-lg p-5 z-999">
    <LastUpdated />
    <div class="flex items-center gap-1">
        <Warning />
        <Settings />
        <ThemeToggle />
    </div>
</div>
