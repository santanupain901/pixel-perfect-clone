import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Info, ChevronLeft, ChevronRight, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { Btn, Card, EmptyState, PageHeader, Pill, SimulatedTag, statusTone } from "@/components/app/ui";
import { allCandidates } from "@/lib/matching";
import type { TokenizedRecord } from "@/lib/data";
import { useReview } from "@/lib/review-store";
import { pageMeta } from "@/lib/meta";

export const Route = createFileRoute("/review")({
  head: () => pageMeta("Match Review", "Human review of candidate patient matches. Records are never merged automatically."),
  component: ReviewPage,
});

const candidates = allCandidates();

function RecordPanel({ r }: { r: TokenizedRecord }) {
  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <p className="text-xs uppercase text-muted-foreground">Hospital {r.hospital}</p>
      <p className="font-mono text-lg font-semibold">{r.ref}</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Masked label</dt><dd>{r.maskedName}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Sex</dt><dd>{r.sex}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Birth year</dt><dd>{r.birthYear}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Identity token</dt><dd className="font-mono text-xs">{r.exactToken}</dd></div>
      </dl>
    </div>
  );
}

function ReviewPage() {
  const { statusOf, setStatus } = useReview();
  const [filter, setFilter] = useState<"Pending Review" | "all">("Pending Review");
  const list = candidates.filter((c) => filter === "all" || statusOf(c.id) === filter);
  const [i, setI] = useState(0);
  const idx = Math.min(i, Math.max(list.length - 1, 0));
  const c = list[idx];

  const decide = (s: "Approved" | "Rejected") => {
    setStatus(c.id, s);
    toast[s === "Approved" ? "success" : "info"](`Candidate ${s.toLowerCase()}`, { description: "Decision recorded. Records remain separate — no merge performed." });
  };

  return (
    <>
      <PageHeader title="Match Review" description="Compare candidate pairs side by side. Records are never merged automatically." actions={<SimulatedTag />} />
      <div className="mb-4 flex gap-2">
        {(["Pending Review", "all"] as const).map((f) => (
          <Btn key={f} variant={filter === f ? "primary" : "outline"} onClick={() => { setFilter(f); setI(0); }}>{f === "all" ? "All candidates" : "Pending only"}</Btn>
        ))}
      </div>
      {!c ? (
        <Card><EmptyState icon={ClipboardCheck} title="All caught up" text="There are no candidates pending review." /></Card>
      ) : (
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={c.category === "Exact token" ? "teal" : "blue"}>{c.category}</Pill>
            <Pill tone={statusTone(statusOf(c.id))}>{statusOf(c.id)}</Pill>
            <span className="ml-auto text-sm text-muted-foreground">{idx + 1} of {list.length}</span>
            <Btn variant="ghost" aria-label="Previous" disabled={idx === 0} onClick={() => setI(idx - 1)}><ChevronLeft className="h-4 w-4" /></Btn>
            <Btn variant="ghost" aria-label="Next" disabled={idx >= list.length - 1} onClick={() => setI(idx + 1)}><ChevronRight className="h-4 w-4" /></Btn>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <RecordPanel r={c.source} />
            <RecordPanel r={c.target} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-4 md:col-span-2">
              <p className="flex items-center gap-2 text-sm font-semibold"><Info className="h-4 w-4 text-info" /> Matching explanation</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">{c.explanation.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm font-semibold">Confidence score</p>
              <p className="font-display text-3xl font-semibold">{Math.round(c.confidence * 100)}%</p>
              <div className="mt-2 h-2 rounded-full bg-muted"><div className="bg-brand h-2 rounded-full" style={{ width: `${c.confidence * 100}%` }} /></div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Btn variant="danger" onClick={() => decide("Rejected")}><X className="h-4 w-4" /> Reject Candidate</Btn>
            <Btn onClick={() => decide("Approved")}><Check className="h-4 w-4" /> Approve Candidate</Btn>
          </div>
        </Card>
      )}
    </>
  );
}
