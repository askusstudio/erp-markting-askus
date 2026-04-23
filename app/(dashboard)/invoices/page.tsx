import { Plus, MoreVertical, FileText, Download, Send } from 'lucide-react';

const invoices = [
  {
    id: 'INV-2026-052',
    client: 'Cyberdyne Systems',
    amount: '$4,500.00',
    date: 'Apr 22, 2026',
    dueDate: 'May 06, 2026',
    status: 'Sent',
  },
  {
    id: 'INV-2026-051',
    client: 'Wayne Enterprises',
    amount: '$12,000.00',
    date: 'Apr 20, 2026',
    dueDate: 'May 04, 2026',
    status: 'Paid',
  },
  {
    id: 'INV-2026-050',
    client: 'Acme Corp',
    amount: '$3,200.00',
    date: 'Apr 15, 2026',
    dueDate: 'Apr 29, 2026',
    status: 'Overdue',
  },
  {
    id: 'INV-2026-049',
    client: 'Globex Inc',
    amount: '$1,500.00',
    date: 'Apr 10, 2026',
    dueDate: 'Apr 24, 2026',
    status: 'Draft',
  },
];

const statusStyles = {
  Paid: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  Sent: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
  Draft: 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-600/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700',
  Overdue: 'bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
};

export default function InvoicesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Invoices</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create, send, and track invoices for your clients.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black">
          <Plus className="h-5 w-5" />
          Create Invoice
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex gap-2">
            <select className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <option>All Statuses</option>
              <option>Paid</option>
              <option>Sent</option>
              <option>Draft</option>
              <option>Overdue</option>
            </select>
            <select className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <option>All Time</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Invoice ID</th>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Client</th>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Amount</th>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Issued / Due</th>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                <th className="px-6 py-4 text-right font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-white">{invoice.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{invoice.client}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{invoice.amount}</td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-900 dark:text-zinc-300">{invoice.date}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Due {invoice.dueDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status as keyof typeof statusStyles]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" title="Download PDF">
                        <Download className="h-4 w-4" />
                      </button>
                      {invoice.status === 'Draft' && (
                        <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400" title="Send Invoice">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
