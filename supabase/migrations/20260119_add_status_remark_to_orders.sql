-- Add status and remark columns to orders table
ALTER TABLE public.orders
ADD COLUMN status text DEFAULT 'pending' NOT NULL,
ADD COLUMN remark text NULL,
ADD COLUMN debit_money numeric(12,2) DEFAULT 0 NOT NULL;

-- Create enum type for order status
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');

-- You can optionally update the status column to use the enum type:
-- ALTER TABLE public.orders ALTER COLUMN status TYPE order_status USING status::order_status;
