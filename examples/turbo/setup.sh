#!/bin/bash

echo "🚀 Setting up Turbo Todo App with Prisma Field Encryption..."

# Check if .env file exists in database package
if [ ! -f packages/database/.env ]; then
    echo "📝 Creating .env file in database package..."
    cat > packages/database/.env << EOF
# Database URL for local development
DATABASE_URL="file:./dev.db"

# Prisma Field Encryption Key (if using encryption features)
# CLOAK_MASTER_KEY="your-32-character-encryption-key"
EOF
    echo "✅ .env file created with SQLite configuration"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd packages/database
pnpm db:generate

# Run database migration
echo "🗄️ Running database migration..."
pnpm db:migrate

cd ../..

echo "🎉 Setup complete!"
echo ""
echo "To start the development servers, run:"
echo "  pnpm dev"
echo ""
echo "Then open http://localhost:3000 for the web app"
echo "and http://localhost:3001 for the API"
echo ""
echo "To view your database, run:"
echo "  cd packages/database && pnpm db:studio"