import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { auth as authApi } from '../../api';
import { authSearch } from '../../authFlow';
import { Alert, Button, Field, FormStack, Input } from '../../components/ui';
import { AuthShell } from './AuthShell';

export function Register() {
  const [params] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const search = authSearch(params);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await authApi.register({ email, password, name: name || undefined });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <AuthShell
        title="Check your email"
        footer={
          <span>
            Already verified? <Link to={`/login${search}`}>Sign in</Link>
          </span>
        }
      >
        <Alert $variant="success">
          We've sent a verification link to <strong>{email}</strong>. Click it to activate your
          account, then sign in.
        </Alert>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="One account for Journal, Fitness and Habit. Verify your email to get started."
      footer={
        <span>
          Already have an account? <Link to={`/login${search}`}>Sign in</Link>
        </span>
      }
    >
      <FormStack onSubmit={onSubmit}>
        {error && <Alert $variant="error">{error}</Alert>}
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
        <Field>
          Confirm password
          <Input
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <Button type="submit" $variant="primary" $size="lg" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </Button>
      </FormStack>
    </AuthShell>
  );
}
