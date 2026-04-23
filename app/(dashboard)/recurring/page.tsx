import { Settings, Repeat, Package, BarChart3 } from 'lucide-react';

export default function RecurringPage() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500">
        <Repeat className="h-10 w-10" />
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Recurring Billing</h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        Set up retainers and auto-generate invoices on schedule. This feature is coming in Phase 1.
      </p>
    </div>
  );
}
