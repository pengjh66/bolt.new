#!/bin/sh
set -e

# Write environment variables to .dev.vars so wrangler passes them
# as bindings to the Cloudflare Workers runtime.
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" > /app/.dev.vars
fi

if [ -n "$ADMIN_PASSWORD" ]; then
  echo "ADMIN_PASSWORD=$ADMIN_PASSWORD" >> /app/.dev.vars
fi

if [ -n "$JWT_SECRET" ]; then
  echo "JWT_SECRET=$JWT_SECRET" >> /app/.dev.vars
fi

exec pnpm wrangler pages dev ./build/client --port 3000 --ip 0.0.0.0
