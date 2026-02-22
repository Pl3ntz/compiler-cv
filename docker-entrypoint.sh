#!/bin/sh
set -e

MAX_RETRIES=10
RETRY_INTERVAL=2

# Wait for database to be ready
echo "[entrypoint] Waiting for database..."
attempt=0
until bun -e "import('postgres').then(m => m.default(process.env.DATABASE_URL)\`SELECT 1\`.then(() => process.exit(0)).catch(() => process.exit(1)))" 2>/dev/null; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $MAX_RETRIES ]; then
    echo "[entrypoint] ERROR: Database not reachable after $MAX_RETRIES attempts"
    exit 1
  fi
  echo "[entrypoint] DB not ready (attempt $attempt/$MAX_RETRIES), retrying in ${RETRY_INTERVAL}s..."
  sleep $RETRY_INTERVAL
done
echo "[entrypoint] Database is ready."

# Run migrations
echo "[entrypoint] Running database migrations..."
bunx drizzle-kit migrate

# Run seed (idempotent)
echo "[entrypoint] Running database seed..."
bun scripts/seed.ts

# Start application (exec replaces shell for proper signal handling)
echo "[entrypoint] Starting application..."
exec bun src/server/index.ts
