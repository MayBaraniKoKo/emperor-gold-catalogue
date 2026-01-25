-- Add original_price and discount columns to products table
ALTER TABLE public.products
ADD COLUMN original_price numeric(12,2) NULL,
ADD COLUMN discount numeric(5,2) DEFAULT 0 NOT NULL;

-- Note: original_price is optional (for new products, can be same as price)
-- discount is percentage (0-100), default 0
