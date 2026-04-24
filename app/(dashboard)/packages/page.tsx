"use client";

import { useState } from "react";
import { Package, Plus, Search, MoreHorizontal, X } from "lucide-react";

const initialPackages = [
  { id: 1, name: "SEO Foundation", price: "$500", cadence: "Monthly", description: "On-page SEO, keyword research, and monthly reporting." },
  { id: 2, name: "Google Ads Growth", price: "$1,200", cadence: "Monthly", description: "Search and display campaigns, landing page optimization." },
  { id: 3, name: "Meta Ads Scale", price: "$1,000", cadence: "Monthly", description: "FB/IG ads management, creative testing, retargeting." },
  { id: 4, name: "SMM Bundle", price: "$800", cadence: "Monthly", description: "12 posts/month, community management, stories." },
  { id: 5, name: "Website Dev (Basic)", price: "$2,500", cadence: "One-time", description: "5-page custom website, responsive, SEO optimized." },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState(initialPackages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: "", price: "", cadence: "Monthly", description: "" });

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackage.name || !newPackage.price) return;
    
    setPackages([
      {
        id: Date.now(),
        name: newPackage.name,
        price: `$${parseFloat(newPackage.price).toFixed(2)}`,
        cadence: newPackage.cadence,
        description: newPackage.description || "Custom package description.",
      },
      ...packages,
    ]);
    setIsModalOpen(false);
    setNewPackage({ name: "", price: "", cadence: "Monthly", description: "" });
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Service Packages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your predefined service bundles for quick invoicing.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-600"
        >
          <Plus className="h-4 w-4" />
          Create Package
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search packages..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                <Package className="h-6 w-6" />
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            
            <h3 className="mt-4 text-lg font-bold text-slate-800">{pkg.name}</h3>
            <p className="mt-2 text-sm text-slate-500 min-h-[40px]">{pkg.description}</p>
            
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-lg font-semibold text-slate-800">{pkg.price}</span>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-600">
                {pkg.cadence}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Create Package</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddPackage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Package Name *</label>
                <input required type="text" value={newPackage.name} onChange={e => setNewPackage({...newPackage, name: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price ($) *</label>
                <input required type="number" step="0.01" value={newPackage.price} onChange={e => setNewPackage({...newPackage, price: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cadence</label>
                <select value={newPackage.cadence} onChange={e => setNewPackage({...newPackage, cadence: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none bg-white">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Yearly</option>
                  <option>One-time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={2} value={newPackage.description} onChange={e => setNewPackage({...newPackage, description: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-400 focus:outline-none"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 transition-colors">Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
