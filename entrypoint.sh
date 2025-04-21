#!/bin/sh

# Wait for Postgres to be ready (or use wait-for-it / wait-on)

# Now apply migrations
echo "Waiting for Postgres..."
until pg_isready -h db -p 5432 -U postgres; do
  sleep 1
done

npx prisma migrate deploy

# Or: for dev use only
# npx prisma migrate dev --name init

nohup pnpm run board
# Then start your app
pnpm start
