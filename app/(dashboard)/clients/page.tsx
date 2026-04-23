import { Plus, MoreVertical, Building2, Mail, Phone } from 'lucide-react';

const clients = [
  {
    id: 1,
    name: 'Acme Corp',
    contact: 'John Doe',
    email: 'john@acme.com',
    phone: '+1 (555) 123-4567',
    status: 'Active',
    totalBilled: '$12,400.00',
  },
  {
    id: 2,
    name: 'Globex Inc',
    contact: 'Jane Smith',
    email: 'jane@globex.com',
    phone: '+1 (555) 987-6543',
    status: 'Active',
    totalBilled: '$8,250.00',
  },
  {
    id: 3,
    name: 'Wayne Enterprises',
    contact: 'Bruce Wayne',
    email: 'bruce@wayne.com',
    phone: '+1 (555) 555-0000',
    status: 'Inactive',
    totalBilled: '$45,000.00',
  },
];

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Clients</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your agency's clients and billing details.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black">
          <Plus className="h-5 w-5" />
          Add Client
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Company</th>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Contact</th>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Total Billed</th>
                <th className="px-6 py-4 text-right font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {clients.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <Building2 className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-white">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{client.contact}</p>
                      <div className="mt-1 flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {client.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        client.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
                          : 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-600/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{client.totalBilled}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                      <MoreVertical className="h-5 w-5" />
                    </button>
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
