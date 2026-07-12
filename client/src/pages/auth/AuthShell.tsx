import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Eyebrow, FadeRise, Hero } from '../../components/ui';
import { Logo } from '../../components/Logo';

// Centered auth card on the ruudjuffermans.nl hero background, shared by all
// auth pages so the whole flow looks like one product.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Wrap>
      <Content>
        <FadeRise>
          <Card>
            <LogoRow>
              <Logo size={44} />
            </LogoRow>
            <Eyebrow>Ruudjuffermans Account</Eyebrow>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            {children}
          </Card>
        </FadeRise>
        {footer && (
          <FadeRise $delay={120}>
            <Footer>{footer}</Footer>
          </FadeRise>
        )}
      </Content>
    </Wrap>
  );
}

const Wrap = styled(Hero)`
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background: var(--app-surface-elevated);
  border: 1px solid var(--app-border);
  border-radius: 24px;
  padding: 44px 36px 36px;
  box-shadow: 0 1px 2px rgba(11, 17, 32, 0.05), 0 24px 60px rgba(11, 17, 32, 0.08);

  @media (max-width: 480px) {
    padding: 32px 24px 28px;
  }
`;

const LogoRow = styled.div`
  margin-bottom: 18px;
`;

const Title = styled.h1`
  margin: 14px 0 6px;
`;

const Subtitle = styled.p`
  margin: 0 0 24px;
  color: var(--app-text-secondary);
  font-size: 1rem;
  line-height: 1.6;
`;

const Footer = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: var(--app-text-muted);
`;
