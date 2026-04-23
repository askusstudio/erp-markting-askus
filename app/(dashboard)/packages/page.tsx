import { Package } from "lucide-react";
export default function PackagesPage() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center">
      {" "}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {" "}
        <Package className="h-10 w-10" />{" "}
      </div>{" "}
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-800">
        Service Packages
      </h2>{" "}
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        {" "}
        Pre-built service packages (SEO, Google Ads, etc.) to one-click add to
        invoices.{" "}
      </p>{" "}
    </div>
  );
}
