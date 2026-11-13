# Dashboard Demo

Generative UI with **[A2UI 1.0](https://a2ui.org)**, **A2UI Express**, and
**macros**, optimized for small, fast models: **Gemma 4** and **Gemini Flash
Lite**. An LLM composes a dashboard, and an Angular client renders it with
CopilotKit.

The LLM doesn't write A2UI JSON. It describes the dashboard in a few lines of
**A2UI Express**, A2UI's compact DSL, using only **macros**: high-level components
such as `FlightsTable` or `BoardingPasses`.

```
root = Dashboard([
  FlightsTable("Graz", "Hamburg", maxRows=5),
  DelayShareChart("Graz", "Hamburg"),
  WeatherList()
])
```

The server expands the macros into **A2UI 1.0** components, loads their data,
and streams the result to the client. For the flight analytics example, the
LLM writes about 360 characters (120 tokens), which become 12,000 characters
of A2UI JSON with 81 components.

## Optimized for Small Models

The demo runs on Gemma 4 (on Cloudflare Workers AI) and Gemini Flash Lite
instead of frontier models. It keeps their job simple:

- **Choose, don't design**: The LLM only picks macros and their arguments.
  Layout, data, and A2UI details come from the server.
- **Short prompt**: The system prompt lists the macros with their arguments,
  generated from the macro definitions. It doesn't include the full A2UI
  Express grammar, which alone would be about 4,800 characters.
- **One step**: The LLM makes exactly one tool call, with temperature 0 and
  without thinking. In a test, thinking made Gemma 4 take 47 seconds for a
  short answer instead of less than one.

In our tests, Gemini Flash Lite described a dashboard in about 1 second,
Gemma 4 in 1 to 6 seconds.

## Getting Started

```bash
npm install
cp .env.example .env   # optional: the UI offers these keys as defaults
npm start              # server and client
```

`npm start` runs both parts, which you can also start separately:

- `npm run ai-server`: Mastra server on http://localhost:4111
- `npm run client`: Angular client on http://localhost:4200

In the UI, choose the LLM (Gemini Flash Lite or Gemma 4 on Cloudflare
Workers AI), enter the connection data, and try one of the example prompts.

## How It Works

```
Angular + CopilotKit                    Mastra server
─────────────────────                   ──────────────────────────────────────
prompt + LLM settings ── AG-UI run ──►  dashboard agent (one tool call)
                                          renderDashboard({ dsl })
                                                   │
                                        DashboardMiddleware
                        ◄── ACTIVITY_SNAPSHOT ──  dashboard-dsl    { dsl }
                                          compileDashboard(dsl)
                                            1. parse the DSL (A2UI Express)
                                            2. expand macros, load data
                                            3. wrap into one createSurface
                        ◄── ACTIVITY_SNAPSHOT ──  a2ui-surface-v1  { a2ui_operations }
A2uiActivity renders the surface
Inspector shows DSL and A2UI
```

- **Macros** are high-level components such as `FlightsTable` or `Hotels`.
  Each macro file bundles its arguments (a Zod schema), the data it loads,
  and the A2UI components it renders. The LLM only sees the macros, so its
  output stays short. The system prompt lists them automatically.
- **Activity messages** carry both the DSL and the A2UI messages to the client.
  AG-UI clients keep them in the message list, but they are not part of the
  LLM conversation. The contract lives in
  [shared/dashboard-protocol.ts](shared/dashboard-protocol.ts).
- **A2UI 1.0**: CopilotKit's built-in A2UI renderer only supports 0.9, so the
  client registers its own activity renderer based on `@a2ui/angular`.
- **Custom component**: The dashboard catalog is the A2UI basic catalog plus
  the client's `TicketWidget`, an Angular component for boarding passes. The
  `BoardingPasses` macro uses it like any other component.
- **Actions**: Buttons such as "Check in" or "Search" send A2UI actions with
  their context resolved from the data model. The inspector shows them; a real
  app would forward them to the agent or handle them in the client.
- **LLM settings** travel with every run as `forwardedProps.llm`. The agent
  picks the model from Mastra's model router at request time.

## Where to Look

| Path                                                                             | What                                            |
| -------------------------------------------------------------------------------- | ----------------------------------------------- |
| [ai-server/src/mastra/dashboard/](ai-server/src/mastra/dashboard/)               | Agent, prompt, tool, AG-UI route, middleware    |
| [ai-server/src/mastra/dashboard/macros/](ai-server/src/mastra/dashboard/macros/) | One file per dashboard tile                     |
| [ai-server/src/mastra/dsl/](ai-server/src/mastra/dsl/)                           | Generic macro mechanism: parse, apply, describe |
| [ai-server/src/mastra/llm/](ai-server/src/mastra/llm/)                           | Model selection and the .env defaults           |
| [src/app/a2ui/a2ui-activity.ts](src/app/a2ui/a2ui-activity.ts)                   | A2UI 1.0 activity renderer                      |
| [src/app/a2ui/dashboard-catalog.ts](src/app/a2ui/dashboard-catalog.ts)           | Basic catalog plus the TicketWidget             |
| [src/app/dashboard/dashboard-store.ts](src/app/dashboard/dashboard-store.ts)     | Runs the agent, exposes DSL and A2UI            |

## Demo Shortcuts

- The server hands the keys from `.env` to the browser. Fine for a local demo,
  never do this in production.
- Flights come from a public demo API; hotels and weather are fake.
- The A2UI basic catalog has no chart component, so charts are images: the
  server renders them as SVG with ECharts and keeps them in memory.
