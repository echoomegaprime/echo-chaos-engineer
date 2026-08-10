# Contributing

Thank you for improving Echo Chaos Engineer. This is a public, proprietary infrastructure
project: contributions are welcome for review, but repository visibility does not grant a
general use or redistribution license.

## Development path

1. Open an issue describing the chaos-engineering behavior being changed.
2. Create a focused branch from current `main`.
3. Add a failing test before changing authentication or the `X-Commander-Override` concurrency
   bypass -- see SECURITY.md for why that bypass is intentional but should never become a
   separate authentication path.
4. Validate before opening a pull request:

   ```powershell
   npm install
   npm test
   ```

5. Open a pull request using the repository template and include exact test output.

## Pull-request requirements

- No secrets (`ECHO_API_KEY`) are included.
- No stubs, placeholders, skipped safety checks, or self-asserted readiness -- this tool injects
  real failures into real infrastructure.
- Changes to the authentication boundary or the `X-Commander-Override` bypass are called out
  explicitly in the pull request description.
