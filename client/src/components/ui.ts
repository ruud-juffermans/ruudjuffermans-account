import styled, { css, keyframes } from 'styled-components';

// Shared primitives implementing the ruudjuffermans.nl design language on top
// of the CSS variables in styles/tokens.css.

const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

/* ---------- motion ---------- */

const rise = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Entrance wrapper: fade + rise, staggered via $delay (multiples of ~120ms).
export const FadeRise = styled.div<{ $delay?: number }>`
  animation: ${rise} 700ms cubic-bezier(0.2, 0.65, 0.25, 1) both;
  animation-delay: ${({ $delay = 0 }) => $delay}ms;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* ---------- layout ---------- */

// Full-viewport hero background (dot grid + red glow, defined in tokens.css).
// Children must be positioned to paint above the ::before/::after layers.
export const Hero = styled.div.attrs({ className: 'hero' })`
  display: flex;
  flex-direction: column;

  > * {
    position: relative;
    z-index: 1;
  }
`;

export const Eyebrow = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--app-red);
`;

export const Card = styled.section`
  background: var(--app-surface-elevated);
  border: 1px solid var(--app-border);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 2px rgba(11, 17, 32, 0.04), 0 12px 32px rgba(11, 17, 32, 0.05);

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.35rem;
  letter-spacing: -0.025em;
  margin: 0 0 4px;
`;

export const SectionLead = styled.p`
  margin: 0 0 20px;
  color: var(--app-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
`;

export const Muted = styled.span`
  color: var(--app-text-muted);
  font-size: 0.875rem;
`;

/* ---------- forms ---------- */

export const Input = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid var(--app-border);
  background: var(--app-bg);
  color: var(--app-text-primary);
  font-size: 1rem;
  transition: border-color 0.25s ${ease}, box-shadow 0.25s ${ease};

  &::placeholder {
    color: var(--app-text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--app-red);
    box-shadow: 0 0 0 4px var(--app-red-muted);
  }

  &:disabled {
    background: var(--app-surface);
    color: var(--app-text-secondary);
    cursor: not-allowed;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--app-text-secondary);
`;

export const FormStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Alert = styled.div<{ $variant?: 'error' | 'success' }>`
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.5;
  border: 1px solid
    ${({ $variant }) => ($variant === 'success' ? 'var(--app-green)' : 'var(--app-red)')};
  color: ${({ $variant }) => ($variant === 'success' ? 'var(--app-green)' : 'var(--app-red)')};
  background: ${({ $variant }) =>
    $variant === 'success' ? 'var(--app-green-muted)' : 'var(--app-red-muted)'};

  a {
    color: inherit;
    font-weight: 600;
    text-decoration: underline;
  }
`;

export const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--app-text-muted);
  font-size: 0.875rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--app-border);
  }
`;

/* ---------- buttons ---------- */

export const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
  $size?: 'md' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  font-family: 'Outfit Variable', 'Segoe UI', sans-serif;
  font-weight: 600;
  text-transform: none;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.25s ${ease};

  ${({ $size }) =>
    $size === 'lg'
      ? css`
          padding: 14px 34px;
          min-height: 52px;
          font-size: 1rem;
        `
      : css`
          padding: 9px 22px;
          min-height: 42px;
          font-size: 0.9375rem;
        `}

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${({ $variant = 'secondary' }) =>
    $variant === 'primary'
      ? css`
          background: var(--app-red);
          color: #fff;
          border: none;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 1px 2px rgba(11, 17, 32, 0.12);

          &:hover:not(:disabled) {
            background: var(--app-red-hover);
            transform: translateY(-1px);
            box-shadow: 0 10px 28px var(--app-red-glow);
          }
        `
      : $variant === 'danger'
        ? css`
            background: transparent;
            color: var(--app-red);
            border: 1.5px solid var(--app-red-glow);

            &:hover:not(:disabled) {
              border-color: var(--app-red);
              background: var(--app-red-muted);
            }
          `
        : css`
            background: transparent;
            color: var(--app-text-primary);
            border: 1.5px solid var(--app-border);

            &:hover:not(:disabled) {
              border-color: var(--app-red);
              background: var(--app-red-muted);
            }
          `}
`;
