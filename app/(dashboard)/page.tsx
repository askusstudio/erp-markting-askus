import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: invoices } = await supabase.from('invoices').select('*, clients(name)').order('created_at', { ascending: false });
  const invoicesList = invoices || [];
  
  const { data: clients } = await supabase.from('clients').select('*').order('created_at', { ascending: false }).limit(5);
  const clientsList = clients || [];

  const totalRevenue = invoicesList.filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.total), 0);
  const pendingPayments = invoicesList.filter(i => ['Draft', 'Sent'].includes(i.status)).reduce((sum, i) => sum + Number(i.total), 0);
  const paidInvoicesCount = invoicesList.filter(i => i.status === 'Paid').length;
  const pendingInvoicesCount = invoicesList.filter(i => ['Draft', 'Sent'].includes(i.status)).length;
  
  const now = new Date();
  const overdueInvoices = invoicesList
    .filter(i => i.status === 'Overdue' || (new Date(i.due_date) < now && i.status !== 'Paid' && i.status !== 'Draft'))
    .map(i => {
      const dueDate = new Date(i.due_date);
      const daysLate = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
      return {
        id: i.invoice_number,
        client: i.clients?.name || 'Unknown',
        amount: `$${Number(i.total).toFixed(2)}`,
        days: daysLate > 0 ? daysLate : 0
      };
    }).slice(0, 5);

  const recentActivity: any[] = [];
  
  invoicesList.slice(0, 3).forEach((inv) => {
    recentActivity.push({
      id: `inv-${inv.id}`,
      action: inv.status === 'Paid' ? 'Invoice Paid' : (inv.status === 'Sent' ? 'Invoice Sent' : 'Invoice Created'),
      target: inv.invoice_number,
      client: inv.clients?.name || 'Unknown',
      time: new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: new Date(inv.created_at).getTime()
    });
  });

  clientsList.slice(0, 2).forEach(c => {
    recentActivity.push({
      id: `cli-${c.id}`,
      action: 'New Client Added',
      target: c.name,
      client: '',
      time: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: new Date(c.created_at).getTime()
    });
  });

  recentActivity.sort((a, b) => b.timestamp - a.timestamp);

  const stats = [
    { name: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, change: "+0.0%", trend: "neutral", icon: DollarSign },
    { name: `Pending Payments (${pendingInvoicesCount})`, value: `$${pendingPayments.toFixed(2)}`, change: "+0.0%", trend: "neutral", icon: Clock },
    { name: "Paid Invoices", value: paidInvoicesCount.toString(), change: "All time", trend: "neutral", icon: CheckCircle2 },
  ];
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
