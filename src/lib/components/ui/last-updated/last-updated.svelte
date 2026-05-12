<script lang="ts">
    import info from "@generator/info.json"
</script>

{#if info?.last_updated}
    <p class="font-mono text-xs select-none">
        Last updated:
        <span class="text-muted-foreground">
            {new Date(info.last_updated).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                minute: "numeric",
                hour: "numeric",
                second: "numeric",
                timeZoneName: "short",
            })}
        </span>
    </p>
{:else}
    <p class="opacity-0">last_updated not found</p>
{/if}
