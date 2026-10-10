import { createContext, useContext, useState, type ReactNode } from "react";

export type ReviewStatus = "Pending Review" | "Approved" | "Rejected";

interface Ctx {
  statusOf: (id: string) => ReviewStatus;
  setStatus: (id: string, s: ReviewStatus) => void;
  decisions: Record<string, ReviewStatus>;
}

const ReviewContext = createContext<Ctx | null>(null);

/** In-memory only — review decisions are intentionally not persisted to localStorage. */
export function ReviewProvider({ children }: { children: ReactNode }) {
  const [decisions, setDecisions] = useState<Record<string, ReviewStatus>>({});
  return (
    <ReviewContext.Provider
      value={{
        decisions,
        statusOf: (id) => decisions[id] ?? "Pending Review",
        setStatus: (id, s) => setDecisions((d) => ({ ...d, [id]: s })),
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const c = useContext(ReviewContext);
  if (!c) throw new Error("useReview must be used inside ReviewProvider");
  return c;
}
