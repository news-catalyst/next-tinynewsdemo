#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "feature/vercel-platforms" ]] ; then
  echo "🛑 - feature/vercel-platforms: build should not proceed in env $VERCEL_ENV"
  exit 0;

elif [[ "$VERCEL_GIT_COMMIT_REF" == "main"  ]] ; then 
  echo "✅ - main: build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled in env '$VERCEL_ENV' on branch '$VERCEL_GIT_COMMIT_REF'"
  exit 0;
fi