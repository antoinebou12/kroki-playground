# Security policy

## Supported versions

Security updates are applied to the default development branch (`main`) and released through normal commits and deployments. Use the latest revision of `main` for production.

## Scope

This policy covers:

- This repository (Next.js app, API routes, client-side code)
- Configuration and scripts shipped in this repository

It does not cover upstream services you configure yourself (for example a self-hosted Kroki instance or your Vercel project settings). Harden and patch those according to their own documentation.

## Reporting a vulnerability

Please **do not** open a public issue for undisclosed security problems.

**Preferred:** use [GitHub private vulnerability reporting](https://github.com/antoinebou12/kroki-playground/security/advisories/new) for this repository (if enabled for the repo).

If private reporting is unavailable, email the maintainers with a clear subject line (for example `[security] kroki-playground`) and include:

- Description of the issue and its impact
- Steps to reproduce or a proof of concept
- Affected component (browser, API route, dependency, etc.)
- Your suggestion for a fix, if any

We aim to acknowledge reports within a few business days and will coordinate disclosure after a fix is available.

## Secure development notes

- Keep `.env` out of version control; it is listed in `.gitignore`.
- Do not commit API keys, tokens, or production URLs that should stay private.
- In GitHub Codespaces or CI, use [encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) and repository variables instead of hard-coding credentials.
