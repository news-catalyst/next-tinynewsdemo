#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_ENV: $VERCEL_ENV"
echo "ORG_SLUG: $ORG_SLUG"

if [[ "$VERCEL_GIT_COMMIT_REF" == "stable" && "$VERCEL_ENV" == "production" && "$ORG_SLUG" != "oaklyn"  ]] ; then
  # Proceed with the build
  echo "✅ - Not Oaklyn: build can proceed for stable branch in production env"
  exit 1;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "main" && "$VERCEL_ENV" == "production" && "$ORG_SLUG" == "oaklyn"  ]] ; then
# Proceed with the build
  echo "✅ - Oaklyn: build can proceed for main branch in production env"
  exit 1;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "main" && "$VERCEL_ENV" == "preview" && "$ORG_SLUG" != "oaklyn"  ]] ; then
# Proceed with the build
  echo "✅ - Not Oaklyn: build can proceed for main branch in preview env"
  exit 1;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "feature/vercel-platforms" && "$ORG_SLUG" == "oaklyn" ]] ; then
  echo "✅ - Oaklyn: build can proceed for branch $VERCEL_GIT_COMMIT_REF in env $VERCEL_ENV"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled for org '$ORG_SLUG' in env '$VERCEL_ENV' on branch '$VERCEL_GIT_COMMIT_REF'"
  exit 0;
fi