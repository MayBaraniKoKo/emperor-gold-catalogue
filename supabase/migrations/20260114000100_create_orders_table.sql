-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  note text NULL,
  items jsonb NOT NULL,
  total numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS (optional) and add a permissive insert policy for demo/testing
-- NOTE: In production, tighten these policies to require authenticated users and proper checks.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON public.orders FOR INSERT USING (true);
CREATE POLICY "Allow admin deletes" ON public.orders FOR DELETE USING (auth.role() = 'authenticated');
