# Finsight — Finance professionals network (MVP)

This repository contains a starter scaffold for Finsight, a LinkedIn-like platform for finance professionals to share insights, reports, and commentary.

Quickstart (Windows cmd):

1. Install dependencies:

```cmd
npm install
```

2. Start local Postgres with Docker Compose:

```cmd
docker compose up -d
```

3. Push Prisma schema and run seed:

```cmd
npx prisma db push
npm run db:seed
```

4. Run dev server:

```cmd
npm run dev
```

Environment variables (create a `.env` file from `.env.example`):

- DATABASE_URL - e.g. "postgresql://user:password@localhost:5432/finsight?schema=public"
- NEXTAUTH_URL - e.g. "http://localhost:3000"
- NEXTAUTH_SECRET - a random strong secret
- CLOUDINARY_URL or S3_* envs for file uploads (optional)

Deployment: Vercel + managed Postgres is recommended. See `docs/deploy.md` for a short checklist.

License: MIT
