import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { account, formatDateTime, loadConfig } from '../../api';
import { useAuth } from '../../auth';
import type { SessionInfo } from '../../types';
import { Alert, Button, Card, SectionLead, SectionTitle } from '../../components/ui';

// Light user-agent sniffing — enough for "Chrome on macOS", no library needed.
function describeAgent(ua: string | null): string {
  if (!ua) return 'Unknown device';
  const browser = /edg(a|ios)?\//i.test(ua)
    ? 'Edge'
    : /opr\/|opera/i.test(ua)
      ? 'Opera'
      : /firefox|fxios/i.test(ua)
        ? 'Firefox'
        : /chrome|crios/i.test(ua)
          ? 'Chrome'
          : /safari/i.test(ua)
            ? 'Safari'
            : 'Browser';
  const os = /windows/i.test(ua)
    ? 'Windows'
    : /iphone|ipad|ipod/i.test(ua)
      ? 'iOS'
      : /android/i.test(ua)
        ? 'Android'
        : /mac os|macintosh/i.test(ua)
          ? 'macOS'
          : /linux/i.test(ua)
            ? 'Linux'
            : null;
  return os ? `${browser} on ${os}` : browser;
}

export function SessionsCard() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [sessions, setSessions] = useState<SessionInfo[] | null>(null);
  const [appNames, setAppNames] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState<'others' | 'all' | null>(null);

  async function load() {
    try {
      const { sessions } = await account.sessions();
      setSessions(sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your sessions.');
    }
  }

  useEffect(() => {
    void load();
    loadConfig()
      .then((config) => setAppNames(Object.fromEntries(config.apps.map((a) => [a.id, a.name]))))
      .catch(() => {
        /* fall back to raw app ids */
      });
  }, []);

  function appLabel(app: string | null): string {
    if (!app) return 'Account';
    return appNames[app] ?? app.charAt(0).toUpperCase() + app.slice(1);
  }

  async function revoke(id: string) {
    setError(null);
    setBusyId(id);
    try {
      await account.revokeSession(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not revoke that session.');
    } finally {
      setBusyId(null);
    }
  }

  async function revokeOthers() {
    setError(null);
    setBulkBusy('others');
    try {
      await account.revokeOthers();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign out other sessions.');
    } finally {
      setBulkBusy(null);
    }
  }

  async function revokeAll() {
    if (!window.confirm('Sign out everywhere? This also signs you out on this device.')) return;
    setError(null);
    setBulkBusy('all');
    try {
      await account.revokeAll();
      await refresh(); // /me now 401s → clears the user in context
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign out everywhere.');
      setBulkBusy(null);
    }
  }

  const others = sessions?.some((s) => !s.current) ?? false;

  return (
    <Card>
      <SectionTitle>Active sessions</SectionTitle>
      <SectionLead>Everywhere you're currently signed in with this account.</SectionLead>
      {error && <Alert $variant="error">{error}</Alert>}

      {sessions === null && !error && <Loading>Loading sessions…</Loading>}

      {sessions && (
        <List>
          {sessions.map((session) => (
            <Row key={session.id}>
              <RowMain>
                <RowTitle>
                  {appLabel(session.app)} &middot; {describeAgent(session.userAgent)}
                  {session.current && <ThisDevice>This device</ThisDevice>}
                </RowTitle>
                <RowMeta>
                  {session.ip ?? 'Unknown IP'} &middot; last used {formatDateTime(session.lastUsedAt)}
                </RowMeta>
              </RowMain>
              {!session.current && (
                <Button
                  onClick={() => void revoke(session.id)}
                  disabled={busyId === session.id || bulkBusy !== null}
                >
                  {busyId === session.id ? 'Revoking…' : 'Revoke'}
                </Button>
              )}
            </Row>
          ))}
        </List>
      )}

      <Actions>
        <Button onClick={() => void revokeOthers()} disabled={bulkBusy !== null || !others}>
          {bulkBusy === 'others' ? 'Signing out…' : 'Sign out other sessions'}
        </Button>
        <Button $variant="danger" onClick={() => void revokeAll()} disabled={bulkBusy !== null}>
          {bulkBusy === 'all' ? 'Signing out…' : 'Sign out everywhere'}
        </Button>
      </Actions>
    </Card>
  );
}

const List = styled.ul`
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--app-divider);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const RowMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const RowTitle = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ThisDevice = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--app-red-muted);
  color: var(--app-red);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const RowMeta = styled.div`
  color: var(--app-text-muted);
  font-size: 0.85rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Loading = styled.div`
  color: var(--app-text-muted);
  font-size: 0.9rem;
  margin-bottom: 20px;
`;
