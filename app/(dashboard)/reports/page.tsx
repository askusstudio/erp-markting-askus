"use client";

import { BarChart3, TrendingUp, Download, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ReportsPage() {
  const supabase = createClient();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [invRes, cliRes] = await Promise.all([
        supabase.from('invoices').select('*, clients(name)'),
        supabase.from('clients').select('*')
      ]);
      if (!invRes.error) setInvoices(invRes.data);
      if (!cliRes.error) setClients(cliRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.total), 0);
  const outstanding = invoices.filter(i => ['Draft', 'Sent', 'Overdue'].includes(i.status)).reduce((sum, i) => sum + Number(i.total), 0);
  const paidCount = invoices.filter(i => i.status === 'Paid').length;

  const stats = [
    { name: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, change: "All time", trend: "neutral" },
    { name: "Outstanding", value: `$${outstanding.toFixed(2)}`, change: "Pending", trend: "neutral" },
    { name: "Paid Invoices", value: paidCount.toString(), change: "All time", trend: "neutral" },
  ];

  const exportCSV = () => {
    // Generate CSV for invoices
    const header = ["Invoice Number", "Client", "Issue Date", "Due Date", "Total", "Status"];
    const rows = invoices.map(i => [
      i.invoice_number,
      i.clients?.name || "Unknown",
      i.issue_date,
      i.due_date,
      i.total,
      i.status
    ]);
    
    const csvContent = [
      header.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate client revenue ranking
  const clientRevenue: Record<string, number> = {};
  invoices.filter(i => i.status === 'Paid').forEach(inv => {
    const name = inv.clients?.name || "Unknown";
    clientRevenue[name] = (clientRevenue[name] || 0) + Number(inv.total);
  });
  
  const topClients = Object.entries(clientRevenue)
    .map(([name, amount]) => ({ name, amount: `$${amount.toFixed(2)}`, raw: amount }))
    .sort((a, b) => b.raw - a.raw)
    .slice(0, 5);

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monthly revenue charts, client-wise ranking, and aging reports.
          </p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">{stat.name}</h3>
            <div className="mt-2 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
              <span className={clsx("flex items-center text-sm font-medium", stat.trend === "up" ? "text-teal-600" : "text-rose-600")}>
                {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500 mb-4" />
            Generating reports...
          </div>
        ) : (
          <>
            {/* Mock Chart Area */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Monthly Revenue (Example Chart)</h3>
              <div className="h-64 flex items-end gap-2 justify-between">
                {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                  <div key={i} className="w-full bg-violet-100 rounded-t-lg relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-violet-500 rounded-t-lg transition-all group-hover:bg-violet-600" 
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs font-medium text-slate-400">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
              </div>
            </div>

            {/* Client Ranking Area */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Top Clients by Revenue</h3>
              <div className="space-y-4">
                {topClients.length === 0 ? (
                  <p className="text-slate-500 text-sm">No paid invoices yet to rank clients.</p>
                ) : (
                  topClients.map((client, i) => (
                    <div key={client.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </div>
                        <span className="font-medium text-slate-700">{client.name}</span>
                      </div>
                      <span className="font-semibold text-slate-800">{client.amount}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
