import { browser } from "$app/environment"
import type { Settings } from "@types"

function createPersistedStore<T extends object>(key: string, initial: T) {

    const stored = browser ? localStorage.getItem(key) : null
    let state = $state<T>(stored ? JSON.parse(stored) : initial)
    let loading = $state(false)

    $effect.root(() => {
        $effect(() => {
            if (browser) localStorage.setItem(key, JSON.stringify(state))
        })
    })

    return {
        get state() { return state },
        get loading() { return loading },
        async set<K extends keyof T>(key: K, value: T[K]) {
            loading = true
            await new Promise(r => setTimeout(r, 0))
            state[key] = value
            loading = false
        }
    }
}

export const settings = createPersistedStore<Settings>("settings", {
    labels: true,
    legends: true,
    values: true,
    highlights: true,
    per_user: true
})
