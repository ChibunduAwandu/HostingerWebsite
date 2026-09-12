#!/usr/bin/env bash
set -euo pipefail

: "${HOSTINGER_HOST:?Set HOSTINGER_HOST}"
: "${HOSTINGER_PORT:?Set HOSTINGER_PORT}"
: "${HOSTINGER_USER:?Set HOSTINGER_USER}"
: "${HOSTINGER_PATH:?Set HOSTINGER_PATH}"
[[ "$HOSTINGER_HOST" =~ ^[a-zA-Z0-9.-]+$ ]] || exit 2
[[ "$HOSTINGER_PORT" =~ ^[0-9]+$ ]] || exit 2
[[ "$HOSTINGER_USER" =~ ^[a-zA-Z0-9_-]+$ ]] || exit 2
[[ "$HOSTINGER_PATH" =~ ^/home/[a-zA-Z0-9_./-]+/public_html/?$ ]] || exit 2
[[ "$HOSTINGER_PATH" != *'..'* ]] || exit 2

ssh_args=(-p "$HOSTINGER_PORT" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=15)
if [[ -n "${HOSTINGER_KEY:-}" ]]; then ssh_args+=(-i "$HOSTINGER_KEY"); fi
remote="${HOSTINGER_USER}@${HOSTINGER_HOST}"
destination="${HOSTINGER_PATH%/}"
release="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short HEAD)"
stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT

# An explicit allowlist keeps old photos, PHP, and site configuration out of this release.
for directory in assets models asset-previews licenses; do cp -R "dist/$directory" "$stage/$directory"; done
for file in index.html favicon.svg site.webmanifest robots.txt sitemap.xml Chibundu_Awandu_Resume.pdf social-preview.png; do cp "dist/$file" "$stage/$file"; done
printf -v rsh '%q ' ssh "${ssh_args[@]}"

if [[ "${DEPLOY_DRY_RUN:-0}" == 1 ]]; then
  rsync -rtn --omit-dir-times --itemize-changes --exclude=index.html -e "$rsh" "$stage/" "$remote:$destination/"
  printf 'Dry run: index.html would be replaced atomically after asset upload.\n'
  exit 0
fi

# The backup is outside public_html, including configuration files omitted from the upload.
ssh "${ssh_args[@]}" "$remote" "test -d '$destination' && mkdir -p ~/site-backups && tar -czf ~/site-backups/collection-$release.tar.gz -C '$destination' ."
rsync -rt --omit-dir-times --itemize-changes --exclude=index.html -e "$rsh" "$stage/" "$remote:$destination/"
rsync -rt -e "$rsh" "$stage/index.html" "$remote:$destination/index.$release.tmp"
ssh "${ssh_args[@]}" "$remote" "mv '$destination/index.$release.tmp' '$destination/index.html'"
printf 'Published %s. Backup: ~/site-backups/collection-%s.tar.gz\n' "$release" "$release"
