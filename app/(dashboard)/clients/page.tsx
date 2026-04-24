"use client";

import { useState } from "react";
import { Plus, MoreVertical, Building2, Mail, Phone, X } from "lucide-react";

const initialClients = [
  { id: 1, name: "Acme Corp", contact: "John Doe", email: "john@acme.com", phone: "+1 (555) 123-4567", status: "Active", totalBilled: "$12,400.00" },
  { id: 2, name: "Globex Inc", contact: "Jane Smith", email: "jane@globex.com", phone: "+1 (555) 987-6543", status: "Active", totalBilled: "$8,250.00" },
  { id: 3, name: "Wayne Enterprises", contact: "Bruce Wayne", email: "bruce@wayne.com", phone: "+1 (555) 555-0000", status: "Inactive", totalBilled: "$45,000.00" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", contact: "", email: "", phone: "" });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;
    
    setClients([
      {
        id: Date.now(),
        ...newClient,
        status: "Active",
        totalBilled: "$0.00",
      },
      ...clients,
    ]);
    setIsModalOpen(false);
    setNewClient({ name: "", contact: "", email: "", phone: "" });
  };

  return (
    <div className="space-y-8 p-8 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Clients</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your agency's clients and billing details.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-600 focus:outline-none"
        >
          <Plus className="h-5 w-5" /> Add Client
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-[#fdfbf7]/50">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-400">Company</th>
                <th className="px-6 py-4 font-medium text-slate-400">Contact</th>
                <th className="px-6 py-4 font-medium text-slate-400">Status</th>
                <th className="px-6 py-4 font-medium text-slate-400">Total Billed</th>
                <th className="px-6 py-4 text-right font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {clients.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-[#fdfbf7]/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                        <Building2 className="h-5 w-5 text-slate-400" />
                      </div>
                      <span className="font-medium text-slate-800">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{client.contact}</p>
                      <div className="mt-1 flex flex-col gap-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {client.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${client.status === "Active" ? "bg-teal-50 text-teal-600 ring-1 ring-teal-500/20" : "bg-slate-100 text-slate-600 ring-1 ring-zinc-600/20"}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{client.totalBilled}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500">
                      <MoreVertical className="h-5 w-5" />
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
              <h2 className="text-xl font-bold text-slate-800">Add New Client</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                <input required type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                <input type="text" value={newClient.contact} onChange={e => setNewClient({...newClient, contact: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="text" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 transition-colors">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
