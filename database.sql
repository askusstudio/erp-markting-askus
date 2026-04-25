-- Run this schema in your Supabase SQL Editor

-- 1. Create a Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT,
  tax_id TEXT,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create a Users table (extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create a Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  industry TEXT,
  tax_id TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Active',
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create an Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(10,2) DEFAULT 0.00,
  tax_total DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) DEFAULT 0.00,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create an Invoice Line Items table
CREATE TABLE invoice_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1.00,
  rate DECIMAL(10,2) DEFAULT 0.00,
  tax_percentage DECIMAL(5,2) DEFAULT 0.00,
  amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create a Service Packages table
CREATE TABLE service_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_price DECIMAL(10,2) DEFAULT 0.00,
  recurring_cadence TEXT, -- monthly, weekly, yearly, null
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Retainers table
CREATE TABLE retainers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  package_id UUID REFERENCES service_packages(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) DEFAULT 0.00,
  cadence TEXT DEFAULT 'Monthly',
  next_invoice_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Enable RLS (Row Level Security)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE retainers ENABLE ROW LEVEL SECURITY;

-- Note: You will need to write proper RLS policies so that users can only read/write to their own workspace_id.
-- For MVP testing, we are allowing all access:
CREATE POLICY "Allow public access for MVP" ON workspaces FOR ALL USING (true);
CREATE POLICY "Allow public access for MVP" ON users FOR ALL USING (true);
CREATE POLICY "Allow public access for MVP" ON clients FOR ALL USING (true);
CREATE POLICY "Allow public access for MVP" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow public access for MVP" ON invoice_line_items FOR ALL USING (true);
CREATE POLICY "Allow public access for MVP" ON service_packages FOR ALL USING (true);
CREATE POLICY "Allow public access for MVP" ON retainers FOR ALL USING (true);
