"use client";

import { useState, useEffect } from "react";
import { Plus, Briefcase, Mail, Phone, X, Loader2 } from "lucide-react";
import ActionMenu from "@/components/ActionMenu";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function EmployeesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ 
    name: "", email: "", phone: "", role: "", designation: "", 
    salary: "", joining_date: "", bank_details: { bankName: "", accountNo: "", ifsc: "" } 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error) setEmployees(data || []);
    setIsLoading(false);
  };

  const handleEdit = (employee: any) => {
    setNewEmployee({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      role: employee.role || "",
      designation: employee.designation || "",
      salary: employee.salary || "",
      joining_date: employee.joining_date || "",
      bank_details: employee.bank_details || { bankName: "", accountNo: "", ifsc: "" },
    });
    setEditingId(employee.id);
    setIsModalOpen(true);
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) return;
    
    const empData = {
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: newEmployee.role,
      designation: newEmployee.designation,
      salary: newEmployee.salary ? parseFloat(newEmployee.salary) : 0,
      joining_date: newEmployee.joining_date || null,
      bank_details: newEmployee.bank_details,
    };

    if (editingId) {
      const { error } = await supabase.from('employees').update(empData).eq('id', editingId);
      if (!error) {
        setEmployees(employees.map(e => e.id === editingId ? { ...e, ...empData } : e));
      }
      setEditingId(null);
    } else {
      const { data, error } = await supabase.from('employees').insert([{ ...empData, status: 'Active' }]).select().single();
      if (!error && data) {
        setEmployees([data, ...employees]);
      }
    }
    
    setIsModalOpen(false);
    setNewEmployee({ name: "", email: "", phone: "", role: "", designation: "", salary: "", joining_date: "", bank_details: { bankName: "", accountNo: "", ifsc: "" } });
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this employee?")) return;
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (!error) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8 p-8 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Employees</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your team members and their details.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewEmployee({ name: "", email: "", phone: "", role: "", designation: "", salary: "", joining_date: "", bank_details: { bankName: "", accountNo: "", ifsc: "" } });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-600 focus:outline-none"
        >
          <Plus className="h-5 w-5" /> Add Employee
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-[#fdfbf7]/50">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-400">Employee</th>
                <th className="px-6 py-4 font-medium text-slate-400">Contact</th>
                <th className="px-6 py-4 font-medium text-slate-400">Role / Designation</th>
                <th className="px-6 py-4 font-medium text-slate-400">Base Salary</th>
                <th className="px-6 py-4 font-medium text-slate-400">Status</th>
                <th className="px-6 py-4 text-right font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center mb-2"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>
                    Loading employees...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No employees found. Add your first employee to get started.
                  </td>
                </tr>
              ) : employees.map((emp) => (
                <tr key={emp.id} onClick={() => router.push(`/employees/${emp.id}`)} className="transition-colors hover:bg-[#fdfbf7]/50 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                        <Briefcase className="h-5 w-5 text-violet-500" />
                      </div>
                      <span className="font-medium text-slate-800">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {emp.email}</span>
                      {emp.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {emp.phone}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{emp.designation || "-"}</div>
                    <div className="text-xs text-slate-400">{emp.role || "-"}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    ₹{emp.salary || "0.00"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${emp.status === "Active" ? "bg-teal-50 text-teal-600 ring-1 ring-teal-500/20" : "bg-slate-100 text-slate-600 ring-1 ring-zinc-600/20"}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu 
                      onEdit={() => handleEdit(emp)} 
                      onDelete={() => handleDelete(emp.id)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? "Edit Employee" : "Add New Employee"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input required type="text" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input required type="email" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="text" value={newEmployee.phone} onChange={e => setNewEmployee({...newEmployee, phone: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Joining Date</label>
                  <input type="date" value={newEmployee.joining_date} onChange={e => setNewEmployee({...newEmployee, joining_date: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role (e.g. Sales, Dev)</label>
                  <input type="text" value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                  <input type="text" value={newEmployee.designation} onChange={e => setNewEmployee({...newEmployee, designation: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Base Monthly Salary (₹)</label>
                  <input type="number" step="0.01" value={newEmployee.salary} onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Bank Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                    <input type="text" value={newEmployee.bank_details.bankName} onChange={e => setNewEmployee({...newEmployee, bank_details: {...newEmployee.bank_details, bankName: e.target.value}})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account No.</label>
                    <input type="text" value={newEmployee.bank_details.accountNo} onChange={e => setNewEmployee({...newEmployee, bank_details: {...newEmployee.bank_details, accountNo: e.target.value}})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                    <input type="text" value={newEmployee.bank_details.ifsc} onChange={e => setNewEmployee({...newEmployee, bank_details: {...newEmployee.bank_details, ifsc: e.target.value}})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 transition-colors">{editingId ? "Save Changes" : "Save Employee"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
