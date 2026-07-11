import { Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './auth';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Settings } from './pages/dashboard/Settings';
import { Admin } from './pages/admin/Admin';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';

// The auth pages stay mounted regardless of session state: email links
// (verify/reset) must work while signed in, and /login handles the "already
// signed in, bounce back to the requesting app" case itself.
export function App() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          loading ? <Splash>Loading…</Splash> : user ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/settings"
        element={
          loading ? <Splash>Loading…</Splash> : user ? <Settings /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/admin"
        element={
          loading ? <Splash>Loading…</Splash> : user ? <Admin /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Full-screen placeholder while the initial session check (/api/account/auth/me) runs.
const Splash = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-muted);
`;
