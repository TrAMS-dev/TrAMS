# TrAMS Web

The official website for **Trondheim Akuttmedisinske Studentforening (TrAMS)**. This project is a modern web application built for performance, ease of content management, and scalability.

## 🛠️ Technology Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **CMS:** [Sanity v3](https://www.sanity.io/)
- **Database / Auth:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Chakra UI](https://chakra-ui.com/), [Ark UI](https://ark-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/trams-web.git
   cd trams-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

### Environment Configuration

Create a `.env.local` file in the root directory. You can use the `env.example` file as a reference.

**Required Environment Variables:**

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-12-01 # Optional

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📂 Project Structure

- **`/app`**: Next.js App Router pages and layouts.
  - **`/studio`**: The Sanity Studio mounting point.
- **`/components`**: Reusable React components.
- **`/sanity`**: Sanity configuration, schemas, and utilities.
  - **`/schemas`**: Content content definitions.
- **`/utils`**: Helper functions and utilities.
- **`/public`**: Static assets (images, fonts, etc.).

## ✏️ Content Management (Sanity)

This project uses Sanity as a Headless CMS.

### Accessing the Studio

You can access the content editing interface locally at:
[http://localhost:3000/studio](http://localhost:3000/studio)

### updating Schemas & Types

If you verify or modify schemas in `sanity/schemas`, remember to regenerate the TypeScript definitions:

```bash
npm run typegen
```

This command runs `sanity schema extract` and `sanity typegen generate` to ensure your frontend code is type-safe with your content model.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run typegen`: Generates TypeScript types from Sanity schemas.

## ☁️ Deployment

The application is designed to be deployed on **Vercel**.

1. Push your code to a Git repository.
2. Import the project into Vercel.
3. Configure the **Environment Variables** in the Vercel dashboard.
4. Deploy!
