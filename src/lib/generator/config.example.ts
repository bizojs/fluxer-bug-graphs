import path from "path"

/*
You only need to fill out the TOKEN and CHANNELS options below:
*/
export const TOKEN = "flx_"

export const CHANNELS = {
    "canary-bug-reports": "",
    "canary-a11y-reports": "",
    "Approval Queue": "",
    "Claimed Fixed": "",
    "Fixed Bugs": ""
} as const


/*
 The options below do NOT need to be changed
*/

export type ChannelName = keyof typeof CHANNELS

export const COLORS = {
    bug: 16754176,
    a11y: 26316
} as const

export const API_BASE = "https://api.fluxer.app"
export const DATA_DIR = path.join("src", "lib", "generator", "data")
export const PROCESSED_FILE = path.join("src", "lib", "generator", "data.json")
export const INFO_FILE = path.join("src", "lib", "generator", "info.json")
