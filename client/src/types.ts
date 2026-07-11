export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  isGuest: boolean;
  role: 'user' | 'admin';
}

export type AppId = 'journal' | 'fitness' | 'habit';

export interface PlatformApp {
  id: AppId;
  name: string;
  url: string;
}

export interface PlatformConfig {
  apps: PlatformApp[];
  accountUrl: string;
  // The portfolio site — a valid return_url origin, but not an app tile.
  websiteUrl?: string;
}

// ── admin ────────────────────────────────────────────────────────────────────

// User row from /api/account/admin/users — metadata + per-module activity
// counts, never other users' content.
export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  isGuest: boolean;
  role: 'user' | 'admin';
  disabledAt: string | null;
  createdAt: string;
  _count: { journalEntries: number; workouts: number; habits: number };
}

export type ContactStatus = 'new' | 'responded' | 'archived';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string;
  active: boolean;
  createdAt: string;
  unsubscribedAt: string | null;
}

export interface SessionInfo {
  id: string;
  app: string | null;
  userAgent: string | null;
  ip: string | null;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  current: boolean;
}
