import { loadConfig } from './api';

// Helpers for the cross-app sign-in flow. Apps send users here with
// ?return_url=<where to go back to>&app=<app id>; every hop between the auth
// pages must forward both params so the flow survives register/reset detours.

/** Query string ("?return_url=…&app=…" or "") carrying only the flow params. */
export function authSearch(params: URLSearchParams): string {
  const next = new URLSearchParams();
  const returnUrl = params.get('return_url');
  const app = params.get('app');
  if (returnUrl) next.set('return_url', returnUrl);
  if (app) next.set('app', app);
  const s = next.toString();
  return s ? `?${s}` : '';
}

export function appParam(params: URLSearchParams): string | undefined {
  return params.get('app') ?? undefined;
}

/**
 * Where to send the user after a successful sign-in: the return_url if its
 * origin exactly matches one of the platform apps (or the account app itself),
 * otherwise null (→ stay here, on the account dashboard). Open-redirect guard.
 */
export async function resolveDestination(params: URLSearchParams): Promise<string | null> {
  const returnUrl = params.get('return_url');
  if (!returnUrl) return null;

  let target: URL;
  try {
    target = new URL(returnUrl);
  } catch {
    return null; // relative or malformed → ignore
  }

  try {
    const config = await loadConfig();
    const allowed = [...config.apps.map((app) => app.url), config.accountUrl];
    for (const url of allowed) {
      try {
        if (new URL(url).origin === target.origin) return target.href;
      } catch {
        // skip malformed config entries
      }
    }
  } catch {
    // config unavailable → refuse the external redirect rather than guess
  }
  return null;
}
