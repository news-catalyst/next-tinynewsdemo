#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_GIT_COMMIT_REF" == "stable" && "$VERCEL_ENV" == "production"  ]] ; then
  # Proceed with the build
  echo "✅ - stable/prod: build can proceed"
  exit 1;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "main" && "$VERCEL_ENV" == "preview" ]] ; then
# Proceed with the build
  echo "✅ - main/preview: build can proceed"
  exit 1;

elif [[ "$VERCEL_GIT_COMMIT_REF" != "stable" && "$VERCEL_ENV" == "preview" ]] ; then
# Proceed with the build
  echo "✅ - any branch besides stable in preview env: build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled in env '$VERCEL_ENV' on branch '$VERCEL_GIT_COMMIT_REF'"
  exit 0;
fi