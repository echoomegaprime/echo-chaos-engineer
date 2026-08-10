# Security policy

Echo Chaos Engineer is a Cloudflare Worker (D1 + KV) that injects controlled failures into ECHO
infrastructure for resilience testing. Every route other than `/` and `/health` requires
`X-Echo-API-Key`, compared to `env.ECHO_API_KEY` in constant time. There is a single shared
credential -- this service has no separate read/write/admin tier the way some other Echo
services do.

## The `X-Commander-Override` header

`POST /experiments/:id/run` normally refuses to start a second experiment while one is already
running fleet-wide (a safety concurrency lock, since overlapping failure injections into
production could compound in unpredictable ways). `X-Commander-Override: true` bypasses that
lock. This is **not** a separate authentication bypass: the global auth middleware runs first
and already requires a valid `X-Echo-API-Key` on this route, so the override only changes
behavior for a caller who has already proven they hold the shared secret. It is a plain string
comparison with no independent confirmation step, which is a reasonable "break glass" design for
a shared-secret tool but is documented here explicitly rather than left for a future reviewer to
re-derive -- if this service ever moves to a tiered-credential model, the override should
probably require the same elevated tier, not just any valid key.

## Supported version

Security fixes target the current `main` branch and the currently deployed Worker release.
Historical commits are retained for evidence and are not patched in place.

## Report a vulnerability

Do not open a public issue for a suspected vulnerability. Send a private report to
`security@echo-op.com` with:

- affected endpoint and exact revision;
- reproduction steps and expected impact;
- whether the `X-Echo-API-Key` authentication boundary or the `X-Commander-Override` bypass may
  be involved;
- safe contact details for follow-up.

Never include a live `ECHO_API_KEY` in a report.
