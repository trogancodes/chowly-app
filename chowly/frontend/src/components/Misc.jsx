import React from "react";

export function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink/60">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-clay border-t-terracotta" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta-dark">
      {message}
    </div>
  );
}

const STATUS_STYLES = {
  PENDING: "bg-clay text-ink/70",
  ACCEPTED: "bg-sage/15 text-sage",
  PREPARING: "bg-terracotta/15 text-terracotta-dark",
  SERVED: "bg-sage/20 text-sage",
  COMPLETED: "bg-ink/10 text-ink/60",
  DELAYED: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  PENDING: "Order received",
  ACCEPTED: "Accepted by waiter",
  PREPARING: "Being prepared",
  SERVED: "Served",
  COMPLETED: "Completed",
  DELAYED: "Delayed",
};

export function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] || ""}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
