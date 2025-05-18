-- Add columns to clients table for sobriety tracking
ALTER TABLE clients ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_relapse_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS relapse_count INTEGER DEFAULT 0;

-- Create sobriety_logs table
CREATE TABLE IF NOT EXISTS sobriety_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('sober', 'relapse')),
  check_in_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sobriety_milestones table
CREATE TABLE IF NOT EXISTS sobriety_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  days INTEGER NOT NULL,
  achieved_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to increment relapse count
CREATE OR REPLACE FUNCTION increment_relapse_count(client_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE clients
  SET relapse_count = COALESCE(relapse_count, 0) + 1
  WHERE id = client_id
  RETURNING relapse_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sobriety_logs_client_id ON sobriety_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_sobriety_logs_check_in_date ON sobriety_logs(check_in_date);
CREATE INDEX IF NOT EXISTS idx_sobriety_milestones_client_id ON sobriety_milestones(client_id);

-- Create RLS policies
ALTER TABLE sobriety_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sobriety_milestones ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all sobriety logs
CREATE POLICY sobriety_logs_select_policy ON sobriety_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert their own sobriety logs
CREATE POLICY sobriety_logs_insert_policy ON sobriety_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to read all sobriety milestones
CREATE POLICY sobriety_milestones_select_policy ON sobriety_milestones
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert their own sobriety milestones
CREATE POLICY sobriety_milestones_insert_policy ON sobriety_milestones
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own sobriety milestones
CREATE POLICY sobriety_milestones_update_policy ON sobriety_milestones
  FOR UPDATE USING (auth.role() = 'authenticated');
