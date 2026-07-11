import { useAuth } from '../../auth';
import { Eyebrow, FadeRise } from '../../components/ui';
import { Shell, PageHeader, Lead } from './Shell';
import { ConvertCard } from './ConvertCard';
import { AppsCard } from './AppsCard';

// Landing page of the account app: greeting + the platform's apps. Profile
// (name, password) and sessions live on the Settings page.
export function Dashboard() {
  const { user } = useAuth();

  if (!user) return null; // guarded by the route in App.tsx

  const firstName = user.name?.trim().split(/\s+/)[0];

  return (
    <Shell>
      <FadeRise>
        <PageHeader>
          <Eyebrow>Ruudjuffermans Account</Eyebrow>
          <h1>{user.isGuest ? 'Welcome, guest' : firstName ? `Hi, ${firstName}` : 'Your account'}</h1>
          <Lead>All your apps, one sign-in. Manage your profile and sessions under settings.</Lead>
        </PageHeader>
      </FadeRise>

      {user.isGuest && (
        <FadeRise $delay={120}>
          <ConvertCard />
        </FadeRise>
      )}
      <FadeRise $delay={user.isGuest ? 240 : 120}>
        <AppsCard />
      </FadeRise>
    </Shell>
  );
}
