# Database Guide

## Local Development

1. Start PostgreSQL with Docker:
```bash
docker compose up -d
```

2. Apply schema changes:
```bash
npx prisma db push
```

3. (Optional) Seed development data:
```bash
npm run db:seed
```

4. Open Prisma Studio to view/edit data:
```bash
npm run prisma:studio
```

## Database Migrations

### Creating Migrations

When you modify `schema.prisma`:

1. Create a new migration:
```bash
npx prisma migrate dev --name descriptive_name
```

2. Review generated SQL in `prisma/migrations`

3. Apply to development database:
```bash
npx prisma migrate dev
```

### Production Migrations

Before deploying schema changes:

1. Test migrations locally:
```bash
npx prisma migrate reset --preview
```

2. Deploy to production:
```bash
npx prisma migrate deploy
```

### Backup & Restore

Using pg_dump/pg_restore with Neon:

1. Backup:
```bash
pg_dump -d your_database_url > backup.sql
```

2. Restore:
```bash
psql your_database_url < backup.sql
```

## Performance Tips

1. Indexes are automatically created for:
- Primary keys
- Unique constraints
- Relations

2. Consider adding indexes for:
- Frequently searched fields
- Sort columns in feed queries
- Filter fields in search

3. Use connection pooling in production:
- Enable in Neon dashboard
- Update DATABASE_URL to use pooling config

## Monitoring

1. Monitor query performance:
- Use Prisma Client metrics
- Check database provider dashboard
- Set up alerts for slow queries

2. Common issues to watch:
- Connection pool exhaustion
- Slow queries without indexes
- Transaction timeouts

## Security

1. Access Control:
- Use row-level security when possible
- Implement soft deletes for user data
- Regular security audits

2. Data Protection:
- Regular backups
- Point-in-time recovery
- Encryption at rest (enabled by default)