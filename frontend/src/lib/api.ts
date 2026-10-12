// Typed client for the ACFLO backend API (Express + MongoDB + Cloudinary).
// Used by the auth page, the dashboard guard and the publishing dashboard.

const API_BASE = ((import.meta.env["VITE_API_URL"] as string | undefined) || "http://localhost:5000").replace(/\/+$/, "");

const TOKEN_KEY = "acflo_admin_token";

export function getToken(): string | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  auth?: boolean;
};

export type ApiError = Error & { status?: number };

async function request<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, formData, auth = true } = opts;
  const headers: Record<string, string> = {};
  const token = getToken();
  if (auth && token) headers["Authorization"] = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (formData) {
    payload = formData; // browser sets the multipart boundary
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    if (res.status === 401 && auth) clearToken();
    const details = Array.isArray(data?.details)
      ? data.details
          .map((d: any) => (typeof d === "string" ? d : `${d?.path ? d.path + ": " : ""}${d?.message ?? ""}`))
          .join(", ")
      : "";
    const error = new Error(data?.error || details || text || `Request failed (${res.status})`) as ApiError;
    error.status = res.status;
    throw error;
  }
  return data as T;
}

function toFormData(data: Record<string, unknown>, files: { image?: File | null; file?: File | null } = {}): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    fd.append(key, String(value));
  }
  if (files.image) fd.append("image", files.image);
  if (files.file) fd.append("file", files.file);
  return fd;
}

export type AdminProfile = {
  id: string;
  display_name: string;
  organization: string;
  bio?: string;
  country?: string;
  website?: string;
  avatar_url?: string;
  created_at?: string;
};

export type ContentFiles = { image?: File | null; file?: File | null };

export const api = {
  base: API_BASE,

  // --- auth ---
  setupStatus: () => request<{ needsSetup: boolean }>("/api/auth/setup", { auth: false }),
  bootstrap: (body: { email: string; password: string; display_name?: string; organization?: string }) =>
    request<{ token: string; admin: any }>("/api/auth/bootstrap", { method: "POST", body, auth: false }),
  login: (body: { email: string; password: string }) =>
    request<{ token: string; admin: any }>("/api/auth/login", { method: "POST", body, auth: false }),
  me: () => request<{ admin: any }>("/api/auth/me"),
  logout: clearToken,
  listAdmins: () => request<{ admins: AdminProfile[] }>("/api/auth/admins", { auth: false }),

  // --- content ---
  listContent: (params: Record<string, string | number | boolean | undefined> = {}) => {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") qs.set(key, String(value));
    }
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return request<{ items: any[]; total: number; page: number; pages: number; limit: number }>(
      `/api/content${suffix}`,
      { auth: false },
    );
  },
  getContent: (kind: string, slug: string) =>
    request<any>(`/api/content/${encodeURIComponent(kind)}/${encodeURIComponent(slug)}`, { auth: false }),
  createContent: (data: Record<string, unknown>, files: ContentFiles = {}) =>
    files.image || files.file
      ? request<any>("/api/content", { method: "POST", formData: toFormData(data, files) })
      : request<any>("/api/content", { method: "POST", body: data }),
  updateContent: (id: string, data: Record<string, unknown>, files: ContentFiles = {}) =>
    files.image || files.file
      ? request<any>(`/api/content/${id}`, { method: "PUT", formData: toFormData(data, files) })
      : request<any>(`/api/content/${id}`, { method: "PUT", body: data }),
  deleteContent: (id: string) => request<{ ok: boolean }>(`/api/content/${id}`, { method: "DELETE" }),

  // --- messages (contact/join forms) ---
  createMessage: (body: Record<string, unknown>) => request<any>("/api/messages", { method: "POST", body, auth: false }),
};