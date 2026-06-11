export interface BugReportData {
    id: number
    created: string
    type: "bug" | "a11y" | "video"
    approved: boolean
    approved_timestamp: string | null
    fixed: boolean | null
    fixed_timestamp: string | null
    denied: boolean
}

export interface Settings {
    labels: boolean
    legends: boolean
    values: boolean
    highlights: boolean
}

export interface ChartTotalByUser {
    username: string
    count: {
        bug: number
        a11y: number
        total: number
    }
}

export interface InfoFileData {
    last_updated: null | string
}
