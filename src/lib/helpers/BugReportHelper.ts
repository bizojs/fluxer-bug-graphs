import type { BugReportData } from "@types"
import data from "@generator/data.json"

const USERNAME_DISCRIM_REGEX = /^([^#(]+(?:#\d{4})?)/
const USERNAME_NO_DISCRIM_REGEX = /^([^#(]+)/
const ID_REGEX = /\((\d+)\)$/

const bugReportData = data as BugReportData[]

export class BugReportHelper {

    static getUsername(value: string) {
        let result = value.match(USERNAME_NO_DISCRIM_REGEX)
        return result ? result[1] : value
    }

    static getUsernameAndDiscrim(value: string) {
        let result = value.match(USERNAME_DISCRIM_REGEX)
        return result ? result[1] : value
    }

    static getId(value: string) {
        let result = value.match(ID_REGEX)
        return result ? result[1] : value
    }

    static getTotalReportsByUser(min: number, approvedOnly: boolean = false) {
        const map = new Map<string, { bug: number; a11y: number; username: string }>()

        for (const report of bugReportData) {
            if (approvedOnly && !report.approved) continue
            const id = this.getId(report.user)
            const username = this.getUsername(report.user)
            const entry = map.get(id) ?? { bug: 0, a11y: 0, username }
            entry[report.type]++
            entry.username = username
            map.set(id, entry)
        }

        return [...map.entries()]
            .map(([_, counts]) => ({
                username: counts.username,
                bug: counts.bug,
                a11y: counts.a11y,
                total: counts.bug + counts.a11y,
            }))
            .sort((a, b) => b.total - a.total)
            .filter(d => d.total > min)
    }

    static getBugVsA11y() {
        const reduced = bugReportData.reduce((acc, report) => {
            acc[report.type] = (acc[report.type] || 0) + 1
            return acc
        }, {} as Record<string, number>)
        const sorted = Object.entries(reduced)
            .sort((a, b) => b[1] - a[1])
        return sorted.map(([type, count]) => ({ type, count }))
    }

    static getReportsByDate(): {
        date: Date
        bug: number
        a11y: number
        total: number
    }[] {
        const approved = bugReportData.filter(r => r.approved)
        if (approved.length === 0) return []

        const map = new Map<string, { bug: number; a11y: number }>()

        for (const report of approved) {
            const day = report.date.slice(0, 10)
            const entry = map.get(day) ?? { bug: 0, a11y: 0 }
            entry[report.type]++
            map.set(day, entry)
        }

        const earliest = approved.reduce((min, r) => r.date < min ? r.date : min, approved[0].date)
        const start = new Date(earliest.slice(0, 10))
        const today = new Date()
        const result = []

        for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
            const day = d.toISOString().split("T")[0]
            const counts = map.get(day) ?? { bug: 0, a11y: 0 }
            result.push({
                date: new Date(day),
                bug: counts.bug,
                a11y: counts.a11y,
                total: counts.bug + counts.a11y,
            })
        }

        return result
    }

    static getBugReportsOverTime(): {
        date: Date
        bug: number
        a11y: number
        total: number
    }[] {
        const byDay = this.getReportsByDate()
        let bug = 0, a11y = 0

        return byDay.map(d => {
            bug += d.bug
            a11y += d.a11y
            return {
                date: d.date,
                bug,
                a11y,
                total: bug + a11y,
            }
        })
    }

    static getApprovalRate() {

        const approved = bugReportData.filter(r => r.approved)
        const notApproved = bugReportData.filter(r => !r.approved)

        return [
            { key: "Approved", value: approved.length },
            { key: "Not approved", value: notApproved.length },
        ]

    }

    static getFixRate() {

        const fixed = bugReportData.filter(r => r.fixed === true)
        const not_fixed = bugReportData.filter(r => r.fixed === false)
        const maybe_fixed = bugReportData.filter(r => r.fixed === null)

        return [
            { key: "Fixed", value: fixed.length },
            { key: "Not Fixed", value: not_fixed.length },
            { key: "Claimed Fixed", value: maybe_fixed.length },
        ]

    }

    static getMissingReports() {
        const ids = new Set(bugReportData.map(r => r.id))
        const lastId = Math.max(...ids)

        const missing = Array.from({ length: lastId }, (_, i) => i + 1)
            .filter(id => !ids.has(id))

        return missing
    }

}
