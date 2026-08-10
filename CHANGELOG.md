# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Security

- Replaced the raw `apiKey !== env.ECHO_API_KEY` comparison in `authMiddleware` with a
  constant-time `timingSafeEqual`, closing a timing side-channel on the check guarding every
  route in a tool that can inject controlled failures into production infrastructure.
- Reviewed the `X-Commander-Override` header (bypasses the "one experiment running fleet-wide"
  safety lock) before assuming it was a bug: confirmed it sits *behind* the global auth
  middleware (a caller must already hold a valid `X-Echo-API-Key` to reach it), so it is an
  in-session concurrency-lock bypass, not a separate authentication bypass. Documented explicitly
  in SECURITY.md rather than either silently leaving it unexplained or unilaterally redesigning
  the single-tier credential model.
- Bumped `hono` `^4.12.8` -> `^4.13.1`; `npm audit --omit=dev` reports 0 vulnerabilities.
- Corrected `package.json`'s `"license": "UNLICENSED"` to point at the real `LICENSE` file.

### Added

- `tests/auth.test.mjs`: 15 real tests, including end-to-end tests calling the actual exported
  Hono `app` via `app.request()` against real routes (`/experiments`, `/stats`, `/safety`,
  `POST /experiments/:id/run`), plus unit tests for `timingSafeEqual` and `authMiddleware`
  directly. These prove the auth boundary is correct; they cannot prove it is constant-time
  (functional tests can't detect a timing side-channel) -- that is what
  `certforge_journey.py`'s text-pattern regression guard is for, verified locally to actually
  fail when the raw `!==` is reintroduced, then restored.
- `package.json` `test` script (`tsc --noEmit && node --test`).
- `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
- Hosted CI (`.github/workflows/ci.yml`): runs `npm test` on every push and pull request.
- Issue templates (bug report, feature request) and a pull-request template.
- `.echo/{apps.json,certification.json,sdk.json}` for ECHO Certification Forge and GitHub App
  Suite enrollment; `sdk.json` is honestly empty -- no `echo.chaos.*` or similar capability is
  registered in `arcanum_sdk.sdk_capabilities` for this repo (checked broadly, not just the
  obvious prefix; the two `%chaos%` matches found belong to unrelated systems).
  `scripts/certforge_journey.py` critical journey verified locally to fail if the timing-unsafe
  regression is reintroduced, then restored.
- This CHANGELOG (the repository previously had no CHANGELOG; `tsconfig.json`/`package.json`
  devDependencies already existed and were left largely as-is since they were already solid).

## [Prior history]

- Add root route returning 200 JSON service info.
- Update config and hardening changes.
- Sync deployed changes (auth hardening, D1 error handling, service bindings).
- v1.0.0 -- initial commit.
