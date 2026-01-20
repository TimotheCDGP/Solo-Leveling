#!/bin/sh
set -e

echo "Waiting for Postgres to be available..."
until pg_isready -h "$POSTGRES_HOST" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-solodev}"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Running prisma generate..."
npx prisma generate

echo "Applying migrations (prisma migrate deploy)..."
npx prisma migrate deploy || true

echo "Starting server"
exec node dist/main
