# Production Better Auth secret rotation

The production `BETTER_AUTH_SECRET` was confirmed to match a value committed in
`apps/server/.env.example` at `3521f99`. Removing that value from the current
example does not remove it from Git history. Treat it as exposed until the
production runtime uses a new, independent secret. This note is a rollout plan;
it does not record a completed rotation or session revocation.

## Expected effects in this application

Hydro uses Better Auth 1.7.12 with PostgreSQL sessions and Google OAuth
(`apps/server/src/lib/auth.ts`, `apps/server/src/db/schema/auth.ts`, `bun.lock`).
The installed 1.7.12 implementation shows:

- The session cookie contains a database session token signed with the auth
  secret. After a direct secret change, old cookies fail verification and users
  must sign in again. The corresponding `session` rows are **not** deleted by
  changing the secret. See `dist/cookies/index.mjs` and
  `dist/api/routes/session.mjs` in the installed Better Auth package.
- OAuth state uses a database verification row plus a cookie signed with the
  secret in this stateful configuration. A Google sign-in started before the
  change can fail on callback; the user can start it again. The state row
  expires after ten minutes. See `dist/context/create-context.mjs` and
  `dist/state.mjs`.
- Password hashes are verified with scrypt independently of this secret.
  Password-reset tokens are random identifiers stored in the `verification`
  table, so changing the secret alone does not invalidate such links. Hydro
  currently has no `sendResetPassword` handler, so reset emails are disabled.
  See `dist/crypto/password.mjs`, `dist/api/routes/password.mjs`, and
  `apps/server/src/lib/auth.ts`.
- Email-verification links are HS256 JWTs signed with this secret, so any
  previously issued links fail after rotation. Hydro's sender is commented
  out, but Better Auth still registers `/verify-email`. With the exposed key,
  a forged verification token could change a user's verification status or
  enter the email-change flow. See `dist/api/index.mjs`,
  `dist/api/routes/email-verification.mjs`, and `apps/server/src/lib/auth.ts`.

The `dist/` paths above refer to the installed `better-auth@1.7.12` package,
not repository files. Recheck behavior if the deployed version differs.

## Operator rollout

1. Schedule a brief sign-in interruption. Confirm the deployment version,
   server replicas, a working database backup, and a way for operators to
   reauthenticate. Keep backup locations and credentials in protected storage.
2. Generate a **new, unique** high-entropy value (at least 32 random bytes)
   directly into the protected production secret store. Do not reuse the
   exposed value, the example placeholder, or a development secret. Do not
   place the value in Git, deployment logs, issue text, or shell history.
3. Stop or drain all API writers. Record the count of active rows in the
   `session` table, then delete all rows from that table in a transaction after
   the backup is verified. Revoking them is recommended: the secret change
   invalidates browser cookies, while deleting the database sessions also
   invalidates their underlying tokens. Do not delete `user`, `account`, or
   the entire `verification` table as part of this rotation.
4. Set only the new `BETTER_AUTH_SECRET` for every production API replica and
   deploy them together before reopening traffic. Ensure no configured
   `BETTER_AUTH_SECRETS`, `AUTH_SECRET`, or Better Auth `secrets` array accepts
   the exposed key as a previous version. Do not keep the exposed key as a
   grace-period fallback. Better Auth 1.7.12 supports a fallback key array,
   but accepting this known key would extend its exposure.
5. Confirm that a previously signed cookie gets no session from
   `/api/auth/get-session` and is rejected by a protected API route. Test a
   fresh email/password login, a fresh Google OAuth flow, session persistence
   across a page reload, and sign-out. Check that only new sessions appear in
   the database. Ask users whose OAuth flow crossed the cutover to retry.
6. Review available account and authentication logs from the exposure window
   for unexpected email changes, `emailVerified` transitions, and sessions.
   Investigate affected accounts before treating the incident as closed.

If deployment validation fails, roll back application code or routing **while
keeping the new secret**. Repair the deployment or generate another new key;
never restore the exposed key to regain old sessions. Record the new deployment
revision, backup location, session-row counts, test results, and any remaining
user impact in the operator change record without copying secret material.
