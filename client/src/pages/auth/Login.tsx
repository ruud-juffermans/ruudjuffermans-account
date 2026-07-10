import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth';
import { auth as authApi, ApiError } from '../../api';
import { appParam, authSearch, resolveDestination } from '../../authFlow';
import { Alert, Button, Field, FormStack, Input, OrDivider } from '../../components/ui';
import { AuthShell } from './AuthShell';

// The platform's single sign-in screen. Apps land here with ?return_url=&app=;
// after auth we bounce back to the requesting app if its origin is one of the
// platform's own (see resolveDestination), otherwise we show the dashboard.
export function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, loading: authLoading, login, guest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [needsVerify, setNeedsVerify] = useState(false);
  const [resent, setResent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [guestBusy, setGuestBusy] = useState(false);
  // One redirect per mount, whether it comes from the form or the effect below.
  const redirected = useRef(false);

  async function finish() {
    if (redirected.current) return;
    redirected.current = true;
    const dest = await resolveDestination(params);
    if (dest) window.location.assign(dest);
    else navigate('/', { replace: true });
  }

  // Already signed in (e.g. sent here by an app while holding a live session):
  // skip the form and complete the redirect immediately.
  useEffect(() => {
    if (!authLoading && user) void finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNeedsVerify(false);
    setBusy(true);
    try {
      await login(email, password, appParam(params));
      await finish();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerify(true);
      }
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setBusy(false);
    }
  }

  async function onGuest() {
    setError(null);
    setGuestBusy(true);
    try {
      await guest(appParam(params));
      await finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start a guest session.');
      setGuestBusy(false);
    }
  }

  async function resend() {
    setResent(false);
    try {
      await authApi.resendVerification(email);
    } finally {
      setResent(true); // response is intentionally generic
    }
  }

  const search = authSearch(params);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="One account for every ruudjuffermans.nl app."
      footer={
        <span>
          No account? <Link to={`/register${search}`}>Create one</Link>
        </span>
      }
    >
      <FormStack onSubmit={onSubmit}>
        {error && !needsVerify && <Alert $variant="error">{error}</Alert>}
        {needsVerify && (
          <Alert $variant={resent ? 'success' : 'error'}>
            {resent ? (
              'Verification email sent — check your inbox.'
            ) : (
              <>
                Your email isn't verified yet.{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    void resend();
                  }}
                >
                  Resend the verification link
                </a>
                .
              </>
            )}
          </Alert>
        )}
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
          Password
          <Input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" $variant="primary" $size="lg" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
        <Link to={`/forgot-password${search}`} style={{ fontSize: '0.9rem', textAlign: 'center' }}>
          Forgot your password?
        </Link>
        <OrDivider>or</OrDivider>
        <Button type="button" $size="lg" onClick={onGuest} disabled={guestBusy}>
          {guestBusy ? 'Setting up…' : 'Continue as guest'}
        </Button>
      </FormStack>
    </AuthShell>
  );
}
