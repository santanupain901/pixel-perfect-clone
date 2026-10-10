import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, MinusCircle, Target, Activity, Sigma } from "lucide-react";
import { Card, PageHeader, SimulatedTag, StatCard } from "@/components/app/ui";
import { evaluate } from "@/lib/matching";
import { pageMeta } from "@/lib/meta";

export const Route = createFileRoute("/evaluation")({
  head: () => pageMeta("Evaluation", "Precision, recall and F1 computed against a known synthetic ground-truth dataset."),
  component: EvaluationPage,
});

const m = evaluate();
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

function EvaluationPage() {
  return (
    <>
      <PageHeader title="Evaluation" description="Metrics are computed live from the synthetic test dataset, whose true identities are known." actions={<SimulatedTag />} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="True positives" value={m.tp} icon={CheckCircle2} hint="Correct candidate pairs" />
        <StatCard label="False positives" value={m.fp} icon={XCircle} hint="Different people flagged" />
        <StatCard label="False negatives" value={m.fn} icon={MinusCircle} hint="Same person missed" />
        <StatCard label="Precision" value={pct(m.precision)} icon={Target} hint="TP / (TP + FP)" />
        <StatCard label="Recall" value={pct(m.recall)} icon={Activity} hint="TP / (TP + FN)" />
        <StatCard label="F1 score" value={pct(m.f1)} icon={Sigma} hint="Harmonic mean" />
      </div>
      <Card className="mt-6 text-sm text-muted-foreground">
        <h2 className="mb-2 font-semibold text-foreground">Method</h2>
        Exact-token and approximate matching are run over every hospital pair (A–B, A–C, B–C). Each candidate is compared with the hidden synthetic person ID. Missed pairs include a record whose name changed and one with a birth-date entry error — known weaknesses of deterministic tokens.
      </Card>
    </>
  );
}
