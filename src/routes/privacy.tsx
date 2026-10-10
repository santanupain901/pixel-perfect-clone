import { createFileRoute } from "@tanstack/react-router";
import { Filter, KeyRound, Server, Split, AlertTriangle, FlaskConical } from "lucide-react";
import { Card, PageHeader } from "@/components/app/ui";
import { pageMeta } from "@/lib/meta";

export const Route = createFileRoute("/privacy")({
  head: () => pageMeta("Privacy Center", "How HealthLink minimizes identifier exposure: tokenization, secret handling and limitations."),
  component: PrivacyPage,
});

const items = [
  { icon: Filter, title: "Data minimization", text: "Hospitals share only the fields needed for linkage. Clinical data never leaves the hospital, and the linkage service sees tokens rather than names or birth dates." },
  { icon: KeyRound, title: "HMAC-SHA-256 tokenization", text: "Normalized identifiers (e.g. name + DOB + sex) are transformed with HMAC-SHA-256 using a shared secret. Identical inputs yield identical tokens, enabling comparison without revealing values." },
  { icon: Server, title: "Backend-only secret management", text: "The HMAC key lives only on the backend (e.g. a secrets manager). It is never shipped to the browser, never stored in frontend environment variables, and tokenization never runs client-side." },
  { icon: Split, title: "Separate matching and record access", text: "The matching service returns only hospital-specific references and scores. Accessing the underlying record requires a separate, authorized request to the owning hospital." },
  { icon: AlertTriangle, title: "Limitations of deterministic tokens", text: "Deterministic tokens are vulnerable to dictionary attacks if the key leaks, cannot tolerate typos on their own, and reveal when two records are equal. Key rotation, rate limits and approximate modes mitigate but do not remove these risks." },
  { icon: FlaskConical, title: "Synthetic-data-only demonstration", text: "Every record in this app is fabricated. Tokens shown are placeholders representing backend output. No real patient information is used anywhere." },
];

function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Center" description="The safeguards behind privacy-preserving record linkage — and their limits." />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <span className="inline-flex rounded-lg bg-accent p-2 text-accent-foreground"><Icon className="h-5 w-5" /></span>
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
