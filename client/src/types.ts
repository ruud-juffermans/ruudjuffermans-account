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
