#!/usr/bin/env bash
# Static deploy for alphamail.xyz → /var/www/alphamail
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${DEPLOY_HOST:-37.27.152.36}"
USER="${DEPLOY_USER:-deploy}"
PATH_REMOTE="${DEPLOY_PATH:-/var/www/alphamail}"
KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/bley-deploy}"

cd "$ROOT"

if [[ ! -d build ]] || [[ "${FORCE_BUILD:-0}" == "1" ]]; then
	echo "==> build"
	bun run build
fi

echo "==> ensure remote dir"
ssh -i "$KEY" -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes \
	"${USER}@${HOST}" "mkdir -p '${PATH_REMOTE}'"

echo "==> rsync → ${USER}@${HOST}:${PATH_REMOTE}/"
rsync -az --delete \
	-e "ssh -i ${KEY} -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes" \
	./build/ \
	"${USER}@${HOST}:${PATH_REMOTE}/"

echo "==> live files at ${PATH_REMOTE} (point DNS + Caddy when ready)"
echo "    Caddy snippet: deploy/Caddyfile.alphamail.xyz"
