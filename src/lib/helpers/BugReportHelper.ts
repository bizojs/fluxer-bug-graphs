import type { BugReportData } from "@types"

const USERNAME_DISCRIM_REGEX = /(\w+(#[0-9]{4})?)/g
const ID_REGEX = /\(([0-9]+)\)$/g

export class BugReportHelper {

    static getUsername(value: string) {
        let result = value.match(USERNAME_DISCRIM_REGEX)
        return result ? result[0] : value
    }

    static getId(value: string) {
        let result = value.match(ID_REGEX)
        return result ? result[0] : value
    }

    static getTotalReportsByUser(data: BugReportData[], min: number, approvedOnly: boolean = false) {
        const map = new Map<string, { bug: number; a11y: number }>()

        for (const report of data) {
            if (approvedOnly && !report.approved) continue
            const username = this.getUsername(report.user)
            const entry = map.get(username) ?? { bug: 0, a11y: 0 }
            entry[report.type]++
            map.set(username, entry)
        }

        let mapped = [...map.entries()]
            .map(([username, counts]) => ({
                username,
                count: {
                    bug: counts.bug,
                    a11y: counts.a11y,
                    total: counts.bug + counts.a11y,
                }
            }))
            .sort((a, b) => b.count.total - a.count.total)
            .filter(d => d.count.total > min)

            return mapped.map(d => ({
                username: d.username,
                bug: d.count.bug,
                a11y: d.count.a11y,
                total: d.count.total,
            }))
    }

    static getBugVsA11y(data: BugReportData[]) {
        const reduced = data.reduce((acc, report) => {
            acc[report.type] = (acc[report.type] || 0) + 1
            return acc
        }, {} as Record<string, number>)
        const sorted = Object.entries(reduced)
            .sort((a, b) => b[1] - a[1])
        return sorted.map(([type, count]) => ({ type, count }))
    }

    static getReportsByDate(data: BugReportData[]): {
        date: Date
        bug: number
        a11y: number
        total: number
    }[] {
        const approved = data.filter(r => r.approved)
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

    static getBugReportsOverTime(data: BugReportData[]): {
        date: Date
        bug: number
        a11y: number
        total: number
    }[] {
        const byDay = this.getReportsByDate(data)
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

    static getApprovalRate(data: BugReportData[]) {

        const approved = data.filter(r => r.approved)
        const notApproved = data.filter(r => !r.approved)

        return [
            { key: "Approved", value: approved.length },
            { key: "Not approved", value: notApproved.length },
        ]

    }

}
