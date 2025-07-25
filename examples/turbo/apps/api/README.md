This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

### Environment Configuration

This API server uses field encryption for sensitive data. You need to set up the following environment variables:

```bash
# Create a .env.local file in the api app directory
DATABASE_URL="file:../packages/database/dev.db"
CLOAK_MASTER_KEY="your-32-character-encryption-key-here"
```

**Important**: The `CLOAK_MASTER_KEY` must be exactly 32 characters long for AES-256 encryption.

### Database Setup

First, set up the database with field encryption:

```bash
# From the root of the turbo monorepo
cd packages/database
pnpm db:generate
pnpm db:migrate
```

### Running the API Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The API server will run on [http://localhost:3001](http://localhost:3001).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
