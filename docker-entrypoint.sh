#!/bin/sh
set -e

# Write environment variables to .dev.vars so wrangler passes them
# as bindings to the Cloudflare Workers runtime.
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" > /app/.dev.vars
fi

if [ -n "$QIA_API_KEY" ]; then
  echo "QIA_API_KEY=$QIA_API_KEY" >> /app/.dev.vars
fi

if [ -n "$QIA_MODEL" ]; then
  echo "QIA_MODEL=$QIA_MODEL" >> /app/.dev.vars
fi

exec pnpm wrangler pages dev ./build/client --port 3000 --ip 0.0.0.0
