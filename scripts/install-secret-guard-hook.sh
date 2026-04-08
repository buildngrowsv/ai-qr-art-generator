#!/bin/bash
#
# Pre-commit hook: Secret leak prevention for banananano2pro
# Created by Vanguard-7742 (2026-04-04) — SEC-06 backlog item
#
# WHY: Prevents live API keys, webhook secrets, and database credentials
# from being committed to the repo. This catches the most common class
# of secret exposure (accidental .env commit, copy-paste into source).
#
# HOW: Scans staged changes (not the whole repo) for known secret patterns.
# Uses only git diff --cached so it's fast even on large repos.
# Exit 1 blocks the commit; developer must remove the secret first.
#
# FALSE POSITIVES: .env.example files and test fixtures with placeholder
# patterns (sk_test_xxx, whsec_placeholder) are excluded. If you hit a
# false positive, review the pattern and add an exclusion below.

set -e

# Only scan staged content (what's about to be committed)
STAGED_DIFF=$(git diff --cached --diff-filter=ACMR --unified=0 2>/dev/null || true)

if [ -z "$STAGED_DIFF" ]; then
  exit 0
fi

# Patterns that indicate real secrets (not placeholders)
# Each pattern is specific enough to avoid most false positives
SECRET_PATTERNS=(
  'sk_live_[A-Za-z0-9]{10,}'        # Stripe live secret key
  'sk_test_51[A-Za-z0-9]{10,}'      # Stripe test key (with account prefix = real)
  'whsec_[A-Za-z0-9]{20,}'          # Stripe webhook secret (long = real)
  'sk-proj-[A-Za-z0-9]{10,}'        # OpenAI project key
  'sk-[A-Za-z0-9]{40,}'             # OpenAI API key (long format)
  'AKIA[A-Z0-9]{12,}'               # AWS access key
  'fal_[A-Za-z0-9]{20,}'            # fal.ai API key
  'neon://[^ ]*@'                   # Neon database connection string
  'postgres://[^ ]*:[^ ]*@'        # Any postgres connection with password
)

FOUND_SECRETS=0
for pattern in "${SECRET_PATTERNS[@]}"; do
  MATCHES=$(echo "$STAGED_DIFF" | grep -cE "^\+.*${pattern}" 2>/dev/null || true)
  if [ "$MATCHES" -gt 0 ]; then
    echo "⛔ SECRET DETECTED in staged changes: pattern '${pattern}'"
    echo "$STAGED_DIFF" | grep -nE "^\+.*${pattern}" | head -3
    echo ""
    FOUND_SECRETS=1
  fi
done

if [ "$FOUND_SECRETS" -eq 1 ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "COMMIT BLOCKED: Live secrets detected in staged changes."
  echo ""
  echo "Fix: Remove the secret from code, use environment variables instead."
  echo "  - Vercel: vercel env add SECRET_NAME production"
  echo "  - Local: add to .env.local (which is gitignored)"
  echo ""
  echo "If this is a false positive (placeholder, test fixture, .env.example):"
  echo "  git commit --no-verify"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi

exit 0
