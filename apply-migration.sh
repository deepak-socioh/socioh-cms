#!/bin/bash

# This script applies the database migration directly using psql
# Run this if you have network restrictions preventing Prisma CLI from working

echo "Applying database migration to Neon DB..."

# Read the migration SQL file
MIGRATION_SQL=$(cat prisma/migrations/20241022_init/migration.sql)

# Apply the migration using psql
psql "$DATABASE_URL" << EOF
$MIGRATION_SQL
EOF

if [ $? -eq 0 ]; then
    echo "✅ Migration applied successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Run: PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate"
    echo "2. Or deploy to Vercel and let it generate Prisma client automatically"
else
    echo "❌ Migration failed. Please check the error above."
    exit 1
fi
