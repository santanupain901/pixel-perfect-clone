import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Btn, Card, PageHeader, Pill } from "@/components/app/ui";
import { apiBaseUrl, checkHealth, type ApiStatus } from "@/services/api";
import { pageMeta } from "@/lib/meta";

export const Route = createFileRoute("/settings")({
  head: () => pageMeta("Settings", "Demo mode, backend connection status, matching configuration and privacy notice."),
  component: SettingsPage,
});

function SettingsPage() {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [demo, setDemo] = useState(true);
  const check = async () => { setStatus(null); setStatus(await checkHealth()); };
  useEffect(() => { check(); }, []);

  return (
    <>
      <PageHeader title="Settings" description="Configuration for this demonstration environment." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Demo mode</h2>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Use built-in synthetic data</span>
            <button role="switch" aria-checked={demo} onClick={() => setDemo(!demo)} className={`relative h-6 w-11 rounded-full transition-colors ${demo ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${demo ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
          {!demo && <p className="mt-2 text-xs text-warning-foreground">Live mode requires a connected backend. Data shown remains synthetic until one responds.</p>}
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">API connection</h2>
            <Btn variant="outline" onClick={check} disabled={!status}>{status ? <RefreshCw className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />} Check</Btn>
          </div>
          <div className="mt-3 text-sm">
            {!status && <Pill>Checking…</Pill>}
            {status?.state === "not_configured" && <><Pill tone="warning">Not configured</Pill><p className="mt-2 text-muted-foreground">No backend URL set. The app runs in demo mode with synthetic data.</p></>}
            {status?.state === "connected" && <><Pill tone="success">Connected</Pill><p className="mt-2 text-muted-foreground">{apiBaseUrl} {status.version && `· v${status.version}`}</p></>}
            {status?.state === "error" && <><Pill tone="danger">Unreachable</Pill><p className="mt-2 text-muted-foreground">{status.message}</p></>}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Matching configuration</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {[["Token algorithm", "HMAC-SHA-256 (backend)"], ["Exact token fields", "name + DOB + sex"], ["Approximate fields", "phonetic name + DOB + sex"], ["Exact confidence", "99%"], ["Approximate confidence", "82%"], ["Auto-merge", "Disabled — human review required"]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
            ))}
          </dl>
        </Card>
        <Card>
          <h2 className="font-semibold">Application information</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {[["Name", "HealthLink Privacy"], ["Version", "0.1.0 (hackathon demo)"], ["Domain", "Advanced Healthcare & Bioinformatics"], ["Backend target", "Node.js / Express"]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
            ))}
          </dl>
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Privacy notice</h2>
          <p className="mt-2 text-sm text-muted-foreground">This application is a demonstration using fabricated, synthetic records only. It must not be used with real patient information. No identifiers are stored in browser storage, no secret keys exist in the frontend, and no record is ever merged without explicit human approval.</p>
        </Card>
      </div>
    </>
  );
}
