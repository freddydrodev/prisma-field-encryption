#!/bin/bash

echo "🚀 Setting up Todo App with Prisma Field Encryption..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database URL for local development
DATABASE_URL="file:./dev.db"

# Prisma Field Encryption Key (if using encryption features)
# PRISMA_FIELD_ENCRYPTION_KEY="your-32-character-encryption-key"
EOF
    echo "✅ .env file created with SQLite configuration"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migration
echo "🗄️ Running database migration..."
npx prisma migrate dev --name init

echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "To view your database, run:"
echo "  npx prisma studio"