"use client";

import { useState } from "react";
import { Repeat, Plus, Search, MoreHorizontal, CheckCircle2, X } from "lucide-react";
import clsx from "clsx";

const initialRetainers = [
  { id: 1, client: "Acme Corp", package: "SEO Foundation", amount: "$500.00", cadence: "Monthly", nextInvoice: "May 1, 2026", status: "active" },
  { id: 2, client: "Globex Inc", package: "Google Ads Growth", amount: "$1,200.00", cadence: "Monthly", nextInvoice: "May 5, 2026", status: "active" },
  { id: 3, client: "Soylent Corp", package: "SMM Bundle", amount: "$800.00", cadence: "Monthly", nextInvoice: "May 15, 2026", status: "paused" },
];

export default function RecurringPage() {
  const [retainers, setRetainers] = useState(initialRetainers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRetainer, setNewRetainer] = useState({ client: "", package: "", amount: "", cadence: "Monthly" });

  const handleAddRetainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRetainer.client || !newRetainer.package || !newRetainer.amount) return;
    
    setRetainers([
      {
        id: Date.now(),
        client: newRetainer.client,
        package: newRetainer.package,
        amount: `$${parseFloat(newRetainer.amount).toFixed(2)}`,
        cadence: newRetainer.cadence,
        nextInvoice: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: "active",
      },
      ...retainers,
    ]);
    setIsModalOpen(false);
    setNewRetainer({ client: "", package: "", amount: "", cadence: "Monthly" });
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
              {retainers.map((plan) => (
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
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
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
              <h2 className="text-xl font-bold text-slate-800">New Retainer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddRetainer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client Name *</label>
                <input required type="text" value={newRetainer.client} onChange={e => setNewRetainer({...newRetainer, client: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Package *</label>
                <input required type="text" value={newRetainer.package} onChange={e => setNewRetainer({...newRetainer, package: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
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
                <button type="submit" className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 transition-colors">Save Retainer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
