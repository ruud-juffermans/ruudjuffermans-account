import { useAuth } from '../../auth';
import { Eyebrow, FadeRise } from '../../components/ui';
import { Shell, PageHeader, Lead } from './Shell';
import { ProfileCard } from './ProfileCard';
import { SessionsCard } from './SessionsCard';

// Settings page: profile (display name, change password) and active sessions.
export function Settings() {
  const { user } = useAuth();

  if (!user) return null; // guarded by the route in App.tsx

  return (
    <Shell>
      <FadeRise>
        <PageHeader>
          <Eyebrow>Ruudjuffermans Account</Eyebrow>
          <h1>Settings</h1>
          <Lead>Manage your profile, password and active sessions in one place.</Lead>
        </PageHeader>
      </FadeRise>

      <FadeRise $delay={120}>
        <ProfileCard />
      </FadeRise>
      <FadeRise $delay={240}>
        <SessionsCard />
      </FadeRise>
    </Shell>
  );
}
