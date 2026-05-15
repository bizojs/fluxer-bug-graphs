# Fluxer Testers Data Visualization

![image](/static/demo.png)

The purpose of this project is to help visualize Fluxer Testers bug report data by formatting the data into graphs/charts. This includes things such as reports per day, reports over time, bug vs a11y reports, approval rate etc.

The data has not been provided in this repo due to it containing usernames, discriminators and IDs, however, the project has scripts set up so you can fetch the data yourself, providing that you're a member of the Fluxer Testers community.

## Framework & Tools:
- [SvelteKit](https://kit.svelte.dev) - Web framework (using svelte 5 runes)
- [shadcn/svelte](https://shadcn-svelte.com/) - Component framework / design system built on top of [bits-ui](https://bits-ui.com)
- [LayerChart](https://next.layerchart.com/) - Library for beautiful charts
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vite.dev) - Build tool

## Configuration
To run this project, you will need to configure the `config.ts`. A placeholder file has been provided in `/src/lib/generator/config.example.ts`. Copy paste the example file and rename it to `config.ts`, then simply fill out the information. The only information you **need** to change are the `TOKEN` and `CHANNELS` values so the data fetching can work.

## Running locally
To run this project locally, run the following commands in the order they're listed:
1. `pnpm i` - installs the required packages
2. `pnpm data:generate` - Generates all the data needed to render the graphs
3. `pnpm dev` - Start the vite dev server

Now you can open the website in your browser: http://localhost:5173

## Scripts

This project is set up to use `pnpm` - however any other package manager should work fine so long as it can run scripts in `package.json`

|command|description|
|-------|-----------|
|`pnpm dev`|Start the vite dev server for the frontend|
|`pnpm build`|Build the files ready to be deployed|
|`pnpm data:generate`|Fetches all the data and maps it to the interface below|
|`pnpm data:fetch`|Fetches all data as json and dumps it in the configured `DATA_DIR`|
`pnpm data:process`|Processes all data in the `DATA_DIR` and maps it to the interface below|

## Types

```ts
interface BugReportData {
    id: number // the ID of the report (the # in any given embed footer)
    message_id: string // the ID of the message containing the bug report
    user: string // the user that sent the report in the format: "name#discrim (id)"
    date: string // ISO date string when the report was created
    type: "bug" | "a11y" // the type of bug
    approved: boolean // whether the bug was approved (no longer in #Approval Queue)
    fixed: boolean | null // true: report in #Fixed Bugs | false: report in #canary/a11y-bug-report | null: report in #Claimed Fixed
}
```
