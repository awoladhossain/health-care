# 📘 Prisma Installation & Setup Guide for Node.js

A complete, step-by-step guide to set up Prisma correctly and avoid common issues.

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL/MySQL/MongoDB (or any supported database)

---

## 🚀 Step 1: Initialize Your Node.js Project

```bash
# Create project directory
mkdir my-project
cd my-project

# Initialize package.json
npm init -y
```

---

## 📦 Step 2: Install Dependencies

### Install Prisma as Dev Dependency

```bash
npm install -D prisma
```

### Install Prisma Client as Regular Dependency

```bash
npm install @prisma/client
```

### Install TypeScript & Other Dev Tools (for TypeScript projects)

```bash
npm install -D typescript @types/node ts-node-dev
```

---

## ⚙️ Step 3: Initialize Prisma

```bash
npx prisma init
```

**This creates:**

- `prisma/schema.prisma` - Your database schema
- `.env` - Environment variables file with `DATABASE_URL`

---

## 🗄️ Step 4: Configure Database Connection

Edit `.env` file:

### PostgreSQL Example

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
```

### MySQL Example

```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

### MongoDB Example

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database_name"
```

---

## 📝 Step 5: Define Your Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  // ✅ DO NOT add custom output path unless absolutely necessary
}

datasource db {
  provider = "postgresql"  // or "mysql", "mongodb", "sqlite"
  url      = env("DATABASE_URL")
}

// Example models
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]

  @@map("users")
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

---

## 🔄 Step 6: Create Database & Generate Client

### Option A: Development (Push schema without migrations)

```bash
npx prisma db push
```

### Option B: Production (Create migrations)

```bash
# Create migration
npx prisma migrate dev --name init

# This does 3 things:
# 1. Creates SQL migration files
# 2. Applies migration to database
# 3. Generates Prisma Client
```

### Generate Client Manually (if needed)

```bash
npx prisma generate
```

---

## 💻 Step 7: Use Prisma Client in Your Code

### Create a Prisma Client Instance

**`src/lib/prisma.ts`** (Recommended for production):

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Why this pattern?**

- Prevents multiple Prisma Client instances in development (hot reload)
- Single instance in production

### Simple Version (for small projects)

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

---

## 📚 Step 8: Example CRUD Operations

**`src/services/user.service.ts`:**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
export const createUser = async (data: { email: string; name: string }) => {
  return await prisma.user.create({
    data,
  });
};

// Read (Find One)
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });
};

// Read (Find Many)
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: { posts: true },
  });
};

// Update
export const updateUser = async (id: string, data: { name?: string }) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

// Delete
export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};
```

---

## 🔧 Step 9: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:push": "prisma db push",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

---

## 📂 Step 10: Project Structure

```
my-project/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts (optional)
├── src/
│   ├── lib/
│   │   └── prisma.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── controllers/
│   ├── routes/
│   └── server.ts
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## ⚠️ Common Mistakes to AVOID

### ❌ DON'T: Use custom output path (unless necessary)

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"  // ❌ Avoid this
}
```

### ✅ DO: Use standard location

```prisma
generator client {
  provider = "prisma-client-js"  // ✅ Generates to node_modules/.prisma/client
}
```

---

### ❌ DON'T: Import from custom paths

```typescript
import { PrismaClient } from '../generated/prisma/client';  // ❌
```

### ✅ DO: Import from @prisma/client

```typescript
import { PrismaClient } from '@prisma/client';  // ✅
```

---

### ❌ DON'T: Create multiple Prisma Client instances

```typescript
// In every file
const prisma = new PrismaClient();  // ❌ Memory leak
```

### ✅ DO: Create one instance and export it

```typescript
// lib/prisma.ts
export const prisma = new PrismaClient();

// other files
import { prisma } from './lib/prisma';  // ✅
```

---

### ❌ DON'T: Forget to generate after schema changes

```bash
# Changed schema.prisma
npm run dev  // ❌ Using old client
```

### ✅ DO: Regenerate client after changes

```bash
# Changed schema.prisma
npx prisma generate  // ✅ Generate new client
npm run dev
```

---

## 🔄 Workflow After Schema Changes

**Every time you modify `schema.prisma`:**

```bash
# Development workflow
npx prisma db push        # Push changes to database
npx prisma generate       # Regenerate client

# Production workflow
npx prisma migrate dev --name your_migration_name
# This automatically runs prisma generate
```

---

## 🛠️ Useful Prisma Commands

```bash
# Open Prisma Studio (Database GUI)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# View current database schema
npx prisma db pull

# Seed database
npx prisma db seed
```

---

## 🧪 Step 11: Setup Database Seeding (Optional)

**`prisma/seed.ts`:**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      posts: {
        create: [
          {
            title: 'First Post',
            content: 'This is my first post',
            published: true,
          },
        ],
      },
    },
  });

  console.log('Created user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Add to `package.json`:**

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

**Run seed:**

```bash
npx prisma db seed
```

---

## 🔐 Step 12: Environment Variables Best Practices

**`.env`:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NODE_ENV="development"
```

**`.env.example`** (commit this to git):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NODE_ENV="development"
```

**`.gitignore`:**

```
node_modules/
.env
dist/
*.log
```

---

## 🐛 Troubleshooting

### Issue: "Prisma Client did not initialize"

**Solution:**

```bash
npx prisma generate
```

### Issue: Schema changes not reflected

**Solution:**

```bash
npx prisma generate
# Restart your dev server
```

### Issue: Database connection errors

**Solution:**

- Check `DATABASE_URL` in `.env`
- Ensure database server is running
- Verify credentials and database name

### Issue: Type errors after schema change

**Solution:**

```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Issue: "Unknown argument" validation errors

**Solution:**
This usually means you're using a stale Prisma Client. Follow these steps:

```bash
# 1. Remove old generated clients
rm -rf node_modules/.prisma
rm -rf src/generated

# 2. Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Generate fresh client
npx prisma generate

# 4. Restart your dev server
npm run dev
```

---

## 📖 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Examples](https://github.com/prisma/prisma-examples)

---

## ✅ Quick Reference Checklist

- [ ] Install `prisma` as devDependency
- [ ] Install `@prisma/client` as dependency
- [ ] Run `npx prisma init`
- [ ] Configure `DATABASE_URL` in `.env`
- [ ] Define models in `schema.prisma`
- [ ] **DON'T** add custom output path
- [ ] Run `npx prisma migrate dev` or `npx prisma db push`
- [ ] **ALWAYS** import from `@prisma/client`
- [ ] Create single Prisma Client instance
- [ ] Run `npx prisma generate` after schema changes

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## 📄 License

This guide is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ for the Node.js & Prisma community**

**Save this guide and follow it every time you set up Prisma in a new project!** 🚀
