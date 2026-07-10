import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { auth as authApi } from '../../api';
import { authSearch } from '../../authFlow';
import { Alert, Button, Field, FormStack, Input } from '../../components/ui';
import { AuthShell } from './AuthShell';

export function ForgotPassword() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const search = authSearch(params);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await authApi.forgotPassword(email);
    } finally {
      // Always show the same confirmation (no account enumeration).
      setDone(true);
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle={done ? undefined : "Enter your email and we'll send you a reset link."}
      footer={
        <span>
          Remembered it? <Link to={`/login${search}`}>Sign in</Link>
        </span>
      }
    >
      {done ? (
        <Alert $variant="success">
          If an account exists for <strong>{email}</strong>, a password reset link is on its way.
        </Alert>
      ) : (
        <FormStack onSubmit={onSubmit}>
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
          <Button type="submit" $variant="primary" $size="lg" disabled={busy}>
            {busy ? 'Sending…' : 'Send reset link'}
          </Button>
        </FormStack>
      )}
    </AuthShell>
  );
}
