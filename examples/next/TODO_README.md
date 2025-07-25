# Todo App with Prisma Field Encryption

A secure todo application built with Next.js and Prisma, featuring field-level encryption for sensitive data.

## Features

- ✅ **Create, Read, Update, Delete (CRUD) operations** for todos
- 🔒 **Field-level encryption** using Prisma Field Encryption
- 🎨 **Modern UI** with Tailwind CSS
- 📱 **Responsive design** that works on all devices
- ⚡ **Real-time updates** with optimistic UI
- 🗄️ **Database persistence** with PostgreSQL

## Todo Features

- Add new todos with title and optional description
- Mark todos as completed/incomplete
- Delete todos
- View creation dates
- Clean, intuitive interface

## Database Schema

The application uses a simple Todo model:

```prisma
model Todo {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Setup Instructions

### Quick Setup (Recommended)

Run the setup script for automatic configuration:

```bash
./setup.sh
```

This will:

- Create a `.env` file with SQLite configuration
- Install dependencies
- Generate Prisma client
- Run database migrations
- Start the development server

### Manual Setup

1. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up your database:**

   - Create a `.env` file in the root directory
   - Set the `DATABASE_URL` environment variable in your `.env` file
   - For SQLite (recommended for development): `DATABASE_URL="file:./dev.db"`
   - For PostgreSQL: `DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"`

3. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

4. **Run database migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Home Page:** Visit the home page to see an overview and get started
2. **Todo List:** Click "Go to Todos" or navigate to `/todos` to manage your todos
3. **Add Todos:** Use the form at the top to add new todos
4. **Complete Todos:** Click the checkbox next to any todo to mark it as complete
5. **Delete Todos:** Click the trash icon to remove a todo

## Security Features

This application demonstrates the use of Prisma Field Encryption, which provides:

- **Field-level encryption** for sensitive data
- **Automatic encryption/decryption** at the database level
- **Secure key management**
- **Transparent encryption** - no changes needed in application code

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite/PostgreSQL with Prisma ORM
- **Encryption:** Prisma Field Encryption
- **Deployment:** Ready for Vercel deployment

## Development

The application is structured as follows:

```
src/
├── app/
│   ├── api/todos/          # API routes for todo operations
│   ├── todos/              # Todo list page
│   ├── layout.tsx          # Root layout with navigation
│   └── page.tsx            # Home page
├── generated/prisma/       # Generated Prisma client
└── lib/
    └── prisma.ts           # Prisma client configuration
```

### Import Aliases

The application uses the `@` alias for cleaner imports. See `IMPORT_EXAMPLES.md` for detailed examples.

**Example:**

```typescript
// Instead of: import prisma from '../../../lib/prisma'
import prisma from '@/lib/prisma'
```

## Contributing

Feel free to contribute to this project by:

1. Adding new features
2. Improving the UI/UX
3. Adding tests
4. Fixing bugs
5. Improving documentation

## License

This project is part of the Prisma Field Encryption library and follows the same license terms.
