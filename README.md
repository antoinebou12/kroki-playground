# Kroki Playground

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

Experiment with [Kroki](https://kroki.io) diagram types in the browser: pick a format, paste source text, and preview SVG. Shareable URLs encode type and compressed source.

## Features

- **Live preview** against `https://kroki.io` or your own Kroki instance (`NEXT_PUBLIC_KROKI_BASE_URL`).
- **REST API** at `/api/generateDiagram` (GET or POST) returning base64 diagram bytes — see **[API docs](/api-docs)** or [`public/openapi.yaml`](public/openapi.yaml) / [`GET /api/openapi`](/api/openapi).

## Requirements

- **Node.js** ≥ 22 (see [`.nvmrc`](.nvmrc) and `engines` in [`package.json`](package.json)). Match your [Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) project Node version to your environment.

## Environment variables

| Variable | Where | Description |
| -------- | ----- | ----------- |
| `KROKI_BASE_URL` | Server | Base URL for the Kroki server used by `/api/generateDiagram` (default `https://kroki.io`). |
| `NEXT_PUBLIC_KROKI_BASE_URL` | Client | Base URL for in-browser preview in the playground (default `https://kroki.io`). |

## Local development

```bash
git clone https://github.com/antoinebou12/kroki-playground.git
cd kroki-playground
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Next.js dev server (Turbopack). |
| `npm run build` | Production build. |
| `npm run start` | Run production server after `build`. |
| `npm run lint` | ESLint. |
| `npm test` | Vitest unit tests. |

## Deployment (Vercel)

The repo includes [`vercel.json`](vercel.json) with the Next.js framework preset and `npm install` / `npm run build` so Vercel uses the same install and build as local. Import the project in Vercel, set **Node.js** to match `.nvmrc` (22.x), and add `KROKI_BASE_URL` / `NEXT_PUBLIC_KROKI_BASE_URL` in **Project → Settings → Environment Variables** if you use a private Kroki instance.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Report security vulnerabilities per [SECURITY.md](SECURITY.md).

## License

[MIT License](LICENSE).
