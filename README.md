# Echo Chaos Engineer

Chaos engineering Cloudflare Worker (D1 + KV) for controlled failure injection and resilience
testing across ECHO infrastructure -- experiments, scheduled game days, safety limits (blast
radius, auto-abort), resilience scoring, and post-experiment reports.

## Endpoints

| Access | Method | Path | Description |
|---|---|---|---|
| Public | GET | `/`, `/health` | Service info / health check |
| Authenticated | GET | `/stats`, `/experiments`, `/experiments/:id`, `/experiments/:id/runs`, `/runs/:id`, `/runs/:id/results`, `/resilience`, `/resilience/:service`, `/safety`, `/report` | Reads |
| Authenticated | POST | `/experiments`, `/experiments/:id/run`, `/experiments/:id/abort`, `/experiments/:id/schedule`, `/resilience/recalculate`, `/gameday` | Create/run/abort/schedule experiments, recalculate resilience scores, run a game day |

## Authentication

Every route other than `/` and `/health` requires `X-Echo-API-Key`, compared to
`env.ECHO_API_KEY` in constant time. There is a single shared credential -- no separate
read/write/admin tiers. See [SECURITY.md](SECURITY.md) for the `X-Commander-Override` header's
scope (a concurrency-lock bypass on `POST /experiments/:id/run`, not a separate auth path).

## Verify

```powershell
npm install
npm test
```

## Security

This tool injects real controlled failures into ECHO infrastructure. See
[SECURITY.md](SECURITY.md) to report a vulnerability -- never as a public issue.

## License

See [LICENSE](LICENSE). Contributions: see [CONTRIBUTING.md](CONTRIBUTING.md).
