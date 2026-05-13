import { processAll } from "@generator/process"
import { INFO_FILE } from "@generator/config"
import { fetchAll } from "@generator/fetch"
import type { InfoFileData } from "@types"
import fs from "fs/promises"

async function updateInfo() {
    let data: InfoFileData = {
        last_updated: null
    }
    let exists = await fs.stat(INFO_FILE).catch(() => null)

    if (!exists) {
        await fs.writeFile(INFO_FILE, JSON.stringify(data, null, 4), "utf-8")
    }

    try {
        const file = await fs.readFile(INFO_FILE, "utf-8")
        data = JSON.parse(file)
        data = {
            last_updated: new Date().toISOString()
        }
    } catch (error: any) {
        if (error?.toString()?.includes("Unexpected end of JSON input")) {
            console.warn("Info file is empty, creating a new one...")
        } else {
            console.warn(error)
        }
        data = {
            last_updated: new Date().toISOString()
        }
    } finally {
        console.log("Info file updated")
        await fs.writeFile(INFO_FILE, JSON.stringify(data, null, 4), "utf-8")
    }
}

async function main() {
    const args = process.argv.slice(2)
    const onlyFetch = args.includes("--fetch")
    const onlyProcess = args.includes("--process")

    if (!onlyProcess) await fetchAll()

    if (!onlyFetch) await processAll()

    await updateInfo()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
