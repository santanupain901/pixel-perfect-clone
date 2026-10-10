import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Building2, GitMerge, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, Pill, SimulatedTag, StatCard, statusTone } from "@/components/app/ui";
import { activity, hospitals, records, recordsFor } from "@/lib/data";
import { allCandidates } from "@/lib/matching";
import { useReview } from "@/lib/review-store";
import { pageMeta } from "@/lib/meta";

export const Route = createFileRoute("/")({
  head: () => pageMeta("Dashboard", "Overview of synthetic records, connected hospitals and privacy-preserving match activity."),
  component: Dashboard,
});

const candidates = allCandidates();

function Dashboard() {
  const { statusOf } = useReview();
  const pending = candidates.filter((c) => statusOf(c.id) === "Pending Review").length;
  const dist = hospitals.map((h) => ({ name: `Hospital ${h.id}`, records: recordsFor(h.id).length }));

  return (
    <>
      <PageHeader title="Dashboard" description="Cross-hospital linkage overview. Matching runs on opaque tokens only." actions={<SimulatedTag />} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Synthetic records" value={records.length} icon={Database} hint="Across all hospitals" />
        <StatCard label="Hospitals connected" value={`${hospitals.filter((h) => h.status === "connected").length}/${hospitals.length}`} icon={Building2} hint="1 degraded sync" />
        <StatCard label="Candidate matches" value={candidates.length} icon={GitMerge} hint="Exact + approximate" />
        <StatCard label="Pending reviews" value={pending} icon={Clock} hint="Awaiting human decision" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Matching activity (last 7 days)</h2>
          <p className="text-xs text-muted-foreground">Simulated run history</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <LineChart data={activity}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Line type="monotone" dataKey="candidates" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="runs" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Record distribution</h2>
          <p className="text-xs text-muted-foreground">Synthetic records per hospital</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={dist}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Bar dataKey="records" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent matching activity</h2>
            <Link to="/review" className="text-sm font-medium text-primary hover:underline">Review all</Link>
          </div>
          <ul className="mt-3 divide-y">
            {candidates.slice(0, 6).map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                <span className="font-mono text-xs">{c.source.ref} ↔ {c.target.ref}</span>
                <Pill tone={c.category === "Exact token" ? "teal" : "blue"}>{c.category}</Pill>
                <span className="text-muted-foreground">{Math.round(c.confidence * 100)}%</span>
                <span className="ml-auto"><Pill tone={statusTone(statusOf(c.id))}>{statusOf(c.id)}</Pill></span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-5 w-5 text-primary" /> Privacy protection</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {["Identifiers tokenized server-side (HMAC-SHA-256)", "Secret key never sent to the browser", "Matching compares tokens only", "No identifiers in local storage", "Human review before any linkage"].map((t) => (
              <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{t}</li>
            ))}
          </ul>
          <Link to="/privacy" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">Open Privacy Center</Link>
        </Card>
      </div>
    </>
  );
}
