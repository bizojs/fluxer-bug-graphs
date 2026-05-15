<script lang="ts">
    import WarningIcon from "@lucide/svelte/icons/info"
    import { BugReportHelper } from "@helpers/BugReportHelper"
    import { IsMobile } from "$lib/hooks/is-mobile.svelte"
    import { buttonVariants } from "@components/button"
    import * as Dialog from "@components/dialog"
    import * as Drawer from "@components/drawer"
    import { cn } from "@utils"

    let open = $state(false)
    let isMobile = new IsMobile()

    let missingIds = $state(BugReportHelper.getMissingReports())
    let showMore = $state(false)
    let showing = $derived(showMore ? missingIds : missingIds.slice(0, 20))

    let modal = {
        title: "Transparency",
        description: "Any notable information regarding bug report data",
    }
</script>

{#if isMobile.current}
    <Drawer.Root bind:open setBackgroundColorOnScale={false}>
        <Drawer.Trigger
            type="button"
            class={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "rounded-2xl")}
        >
            {@render WarningButtonTriggerContent()}
        </Drawer.Trigger>
        <Drawer.Content class="min-w-dvw! m-0! w-full! min-h-[25dvh]">
            <div class="mx-auto w-full max-w-sm max-h-[80dvh] overflow-y-auto">
                <Drawer.Header>
                    <Drawer.Title>{modal.title}</Drawer.Title>
                    <Drawer.Description>{modal.description}</Drawer.Description>
                </Drawer.Header>
                {@render WarningContent()}
            </div>
        </Drawer.Content>
    </Drawer.Root>
{:else}
    <Dialog.Root bind:open>
        <Dialog.Trigger
            type="button"
            class={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "rounded-2xl")}
        >
            {@render WarningButtonTriggerContent()}
        </Dialog.Trigger>
        <Dialog.Content class="max-w-[80dvw] min-w-[80dvw] min-h-[25dvh] max-h-[80dvh] overflow-y-auto">
            <Dialog.Header>
                <Dialog.Title>{modal.title}</Dialog.Title>
                <Dialog.Description>{modal.description}</Dialog.Description>
            </Dialog.Header>
            {@render WarningContent()}
        </Dialog.Content>
    </Dialog.Root>
{/if}

{#snippet WarningButtonTriggerContent()}
    <WarningIcon class="h-[1.2rem] w-[1.2rem] stroke-amber-400" />
    <span class="sr-only">Warnings</span>
{/snippet}

{#snippet WarningContent()}
    <div class="flex-1 text-center flex flex-col gap-10 items-start md:p-0 p-5">
        <div class="flex flex-col gap-4 w-full">
            {@render WarningGroupTitle("Data")}
            <div class="flex items-start gap-2 w-full">
                <div class="flex flex-col text-start items-start gap-2 w-full">
                    <p class="font-medium">Denied reports</p>
                    <div class="flex w-full flex-col gap-1">
                        <p class="text-xs text-muted-foreground">
                            Reports that have been denied and live in the <code class="text-[11px]">#Denied Reports</code> channel are not tracked or displayed.
                        </p>
                        <p class="text-xs text-muted-foreground">
                            The "Approval rate" graph simply tracks which reports remain in the <code class="text-[11px]">#Approval Queue</code> channel as explained in the info tooltip in the top right of the graph.
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex items-start gap-2 w-full">
                <div class="flex flex-col text-start items-start gap-2 w-full">
                    <p class="font-medium">Missing data</p>
                    <p class="text-xs text-muted-foreground">
                        The following report IDs are missing:
                    </p>
                    <div class="flex items-center gap-1 flex-wrap">
                        {#each showing as id}
                            <code class="text-[11px]">#{id}</code>
                        {/each}
                        <button
                            class="text-xs hover:underline text-sky-400 cursor-pointer transition-all"
                            onclick={() => (showMore = !showMore)}
                        >
                            Show {showMore ? "less" : `${missingIds.length - showing.length} more`}
                        </button>
                    </div>
                    <p class="text-xs text-muted-foreground">
                        This is likely due to the bug report being denied or a test report by the Fluxer Testers staff.
                    </p>
                </div>
            </div>
        </div>
    </div>
{/snippet}

{#snippet WarningGroupTitle(name: string)}
    <p class="text-xl font-bold w-full border-b pb-2 mb-2 text-start">{name}</p>
{/snippet}
