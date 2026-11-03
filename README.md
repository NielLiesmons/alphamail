# Alpha Mail — alphamail.xyz

Marketing site for **Alpha**: Spaces for groups and small businesses (Mail, Drive, Chat, Projects + Community).

Same SvelteKit stack as `niel` / `bley`: bilingual FR/EN, Zapstore-aligned tokens, static deploy.

## Local

```bash
bun install
bun run dev
# → http://localhost:5173  (redirects to /en)
```

## Build

```bash
bun run build
bun run preview
```

## Deploy (same VPS as Admin / Bley)

1. DNS at your registrar:
   - `alphamail.xyz` A → VPS IP
   - `www.alphamail.xyz` A → VPS IP (or CNAME → apex)
2. On the VPS: merge `deploy/Caddyfile.alphamail.xyz` into Caddy, `mkdir -p /var/www/alphamail`
3. From this repo:

```bash
./scripts/deploy.sh
# or: DEPLOY_SSH_KEY=~/.ssh/bley-deploy ./scripts/deploy.sh
```

GitHub Actions: set secrets `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH` (`/var/www/alphamail`), `DEPLOY_SSH_KEY`.

## Pages

| Path | Role |
|------|------|
| `/en`, `/fr` | Hero + 4 pillars + Community + close CTA |
| `/…/product` | Mail · Drive · Chat · Projects |
| `/…/community` | Public Community (placeholder for now) |
| `/…/contact` | mailto Space request |

Hero media: drop `/static/media/hero.webp` later (gradient placeholder today).
