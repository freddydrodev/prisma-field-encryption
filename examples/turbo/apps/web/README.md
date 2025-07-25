This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Configuration

This web app connects to the API server. You can configure the API URL by setting the `NEXT_PUBLIC_API_URL` environment variable:

```bash
# Create a .env.local file in the web app directory
NEXT_PUBLIC_API_URL=http://localhost:3001
```

If not set, it defaults to `http://localhost:3001`.

### Running the Application

First, make sure the database is set up and the API server is running:

```bash
# Set up the database with field encryption (from the root of the turbo monorepo)
cd packages/database
pnpm db:generate
pnpm db:migrate

# Set up environment variables for the API server
cd apps/api
# Create .env.local with DATABASE_URL and CLOAK_MASTER_KEY

# Start the API server (in a new terminal)
pnpm dev
```

Then, in another terminal, run the web development server:

```bash
cd apps/web
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
