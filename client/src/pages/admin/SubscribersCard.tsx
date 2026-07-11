import { useEffect, useState } from 'react';
import { admin, formatDateTime } from '../../api';
import type { NewsletterSubscriber } from '../../types';
import { Alert, Card, SectionLead, SectionTitle } from '../../components/ui';
import { Badge, Loading, MiniButton, Row, RowActions, RowList, RowMain, RowMeta, RowTitle } from './bits';

// Newsletter subscribers from the portfolio site.
export function SubscribersCard() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const { subscribers } = await admin.subscribers();
      setSubscribers(subscribers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load subscribers.');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function act(id: string, action: () => Promise<unknown>) {
    setError(null);
    setBusyId(id);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  }

  function onDelete(s: NewsletterSubscriber) {
    if (!window.confirm(`Permanently delete ${s.email} from the subscriber list?`)) return;
    void act(s.id, () => admin.deleteSubscriber(s.id));
  }

  const activeCount = subscribers?.filter((s) => s.active).length ?? 0;

  return (
    <Card>
      <SectionTitle>Subscribers</SectionTitle>
      <SectionLead>
        Newsletter signups from ruudjuffermans.nl
        {subscribers ? ` — ${activeCount} active of ${subscribers.length}.` : '.'}
      </SectionLead>

      {error && <Alert $variant="error">{error}</Alert>}
      {!subscribers && !error && <Loading>Loading subscribers…</Loading>}

      <RowList>
        {subscribers?.map((s) => {
          const busy = busyId === s.id;
          return (
            <Row key={s.id}>
              <RowMain>
                <RowTitle>{s.email}</RowTitle>
                <RowMeta>
                  Subscribed {formatDateTime(s.createdAt)} · via {s.source}{' '}
                  {s.active ? (
                    <Badge $tone="red">active</Badge>
                  ) : (
                    <Badge>
                      unsubscribed{s.unsubscribedAt ? ` ${formatDateTime(s.unsubscribedAt)}` : ''}
                    </Badge>
                  )}
                </RowMeta>
              </RowMain>
              <RowActions>
                {s.active && (
                  <MiniButton disabled={busy} onClick={() => void act(s.id, () => admin.unsubscribeSubscriber(s.id))}>
                    Unsubscribe
                  </MiniButton>
                )}
                <MiniButton $danger disabled={busy} onClick={() => onDelete(s)}>
                  Delete
                </MiniButton>
              </RowActions>
            </Row>
          );
        })}
        {subscribers && subscribers.length === 0 && <Loading>No subscribers yet.</Loading>}
      </RowList>
    </Card>
  );
}
