# Deployment notes

Recommended: Vercel for the frontend + managed Postgres (Neon, Supabase, or Heroku Postgres).

Environment variables to set on deployment:

- DATABASE_URL
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- CLOUDINARY_URL or S3_* if using uploads

Build steps on Vercel: Next.js will build automatically; ensure you run `npx prisma generate` as part of build/prepare step if using Prisma.