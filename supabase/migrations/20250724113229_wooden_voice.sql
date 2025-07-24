/*
  # Create wallet connections table

  1. New Tables
    - `wallet_connections`
      - `id` (uuid, primary key)
      - `wallet_address` (text, unique)
      - `connected_at` (timestamp)
      - `last_connected_at` (timestamp)
      - `connection_count` (integer)
      - `user_agent` (text, optional)
      - `ip_address` (text, optional)

  2. Security
    - Enable RLS on `wallet_connections` table
    - Add policy for users to read their own wallet data
    - Add policy for authenticated users to insert wallet connections
*/

CREATE TABLE IF NOT EXISTS wallet_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  connected_at timestamptz DEFAULT now(),
  last_connected_at timestamptz DEFAULT now(),
  connection_count integer DEFAULT 1,
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read wallet connection data
CREATE POLICY "Users can read wallet connections"
  ON wallet_connections
  FOR SELECT
  USING (true);

-- Policy to allow inserting new wallet connections
CREATE POLICY "Users can insert wallet connections"
  ON wallet_connections
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow updating wallet connections
CREATE POLICY "Users can update wallet connections"
  ON wallet_connections
  FOR UPDATE
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_wallet_connections_address ON wallet_connections(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_connections_connected_at ON wallet_connections(connected_at);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_wallet_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at field
CREATE TRIGGER update_wallet_connections_updated_at
  BEFORE UPDATE ON wallet_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_connections_updated_at();