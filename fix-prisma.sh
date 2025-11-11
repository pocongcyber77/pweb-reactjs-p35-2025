#!/bin/bash

echo "🔧 Fixing Prisma Client and Database..."

# Step 1: Generate Prisma client
echo "📦 Step 1: Generating Prisma client..."
npx prisma generate

# Step 2: Push schema to database (adds missing columns)
echo "📊 Step 2: Pushing schema to database..."
npx prisma db push --accept-data-loss

# Step 3: Verify
echo "✅ Done! Prisma client has been regenerated."
echo ""
echo "📋 Next steps:"
echo "1. Restart your server: npm run dev"
echo "2. Test the update endpoint"
echo ""

