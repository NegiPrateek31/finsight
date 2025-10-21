# Environment Setup Guide

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up local environment:
   - Copy `.env.example` to `.env`
   - Fill in required variables (see below)

3. Start development server:
```bash
npm run dev
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=              # PostgreSQL connection URL

# NextAuth
NEXTAUTH_URL=             # http://localhost:3000 for local
NEXTAUTH_SECRET=          # Generate with: openssl rand -base64 32

# OAuth (at least one required)
GITHUB_ID=                # GitHub OAuth App ID
GITHUB_SECRET=            # GitHub OAuth App Secret
GOOGLE_ID=               # Google OAuth Client ID
GOOGLE_SECRET=           # Google OAuth Client Secret

# File Upload
CLOUDINARY_URL=          # Cloudinary environment URL
```

### Optional Variables

```bash
# Email (for magic link auth)
EMAIL_SERVER=            # SMTP server settings
EMAIL_FROM=             # Sender email address

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=  # Vercel Analytics ID
```

## Local Services

### Database
- PostgreSQL runs in Docker
- Default credentials in docker-compose.yml
- Access via Prisma Studio: npm run prisma:studio

### File Storage
- Cloudinary for production
- Local storage fallback for development
- Configure limits in next.config.js

## Development Tools

### VS Code Extensions
- Prisma: `prisma.prisma`
- ESLint: `dbaeumer.vscode-eslint`
- Prettier: `esbenp.prettier-vscode`

### Chrome Extensions
- React Developer Tools
- Redux DevTools (optional)

## Troubleshooting

### Common Setup Issues

1. npm install fails:
   - Clear npm cache
   - Delete node_modules
   - Try with --legacy-peer-deps

2. Database connection fails:
   - Check Docker is running
   - Verify DATABASE_URL
   - Reset Docker volume if needed

3. Auth doesn't work:
   - Check NEXTAUTH_URL matches
   - Verify OAuth credentials
   - Clear browser cookies

### Development Tips

1. Hot Reload:
   - Enable in next.config.js
   - Use fast refresh safely

2. Type Checking:
   - Run tsc --watch
   - Fix type errors early

3. Testing:
   - Use watch mode: npm test -- --watch
   - Run E2E: npx playwright test