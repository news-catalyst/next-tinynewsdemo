#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_ENV: $VERCEL_ENV"
echo "ORG_SLUG: $ORG_SLUG"

if [[ "$VERCEL_GIT_COMMIT_REF" == "stable" && "$VERCEL_ENV" == "production"  ]] ; then
  # Proceed with the build
  echo "✅ - stable/prod: build can proceed"
  exit 1;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "main" && "$VERCEL_ENV" == "production"  ]] ; then
# Proceed with the build
  echo "✅ - main/prod: build can proceed"
  exit 1;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "main" && "$VERCEL_ENV" == "preview" ]] ; then
# Proceed with the build
  echo "✅ - main/preview: build can proceed"
  exit 1;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "feature/vercel-platforms" ]] ; then
  echo "✅ - feature/vercel-platforms: build can proceed in env $VERCEL_ENV"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled for org '$ORG_SLUG' in env '$VERCEL_ENV' on branch '$VERCEL_GIT_COMMIT_REF'"
  exit 0;
fi