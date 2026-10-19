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
export PATH="/opt/node-v22/bin:${PATH}"
cd "$APP"
node -v
npm -v

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

npm install --no-audit --no-fund
npm run build:shared

if [[ -f "$SECRETS/config.php" ]]; then
  mkdir -p "$APP/dist/client/api"
  cp "$SECRETS/config.php" "$APP/dist/client/api/config.php"
  cp "$SECRETS/config.php" "$APP/public/api/config.php"
fi

if getent group www-data >/dev/null; then
  for cfg in "$APP/dist/client/api/config.php" "$APP/public/api/config.php"; do
    if [[ -f "$cfg" ]]; then
      chgrp www-data "$cfg"
      chmod 640 "$cfg"
    fi
  done
  mkdir -p "$APP/dist/client/_bookings"
  chown www-data:www-data "$APP/dist/client/_bookings"
  chmod 775 "$APP/dist/client/_bookings"
fi

if [[ -f "$APP/scripts/nginx-elysiumhotels.in" && -f /etc/letsencrypt/live/elysiumhotels.in/fullchain.pem ]]; then
  cp "$APP/scripts/nginx-elysiumhotels.in" /etc/nginx/sites-available/elysiumhotels.in
  ln -sfn /etc/nginx/sites-available/elysiumhotels.in /etc/nginx/sites-enabled/elysiumhotels.in
  nginx -t
  systemctl reload nginx
fi

if [[ -f "$APP/scripts/vps-deploy.sh" ]]; then
  cp "$APP/scripts/vps-deploy.sh" /root/elysium-deploy.sh
  chmod 755 /root/elysium-deploy.sh
fi

echo "===== $(date -Is) deploy done $(git -c safe.directory="$APP" rev-parse --short HEAD) ====="
