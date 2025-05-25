-- Create client_legal table
CREATE TABLE IF NOT EXISTS client_legal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  legal_status TEXT,
  probation_officer JSONB,
  court_dates JSONB,
  legal_documents JSONB,
  legal_notes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_legal_client_id ON client_legal(client_id);

-- Add comment to table
COMMENT ON TABLE client_legal IS 'Stores legal information for clients';
