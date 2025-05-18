# AZ House Recovery CRM

A comprehensive client management system for recovery centers.

## Deployment Guide

### Prerequisites

- A Vercel account
- Node.js and npm installed locally for development

### Local Development

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account
3. Click "Add New" > "Project"
4. Import your Git repository
5. Configure your project settings:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
6. Click "Deploy"

### Demo Credentials

The application comes with pre-configured demo accounts:

- Admin: admin@azhouse.org / admin123
- Staff: staff@azhouse.org / staff123
- Support: support@azhouse.org / support123

## Future Database Integration

This project currently uses an in-memory database for demonstration purposes. To integrate with a real database in the future:

1. Choose a database provider (Supabase, MongoDB, etc.)
2. Update the database connection code in `lib/db/index.ts`
3. Migrate the mock data to your real database
4. Update authentication in `lib/auth` to use your chosen auth provider

## Features

- Client Management
- Progress Notes
- Sobriety Tracking
- Staff Scheduling
- Alumni Management
- Alerts System
- Role-based Access Control

## License

This project is licensed under the MIT License.
