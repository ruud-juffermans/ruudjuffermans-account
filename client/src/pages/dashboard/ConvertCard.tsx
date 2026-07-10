import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../auth';
import { Alert, Button, Field, FormStack, Input, SectionLead, SectionTitle } from '../../components/ui';

// Guest banner: converts the guest session into a full account in place
// (POST /api/account/auth/convert). On success the user in context flips to
// isGuest: false and this card unmounts.
export function ConvertCard() {
  const { convert } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      await convert({ email, password, name: name || undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account.');
      setBusy(false);
    }
  }

  return (
    <Banner>
      <SectionTitle>You're browsing as a guest</SectionTitle>
      <SectionLead>
        Guest sessions are temporary and their data is eventually cleaned up. Add an email and a
        password to keep everything you've made — across all apps.
      </SectionLead>
      <FormStack onSubmit={onSubmit}>
        {error && <Alert $variant="error">{error}</Alert>}
        <Row>
          <Field>
            Name <span style={{ opacity: 0.6 }}>(optional)</span>
            <Input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field>
            Email
            <Input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            Password <span style={{ opacity: 0.6 }}>(min 8 characters)</span>
            <Input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </Row>
        <div>
          <Button type="submit" $variant="primary" disabled={busy}>
            {busy ? 'Creating…' : 'Create my account'}
          </Button>
        </div>
      </FormStack>
    </Banner>
  );
}

const Banner = styled.section`
  background: var(--app-red-muted);
  border: 1px solid var(--app-red-glow);
  border-radius: 16px;
  padding: 28px;

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
