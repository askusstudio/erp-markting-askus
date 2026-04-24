import { BarChart3, TrendingUp, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";

const stats = [
  { name: "Total Revenue", value: "$45,231.89", change: "+20.1%", trend: "up" },
  { name: "Outstanding", value: "$12,050.00", change: "-4.5%", trend: "down" },
  { name: "Paid Invoices", value: "34", change: "+12.5%", trend: "up" },
];

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monthly revenue charts, client-wise ranking, and aging reports.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
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
        {/* Mock Chart Area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Monthly Revenue</h3>
          <div className="h-64 flex items-end gap-2 justify-between">
            {/* CSS Mock Bars */}
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
            {[
              { name: "Acme Corp", amount: "$15,400" },
              { name: "Globex Inc", amount: "$9,200" },
              { name: "Soylent Corp", amount: "$6,500" },
              { name: "Initech", amount: "$4,100" },
            ].map((client, i) => (
              <div key={client.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <span className="font-medium text-slate-700">{client.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{client.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
