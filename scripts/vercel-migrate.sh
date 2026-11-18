#!/bin/sh
# Runs on Vercel before `next build` (see vercel.json). Applies pending Supabase
# migrations so the database is ready before the new code goes live. If a
# migration fails, the build fails and the current deployment stays live.
#
# SUPABASE_DB_URL is the database's session pooler connection string, set in
# Vercel per environment: Production -> production DB, Preview (branch dev) -> staging DB.
set -eu

if [ "${VERCEL_ENV:-}" = "production" ]; then
    target="production"
elif [ "${VERCEL_ENV:-}" = "preview" ] && [ "${VERCEL_GIT_COMMIT_REF:-}" = "dev" ]; then
    target="staging"
else
    echo "Skipping migrations (VERCEL_ENV=${VERCEL_ENV:-unset}, branch=${VERCEL_GIT_COMMIT_REF:-unset})"
    exit 0
fi

if [ -z "${SUPABASE_DB_URL:-}" ]; then
    if [ "$target" = "production" ]; then
        echo "SUPABASE_DB_URL is not set for Production in Vercel, so migrations can't run. Failing the build so code isn't deployed ahead of its database changes." >&2
        exit 1
    fi
    echo "SUPABASE_DB_URL is not set for $target, skipping migrations"
    exit 0
fi

echo "Applying Supabase migrations to $target"
# --include-all: also apply migrations dated before the newest applied one,
# which happens when branches with migrations are merged in a different order.
npx supabase db push --db-url "$SUPABASE_DB_URL" --include-all --yes
