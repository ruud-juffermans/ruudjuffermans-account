import { useId } from 'react';

// The account mark — the person tile from brand/account.svg, inlined so it
// renders without a network request and can be sized via props. Gradient ids
// are namespaced with useId so multiple instances on one page don't clash.
export function Logo({ size = 26 }: { size?: number }) {
  const id = useId();
  const g = `${id}-g`;
  const s = `${id}-s`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      aria-hidden
      focusable="false"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={g} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="512" y2="512">
          <stop offset="0" stopColor="#ef4d76" />
          <stop offset="1" stopColor="#b8244c" />
        </linearGradient>
        <linearGradient id={s} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="512">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.17" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="115" fill={`url(#${g})`} />
      <rect width="512" height="512" rx="115" fill={`url(#${s})`} />
      <circle cx="256" cy="185" r="58" fill="#ffffff" />
      <path
        fill="#ffffff"
        d="M256,278 c-67,0 -116,45 -124,99 a22,22 0 0 0 21.8,26 h204.4 a22,22 0 0 0 21.8,-26 c-8,-54 -57,-99 -124,-99 z"
      />
    </svg>
  );
}
