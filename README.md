# ruudjuffermans-account

Central auth + account dashboard for the ruudjuffermans.nl platform — the
platform's equivalent of `account.proton.me`. This is the **only** app with an
auth UI: Journal, Fitness and Habit send users here to sign in
(`/login?return_url=…&app=…`) and get them back after a successful login. Signed-in
users get a Proton-style dashboard: profile (display name, change password),
the platform's apps, and active-session management (revoke per device, sign
out others, sign out everywhere).

Client-only project — every API call goes to the platform server
(`ruudjuffermans-server`), which owns users, sessions and the shared session
cookie.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Account dashboard (requires a session, else → `/login`). Profile card, "Your apps" grid, active sessions, guest-conversion banner. |
| `/login` | Email + password sign-in, "Continue as guest". Reads `return_url` + `app` query params; on success redirects back to the requesting app if its origin matches the platform config, otherwise to `/`. |
| `/register` | Create an account; success state says "check your email". |
| `/forgot-password` | Request a password-reset email. |
| `/reset-password?token=…` | Choose a new password (link from email). |
| `/verify-email?token=…` | Auto-submits the token on mount (link from email). |

The `return_url`/`app` params are forwarded across the login ↔ register ↔
forgot-password ↔ reset/verify links so the cross-app flow survives detours.

## Development

Needs the platform server (`ruudjuffermans-server`) running on
`http://localhost:4000` — the Vite dev server proxies `/api/*` to it so the
session cookie stays same-origin.

```sh
cd client
npm install
npm run dev   # http://localhost:3004
```

## Build & deploy

`docker-compose.yml` builds a single `client` service: a multi-stage image
(node:20-alpine build → nginx:alpine with SPA fallback, serving on port 3000)
attached to the external `dokploy-network`, mirroring the other platform apps.

| Build arg / env | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `https://api.ruudjuffermans.nl` | Platform API origin, inlined by Vite at build time. Leave unset in dev (proxy handles it). See [`.env.example`](.env.example). |

```sh
docker compose build
docker compose up -d
```
