#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_GIT_COMMIT_REF" == "feature/vercel-platforms" ]] ; then
  # Proceed with the build
  echo "🛑 - vercel-platforms feature ignored"
  exit 0;

else
  # Proceed with the build
  echo "✅ - build can proceed"
  exit 1;
fi