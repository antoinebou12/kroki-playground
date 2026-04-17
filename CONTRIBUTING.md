# Contributing

Thank you for helping improve Kroki Playground. This document describes how to set up the project, what to run before opening a pull request, and how we use issues and linking.

## Prerequisites

- **Node.js** 22.x (see [`.nvmrc`](.nvmrc) and [`package.json`](package.json) `engines`).
- **Optional:** [Dev Containers](https://containers.dev/) or [GitHub Codespaces](https://github.com/features/codespaces) using [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json) for a consistent environment (Node 22, `npm install` on container create).

## Setup

```bash
git clone https://github.com/antoinebou12/kroki-playground.git
cd kroki-playground
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Where | Description |
| -------- | ----- | ----------- |
| `KROKI_BASE_URL` | Server | Base URL for the Kroki server used by `/api/generateDiagram` (default `https://kroki.io`). |
| `NEXT_PUBLIC_KROKI_BASE_URL` | Client | Base URL for in-browser preview (default `https://kroki.io`). |

Create a `.env` file locally when you need non-default Kroki URLs or other local-only settings. **Never commit secrets**; `.env` is gitignored.

### Secrets and CI

- Use a local `.env` for development only.
- For GitHub Actions or Codespaces, use **Secrets** and **Variables** in repository settings; do not paste credentials into code or public issues.

### Recommended editor extensions

If you are not using the dev container (which pre-installs a few extensions), you may want:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS** (`bradlc.vscode-tailwindcss`)

## Before opening a pull request

Run:

```bash
npm run lint
npm test
npm run build
```

Fix any failures when reasonable. If something cannot be run in your environment, explain that in the PR description.

## Issues and pull requests

### Linking PRs to issues

In the PR description, use GitHub keywords when a PR fully resolves an issue:

- `Fixes #123`, `Closes #123`, or `Resolves #123`

For partial work or related context, use plain references:

- `Related to #456` or `See #456`

### Dependencies between issues

When work depends on another issue or blocks follow-up work, say so in the issue or PR using **Blocked by** / **Blocks** (see the issue and PR templates). GitHub does not automatically enforce these; they help maintainers and contributors track order of work.

### Task lists

Use markdown task lists in issues (- [ ] / - [x]) to break work into steps and track progress.

## Security

Report security vulnerabilities according to [SECURITY.md](SECURITY.md), not via public issues.

## License

By contributing, you agree that your contributions are licensed under the same license as the project ([MIT](LICENSE)).
