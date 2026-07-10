import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { Button, Eyebrow, FadeRise, Hero } from '../../components/ui';
import { ConvertCard } from './ConvertCard';
import { ProfileCard } from './ProfileCard';
import { AppsCard } from './AppsCard';
import { SessionsCard } from './SessionsCard';

// Proton-account-style dashboard: profile, the platform's apps and the active
// sessions, all on the ruudjuffermans.nl hero background.
export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // guarded by the route in App.tsx

  async function onSignOut() {
    await logout();
    navigate('/login', { replace: true });
  }

  const firstName = user.name?.trim().split(/\s+/)[0];

  return (
    <Hero>
      <Page>
        <TopBar>
          <Brand>
            ruudjuffermans<span>account</span>
          </Brand>
          <Button onClick={onSignOut}>Sign out</Button>
        </TopBar>

        <FadeRise>
          <Header>
            <Eyebrow>Ruudjuffermans Account</Eyebrow>
            <h1>{user.isGuest ? 'Welcome, guest' : firstName ? `Hi, ${firstName}` : 'Your account'}</h1>
            <Lead>Manage your profile, your apps and your active sessions in one place.</Lead>
          </Header>
        </FadeRise>

        {user.isGuest && (
          <FadeRise $delay={120}>
            <ConvertCard />
          </FadeRise>
        )}
        <FadeRise $delay={user.isGuest ? 240 : 120}>
          <ProfileCard />
        </FadeRise>
        <FadeRise $delay={user.isGuest ? 360 : 240}>
          <AppsCard />
        </FadeRise>
        <FadeRise $delay={user.isGuest ? 480 : 360}>
          <SessionsCard />
        </FadeRise>
      </Page>
    </Hero>
  );
}

const Page = styled.div`
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 28px 24px 88px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 480px) {
    padding: 20px 16px 64px;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
`;

const Brand = styled.div`
  font-family: 'Bricolage Grotesque Variable', Georgia, serif;
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: -0.035em;
  color: var(--app-text-primary);
  white-space: nowrap;

  span {
    color: var(--app-red);
    margin-left: 0.4em;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0 8px;

  h1 {
    margin-top: 4px;
  }
`;

const Lead = styled.p`
  margin: 0;
  max-width: 52ch;
  color: var(--app-text-secondary);
  font-size: 1.0625rem;
  line-height: 1.7;
`;
