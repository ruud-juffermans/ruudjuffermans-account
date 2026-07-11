import styled, { css } from 'styled-components';

// Small shared pieces for the admin cards: compact rows, badges and mini
// action buttons (the regular Button is too large for per-row actions).

export const RowList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  padding: 14px 0;
  border-top: 1px solid var(--app-divider);

  &:first-child {
    border-top: none;
  }
`;

export const RowMain = styled.div`
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const RowTitle = styled.div`
  font-weight: 600;
  overflow-wrap: anywhere;
`;

export const RowMeta = styled.div`
  font-size: 0.82rem;
  color: var(--app-text-muted);
  overflow-wrap: anywhere;
`;

export const RowActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Badge = styled.span<{ $tone?: 'red' | 'muted' }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;

  ${({ $tone = 'muted' }) =>
    $tone === 'red'
      ? css`
          background: var(--app-red-muted);
          color: var(--app-red);
        `
      : css`
          background: var(--app-surface);
          color: var(--app-text-secondary);
          border: 1px solid var(--app-border);
        `}
`;

export const MiniButton = styled.button<{ $danger?: boolean }>`
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s ease;

  ${({ $danger }) =>
    $danger
      ? css`
          color: var(--app-red);
          border: 1.5px solid var(--app-red-glow);

          &:hover:not(:disabled) {
            border-color: var(--app-red);
            background: var(--app-red-muted);
          }
        `
      : css`
          color: var(--app-text-secondary);
          border: 1.5px solid var(--app-border);

          &:hover:not(:disabled) {
            border-color: var(--app-text-secondary);
          }
        `}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const Loading = styled.div`
  color: var(--app-text-muted);
  font-size: 0.9rem;
`;
