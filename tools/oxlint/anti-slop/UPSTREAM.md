# Anti-slop provenance

Source repository: unknown. The installer did not include repository metadata.

Source asset: `$HOME/.agents/skills/install-anti-slop/assets/anti-slop`

Source revision: pristine asset snapshot with SHA-256 tree digest `69fa217ad6262822167aeaa4b4cf9d10bddbba0bd9fcb7f83e1807f3707bdca3`.
The digest is the SHA-256 of the sorted, relative-path `shasum -a 256` manifest for every source file.

Installed paths:

- `tools/oxlint/anti-slop/index.ts`
- `tools/oxlint/anti-slop/rules/`
- `tools/oxlint/anti-slop/shared/`
- `tools/oxlint/anti-slop/effect/`
- `tools/oxlint/anti-slop/vendor/`

Intentional deviations: none. The generic plugin is registered. The bundled Effect plugin is not registered because this repository has no direct `effect` dependency.

The vendored ESLint Stylistic source has separate provenance and license records in `vendor/eslint-stylistic/`.
