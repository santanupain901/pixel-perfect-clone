import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card-surface p-5", className)}>{children}</div>;
}

export function StatCard({ label, value, icon: Icon, hint }: { label: string; value: ReactNode; icon: LucideIcon; hint?: string }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className="rounded-lg bg-accent p-2 text-accent-foreground"><Icon className="h-5 w-5" /></span>
      </div>
    </Card>
  );
}

const tones = {
  neutral: "bg-muted text-muted-foreground",
  teal: "bg-accent text-accent-foreground",
  blue: "bg-secondary text-info",
  success: "bg-success/12 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  danger: "bg-destructive/10 text-destructive",
};

export function Pill({ tone = "neutral", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}

export function SimulatedTag() {
  return <Pill tone="warning">Simulated · synthetic data</Pill>;
}

export function Btn({ variant = "primary", className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "danger" | "ghost" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-border bg-card text-foreground hover:bg-muted",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "text-foreground hover:bg-muted",
  }[variant];
  return (
    <button
      {...p}
      className={cn("inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", v, className)}
    />
  );
}

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export const inputCls = "h-10 rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function statusTone(s: string): keyof typeof tones {
  return s === "Approved" ? "success" : s === "Rejected" ? "danger" : "warning";
}
