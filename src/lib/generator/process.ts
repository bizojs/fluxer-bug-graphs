import { CHANNELS, COLORS, DATA_DIR, PROCESSED_FILE } from "@generator/config"
import type { ChannelName } from "@generator/config"
import type { BugReportData } from "@types"
import fs from "fs/promises"
import path from "path"

function getReportType(color: Number): BugReportData["type"] {
    switch (color) {
        case COLORS.a11y: return "a11y"
        case COLORS.bug: return "bug"
        case COLORS.video: return "video"
        default: return "bug"
    }
}

function parseReport(msg: any, channelName: ChannelName): BugReportData | null {
    const embed = msg.embeds?.[0]
    if (!embed) return null

    const footerText = embed.footer?.text
    if (!footerText) return null

    const id = parseInt(footerText.replace("#", ""), 10)
    if (isNaN(id)) return null

    const user = embed.author?.name
    if (!user) return null

    const color = embed.color
    const type = getReportType(color)

    const approved = channelName !== "Approval Queue"
    const denied = channelName === "Denied Reports"
    const fixed = channelName === "Claimed Fixed" ? null : channelName === "Fixed Bugs"

    return {
        id,
        message_id: msg.id,
        user,
        created: embed.timestamp ?? msg.timestamp,
        type,
        approved,
        approved_timestamp: approved ? msg.timestamp : null,
        fixed,
        fixed_timestamp: fixed ? msg.timestamp : null,
        denied
    }
}

export async function processAll() {
    const reports: Record<string, BugReportData> = {}

    for (const channelName of Object.keys(CHANNELS) as ChannelName[]) {
        const filePath = path.join(DATA_DIR, `${channelName}.json`)

        let raw: Record<string, any>
        try {
            const content = await fs.readFile(filePath, "utf-8")
            raw = JSON.parse(content)
        } catch {
            console.warn(`No raw file found for ${channelName}, skipping.`)
            continue
        }

        let count = 0
        for (const msg of Object.values(raw)) {
            const report = parseReport(msg, channelName)
            if (!report) continue
            if (reports[report.id]) continue
            reports[report.id] = report
            count++
        }

        console.log(`Processed ${count} messages from ${channelName}`)
    }

    const output = Object.values(reports).sort((a, b) => a.id - b.id)
    await fs.mkdir(path.dirname(PROCESSED_FILE), { recursive: true })
    await fs.writeFile(PROCESSED_FILE, JSON.stringify(output, null, 4), "utf-8")

    console.log(`\nWrote ${output.length} reports to ${PROCESSED_FILE}`)
}
