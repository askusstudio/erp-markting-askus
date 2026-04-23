import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
const stats = [
  {
    name: "Total Revenue (MTD)",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    name: "Pending Payments (12)",
    value: "$12,450.00",
    change: "+4.5%",
    trend: "up",
    icon: Clock,
  },
  {
    name: "Paid Invoices",
    value: "34",
    change: "This month",
    trend: "neutral",
    icon: CheckCircle2,
  },
];
const overdueInvoices = [
  { id: "INV-2026-042", client: "Acme Corp", amount: "$3,200.00", days: 12 },
  { id: "INV-2026-039", client: "Globex Inc", amount: "$1,500.00", days: 8 },
  {
    id: "INV-2026-035",
    client: "Stark Industries",
    amount: "$4,800.00",
    days: 21,
  },
];
const recentActivity = [
  {
    id: 1,
    action: "Invoice Paid",
    target: "INV-2026-051",
    client: "Wayne Enterprises",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "New Client Added",
    target: "LexCorp",
    client: "",
    time: "5 hours ago",
  },
  {
    id: 3,
    action: "Invoice Sent",
    target: "INV-2026-052",
    client: "Cyberdyne Systems",
    time: "1 day ago",
  },
];
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {" "}
      <div>
        {" "}
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Dashboard
        </h1>{" "}
        <p className="mt-1 text-sm text-slate-400">
          {" "}
          Overview of your agency's financial health.{" "}
        </p>{" "}
      </div>{" "}
      {/* Stats Grid */}{" "}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {" "}
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <p className="text-sm font-medium text-slate-500">
                {stat.name}
              </p>{" "}
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                {" "}
                <stat.icon className="h-5 w-5" />{" "}
              </span>{" "}
            </div>{" "}
            <div className="mt-4 flex items-baseline gap-4">
              {" "}
              <p className="text-3xl font-bold text-slate-800">
                {stat.value}
              </p>{" "}
              {stat.trend !== "neutral" && (
                <span
                  className={`flex items-center text-sm font-medium ${stat.trend === "up" ? "text-teal-500" : "text-rose-500"}`}
                >
                  {" "}
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}{" "}
                  {stat.change}{" "}
                </span>
              )}{" "}
              {stat.trend === "neutral" && (
                <span className="text-sm font-medium text-slate-400">
                  {stat.change}
                </span>
              )}{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {" "}
        {/* Overdue Invoices */}{" "}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {" "}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            {" "}
            <h2 className="text-lg font-semibold text-slate-800">
              Overdue Invoices
            </h2>{" "}
            <Link
              href="/invoices?status=overdue"
              className="text-sm font-medium text-violet-500 hover:text-blue-500"
            >
              {" "}
              View all{" "}
            </Link>{" "}
          </div>{" "}
          <div className="divide-y divide-zinc-200">
            {" "}
            {overdueInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between px-6 py-4"
              >
                {" "}
                <div className="flex items-center gap-4">
                  {" "}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                    {" "}
                    <AlertCircle className="h-5 w-5" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="font-medium text-slate-800">
                      {invoice.client}
                    </p>{" "}
                    <p className="text-sm text-slate-400">{invoice.id}</p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="text-right">
                  {" "}
                  <p className="font-medium text-slate-800">
                    {invoice.amount}
                  </p>{" "}
                  <p className="text-sm text-rose-500">
                    {invoice.days} days late
                  </p>{" "}
                </div>{" "}
              </div>
            ))}{" "}
            {overdueInvoices.length === 0 && (
              <div className="px-6 py-8 text-center text-slate-400">
                {" "}
                No overdue invoices. Great job!{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        {/* Recent Activity */}{" "}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {" "}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            {" "}
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Activity
            </h2>{" "}
          </div>{" "}
          <div className="px-6 py-2">
            {" "}
            <div className="relative border-l border-slate-200 py-4 ml-4 space-y-8">
              {" "}
              {recentActivity.map((activity) => (
                <div key={activity.id} className="relative pl-6">
                  {" "}
                  <span className="absolute -left-1.5 top-1.5 flex h-3 w-3 rounded-full bg-violet-400 ring-4 ring-white"></span>{" "}
                  <div>
                    {" "}
                    <p className="font-medium text-slate-800">
                      {" "}
                      {activity.action}{" "}
                      <span className="font-semibold">
                        {activity.target}
                      </span>{" "}
                    </p>{" "}
                    {activity.client && (
                      <p className="text-sm text-slate-500">
                        for {activity.client}
                      </p>
                    )}{" "}
                    <p className="mt-1 text-xs text-slate-400">
                      {activity.time}
                    </p>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
