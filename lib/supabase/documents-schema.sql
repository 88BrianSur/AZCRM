-- Create client_documents table
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY,
  client_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'Completed',
  tags TEXT[] DEFAULT '{}'
);

-- Create index for faster lookups by client_id
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
