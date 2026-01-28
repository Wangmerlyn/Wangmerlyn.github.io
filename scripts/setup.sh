#!/usr/bin/env bash
set -euo pipefail

# Quick setup for local development.
# Installs pnpm (via corepack) and project dependencies.

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PNPM_VERSION="${PNPM_VERSION:-9.12.1}"

if ! command -v pnpm >/dev/null 2>&1; then
	if ! command -v corepack >/dev/null 2>&1; then
		echo "corepack is required (ships with Node.js >= 16.9). Please install Node.js and re-run." >&2
		exit 1
	fi

	corepack enable
	corepack prepare "pnpm@${PNPM_VERSION}" --activate
fi

pnpm install

echo "Setup complete. pnpm v${PNPM_VERSION} activated and dependencies installed."
