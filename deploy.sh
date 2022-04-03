#!/bin/bash

# Only build the stable branch
if [[ "$VERCEL_GIT_COMMIT_REF" == "stable" ]] ; then
  # Proceed with the build
  echo "✅ - Stable build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Preview builds not supported"
  exit 0;
fi