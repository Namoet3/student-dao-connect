-- Fix the remaining function search path issue
CREATE OR REPLACE FUNCTION public.update_wallet_connections_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';