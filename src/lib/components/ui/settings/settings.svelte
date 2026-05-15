<script lang="ts">
    import SettingsIcon from "@lucide/svelte/icons/settings"
    import { IsMobile } from "$lib/hooks/is-mobile.svelte"
    import { buttonVariants } from "@components/button"
    import { settings } from "@localstorage"
    import * as Dialog from "@components/dialog"
    import * as Drawer from "@components/drawer"
    import { Switch } from "@components/switch"
    import { Label } from "@components/label"
    import { cn } from "@utils"

    let open = $state(false)
    let isMobile = new IsMobile()

    let modal = {
        title: "Settings",
        description: "Manage settings related to the application",
    }
</script>

{#if isMobile.current}
    <Drawer.Root bind:open setBackgroundColorOnScale={false}>
        <Drawer.Trigger
            type="button"
            class={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "rounded-2xl")}
        >
            {@render SettingsButtonTriggerContent()}
        </Drawer.Trigger>
        <Drawer.Content class="min-w-dvw! m-0! w-full! min-h-[25dvh]">
            <div class="mx-auto w-full max-w-sm max-h-[80dvh] overflow-y-auto">
                <Drawer.Header>
                    <Drawer.Title>{modal.title}</Drawer.Title>
                    <Drawer.Description>{modal.description}</Drawer.Description>
                </Drawer.Header>
                {@render SettingsContent()}
            </div>
        </Drawer.Content>
    </Drawer.Root>
{:else}
    <Dialog.Root bind:open>
        <Dialog.Trigger
            type="button"
            class={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "rounded-2xl")}
        >
            {@render SettingsButtonTriggerContent()}
        </Dialog.Trigger>
        <Dialog.Content class="max-w-[80dvw] min-w-[80dvw] min-h-[25dvh] max-h-[80dvh] overflow-y-auto">
            <Dialog.Header>
                <Dialog.Title>{modal.title}</Dialog.Title>
                <Dialog.Description>{modal.description}</Dialog.Description>
            </Dialog.Header>
            {@render SettingsContent()}
        </Dialog.Content>
    </Dialog.Root>
{/if}

{#snippet SettingsButtonTriggerContent()}
    <SettingsIcon class="h-[1.2rem] w-[1.2rem]" />
    <span class="sr-only">Settings</span>
{/snippet}

{#snippet SettingsContent()}
    <div class="flex-1 text-center flex flex-col gap-10 items-start md:p-0 p-5">
        <div class="flex flex-col gap-4 w-full">
            {@render SettingsGroupTitle("Graphs")}
            <div class="flex items-center gap-2 justify-between text-start w-full">
                <Label for="per-user" class="flex flex-col text-start items-start gap-1 w-full">
                    <p class="font-medium">Per user</p>
                    <p class="text-xs text-muted-foreground">Show per user graph. Some people may see this as a "leaderboard" and want to disable it.</p>
                </Label>
                <Switch
                    id="per-user"
                    checked={settings.state.per_user ?? false}
                    onCheckedChange={(value: boolean) => settings.set("per_user", value)}
                    disabled={settings.loading}
                />
            </div>
        </div>
        <div class="flex flex-col gap-4 w-full">
            {@render SettingsGroupTitle("Interface")}
            <div class="flex items-center gap-2 justify-between text-start w-full">
                <Label for="show-labels" class="flex flex-col text-start items-start gap-1 w-full">
                    <p class="font-medium">Labels</p>
                    <p class="text-xs text-muted-foreground">Display X and Y labels on graphs</p>
                </Label>
                <Switch
                    id="show-labels"
                    checked={settings.state.labels ?? true}
                    onCheckedChange={(value: boolean) => settings.set("labels", value)}
                    disabled={settings.loading}
                />
            </div>
            <div class="flex items-center gap-2 justify-between text-start w-full">
                <Label for="show-values" class="flex flex-col text-start items-start gap-1 w-full">
                    <p class="font-medium">Values</p>
                    <p class="text-xs text-muted-foreground">Display number values across graphs</p>
                </Label>
                <Switch
                    id="show-values"
                    checked={settings.state.values ?? true}
                    onCheckedChange={(value: boolean) => settings.set("values", value)}
                    disabled={settings.loading}
                />
            </div>
            <div class="flex items-center gap-2 justify-between text-start w-full">
                <Label for="show-legends" class="flex flex-col text-start items-start gap-1 w-full">
                    <p class="font-medium">Legends</p>
                    <p class="text-xs text-muted-foreground">Show color legends at the bottom of graphs</p>
                </Label>
                <Switch
                    id="show-legends"
                    checked={settings.state.legends ?? true}
                    onCheckedChange={(value: boolean) => settings.set("legends", value)}
                    disabled={settings.loading}
                />
            </div>
            <div class="flex items-center gap-2 justify-between text-start w-full">
                <Label for="show-highlights" class="flex flex-col text-start items-start gap-1 w-full">
                    <p class="font-medium">Highlights</p>
                    <p class="text-xs text-muted-foreground">Highlight bars when hovering over graphs</p>
                </Label>
                <Switch
                    id="show-highlights"
                    checked={settings.state.highlights ?? true}
                    onCheckedChange={(value: boolean) => settings.set("highlights", value)}
                    disabled={settings.loading}
                />
            </div>
        </div>
    </div>
{/snippet}

{#snippet SettingsGroupTitle(name: string)}
    <p class="text-xl font-bold w-full border-b pb-2 mb-2 text-start">{name}</p>
{/snippet}
