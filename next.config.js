/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos', 'lh3.googleusercontent.com'],
  },
  // Keep default ESLint settings; we will fix issues to allow builds to succeed with linting
}

module.exports = nextConfig
