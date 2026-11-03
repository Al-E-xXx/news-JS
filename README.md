# news-JS

News portal: the [original RS School app](https://github.com/rolling-scopes-school/news-JS/) migrated from JavaScript to TypeScript, with an adaptive layout and a demo/live data layer.

Deployed version: https://al-e-xxx.github.io/news-JS/

Task description: https://github.com/rolling-scopes-school/tasks/blob/master/fullstack-engineering/tasks/TS-news-api/migration-newip-to-ts.md

## Requirements

-   Node.js 18 or newer (the project is developed and verified on Node.js 24)
-   npm

## Run the application

1. Copy `.env.example` to `.env` and set your own [NewsAPI](https://newsapi.org/) key:

    ```
    API_KEY=your own api key
    ```

    `.env` is listed in `.gitignore`, so the key never gets into git. The file is optional: without a key the app still runs and shows demo data, only the **Live API** mode needs a key.

2. Install dependencies:

    ```
    npm install
    ```

3. Start the dev server:

    ```
    npm start
    ```

    The app opens at http://localhost:8080. If that port is already used by something else, pick another one:

    ```
    npm start -- --port 8123
    ```

## Scripts

| Command            | What it does                                                      |
| ------------------ | ----------------------------------------------------------------- |
| `npm start`        | webpack-dev-server with inline source maps, opens the browser     |
| `npm run build`    | production build into `dist/`                                     |
| `npm run build:gh` | production build for GitHub Pages (`publicPath: /news-JS/`)       |
| `npm run deploy`   | `npm run build:gh` and publishes `dist/` to the `gh-pages` branch |
| `npm run lint`     | ESLint over the whole project                                     |

Type and format checks (no separate npm script, run them directly):

```
npx tsc --noEmit
npx prettier --check .
```

## Demo data and Live API

The header has a **Demo data / Live API** switch.

-   **Demo data** is the default mode and the default build. Requests go to the local `mocks/` folder - the JSON files from `mocks/*.json` are copied into `dist/mocks/` by the build, so the demo works offline and does not spend any of the NewsAPI key quota. One mock file contains articles of several sources, they are filtered by `article.source.id` on the client (see `src/components/controller/controller.ts`).
-   **Live API** mode sends requests to the course proxy https://rss-news-api.onrender.com/ with the `apiKey` parameter. NewsAPI itself only allows calls from `localhost`, that is why the deployed version cannot call `newsapi.org` directly.

Endpoints and the key are injected at build time by `DefinePlugin`: `API_URL` and `API_MOCK_URL` come from `webpack.api-env.js`, `API_KEY` comes from `.env`. To point a build at another proxy, change `API_PROXY_URL` in `webpack.api-env.js`.

When the proxy is not reachable (it is a free Render instance that sleeps, and some providers block it) the app automatically falls back to demo data, disables the switch, explains the reason and offers a **Check the server again** button. The last probe result is cached in `localStorage` under `news-api.server-status` for 5 minutes, so the switch state is correct before the first request of a new page load.

## Project structure

```
src/
  index.ts              entry point, creates and starts the app
  index.html            markup, <template> items, <dialog> status dialog
  global.css            layout, header, footer, demo/live switch
  global.d.ts           ambient types for css imports and process.env
  models/               interfaces and enums of the api layer
  components/
    app/                App - startup, mode switch, error handling
    controller/         Loader / AppLoader / AppController, timeout, api availability
    view/               AppView, Sources, News, StatusDialog
  utils/                mustFind dom helper, source curation
mocks/                  demo data (sources, everything)
webpack*.js             base, dev, prod, gh configs and the api env defines
```

## Built with

TypeScript 5.9 (`strict`, `noImplicitAny`, no `any` in the source), Webpack 5 with `ts-loader`, ESLint 10 flat config with `typescript-eslint` and `@typescript-eslint/no-explicit-any`, Prettier, `gh-pages` for deployment.
