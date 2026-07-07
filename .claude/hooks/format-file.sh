#!/bin/bash
# PostToolUse(Edit|Write) hook: format the edited file with Biome.
# Receives the hook event JSON on stdin; exits 0 always (non-blocking).
set -u

f=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -z "$f" ] && exit 0
[ -f "$f" ] || exit 0

case "$f" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.json | *.css) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
pnpm exec biome check --write "$f" >/dev/null 2>&1 || true
exit 0
