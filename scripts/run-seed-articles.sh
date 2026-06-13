#!/bin/bash
cd /home/z/my-project
export DATABASE_URL="file:/home/z/my-project/db/custom.db"
exec bun run scripts/seed-articles.ts 2>&1 | tee /tmp/seed-articles-full.log
