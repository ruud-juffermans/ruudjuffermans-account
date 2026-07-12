import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { loadConfig } from '../../api';
import type { PlatformConfig } from '../../types';
import { Alert, Card, SectionLead, SectionTitle } from '../../components/ui';
import { AppTile } from '../../components/AppTile';

function host(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export function AppsCard() {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig()
      .then(setConfig)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load the app list.'));
  }, []);

  return (
    <Card>
      <SectionTitle>Your apps</SectionTitle>
      <SectionLead>Everything on the platform, one sign-in away.</SectionLead>
      {error && <Alert $variant="error">{error}</Alert>}
      {!error && (
        <Grid>
          {(config?.apps ?? []).map((app) => (
            <Tile key={app.id} href={app.url}>
              <AppTile app={app.id} size={40} />
              <TileText>
                <TileName>{app.name}</TileName>
                <TileHost>{host(app.url)}</TileHost>
              </TileText>
              <Arrow aria-hidden="true">&rarr;</Arrow>
            </Tile>
          ))}
          {!config && !error && <Loading>Loading apps…</Loading>}
        </Grid>
      )}
    </Card>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
`;

const Tile = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1.5px solid var(--app-border);
  border-radius: 16px;
  background: var(--app-bg);
  color: var(--app-text-primary);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);

  &:hover {
    text-decoration: none;
    border-color: var(--app-red);
    background: var(--app-red-muted);
    transform: translateY(-1px);
    box-shadow: 0 10px 28px var(--app-red-glow);
  }
`;

const TileText = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

const TileName = styled.span`
  font-weight: 600;
  line-height: 1.3;
`;

const TileHost = styled.span`
  font-size: 0.8rem;
  color: var(--app-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Arrow = styled.span`
  color: var(--app-text-muted);
  transition: transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);

  ${Tile}:hover & {
    color: var(--app-red);
    transform: translateX(3px);
  }
`;

const Loading = styled.div`
  color: var(--app-text-muted);
  font-size: 0.9rem;
`;
