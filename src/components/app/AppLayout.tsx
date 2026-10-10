import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Building2, GitMerge, ClipboardCheck, ShieldCheck, BarChart3, Settings, Menu, X, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/hospitals", label: "Hospitals", icon: Building2 },
  { to: "/linkage", label: "Patient Linkage", icon: GitMerge },
  { to: "/review", label: "Match Review", icon: ClipboardCheck },
  { to: "/privacy", label: "Privacy Center", icon: ShieldCheck },
  { to: "/evaluation", label: "Evaluation", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center gap-3 px-5 py-6">
          <span className="bg-brand rounded-xl p-2 text-primary-foreground"><Link2 className="h-5 w-5" /></span>
          <div>
            <p className="font-display text-base font-semibold leading-tight">HealthLink</p>
            <p className="text-xs text-sidebar-muted">Privacy-preserving linkage</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="m-3 rounded-xl border border-sidebar-border p-4 text-xs text-sidebar-muted">
          <p className="font-medium text-sidebar-primary">Demo mode</p>
          All records are synthetic. No real patient information is used.
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <span className="font-display font-semibold">HealthLink Privacy</span>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
