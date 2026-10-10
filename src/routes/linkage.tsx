import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GitMerge, Play, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Btn, Card, EmptyState, PageHeader, SimulatedTag, inputCls } from "@/components/app/ui";
import { CandidateTable } from "@/components/app/CandidateTable";
import { hospitals, type HospitalId } from "@/lib/data";
import { runMatching, type Candidate, type MatchMode } from "@/lib/matching";
import { pageMeta } from "@/lib/meta";

export const Route = createFileRoute("/linkage")({
  head: () => pageMeta("Patient Linkage", "Run exact token or approximate name matching between two simulated hospitals."),
  component: LinkagePage,
});

const steps = ["Requesting tokens from backend", "Comparing opaque tokens", "Scoring candidates"];

function LinkagePage() {
  const [source, setSource] = useState<HospitalId>("A");
  const [target, setTarget] = useState<HospitalId>("B");
  const [mode, setMode] = useState<MatchMode>("exact");
  const [phase, setPhase] = useState<"idle" | "running" | "done" | "error">("idle");
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<Candidate[]>([]);

  const run = async () => {
    if (source === target) { setPhase("error"); return; }
    setPhase("running");
    for (let i = 0; i < steps.length; i++) { setStep(i); await new Promise((r) => setTimeout(r, 550)); }
    setResults(runMatching(source, target, mode));
    setPhase("done");
  };

  return (
    <>
      <PageHeader title="Patient Linkage" description="Find candidate matches between two hospitals using precomputed tokens." actions={<SimulatedTag />} />
      <Card>
        <div className="grid gap-4 md:grid-cols-4 md:items-end">
          <label className="text-sm font-medium">Source hospital
            <select className={`${inputCls} mt-1 w-full`} value={source} onChange={(e) => setSource(e.target.value as HospitalId)}>
              {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">Target hospital
            <select className={`${inputCls} mt-1 w-full`} value={target} onChange={(e) => setTarget(e.target.value as HospitalId)}>
              {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </label>
          <div className="text-sm font-medium">Matching mode
            <div className="mt-1 grid grid-cols-2 rounded-lg bg-muted p-1">
              {(["exact", "approximate"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`rounded-md py-1.5 text-sm capitalize ${mode === m ? "bg-card font-semibold shadow-sm" : "text-muted-foreground"}`}>{m === "exact" ? "Exact token" : "Approximate"}</button>
              ))}
            </div>
          </div>
          <Btn onClick={run} disabled={phase === "running"} className="h-10">
            {phase === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run Matching
          </Btn>
        </div>
        {mode === "approximate" && <p className="mt-3 text-xs text-muted-foreground">Approximate mode compares phonetic-name, DOB and sex tokens to surface spelling variants. It excludes exact-token pairs.</p>}
        {phase === "running" && (
          <div className="mt-5">
            <div className="h-2 rounded-full bg-muted"><div className="bg-brand h-2 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
            <p className="mt-2 text-sm text-muted-foreground">{steps[step]}…</p>
          </div>
        )}
        {phase === "error" && <p className="mt-4 flex items-center gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" /> Source and target must be different hospitals.</p>}
        {phase === "done" && <p className="mt-4 flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> Completed: {results.length} candidate{results.length === 1 ? "" : "s"} found. Nothing has been merged.</p>}
      </Card>
      <Card className="mt-6">
        <h2 className="mb-4 font-semibold">Candidate matches</h2>
        {phase === "done" ? <CandidateTable candidates={results} /> : <EmptyState icon={GitMerge} title="No run yet" text="Choose two hospitals and run matching to see candidate pairs." />}
      </Card>
    </>
  );
}
