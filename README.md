# alphamail.xyz

Marketing site for **Alpha** — Spaces for groups and SMBs (Mail, Drive, Chat, Projects).

Alpha = private Drive + Mail + Chat on your domain — open protocols, self-hostable where it matters.

## Stack

| Layer | Tech |
|-------|------|
| App | SvelteKit static + Bun |
| UI | `@alpha/ui` (vendored) — shared tokens / chrome with Team |
| i18n | FR / EN routes |
| Deploy | Caddy + rsync / GitHub Actions |

Product surfaces live in **alpha-team** + **alpha-api** + **alpha-drive**; this repo is the public pitch site only.

## Local

```bash
bun install
bun run dev    # → http://localhost:5173 → /en
bun run build
```

## Deploy

```bash
DEPLOY_HOST=your.vps.example ./scripts/deploy.sh
```

`DEPLOY_HOST` required. SSH key defaults to `~/.ssh/alpha-deploy`. CI secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY`.
