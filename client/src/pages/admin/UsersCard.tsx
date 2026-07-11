import { useEffect, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { admin, formatDateTime } from '../../api';
import { useAuth } from '../../auth';
import type { AdminUser } from '../../types';
import { Alert, Card, Input, SectionLead, SectionTitle } from '../../components/ui';
import { Badge, Loading, MiniButton, Row, RowActions, RowList, RowMain, RowMeta, RowTitle } from './bits';

// Registered users: search, suspend/unsuspend, verify, reset password, revoke
// sessions, delete. Metadata only — no user content.
export function UsersCard() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load(query?: string) {
    setError(null);
    try {
      const { users } = await admin.users(query);
      setUsers(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load users.');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    void load(search.trim() || undefined);
  }

  // Run one action against one user, then refresh the list.
  async function act(id: string, action: () => Promise<unknown>, doneNotice?: string) {
    setError(null);
    setNotice(null);
    setBusyId(id);
    try {
      await action();
      if (doneNotice) setNotice(doneNotice);
      await load(search.trim() || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  }

  function onDelete(u: AdminUser) {
    const label = u.isGuest ? 'this guest account' : u.email;
    if (!window.confirm(`Permanently delete ${label} and ALL their data across every app?`)) return;
    void act(u.id, () => admin.deleteUser(u.id));
  }

  function activity(u: AdminUser): string {
    const parts = [
      `${u._count.journalEntries} entries`,
      `${u._count.workouts} workouts`,
      `${u._count.habits} habits`,
    ];
    return parts.join(' · ');
  }

  return (
    <Card>
      <SectionTitle>Users</SectionTitle>
      <SectionLead>Every account on the platform — suspend, verify or remove them.</SectionLead>

      <SearchForm onSubmit={onSearch}>
        <Input
          type="search"
          placeholder="Search by email or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MiniButton type="submit">Search</MiniButton>
      </SearchForm>

      {error && <Alert $variant="error">{error}</Alert>}
      {notice && <Alert $variant="success">{notice}</Alert>}
      {!users && !error && <Loading>Loading users…</Loading>}

      <RowList>
        {users?.map((u) => {
          const busy = busyId === u.id;
          const isSelf = u.id === me?.id;
          return (
            <Row key={u.id}>
              <RowMain>
                <RowTitle>
                  {u.isGuest ? 'Guest account' : u.email}
                  {u.name ? ` — ${u.name}` : ''}
                </RowTitle>
                <RowMeta>
                  Joined {formatDateTime(u.createdAt)} · {activity(u)}
                </RowMeta>
                <div>
                  {u.role === 'admin' && <Badge $tone="red">admin</Badge>}{' '}
                  {u.isGuest && <Badge>guest</Badge>}{' '}
                  {!u.isGuest && !u.emailVerified && <Badge>unverified</Badge>}{' '}
                  {u.disabledAt && <Badge $tone="red">suspended</Badge>}
                </div>
              </RowMain>
              {!isSelf && (
                <RowActions>
                  {u.disabledAt ? (
                    <MiniButton disabled={busy} onClick={() => void act(u.id, () => admin.unsuspendUser(u.id))}>
                      Unsuspend
                    </MiniButton>
                  ) : (
                    <MiniButton disabled={busy} onClick={() => void act(u.id, () => admin.suspendUser(u.id))}>
                      Suspend
                    </MiniButton>
                  )}
                  {!u.isGuest && !u.emailVerified && (
                    <MiniButton disabled={busy} onClick={() => void act(u.id, () => admin.verifyUserEmail(u.id))}>
                      Mark verified
                    </MiniButton>
                  )}
                  {!u.isGuest && (
                    <MiniButton
                      disabled={busy}
                      onClick={() =>
                        void act(u.id, () => admin.resetUserPassword(u.id), `Reset link sent to ${u.email}.`)
                      }
                    >
                      Send reset link
                    </MiniButton>
                  )}
                  <MiniButton
                    disabled={busy}
                    onClick={() => void act(u.id, () => admin.revokeUserSessions(u.id), 'Sessions revoked.')}
                  >
                    Revoke sessions
                  </MiniButton>
                  <MiniButton $danger disabled={busy} onClick={() => onDelete(u)}>
                    Delete
                  </MiniButton>
                </RowActions>
              )}
            </Row>
          );
        })}
        {users && users.length === 0 && <Loading>No users match.</Loading>}
      </RowList>
    </Card>
  );
}

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;

  input {
    flex: 1;
  }
`;
