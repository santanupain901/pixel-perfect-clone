/**
 * API service layer for the Node.js/Express backend.
 * The backend owns the HMAC secret and tokenization. Only the public base URL
 * is configured in the frontend (VITE_API_BASE_URL) — never secrets.
 */
const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

export type ApiStatus =
  | { state: "not_configured" }
  | { state: "connected"; version?: string }
  | { state: "error"; message: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) throw new Error("Backend not configured — running in demo mode.");
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) throw new Error(`Backend responded ${res.status}`);
  return res.json() as Promise<T>;
}

export async function checkHealth(): Promise<ApiStatus> {
  if (!BASE) return { state: "not_configured" };
  try {
    const data = await request<{ version?: string }>("/api/health", { signal: AbortSignal.timeout(4000) });
    return { state: "connected", version: data.version };
  } catch (e) {
    return { state: "error", message: (e as Error).message };
  }
}

/** CSV is sent to the backend for server-side tokenization; raw rows are never kept in the browser. */
export async function uploadHospitalCsv(hospitalId: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return request<{ accepted: number }>(`/api/hospitals/${hospitalId}/upload`, { method: "POST", body });
}

export const apiBaseUrl = BASE ?? null;
