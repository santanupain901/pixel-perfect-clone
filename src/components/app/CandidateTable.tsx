import { useState } from "react";
import { Search } from "lucide-react";
import { EmptyState, Pill, inputCls, statusTone } from "./ui";
import type { Candidate } from "@/lib/matching";
import { useReview } from "@/lib/review-store";

export function CandidateTable({ candidates }: { candidates: Candidate[] }) {
  const { statusOf } = useReview();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [st, setSt] = useState("all");
  const rows = candidates.filter(
    (c) =>
      (c.source.ref + c.target.ref).toLowerCase().includes(q.toLowerCase()) &&
      (cat === "all" || c.category === cat) &&
      (st === "all" || statusOf(c.id) === st),
  );
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input className={`${inputCls} w-full pl-9`} placeholder="Search by reference…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className={inputCls} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
          <option value="all">All categories</option><option>Exact token</option><option>Approximate name</option>
        </select>
        <select className={inputCls} value={st} onChange={(e) => setSt(e.target.value)} aria-label="Status">
          <option value="all">All statuses</option><option>Pending Review</option><option>Approved</option><option>Rejected</option>
        </select>
      </div>
      <div className="mt-4 overflow-x-auto">
        {rows.length === 0 ? <EmptyState icon={Search} title="No candidates" text="No candidate pairs match the current filters." /> : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="py-2">Source</th><th>Target</th><th>Category</th><th>Confidence</th><th>Review status</th></tr></thead>
            <tbody className="divide-y">
              {rows.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 font-mono text-xs">{c.source.ref}</td>
                  <td className="font-mono text-xs">{c.target.ref}</td>
                  <td><Pill tone={c.category === "Exact token" ? "teal" : "blue"}>{c.category}</Pill></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted"><div className="bg-brand h-1.5 rounded-full" style={{ width: `${c.confidence * 100}%` }} /></div>
                      {Math.round(c.confidence * 100)}%
                    </div>
                  </td>
                  <td><Pill tone={statusTone(statusOf(c.id))}>{statusOf(c.id)}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
