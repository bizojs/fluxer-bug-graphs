<script lang="ts">
    import type { Snippet } from "svelte"
    import { cn } from "@utils"

    type ChartRootProps = {
        children: Snippet
        class?: string
    }

    let { children, class: className }: ChartRootProps = $props()
</script>

<div class={cn(className, "flex flex-col gap-4 p-4 rounded-3xl bg-primary/5 dark:bg-primary/2 border")}>
    {@render children?.()}
</div>
