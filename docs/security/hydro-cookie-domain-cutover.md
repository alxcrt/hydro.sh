# Hydro cookie domain cutover

The current production frontend is `hydro.alexcretu.com`, while the API is
`hydroapi.alexcretu.com`. Those sibling hostnames made Better Auth use
`Domain=.alexcretu.com`, exposing Hydro session cookies to unrelated sibling
services. The prepared code requires the API to move under the frontend's
subtree, to `api.hydro.alexcretu.com`, before it can start in public production.

This is a coordinated deployment procedure. The code alone must not be deployed
with the old production environment or the old frontend build.

## Prepare

1. Save the current working API and frontend image revisions, Coolify settings,
   DNS records, Google OAuth redirect URIs, and Stripe webhook configuration in
   a protected location. Keep secrets and exported credentials out of Git.
2. Add the `api.hydro.alexcretu.com` Cloudflare DNS record and Coolify hostname
   to the existing API service. Validate Cloudflare edge TLS and the Coolify
   origin certificate for the new hostname before changing application traffic.
   Preserve existing Cloudflare DNS and security settings for other hosts.
3. Add `https://api.hydro.alexcretu.com/api/auth/callback/google` to Google's
   authorized redirect URIs. Keep the old URI during validation.
4. Identify the exact Stripe webhook endpoint now in use and its signing secret.
   Plan its move to
   `https://api.hydro.alexcretu.com/api/stripe/webhook`. If creating a new
   Stripe endpoint, store its new signing secret in Coolify and avoid leaving
   both endpoints delivering the same events indefinitely.

## Switch together

Use a short maintenance window because the API and frontend deployments are not
atomic. Set these values for the same release:

| Setting | Value | Where |
| --- | --- | --- |
| `DOMAIN` | `hydro.alexcretu.com` | API runtime |
| `BETTER_AUTH_URL` | `https://api.hydro.alexcretu.com` | API runtime |
| `CORS_ORIGIN` | `https://hydro.alexcretu.com` | API runtime |
| `VITE_SERVER_URL` | `https://api.hydro.alexcretu.com` | **Frontend Docker build argument** |

`VITE_SERVER_URL` is baked into the frontend by `Dockerfile`; changing only its
runtime environment does not retarget API, RPC, auth client, or social-preview
requests. Deploy the prepared API and a newly built frontend together. The
production API guard deliberately rejects the old sibling-host configuration.

The new cookie is named `__Secure-hydro.sh.v2.session_token` with
`Domain=.hydro.alexcretu.com`. The name change makes existing browser sessions
sign in again. API and frontend responses expire the old `hydro.sh` cookies at
`Domain=.alexcretu.com`, including ordinary and partitioned variants, when a
browser next contacts them. A browser that never returns keeps the old cookie
until its own expiry; this rollout does not revoke database sessions or stolen
session tokens. Revoke those separately if there is evidence of compromise.

The old `hydroapi.alexcretu.com` hostname should stop serving authentication
routes after the switch. If Stripe still points to it, retain only the webhook
path until its endpoint has been moved and a signed delivery succeeds. Do not
rely on a redirect for Stripe POST deliveries or for Google OAuth callbacks.

## Validate before ending maintenance

1. Verify DNS, edge TLS, origin TLS, and a health response on the new API alias.
2. Sign in with email and Google from `hydro.alexcretu.com`, then refresh a
   protected page. Verify frontend server rendering, authenticated RPC, and
   logout. Check CORS allows only the configured frontend origin.
3. Inspect `Set-Cookie`: new auth cookies must have the `hydro.sh.v2` prefix,
   `Secure`, `HttpOnly`, `Partitioned`, and
   `Domain=.hydro.alexcretu.com`. No newly issued auth cookie may use
   `Domain=.alexcretu.com`.
4. Visit with an old cookie and verify the frontend or API returns expiration
   headers for `Domain=.alexcretu.com` with `Max-Age=0`, both with and without
   `Partitioned`. Confirm in a browser cookie inspector that the old entry is
   gone. Verify a sibling `alexcretu.com` service no longer receives the new
   Hydro cookie.
5. Confirm a signed Stripe webhook reaches the chosen endpoint once, returns
   success, and triggers the expected application behavior. Check logs for auth,
   CORS, callback, and webhook errors.

## Rollback

Restore the saved API and frontend image revisions and their matching old
settings together: `DOMAIN=alexcretu.com`,
`BETTER_AUTH_URL=https://hydroapi.alexcretu.com`, and the frontend image built
with `VITE_SERVER_URL=https://hydroapi.alexcretu.com`. Restore the old API
hostname, Google callback URI, and Stripe webhook routing as needed. Users may
need to sign in again. This emergency rollback reintroduces broad cookies, so
return to the nested API alias after diagnosing the failure.

Narrowing `Domain` stops passive cookie delivery to unrelated sibling hosts.
A malicious sibling that can set a parent-domain cookie with the new name can
still attempt cookie tossing; eliminating that integrity risk requires a
host-only cookie and a frontend authentication architecture that does not depend
on forwarding the frontend request's cookie during server rendering.
