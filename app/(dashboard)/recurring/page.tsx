"use client";

import { useState, useEffect } from "react";
import { Repeat, Plus, Search, MoreHorizontal, CheckCircle2, X, Loader2 } from "lucide-react";
import ActionMenu from "@/components/ActionMenu";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";

export default function RecurringPage() {
  const supabase = createClient();
  const [retainers, setRetainers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRetainer, setNewRetainer] = useState({ client_id: "", package_id: "", amount: "", cadence: "Monthly" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [retainersRes, clientsRes, packagesRes] = await Promise.all([
      supabase.from('retainers').select('*, clients(name), service_packages(name)').order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name').order('name'),
      supabase.from('service_packages').select('id, name, default_price').order('name')
    ]);
    
    if (!retainersRes.error) {
      setRetainers(retainersRes.data.map(r => ({
        id: r.id,
        client_id: r.client_id,
        client: r.clients?.name || "Unknown",
        package_id: r.package_id,
        package: r.service_packages?.name || "Custom",
        amount: `$${r.amount}`,
        rawAmount: r.amount,
        cadence: r.cadence,
        nextInvoice: r.next_invoice_date ? new Date(r.next_invoice_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Not set",
        rawNextInvoice: r.next_invoice_date,
        status: r.status
      })));
    }
    
    if (!clientsRes.error) setClients(clientsRes.data);
    if (!packagesRes.error) setPackages(packagesRes.data);
    
    setIsLoading(false);
  };

  const handleEdit = (retainer: any) => {
    setNewRetainer({
      client_id: retainer.client_id,
      package_id: retainer.package_id || "",
      amount: retainer.rawAmount?.toString() || "",
      cadence: retainer.cadence,
    });
    setEditingId(retainer.id);
    setIsModalOpen(true);
  };

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgId = e.target.value;
    const pkg = packages.find(p => p.id === pkgId);
    setNewRetainer({
      ...newRetainer,
      package_id: pkgId,
      amount: pkg ? pkg.default_price.toString() : newRetainer.amount
    });
  };

  const handleAddRetainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRetainer.client_id || !newRetainer.amount) return;
    
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    
    const retainerData = {
      client_id: newRetainer.client_id,
      package_id: newRetainer.package_id || null,
      amount: parseFloat(newRetainer.amount) || 0,
      cadence: newRetainer.cadence,
      next_invoice_date: editingId ? undefined : nextDate.toISOString().split('T')[0],
      status: "active"
    };
    
    if (editingId) {
      const { error } = await supabase.from('retainers').update(retainerData).eq('id', editingId);
      if (!error) fetchData();
      setEditingId(null);
    } else {
      const { error } = await supabase.from('retainers').insert([retainerData]);
      if (!error) fetchData();
    }
    
    setIsModalOpen(false);
    setNewRetainer({ client_id: "", package_id: "", amount: "", cadence: "Monthly" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('retainers').delete().eq('id', id);
    if (!error) {
      setRetainers(retainers.filter(r => r.id !== id));
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Recurring Retainers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Auto-generate invoices on a schedule for your retainer clients.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-600"
        >
          <Plus className="h-4 w-4" />
          New Retainer
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search retainers..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Package</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Cadence</th>
                <th className="px-6 py-4 font-medium">Next Invoice</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center mb-2"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>
                    Loading retainers...
                  </td>
                </tr>
              ) : retainers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No retainers found.
                  </td>
                </tr>
              ) : retainers.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{plan.client}</td>
                  <td className="px-6 py-4 text-slate-600">{plan.package}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{plan.amount}</td>
                  <td className="px-6 py-4 text-slate-600">{plan.cadence}</td>
                  <td className="px-6 py-4 text-slate-600">{plan.nextInvoice}</td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        plan.status === "active"
                          ? "bg-teal-50 text-teal-600"
                          : "bg-amber-50 text-amber-600"
                      )}
                    >
                      {plan.status === "active" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu 
                      icon={MoreHorizontal}
                      onEdit={() => handleEdit(plan)} 
                      onDelete={() => handleDelete(plan.id)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? "Edit Retainer" : "New Retainer"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddRetainer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client *</label>
                <select required value={newRetainer.client_id} onChange={e => setNewRetainer({...newRetainer, client_id: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none bg-white">
                  <option value="">Select a client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Package (Optional)</label>
                <select value={newRetainer.package_id} onChange={handlePackageChange} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none bg-white">
                  <option value="">Custom Package</option>
                  {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($) *</label>
                <input required type="number" step="0.01" value={newRetainer.amount} onChange={e => setNewRetainer({...newRetainer, amount: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cadence</label>
                <select value={newRetainer.cadence} onChange={e => setNewRetainer({...newRetainer, cadence: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none bg-white">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Yearly</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 transition-colors">{editingId ? "Save Changes" : "Save Retainer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
