"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User, Phone, Mail, Building, MapPin, IndianRupee, Loader2, CalendarCheck, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function EmployeeProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();
  
  const [employee, setEmployee] = useState<any>(null);
  const [structure, setStructure] = useState<any>({ basic: 0, hra: 0, allowance: 0, pf_enabled: false });
  const [attendance, setAttendance] = useState<any[]>([]);
  const [incentives, setIncentives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("attendance"); // attendance, structure, incentives
  
  const [newAtt, setNewAtt] = useState({ date: new Date().toISOString().split('T')[0], status: "Present", check_in: "09:00", check_out: "18:00" });
  const [newInc, setNewInc] = useState({ month: new Date().toISOString().slice(0, 7), sales_amount: "", incentive_amount: "", type: "Percentage" });

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    
    const [empRes, structRes, attRes, incRes] = await Promise.all([
      supabase.from('employees').select('*').eq('id', id).single(),
      supabase.from('salary_structure').select('*').eq('employee_id', id).single(),
      supabase.from('attendance').select('*').eq('employee_id', id).order('date', { ascending: false }).limit(30),
      supabase.from('incentives').select('*').eq('employee_id', id).order('month', { ascending: false })
    ]);
    
    if (empRes.data) setEmployee(empRes.data);
    if (structRes.data) setStructure(structRes.data);
    if (attRes.data) setAttendance(attRes.data);
    if (incRes.data) setIncentives(incRes.data);
    
    setIsLoading(false);
  };

  const handleSaveStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      employee_id: id,
      basic: parseFloat(structure.basic),
      hra: parseFloat(structure.hra),
      allowance: parseFloat(structure.allowance),
      pf_enabled: structure.pf_enabled
    };
    
    const { error } = await supabase.from('salary_structure').upsert(data, { onConflict: 'employee_id' });
    if (!error) alert("Salary Structure Saved!");
    else alert("Error saving structure");
  };

  const handleAddAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      employee_id: id,
      date: newAtt.date,
      status: newAtt.status,
      check_in: newAtt.check_in,
      check_out: newAtt.check_out
    };
    
    const { error } = await supabase.from('attendance').upsert(data, { onConflict: 'employee_id, date' });
    if (!error) {
      setNewAtt({ date: new Date().toISOString().split('T')[0], status: "Present", check_in: "09:00", check_out: "18:00" });
      fetchData();
    } else {
      alert("Error marking attendance");
    }
  };

  const handleAddIncentive = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      employee_id: id,
      month: newInc.month,
      sales_amount: parseFloat(newInc.sales_amount) || 0,
      incentive_amount: parseFloat(newInc.incentive_amount),
      type: newInc.type
    };
    
    const { error } = await supabase.from('incentives').insert([data]);
    if (!error) {
      setNewInc({ month: new Date().toISOString().slice(0, 7), sales_amount: "", incentive_amount: "", type: "Percentage" });
      fetchData();
    } else {
      alert("Error adding incentive");
    }
  };

  const handleDeleteIncentive = async (incId: string) => {
    await supabase.from('incentives').delete().eq('id', incId);
    fetchData();
  };

  const handleDeleteAttendance = async (attId: string) => {
    await supabase.from('attendance').delete().eq('id', attId);
    fetchData();
  };

  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>;
  if (!employee) return <div className="p-8">Employee not found</div>;

  return (
    <div className="space-y-8 p-8 flex-1">
      <div className="flex items-center gap-4">
        <Link href="/employees" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">{employee.name}</h1>
          <p className="mt-1 text-sm text-slate-400">{employee.designation} • {employee.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{employee.name}</h2>
                <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${employee.status === "Active" ? "bg-teal-50 text-teal-600 ring-1 ring-teal-500/20" : "bg-slate-100 text-slate-600 ring-1 ring-zinc-600/20"}`}>
                  {employee.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                <a href={`mailto:${employee.email}`} className="text-sm font-medium text-violet-600 hover:underline">{employee.email}</a>
              </div>
              {employee.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                  <a href={`tel:${employee.phone}`} className="text-sm font-medium text-slate-800 hover:underline">{employee.phone}</a>
                </div>
              )}
              {employee.joining_date && (
                <div className="flex items-start gap-3">
                  <CalendarCheck className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="text-sm font-medium text-slate-800">Joined on {new Date(employee.joining_date).toLocaleDateString()}</div>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2"><IndianRupee className="h-4 w-4 text-slate-400" /> Bank Details</h3>
              {employee.bank_details ? (
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Bank Name</p>
                    <p className="font-medium text-slate-800">{employee.bank_details.bankName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Account No.</p>
                    <p className="font-medium text-slate-800">{employee.bank_details.accountNo || "-"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">IFSC Code</p>
                    <p className="font-medium text-slate-800">{employee.bank_details.ifsc || "-"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No bank details added.</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveTab("attendance")} 
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === "attendance" ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
              >
                Attendance
              </button>
              <button 
                onClick={() => setActiveTab("structure")} 
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === "structure" ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
              >
                Salary Structure
              </button>
              <button 
                onClick={() => setActiveTab("incentives")} 
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === "incentives" ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
              >
                Incentives
              </button>
            </div>

            <div className="p-6">
              {activeTab === "attendance" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Mark Attendance</h3>
                    <form onSubmit={handleAddAttendance} className="flex flex-wrap items-end gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                        <input required type="date" value={newAtt.date} onChange={e => setNewAtt({...newAtt, date: e.target.value})} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-violet-400 focus:outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                        <select value={newAtt.status} onChange={e => setNewAtt({...newAtt, status: e.target.value})} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-violet-400 focus:outline-none bg-white">
                          <option>Present</option>
                          <option>Half Day</option>
                          <option>Absent</option>
                        </select>
                      </div>
                      {newAtt.status !== "Absent" && (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Check In</label>
                            <input type="time" value={newAtt.check_in} onChange={e => setNewAtt({...newAtt, check_in: e.target.value})} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-violet-400 focus:outline-none bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Check Out</label>
                            <input type="time" value={newAtt.check_out} onChange={e => setNewAtt({...newAtt, check_out: e.target.value})} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-violet-400 focus:outline-none bg-white" />
                          </div>
                        </>
                      )}
                      <button type="submit" className="rounded-lg bg-violet-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-600 transition-colors">Save</button>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent Attendance</h3>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-2 font-medium text-slate-500">Date</th>
                            <th className="px-4 py-2 font-medium text-slate-500">Status</th>
                            <th className="px-4 py-2 font-medium text-slate-500">Check In</th>
                            <th className="px-4 py-2 font-medium text-slate-500">Check Out</th>
                            <th className="px-4 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {attendance.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-4 text-center text-slate-500">No attendance records found.</td></tr>
                          ) : attendance.map(att => (
                            <tr key={att.id} className="hover:bg-slate-50">
                              <td className="px-4 py-2 font-medium text-slate-800">{new Date(att.date).toLocaleDateString()}</td>
                              <td className="px-4 py-2">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${att.status === 'Present' ? 'bg-emerald-50 text-emerald-600' : att.status === 'Half Day' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                  {att.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-slate-600">{att.check_in || "-"}</td>
                              <td className="px-4 py-2 text-slate-600">{att.check_out || "-"}</td>
                              <td className="px-4 py-2 text-right">
                                <button onClick={() => handleDeleteAttendance(att.id)} className="text-xs text-rose-500 hover:underline">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "structure" && (
                <form onSubmit={handleSaveStructure} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Basic Salary (₹)</label>
                    <input required type="number" step="0.01" value={structure.basic} onChange={e => setStructure({...structure, basic: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                    <p className="mt-1 text-xs text-slate-400">Current Employee Base: ₹{employee.salary}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">HRA (₹)</label>
                    <input required type="number" step="0.01" value={structure.hra} onChange={e => setStructure({...structure, hra: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Other Allowances (₹)</label>
                    <input required type="number" step="0.01" value={structure.allowance} onChange={e => setStructure({...structure, allowance: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="pf" checked={structure.pf_enabled} onChange={e => setStructure({...structure, pf_enabled: e.target.checked})} className="rounded text-violet-500 focus:ring-violet-500 h-4 w-4" />
                    <label htmlFor="pf" className="text-sm font-medium text-slate-700">Enable PF Deduction (12% of Basic)</label>
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="w-full rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 transition-colors">Save Structure</button>
                  </div>
                </form>
              )}

              {activeTab === "incentives" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Add Incentive</h3>
                    <form onSubmit={handleAddIncentive} className="flex flex-wrap items-end gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Month</label>
                        <input required type="month" value={newInc.month} onChange={e => setNewInc({...newInc, month: e.target.value})} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-violet-400 focus:outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Sales Generated (₹)</label>
                        <input type="number" step="0.01" value={newInc.sales_amount} onChange={e => setNewInc({...newInc, sales_amount: e.target.value})} className="w-32 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-violet-400 focus:outline-none bg-white" placeholder="Optional" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                        <select value={newInc.type} onChange={e => setNewInc({...newInc, type: e.target.value})} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-violet-400 focus:outline-none bg-white">
                          <option>Percentage</option>
                          <option>Fixed</option>
                          <option>Slab</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Incentive Amount (₹) *</label>
                        <input required type="number" step="0.01" value={newInc.incentive_amount} onChange={e => setNewInc({...newInc, incentive_amount: e.target.value})} className="w-32 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-violet-400 focus:outline-none bg-white" />
                      </div>
                      <button type="submit" className="rounded-lg bg-violet-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-600 transition-colors">Add</button>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Incentive History</h3>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-2 font-medium text-slate-500">Month</th>
                            <th className="px-4 py-2 font-medium text-slate-500">Type</th>
                            <th className="px-4 py-2 font-medium text-slate-500">Sales Amount</th>
                            <th className="px-4 py-2 font-medium text-slate-500">Incentive</th>
                            <th className="px-4 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {incentives.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-4 text-center text-slate-500">No incentives found.</td></tr>
                          ) : incentives.map(inc => (
                            <tr key={inc.id} className="hover:bg-slate-50">
                              <td className="px-4 py-2 font-medium text-slate-800">{new Date(inc.month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' })}</td>
                              <td className="px-4 py-2 text-slate-600">{inc.type}</td>
                              <td className="px-4 py-2 text-slate-600">₹{parseFloat(inc.sales_amount).toFixed(2)}</td>
                              <td className="px-4 py-2 font-medium text-emerald-600">₹{parseFloat(inc.incentive_amount).toFixed(2)}</td>
                              <td className="px-4 py-2 text-right">
                                <button onClick={() => handleDeleteIncentive(inc.id)} className="text-xs text-rose-500 hover:underline">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
