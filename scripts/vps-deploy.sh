#!/usr/bin/env bash
# Pull origin/main and publish the static site for elysiumhotels.in.
# Installed copy that GitHub Actions runs: /root/elysium-deploy.sh
set -euo pipefail

APP=/var/www/elysium
LOG=/var/log/elysium-deploy.log
SECRETS=/root/elysium-secrets

mkdir -p "$(dirname "$LOG")" "$SECRETS"
exec >>"$LOG" 2>&1

echo "===== $(date -Is) deploy start ====="
cd "$APP"

if [[ -f "$APP/dist/client/api/config.php" ]]; then
  cp "$APP/dist/client/api/config.php" "$SECRETS/config.php"
elif [[ -f "$APP/public/api/config.php" ]]; then
  cp "$APP/public/api/config.php" "$SECRETS/config.php"
fi

git -c safe.directory="$APP" fetch origin main
git -c safe.directory="$APP" reset --hard origin/main
git -c safe.directory="$APP" clean -fd

if [[ -f "$SECRETS/config.php" ]]; then
  mkdir -p "$APP/public/api"
  cp "$SECRETS/config.php" "$APP/public/api/config.php"
fi

npm ci
npm run build:shared

if [[ -f "$SECRETS/config.php" ]]; then
  mkdir -p "$APP/dist/client/api"
  cp "$SECRETS/config.php" "$APP/dist/client/api/config.php"
  cp "$SECRETS/config.php" "$APP/public/api/config.php"
fi

if [[ -f "$APP/scripts/vps-deploy.sh" ]]; then
  cp "$APP/scripts/vps-deploy.sh" /root/elysium-deploy.sh
  chmod 755 /root/elysium-deploy.sh
fi

echo "===== $(date -Is) deploy done $(git -c safe.directory="$APP" rev-parse --short HEAD) ====="
