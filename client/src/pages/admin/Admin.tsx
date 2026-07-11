import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { Eyebrow, FadeRise } from '../../components/ui';
import { Shell, PageHeader, Lead } from '../dashboard/Shell';
import { UsersCard } from './UsersCard';
import { MessagesCard } from './MessagesCard';
import { SubscribersCard } from './SubscribersCard';

// Admin page: platform users, the site's contact messages and newsletter
// subscribers. The API is admin-gated server-side; this guard is just UX.
export function Admin() {
  const { user } = useAuth();

  if (!user) return null; // guarded by the route in App.tsx
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <Shell>
      <FadeRise>
        <PageHeader>
          <Eyebrow>Ruudjuffermans Account</Eyebrow>
          <h1>Admin</h1>
          <Lead>Manage the platform's users, contact messages and newsletter subscribers.</Lead>
        </PageHeader>
      </FadeRise>

      <FadeRise $delay={120}>
        <UsersCard />
      </FadeRise>
      <FadeRise $delay={240}>
        <MessagesCard />
      </FadeRise>
      <FadeRise $delay={360}>
        <SubscribersCard />
      </FadeRise>
    </Shell>
  );
}
