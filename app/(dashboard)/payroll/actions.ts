"use server";
import { createClient } from "@/utils/supabase/server";

export async function calculateSalary(employeeId: string, month: string) {
  const supabase = await createClient();
  
  // 1. Get employee & structure
  const { data: emp, error: empErr } = await supabase.from('employees').select('salary').eq('id', employeeId).single();
  if (empErr) throw empErr;

  const { data: struct } = await supabase.from('salary_structure').select('*').eq('employee_id', employeeId).single();
  
  // 2. Get attendance for the month
  const startDate = `${month}-01`;
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr);
  const m = parseInt(monthStr);
  const totalDays = new Date(year, m, 0).getDate();
  const endDate = `${month}-${totalDays}`;

  const { data: att } = await supabase.from('attendance')
    .select('status')
    .eq('employee_id', employeeId)
    .gte('date', startDate)
    .lte('date', endDate);
    
  let presentDays = 0;
  if (att) {
    att.forEach(a => {
      if (a.status === 'Present') presentDays += 1;
      else if (a.status === 'Half Day') presentDays += 0.5;
    });
  }

  // 3. Get incentives
  const { data: inc } = await supabase.from('incentives')
    .select('incentive_amount')
    .eq('employee_id', employeeId)
    .eq('month', month);
    
  const totalIncentives = inc?.reduce((sum, item) => sum + parseFloat(item.incentive_amount), 0) || 0;

  // 4. Calculate
  // If structure exists, use it. Else default to base salary as basic
  const basic = struct ? parseFloat(struct.basic) : parseFloat(emp.salary || '0');
  const hra = struct ? parseFloat(struct.hra) : 0;
  const allowance = struct ? parseFloat(struct.allowance) : 0;
  
  // Prorate basic by attendance
  const dailyRate = basic / totalDays;
  const earnedBasic = dailyRate * presentDays;
  
  // HRA and allowance are usually fixed, or we can prorate them too. Let's not prorate allowances to keep it simple, or prorate everything. Let's prorate basic only as per typical rules, or prorate gross. The prompt says: "payable days from attendance × daily rate, plus HRA and allowances" -> This implies HRA and allowance are fixed additions!
  const grossSalary = earnedBasic + hra + allowance;
  
  let deductions = 0;
  if (struct?.pf_enabled) {
    deductions = earnedBasic * 0.12; // 12% of basic
  }
  
  const netSalary = grossSalary - deductions + totalIncentives;

  const record = {
    employee_id: employeeId,
    month,
    total_days: totalDays,
    present_days: presentDays,
    payable_days: presentDays,
    gross_salary: grossSalary,
    deductions,
    incentives: totalIncentives,
    net_salary: netSalary,
    status: 'Unpaid'
  };

  // First try to check if it exists to do an update
  const { data: existing } = await supabase.from('salary_records')
    .select('id')
    .eq('employee_id', employeeId)
    .eq('month', month)
    .single();

  let result;
  if (existing) {
    const { data, error } = await supabase.from('salary_records')
      .update(record)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase.from('salary_records')
      .insert([record])
      .select()
      .single();
    if (error) throw error;
    result = data;
  }
  
  return result;
}
