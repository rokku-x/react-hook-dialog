This folder contains Changesets configuration for automated changelogs and releases.

Common commands:

- Create a changeset (interactive):
  - `bun run changeset` (answers prompt and adds a changeset file under `.changeset/`)

- Version packages locally (apply the changeset bump to package.json and changelog):
  - `bun run version:changeset`

- Publish via changesets (CI):
  - `bun run publish:changeset`

Notes:
- Make sure to commit the generated changeset files and version changes before creating a release.
- The repo is configured to publish to npm with `publish:changeset` and the GitHub publish workflow expects `NPM_TOKEN` in repo secrets.
