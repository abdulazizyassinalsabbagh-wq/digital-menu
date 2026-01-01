# Digital Menu App - Setup Instructions

## Overview
A digital menu system where restaurants can manage their menus via an admin panel and customers can view menus by scanning QR codes.

## Features
- Admin panel for restaurant owners
- Add/edit/delete menu items
- Category management
- Availability toggle for items
- QR code generation
- Customer-facing menu website
- Simple password protection

## Prerequisites
- Node.js (v18 or higher)
- A Supabase account (free tier works fine)

## Setup Steps

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be ready
4. Go to SQL Editor in the sidebar
5. Copy the contents of `supabase-schema.sql` and paste it into the SQL Editor
6. Click "Run" to create all the tables

### 2. Get Supabase Credentials

1. In your Supabase project, go to Settings (gear icon) > API
2. Copy the "Project URL"
3. Copy the "anon public" key

### 3. Configure Environment Variables

1. Open `.env.local` in the root directory
2. Replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Creating Your First Restaurant

Since this is a demo, you'll need to manually add a restaurant to the database:

1. Go to your Supabase project
2. Click "Table Editor" in the sidebar
3. Select the "restaurants" table
4. Click "Insert row"
5. Fill in:
   - name: Your Restaurant Name
   - password: yourpassword (in production, this should be hashed)
   - slug: your-restaurant-name (no spaces, lowercase)
6. Save the row

## Using the Admin Panel

1. Go to `/admin/login`
2. Enter your restaurant slug (e.g., "your-restaurant-name")
3. Enter your password
4. You're in! Now you can:
   - Add menu items
   - Create categories
   - Generate QR codes

## Customer Menu Access

Customers can view your menu at: `/menu/your-restaurant-slug`

Example: `http://localhost:3000/menu/your-restaurant-name`

## Project Structure

```
app/
├── admin/
│   ├── login/              # Admin login page
│   └── dashboard/          # Admin dashboard
│       ├── page.tsx        # Menu items management
│       ├── categories/     # Category management
│       └── qr-code/        # QR code generation
├── menu/
│   └── [slug]/             # Customer-facing menu (dynamic route)
└── page.tsx                # Landing page

lib/
└── supabase.ts             # Supabase client configuration

supabase-schema.sql         # Database schema
```

## Database Tables

- **restaurants**: Store restaurant info and credentials
- **categories**: Menu categories (appetizers, mains, etc.)
- **menu_items**: Individual menu items with prices and descriptions

## Next Steps for Production

1. Hash passwords instead of storing plain text
2. Add proper user authentication (Supabase Auth)
3. Add image upload for menu items
4. Add multi-restaurant support with proper authentication
5. Add analytics to track menu views
6. Customize styling to match your brand
7. Deploy to Vercel or similar platform

## Deployment

To deploy to Vercel:

```bash
npm run build
```

Then connect your GitHub repo to Vercel and add the environment variables.

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
