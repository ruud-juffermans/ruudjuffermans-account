import type { ReactNode } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { Button, Hero } from '../../components/ui';

// Shared chrome for the signed-in pages (apps overview + settings): brand bar
// with navigation and sign-out, on the ruudjuffermans.nl hero background.
export function Shell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function onSignOut() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <Hero>
      <Page>
        <TopBar>
          <Brand>
            ruudjuffermans<span>account</span>
          </Brand>
          <Nav>
            <TabLink to="/" end>
              Apps
            </TabLink>
            <TabLink to="/settings">Settings</TabLink>
            {user?.role === 'admin' && <TabLink to="/admin">Admin</TabLink>}
            <Button onClick={onSignOut}>Sign out</Button>
          </Nav>
        </TopBar>
        {children}
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

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const TabLink = styled(NavLink)`
  color: var(--app-text-secondary);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;

  &:hover {
    color: var(--app-red);
    text-decoration: none;
  }

  &.active {
    color: var(--app-red);
  }
`;

export const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0 8px;

  h1 {
    margin-top: 4px;
  }
`;

export const Lead = styled.p`
  margin: 0;
  max-width: 52ch;
  color: var(--app-text-secondary);
  font-size: 1.0625rem;
  line-height: 1.7;
`;
