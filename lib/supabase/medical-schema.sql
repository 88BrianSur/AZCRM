-- Create client_medical table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_medical (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  allergies TEXT,
  medications JSONB DEFAULT '[]'::jsonb,
  conditions JSONB DEFAULT '[]'::jsonb,
  vitals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_medical_client_id ON client_medical(client_id);

-- Add comment to table
COMMENT ON TABLE client_medical IS 'Stores medical information for clients';
