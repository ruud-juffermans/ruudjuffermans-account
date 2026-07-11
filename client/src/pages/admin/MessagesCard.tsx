import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { admin, formatDateTime } from '../../api';
import type { ContactStatus, ContactSubmission } from '../../types';
import { Alert, Card, SectionLead, SectionTitle } from '../../components/ui';
import { Badge, Loading, MiniButton, Row, RowActions, RowList, RowMain, RowMeta, RowTitle } from './bits';

const FILTERS: Array<{ label: string; value: ContactStatus | undefined }> = [
  { label: 'All', value: undefined },
  { label: 'New', value: 'new' },
  { label: 'Responded', value: 'responded' },
  { label: 'Archived', value: 'archived' },
];

// Contact-form submissions from the portfolio site, with the new → responded
// → archived workflow.
export function MessagesCard() {
  const [submissions, setSubmissions] = useState<ContactSubmission[] | null>(null);
  const [filter, setFilter] = useState<ContactStatus | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load(status?: ContactStatus) {
    setError(null);
    try {
      const { submissions } = await admin.contactSubmissions(status);
      setSubmissions(submissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load messages.');
    }
  }

  useEffect(() => {
    void load(filter);
  }, [filter]);

  async function act(id: string, action: () => Promise<unknown>) {
    setError(null);
    setBusyId(id);
    try {
      await action();
      await load(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  }

  function onDelete(s: ContactSubmission) {
    if (!window.confirm(`Permanently delete the message from ${s.email}?`)) return;
    void act(s.id, () => admin.deleteContactSubmission(s.id));
  }

  return (
    <Card>
      <SectionTitle>Messages</SectionTitle>
      <SectionLead>Contact-form submissions from ruudjuffermans.nl.</SectionLead>

      <Filters>
        {FILTERS.map((f) => (
          <MiniButton
            key={f.label}
            type="button"
            $danger={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </MiniButton>
        ))}
      </Filters>

      {error && <Alert $variant="error">{error}</Alert>}
      {!submissions && !error && <Loading>Loading messages…</Loading>}

      <RowList>
        {submissions?.map((s) => {
          const busy = busyId === s.id;
          return (
            <Row key={s.id}>
              <RowMain>
                <RowTitle>
                  {s.name} — {s.email}
                </RowTitle>
                <RowMeta>
                  {formatDateTime(s.createdAt)}
                  {s.company ? ` · ${s.company}` : ''}{' '}
                  <Badge $tone={s.status === 'new' ? 'red' : 'muted'}>{s.status}</Badge>
                </RowMeta>
                <Message>{s.message}</Message>
              </RowMain>
              <RowActions>
                {s.status !== 'responded' && (
                  <MiniButton disabled={busy} onClick={() => void act(s.id, () => admin.setContactStatus(s.id, 'responded'))}>
                    Mark responded
                  </MiniButton>
                )}
                {s.status !== 'archived' && (
                  <MiniButton disabled={busy} onClick={() => void act(s.id, () => admin.setContactStatus(s.id, 'archived'))}>
                    Archive
                  </MiniButton>
                )}
                <MiniButton $danger disabled={busy} onClick={() => onDelete(s)}>
                  Delete
                </MiniButton>
              </RowActions>
            </Row>
          );
        })}
        {submissions && submissions.length === 0 && <Loading>No messages here.</Loading>}
      </RowList>
    </Card>
  );
}

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const Message = styled.p`
  margin: 6px 0 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--app-text-secondary);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;
