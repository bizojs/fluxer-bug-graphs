export interface BugReportData {
    id: number
    message_id: string
    user: string
    date: string
    type: "bug" | "a11y"
    approved: boolean
    fixed: boolean
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
