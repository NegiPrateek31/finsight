# Security notes

- Never check secrets into source control. Use environment variables for secrets like `NEXTAUTH_SECRET` and cloud storage keys.
- Validate and sanitize uploaded files. Limit allowed file types (PDF, PNG, JPG) and size.
- Use signed URLs for serving private reports or use a CDN with origin protection.
- Rate-limit write endpoints and add moderation tools to review reported content.
