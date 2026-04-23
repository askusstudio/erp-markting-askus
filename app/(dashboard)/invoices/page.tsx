import { Plus, MoreVertical, FileText, Download, Send } from "lucide-react";
const invoices = [
  {
    id: "INV-2026-052",
    client: "Cyberdyne Systems",
    amount: "$4,500.00",
    date: "Apr 22, 2026",
    dueDate: "May 06, 2026",
    status: "Sent",
  },
  {
    id: "INV-2026-051",
    client: "Wayne Enterprises",
    amount: "$12,000.00",
    date: "Apr 20, 2026",
    dueDate: "May 04, 2026",
    status: "Paid",
  },
  {
    id: "INV-2026-050",
    client: "Acme Corp",
    amount: "$3,200.00",
    date: "Apr 15, 2026",
    dueDate: "Apr 29, 2026",
    status: "Overdue",
  },
  {
    id: "INV-2026-049",
    client: "Globex Inc",
    amount: "$1,500.00",
    date: "Apr 10, 2026",
    dueDate: "Apr 24, 2026",
    status: "Draft",
  },
];
const statusStyles = {
  Paid: "bg-teal-50 text-teal-600 ring-1 ring-teal-500/20",
  Sent: "bg-violet-50 text-violet-600 ring-1 ring-blue-600/20",
  Draft: "bg-slate-100 text-slate-600 ring-1 ring-zinc-600/20",
  Overdue: "bg-rose-50 text-rose-600 ring-1 ring-rose-500/20",
};
export default function InvoicesPage() {
  return (
    <div className="space-y-8">
      {" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Invoices
          </h1>{" "}
          <p className="mt-1 text-sm text-slate-400">
            {" "}
            Create, send, and track invoices for your clients.{" "}
          </p>{" "}
        </div>{" "}
        <button className="inline-flex items-center gap-2 rounded-xl bg-violet-400 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2">
          {" "}
          <Plus className="h-5 w-5" /> Create Invoice{" "}
        </button>{" "}
      </div>{" "}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {" "}
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          {" "}
          <div className="flex gap-2">
            {" "}
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400">
              {" "}
              <option>All Statuses</option> <option>Paid</option>{" "}
              <option>Sent</option> <option>Draft</option>{" "}
              <option>Overdue</option>{" "}
            </select>{" "}
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400">
              {" "}
              <option>All Time</option> <option>This Month</option>{" "}
              <option>Last Month</option> <option>This Year</option>{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full text-left text-sm">
            {" "}
            <thead className="border-b border-slate-200 bg-[#fdfbf7]/50">
              {" "}
              <tr>
                {" "}
                <th className="px-6 py-4 font-medium text-slate-400">
                  Invoice ID
                </th>{" "}
                <th className="px-6 py-4 font-medium text-slate-400">Client</th>{" "}
                <th className="px-6 py-4 font-medium text-slate-400">Amount</th>{" "}
                <th className="px-6 py-4 font-medium text-slate-400">
                  Issued / Due
                </th>{" "}
                <th className="px-6 py-4 font-medium text-slate-400">Status</th>{" "}
                <th className="px-6 py-4 text-right font-medium text-slate-400">
                  Actions
                </th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-zinc-200">
              {" "}
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="transition-colors hover:bg-[#fdfbf7]/50"
                >
                  {" "}
                  <td className="px-6 py-4">
                    {" "}
                    <div className="flex items-center gap-3">
                      {" "}
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                        {" "}
                        <FileText className="h-5 w-5 text-violet-500" />{" "}
                      </div>{" "}
                      <span className="font-medium text-slate-800">
                        {invoice.id}
                      </span>{" "}
                    </div>{" "}
                  </td>{" "}
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {invoice.client}
                  </td>{" "}
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {invoice.amount}
                  </td>{" "}
                  <td className="px-6 py-4">
                    {" "}
                    <div className="text-slate-800">{invoice.date}</div>{" "}
                    <div className="text-xs text-slate-400">
                      Due {invoice.dueDate}
                    </div>{" "}
                  </td>{" "}
                  <td className="px-6 py-4">
                    {" "}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status as keyof typeof statusStyles]}`}
                    >
                      {" "}
                      {invoice.status}{" "}
                    </span>{" "}
                  </td>{" "}
                  <td className="px-6 py-4 text-right">
                    {" "}
                    <div className="flex items-center justify-end gap-2">
                      {" "}
                      <button
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500"
                        title="Download PDF"
                      >
                        {" "}
                        <Download className="h-4 w-4" />{" "}
                      </button>{" "}
                      {invoice.status === "Draft" && (
                        <button
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-violet-500"
                          title="Send Invoice"
                        >
                          {" "}
                          <Send className="h-4 w-4" />{" "}
                        </button>
                      )}{" "}
                      <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500">
                        {" "}
                        <MoreVertical className="h-4 w-4" />{" "}
                      </button>{" "}
                    </div>{" "}
                  </td>{" "}
                </tr>
              ))}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
