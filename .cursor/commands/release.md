# Release

Prepare an npm release for this package. Follow `.cursor/rules/versioning.mdc`.

1. Run `npm test`. Stop if tests fail.
2. Inspect git history and the public API since the last tag. Classify the change as patch, minor, or major using the pre-1.0 / post-1.0 rules.
3. Propose the bump level and exact target version. **Wait for confirmation** before editing `package.json`, running `npm version`, committing, tagging, or publishing.
4. After version confirmation: `npm version patch|minor|major` (creates the commit and `vX.Y.Z` tag), or bump `package.json` manually with commit message `X.Y.Z`.
5. **`npm publish` is always user-approved.** Do not push the tag or publish until the user explicitly asks. Pushing `vX.Y.Z` runs `.github/workflows/publish.yml` (Trusted Publishing). Laptop `npm publish` only if the Action fails.
6. On npmjs.com for `rosario`: Trusted Publisher → GitHub Actions, user `atgeo`, repo `rosario`, workflow filename `publish.yml`, allow `npm publish`. Required once.
7. Do not publish tests, `.gitignore`, or `.idea/` — `files` in `package.json` controls the tarball.
