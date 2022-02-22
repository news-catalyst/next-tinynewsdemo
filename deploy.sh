#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_GIT_COMMIT_REF" == "feature/vercel-platforms" ]] ; then
  echo "🛑 - vercel-platforms feature ignored" # this will be built in a separate Vercel project
  exit 0;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_ENV" == "preview"  ]] ; then
  echo "✅ - okay to build main branch in preview env"
  exit 1;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "production" || "$VERCEL_ENV" == "production"  ]] ; then
  echo "✅ - okay to build production branch in production env"
  exit 1;
  
else
  # Skip the build
  echo "🛑 - otherwise skipping the build in $VERCEL_GIT_COMMIT_REF and $VERCEL_ENV"
  exit 1;
fi