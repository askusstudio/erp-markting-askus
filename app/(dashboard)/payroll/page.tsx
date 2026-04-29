"use client";

import { useState, useEffect } from "react";
import { Users, Wallet, Trophy, CalendarCheck, Loader2, Play, CheckCircle2, FileText, IndianRupee } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { calculateSalary } from "./actions";

export default function PayrollPage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<any[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPayout: 0,
    totalIncentives: 0,
    avgAttendance: 0,
    pendingUnpaid: 0
  });

  const [paymentModal, setPaymentModal] = useState<{isOpen: boolean, recordId: string | null, amount: number}>({ isOpen: false, recordId: null, amount: 0 });
  const [paymentDetails, setPaymentDetails] = useState({ mode: "Bank Transfer", transactionId: "" });

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch active employees
    const { data: emps } = await supabase.from('employees').select('id, name, role, designation, salary').eq('status', 'Active');
    
    // Fetch salary records for selected month
    const { data: records } = await supabase.from('salary_records')
      .select('*, employees(name)')
      .eq('month', selectedMonth);
      
    // Fetch attendance to calculate avg attendance
    const startDate = `${selectedMonth}-01`;
    const [year, month] = selectedMonth.split('-');
    const totalDays = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${selectedMonth}-${totalDays}`;
    
    const { data: att } = await supabase.from('attendance')
      .select('status, employee_id')
      .gte('date', startDate)
      .lte('date', endDate);

    setEmployees(emps || []);
    setSalaryRecords(records || []);

    // Compute stats
    const totalEmp = emps?.length || 0;
    const totalPayout = records?.reduce((sum, r) => sum + parseFloat(r.net_salary), 0) || 0;
    const totalInc = records?.reduce((sum, r) => sum + parseFloat(r.incentives), 0) || 0;
    const pending = records?.filter(r => r.status === 'Unpaid').length || 0;
    
    let avgAtt = 0;
    if (totalEmp > 0 && att && att.length > 0) {
      const presentCount = att.filter(a => a.status === 'Present').length + (att.filter(a => a.status === 'Half Day').length * 0.5);
      const possibleDays = totalEmp * totalDays;
      avgAtt = (presentCount / possibleDays) * 100;
    }

    setStats({
      totalEmployees: totalEmp,
      totalPayout,
      totalIncentives: totalInc,
      avgAttendance: avgAtt,
      pendingUnpaid: pending
    });
    
    setIsLoading(false);
  };

  const handleGenerateSalary = async (employeeId: string) => {
    setIsProcessing(employeeId);
    try {
      await calculateSalary(employeeId, selectedMonth);
      await fetchData();
    } catch (error) {
      console.error("Error generating salary:", error);
      alert("Failed to generate salary. Make sure employee exists.");
    }
    setIsProcessing(null);
  };

  const handleGenerateAll = async () => {
    if(!confirm("Generate salary for all active employees for this month?")) return;
    setIsProcessing("all");
    for (const emp of employees) {
      try {
        await calculateSalary(emp.id, selectedMonth);
      } catch(e) {}
    }
    await fetchData();
    setIsProcessing(null);
  };

  const handleMarkPaid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModal.recordId) return;
    
    const record = salaryRecords.find(r => r.id === paymentModal.recordId);
    
    // 1. Update salary_records
    await supabase.from('salary_records').update({ status: 'Paid' }).eq('id', paymentModal.recordId);
    
    // 2. Insert into payments
    await supabase.from('payments').insert([{
      employee_id: record.employee_id,
      salary_id: record.id,
      amount: record.net_salary,
      payment_date: new Date().toISOString().split('T')[0],
      mode: paymentDetails.mode,
      transaction_id: paymentDetails.transactionId
    }]);

    setPaymentModal({ isOpen: false, recordId: null, amount: 0 });
    setPaymentDetails({ mode: "Bank Transfer", transactionId: "" });
    fetchData();
  };

  const printSalarySlip = (record: any) => {
    const emp = employees.find(e => e.id === record.employee_id) || { name: record.employees?.name || 'Unknown', designation: '' };
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Salary Slip - ${emp.name} - ${record.month}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0 0 5px 0; color: #6366f1; }
            .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            table { w-full; border-collapse: collapse; margin-bottom: 30px; width: 100%; }
            th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
            th { background: #f8fafc; }
            .total { font-weight: bold; font-size: 1.1em; background: #f8fafc; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Askus Studio</h1>
            <p>Salary Slip for ${record.month}</p>
          </div>
          <div class="details">
            <div>
              <p><strong>Employee Name:</strong> ${emp.name}</p>
              <p><strong>Designation:</strong> ${emp.designation || 'N/A'}</p>
            </div>
            <div class="text-right">
              <p><strong>Total Days:</strong> ${record.total_days}</p>
              <p><strong>Present Days:</strong> ${record.present_days}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Earnings</th>
                <th class="text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gross Salary (Basic + HRA + Allowance)</td>
                <td class="text-right">₹${record.gross_salary.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Incentives</td>
                <td class="text-right">₹${record.incentives.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total Earnings</strong></td>
                <td class="text-right"><strong>₹${(record.gross_salary + record.incentives).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <table>
            <thead>
              <tr>
                <th>Deductions</th>
                <th class="text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PF / Other Deductions</td>
                <td class="text-right">₹${record.deductions.toFixed(2)}</td>
              </tr>
              <tr class="total">
                <td>Net Payable Salary</td>
                <td class="text-right">₹${record.net_salary.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <p style="text-align: center; color: #888; font-size: 0.9em; margin-top: 50px;">This is a computer-generated document and requires no signature.</p>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const statCards = [
    { name: "Active Employees", value: stats.totalEmployees.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Total Payout", value: `₹${stats.totalPayout.toFixed(2)}`, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Incentives Paid", value: `₹${stats.totalIncentives.toFixed(2)}`, icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "Avg Attendance", value: `${stats.avgAttendance.toFixed(1)}%`, icon: CalendarCheck, color: "text-violet-500", bg: "bg-violet-50" },
    { name: "Pending Salaries", value: stats.pendingUnpaid.toString(), icon: Wallet, color: "text-rose-500", bg: "bg-rose-50" }
  ];

  return (
    <div className="space-y-8 p-8 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Salary & Payroll</h1>
          <p className="mt-1 text-sm text-slate-400">Manage employee salaries, incentives, and attendance.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none bg-white"
          />
          <button 
            onClick={handleGenerateAll}
            disabled={isProcessing === "all" || employees.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-600 focus:outline-none disabled:opacity-50"
          >
            {isProcessing === "all" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
            Generate All
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <div key={stat.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">Payroll Records for {new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-[#fdfbf7]/50">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-400">Employee</th>
                <th className="px-6 py-4 font-medium text-slate-400">Attendance</th>
                <th className="px-6 py-4 font-medium text-slate-400">Gross / Ded / Inc</th>
                <th className="px-6 py-4 font-medium text-slate-400">Net Salary</th>
                <th className="px-6 py-4 font-medium text-slate-400">Status</th>
                <th className="px-6 py-4 text-right font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-500 mx-auto mb-2" />
                    Loading payroll data...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No active employees found.
                  </td>
                </tr>
              ) : employees.map((emp) => {
                const record = salaryRecords.find(r => r.employee_id === emp.id);
                
                return (
                  <tr key={emp.id} className="transition-colors hover:bg-[#fdfbf7]/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{emp.name}</div>
                      <div className="text-xs text-slate-400">{emp.designation || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {record ? (
                        <div className="text-slate-600">{record.present_days} / {record.total_days} Days</div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {record ? (
                        <div className="text-xs space-y-1">
                          <div className="text-slate-600">Gross: ₹{record.gross_salary.toFixed(2)}</div>
                          {record.deductions > 0 && <div className="text-rose-500">Ded: -₹{record.deductions.toFixed(2)}</div>}
                          {record.incentives > 0 && <div className="text-emerald-500">Inc: +₹{record.incentives.toFixed(2)}</div>}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {record ? `₹${record.net_salary.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {record ? (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${record.status === "Paid" ? "bg-teal-50 text-teal-600 ring-1 ring-teal-500/20" : "bg-amber-50 text-amber-600 ring-1 ring-amber-500/20"}`}>
                          {record.status === "Paid" && <CheckCircle2 className="h-3 w-3" />}
                          {record.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-zinc-600/20">Not Generated</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!record ? (
                          <button 
                            onClick={() => handleGenerateSalary(emp.id)}
                            disabled={isProcessing === emp.id}
                            className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-100 transition-colors disabled:opacity-50"
                          >
                            {isProcessing === emp.id ? "Processing..." : "Generate"}
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => printSalarySlip(record)}
                              title="Download Salary Slip"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                            {record.status === 'Unpaid' && (
                              <button 
                                onClick={() => setPaymentModal({ isOpen: true, recordId: record.id, amount: record.net_salary })}
                                className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-600 hover:bg-teal-100 transition-colors"
                              >
                                Mark Paid
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Mark Salary Paid</h2>
            <form onSubmit={handleMarkPaid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <input type="text" disabled value={`₹${paymentModal.amount.toFixed(2)}`} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode *</label>
                <select value={paymentDetails.mode} onChange={e => setPaymentDetails({...paymentDetails, mode: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none bg-white">
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction ID / Ref No.</label>
                <input type="text" value={paymentDetails.transactionId} onChange={e => setPaymentDetails({...paymentDetails, transactionId: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setPaymentModal({ isOpen: false, recordId: null, amount: 0 })} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 transition-colors">Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
