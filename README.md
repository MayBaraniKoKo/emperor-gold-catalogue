# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

---

## Server-side Orders (Supabase)

This project can persist orders server-side using Supabase. Steps to enable:

1. Apply the provided SQL migration in `supabase/migrations/20260114000100_create_orders_table.sql` to create the `orders` table.
2. Ensure the `orders` table has a suitable RLS policy. The migration includes a permissive insert policy for demo/testing, but in production you should require authenticated users or server-side validation.
3. The checkout page (`src/pages/Checkout.tsx`) attempts to insert orders into Supabase and falls back to localStorage if the insert fails.

If you'd like, I can also add a server-side endpoint or use a service role key to securely accept unauthenticated orders and/or send confirmation emails.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Cart behavior

- The site includes a simple client-side cart (persisted in the browser's `localStorage`).
- Add items from the product detail page. The cart is available at `/cart` and via the cart icon in the header.
- Cart persistence is a convenience for a demo; for production you may want server-side carts tied to user accounts.
