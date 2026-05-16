export interface BugReportData {
    id: number
    message_id: string
    user: string
    created: string
    type: "bug" | "a11y"
    approved: boolean
    approved_timestamp: string | null
    fixed: boolean | null
    fixed_timestamp: string | null
}

export interface Settings {
    labels: boolean
    legends: boolean
    values: boolean
    highlights: boolean
    per_user: boolean
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
