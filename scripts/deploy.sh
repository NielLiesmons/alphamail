#!/usr/bin/env bash
# Static deploy for alphamail.xyz → /var/www/alphamail
#
# Required: DEPLOY_HOST (hostname or IP of the deploy target).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${DEPLOY_HOST:?Set DEPLOY_HOST to the deploy target hostname or IP}"
USER="${DEPLOY_USER:-deploy}"
PATH_REMOTE="${DEPLOY_PATH:-/var/www/alphamail}"

if [[ -n "${DEPLOY_SSH_KEY:-}" ]]; then
	KEY="$DEPLOY_SSH_KEY"
elif [[ -f "$HOME/.ssh/alpha-deploy" ]]; then
	KEY="$HOME/.ssh/alpha-deploy"
elif [[ -f "$HOME/.ssh/bley-deploy" ]]; then
	# Legacy key name still accepted if present locally.
	KEY="$HOME/.ssh/bley-deploy"
else
	KEY="$HOME/.ssh/alpha-deploy"
fi

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
