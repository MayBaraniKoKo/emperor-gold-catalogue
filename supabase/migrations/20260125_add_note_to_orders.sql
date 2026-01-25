-- Add note column to orders table for customer notes
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS note TEXT;
