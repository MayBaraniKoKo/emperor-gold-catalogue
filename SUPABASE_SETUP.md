# Supabase Database Setup Guide for Emperor Gold Catalogue

## Your Supabase Project Details

- **Project ID:** khqrubyyndipqjyerrqg
- **Project URL:** https://khqrubyyndipqjyerrqg.supabase.co
- **Dashboard:** https://app.supabase.com/project/khqrubyyndipqjyerrqg

## Quick Setup (3 Steps)

### Step 1: Copy the Migration SQL
File location: `APPLY_ALL_MIGRATIONS.sql` in your project root

### Step 2: Run in Supabase
1. Go to: https://app.supabase.com/project/khqrubyyndipqjyerrqg/sql/new
2. Open the SQL Editor
3. Paste the entire contents of `APPLY_ALL_MIGRATIONS.sql`
4. Click the **RUN** button
5. Wait for completion (should take 5-10 seconds)

### Step 3: Verify Setup
After running the SQL, you can verify the setup:

```bash
node verify-db.mjs
```

This will check that all tables were created successfully.

## What Gets Created

### Tables
- ✅ **categories** - Product categories
- ✅ **subcategories** - Sub-categories within categories
- ✅ **products** - Products with discount fields (original_price, discount)
- ✅ **orders** - Customer orders with status tracking
- ✅ **vouchers** - Discount vouchers

### Security Features
- ✅ **Row Level Security (RLS)** - Enabled on all tables
- ✅ **Public Read Access** - Anyone can view products, categories, orders
- ✅ **Admin Write Access** - Only authenticated users can create/update/delete
- ✅ **Auto Timestamps** - All tables auto-update `created_at` and `updated_at`

### Performance
- ✅ **Indexes** - Created on foreign keys and frequently searched fields
- ✅ **Triggers** - Auto-update timestamps on changes

## Product Discount Fields

The products table includes:
- `price` - Current selling price (after discount)
- `original_price` - Original price before discount (nullable, for admin use)
- `discount` - Discount percentage (0-100, default 0)

The frontend automatically calculates and displays:
- Original price (struck-through if discount > 0)
- Discount percentage badge
- Final discounted price

## For GoDaddy Hosting

This setup is production-ready for GoDaddy:

1. ✅ Database hosted on Supabase (cloud-based)
2. ✅ Automatic backups and security
3. ✅ Scalable for future growth
4. ✅ Can handle high traffic
5. ✅ SSL/HTTPS included
6. ✅ Public API ready for your website

Your `.env` file already has the correct Supabase credentials configured.

## Troubleshooting

### Tables don't appear after running SQL
- Check the Supabase dashboard for any error messages
- Make sure you're using a fresh Supabase project
- Try running the SQL again in small sections if needed

### Can't connect to database in your app
- Verify `.env` has the correct VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
- Check that your Supabase project is active
- Test with: `node verify-db.mjs`

### Still having issues?
1. Check https://app.supabase.com/project/khqrubyyndipqjyerrqg/editor - view the tables directly
2. Look at the SQL Editor logs for any errors
3. Try running each migration section separately

## Next Steps

1. ✅ Run the SQL migrations
2. ✅ Verify with `node verify-db.mjs`
3. ✅ Run your dev server: `npm run dev`
4. ✅ Test the app locally
5. ✅ Deploy to GoDaddy when ready

Your Emperor Gold Catalogue is now ready for production! 🎉
