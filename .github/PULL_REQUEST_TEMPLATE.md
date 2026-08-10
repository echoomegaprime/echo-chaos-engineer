## Objective

Describe the chaos-engineering behavior this change adds or fixes.

## Evidence

- Exact source revision:
- Test output (`npm test`):
- Negative paths exercised (missing/invalid key):
- Hosted CI run:

## Security and release impact

- [ ] No secrets (`ECHO_API_KEY`) are included.
- [ ] The `X-Echo-API-Key` authentication boundary is unchanged, or the change is called out
      explicitly.
- [ ] Any change to `X-Commander-Override` is called out explicitly (see SECURITY.md).
- [ ] Staging-first deployment and rollback implications are documented.
