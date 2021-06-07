#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"
echo "PREVIEW_DEPLOY: $PREVIEW_DEPLOY"

if [[ "$VERCEL_ENV" == "production" || "$PREVIEW_DEPLOY" == "1" ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled: preview deploys are turned off (set PREVIEW_DEPLOY to '1' to turn on)"
  exit 0;
fi
