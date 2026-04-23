import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    name: 'Total Revenue (MTD)',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    name: 'Pending Payments (12)',
    value: '$12,450.00',
    change: '+4.5%',
    trend: 'up',
    icon: Clock,
  },
  {
    name: 'Paid Invoices',
    value: '34',
    change: 'This month',
    trend: 'neutral',
    icon: CheckCircle2,
  },
];

const overdueInvoices = [
  { id: 'INV-2026-042', client: 'Acme Corp', amount: '$3,200.00', days: 12 },
  { id: 'INV-2026-039', client: 'Globex Inc', amount: '$1,500.00', days: 8 },
  { id: 'INV-2026-035', client: 'Stark Industries', amount: '$4,800.00', days: 21 },
];

const recentActivity = [
  { id: 1, action: 'Invoice Paid', target: 'INV-2026-051', client: 'Wayne Enterprises', time: '2 hours ago' },
  { id: 2, action: 'New Client Added', target: 'LexCorp', client: '', time: '5 hours ago' },
  { id: 3, action: 'Invoice Sent', target: 'INV-2026-052', client: 'Cyberdyne Systems', time: '1 day ago' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Overview of your agency's financial health.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{stat.name}</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <stat.icon className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-4">
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
              {stat.trend !== 'neutral' && (
                <span
                  className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {stat.change}
                </span>
              )}
              {stat.trend === 'neutral' && (
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Overdue Invoices */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Overdue Invoices</h2>
            <Link href="/invoices?status=overdue" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              View all
            </Link>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {overdueInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">{invoice.client}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{invoice.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-zinc-900 dark:text-white">{invoice.amount}</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{invoice.days} days late</p>
                </div>
              </div>
            ))}
            {overdueInvoices.length === 0 && (
              <div className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                No overdue invoices. Great job!
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="px-6 py-2">
            <div className="relative border-l border-zinc-200 py-4 dark:border-zinc-800 ml-4 space-y-8">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="relative pl-6">
                  <span className="absolute -left-1.5 top-1.5 flex h-3 w-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-zinc-950"></span>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {activity.action} <span className="font-semibold">{activity.target}</span>
                    </p>
                    {activity.client && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">for {activity.client}</p>
                    )}
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
