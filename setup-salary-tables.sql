-- Run this in your Supabase SQL Editor

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT,
  designation TEXT,
  salary DECIMAL(10,2),
  joining_date DATE,
  bank_details JSONB,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL, -- Present, Absent, Half Day
  check_in TIME,
  check_out TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(employee_id, date)
);

CREATE TABLE salary_structure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE UNIQUE,
  basic DECIMAL(10,2) NOT NULL DEFAULT 0,
  hra DECIMAL(10,2) NOT NULL DEFAULT 0,
  allowance DECIMAL(10,2) NOT NULL DEFAULT 0,
  pf_enabled BOOLEAN DEFAULT false
);

CREATE TABLE incentives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- YYYY-MM
  sales_amount DECIMAL(10,2) DEFAULT 0,
  incentive_amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL, -- percentage, fixed, slab
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE salary_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- YYYY-MM
  total_days INT NOT NULL,
  present_days DECIMAL(4,1) NOT NULL,
  payable_days DECIMAL(4,1) NOT NULL,
  gross_salary DECIMAL(10,2) NOT NULL,
  deductions DECIMAL(10,2) NOT NULL,
  incentives DECIMAL(10,2) NOT NULL,
  net_salary DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'Unpaid', -- Unpaid, Paid
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(employee_id, month)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  salary_id UUID REFERENCES salary_records(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  mode TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and create wide-open policies for unrestricted testing
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for employees" ON employees FOR ALL USING (true);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for attendance" ON attendance FOR ALL USING (true);

ALTER TABLE salary_structure ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for salary_structure" ON salary_structure FOR ALL USING (true);

ALTER TABLE incentives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for incentives" ON incentives FOR ALL USING (true);

ALTER TABLE salary_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for salary_records" ON salary_records FOR ALL USING (true);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for payments" ON payments FOR ALL USING (true);
