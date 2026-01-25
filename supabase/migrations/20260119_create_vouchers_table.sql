-- Create vouchers table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(12,2) NOT NULL,
  expiry_date timestamptz NOT NULL,
  usage_limit integer DEFAULT 0,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  description text NULL
);

-- Enable RLS
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public reads" ON public.vouchers FOR SELECT USING (true);
CREATE POLICY "Allow admin creates" ON public.vouchers FOR INSERT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin updates" ON public.vouchers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin deletes" ON public.vouchers FOR DELETE USING (auth.role() = 'authenticated');
