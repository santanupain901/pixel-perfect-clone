import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Building2, Upload, Eye, CheckCircle2, AlertTriangle, Search, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Btn, Card, EmptyState, PageHeader, Pill, SimulatedTag, inputCls } from "@/components/app/ui";
import { hospitals, recordsFor, type HospitalId } from "@/lib/data";
import { uploadHospitalCsv } from "@/services/api";
import { pageMeta } from "@/lib/meta";

export const Route = createFileRoute("/hospitals")({
  head: () => pageMeta("Hospitals", "Simulated hospitals participating in privacy-preserving record linkage."),
  component: HospitalsPage,
});

function HospitalsPage() {
  const [viewing, setViewing] = useState<HospitalId | null>(null);
  const [uploading, setUploading] = useState<HospitalId | null>(null);
  const [q, setQ] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const target = useRef<HospitalId | null>(null);

  const onFile = async (f: File | undefined) => {
    const id = target.current;
    if (!f || !id) return;
    setUploading(id);
    try {
      const res = await uploadHospitalCsv(id, f);
      toast.success(`Backend accepted ${res.accepted} rows for Hospital ${id}`);
    } catch (e) {
      toast.error("Upload not sent", { description: `${(e as Error).message} CSV files must be tokenized by the backend; the browser does not process them.` });
    } finally {
      setUploading(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const rows = viewing ? recordsFor(viewing).filter((r) => (r.ref + r.maskedName).toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <>
      <PageHeader title="Hospitals" description="Three simulated hospitals share only tokenized records with the linkage service." actions={<SimulatedTag />} />
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <div className="grid gap-4 md:grid-cols-3">
        {hospitals.map((h) => (
          <Card key={h.id}>
            <div className="flex items-start justify-between">
              <span className="bg-brand rounded-xl p-2.5 text-primary-foreground"><Building2 className="h-5 w-5" /></span>
              <Pill tone={h.status === "connected" ? "success" : "warning"}>{h.status === "connected" ? "Connected" : "Degraded"}</Pill>
            </div>
            <h2 className="mt-4 font-semibold">{h.name}</h2>
            <p className="text-xs text-muted-foreground">{h.city}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Records</p><p className="font-display text-xl font-semibold">{recordsFor(h.id).length}</p></div>
              <div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Last sync</p>
                <p className="flex items-center gap-1 text-xs font-medium">{h.syncOk ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <AlertTriangle className="h-3.5 w-3.5 text-warning" />}{h.syncOk ? "Succeeded" : "Failed"}</p>
                <p className="text-[11px] text-muted-foreground">{h.lastSync}</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Btn variant="outline" className="flex-1" disabled={uploading === h.id} onClick={() => { target.current = h.id; fileRef.current?.click(); }}>
                {uploading === h.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload CSV
              </Btn>
              <Btn className="flex-1" onClick={() => { setViewing(h.id); setQ(""); }}><Eye className="h-4 w-4" /> View records</Btn>
            </div>
          </Card>
        ))}
      </div>

      {viewing && (
        <Card className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-semibold">Hospital {viewing} — tokenized records</h2>
            <div className="relative ml-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input className={`${inputCls} pl-9`} placeholder="Search reference…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Btn variant="ghost" onClick={() => setViewing(null)} aria-label="Close"><X className="h-4 w-4" /></Btn>
          </div>
          <div className="mt-4 overflow-x-auto">
            {rows.length === 0 ? <EmptyState icon={Search} title="No records" text="No records match your search." /> : (
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="py-2">Reference</th><th>Masked label</th><th>Sex</th><th>Birth year</th><th>Identity token</th></tr></thead>
                <tbody className="divide-y">
                  {rows.map((r) => (
                    <tr key={r.ref}><td className="py-2.5 font-mono text-xs">{r.ref}</td><td>{r.maskedName}</td><td>{r.sex}</td><td>{r.birthYear}</td><td className="font-mono text-xs text-muted-foreground">{r.exactToken}…</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
    </>
  );
}
