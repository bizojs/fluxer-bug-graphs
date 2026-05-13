import { TOKEN, CHANNELS, API_BASE, DATA_DIR } from "@generator/config"
import fs from "fs/promises"
import path from "path"

interface RawMessage {
    id: string
    [key: string]: any
}

async function fetchMessages(channelId: string): Promise<Record<string, RawMessage>> {

    const messages: Record<string, RawMessage> = {}
    let before: string | undefined = undefined

    while (true) {

        const url = `${API_BASE}/channels/${channelId}/messages?limit=100${before ? `&before=${before}` : ""}`

        const res = await fetch(url, {
            headers: {
                "Authorization": TOKEN,
                "Origin": API_BASE.replace("api", "web")
            }
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch channel ${channelId}: ${res.status} ${res.statusText}`)
        }

        const batch: RawMessage[] = await res.json()

        if (batch.length === 0) break

        for (const msg of batch) {
            messages[msg.id] = msg
        }

        if (batch.length < 100) break

        before = batch.reduce((min, msg) => (BigInt(msg.id) < BigInt(min) ? msg.id : min), batch[0].id)

        console.log(`\tFetched ${Object.keys(messages).length} messages. continuing before ${before}....`)

    }

    return messages

}

async function loadExisting(filePath: string): Promise<Record<string, RawMessage>> {
    try {
        const raw = await fs.readFile(filePath, "utf-8")
        return JSON.parse(raw)
    } catch {
        return {}
    }
}

export async function fetchAll() {
    await fs.mkdir(DATA_DIR, { recursive: true })

    for (const [name, channelId] of Object.entries(CHANNELS)) {
        console.log(`Fetching ${name}...`)
        const filePath = path.join(DATA_DIR, `${name}.json`)

        const existing = await loadExisting(filePath)
        const fetched = await fetchMessages(channelId)

        const merged = { ...existing, ...fetched }
        await fs.writeFile(filePath, JSON.stringify(merged, null, 4))

        console.log(`\tDone. ${Object.keys(merged).length} total messages saved.`)
    }
}
