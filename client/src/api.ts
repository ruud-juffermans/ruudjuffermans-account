import type { AuthUser, PlatformConfig, SessionInfo } from './types';

// Empty base in dev: Vite proxies /api → http://localhost:4000 (see
// vite.config.ts). In production builds VITE_API_URL is baked in.
const base = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    credentials: 'include', // platform session cookie
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    // Prefer a JSON { error } body; fall back to plain text.
    let message = res.statusText;
    let code: string | undefined;
    const text = await res.text();
    if (text) {
      try {
        const parsed = JSON.parse(text);
        message = parsed.error ?? text;
        code = parsed.code;
      } catch {
        message = text;
      }
    }
    throw new ApiError(res.status, message, code);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });

export const auth = {
  register: (data: { email: string; password: string; name?: string }) =>
    post<{ ok: true }>('/api/account/auth/register', data),
  verifyEmail: (token: string) => post<{ ok: true }>('/api/account/auth/verify-email', { token }),
  resendVerification: (email: string) =>
    post<{ ok: true }>('/api/account/auth/resend-verification', { email }),
  login: (data: { email: string; password: string; app?: string }) =>
    post<{ user: AuthUser }>('/api/account/auth/login', data),
  guest: (app?: string) =>
    post<{ user: AuthUser }>('/api/account/auth/guest', app ? { app } : undefined),
  convert: (data: { email: string; password: string; name?: string }) =>
    post<{ user: AuthUser }>('/api/account/auth/convert', data),
  logout: () => post<{ ok: true }>('/api/account/auth/logout'),
  me: () => request<{ user: AuthUser }>('/api/account/auth/me'),
  updateMe: (data: { name: string }) =>
    request<{ user: AuthUser }>('/api/account/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  forgotPassword: (email: string) => post<{ ok: true }>('/api/account/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) =>
    post<{ ok: true }>('/api/account/auth/reset-password', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    post<{ ok: true }>('/api/account/auth/change-password', data),
};

export const account = {
  config: () => request<PlatformConfig>('/api/account/config'),
  sessions: () => request<{ sessions: SessionInfo[] }>('/api/account/sessions'),
  revokeSession: (id: string) =>
    request<{ ok: true }>(`/api/account/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  revokeOthers: () => post<{ ok: true }>('/api/account/sessions/revoke-others'),
  revokeAll: () => post<{ ok: true }>('/api/account/sessions/revoke-all'),
};

// The platform config is static per deployment; cache the promise so the login
// redirect check, the apps grid and the sessions labels share one fetch.
let configPromise: Promise<PlatformConfig> | null = null;

export function loadConfig(): Promise<PlatformConfig> {
  if (!configPromise) {
    configPromise = account.config().catch((err) => {
      configPromise = null; // allow a retry after a failure
      throw err;
    });
  }
  return configPromise;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
