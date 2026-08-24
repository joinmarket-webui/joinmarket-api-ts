# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Coin control on direct-send:** `input_utxos` on `DirectSendRequest`, an optional list of `txid:vout` strings that pins the exact inputs to spend (joinmarket-ng#587). Omitting it keeps the previous auto-selecting behaviour.
- **Coin control on coinjoin:** `input_utxos` on `DoCoinjoinRequest`, same shape and semantics as the direct-send field above (joinmarket-ng#587). Not previously synced from the backend even though it shipped alongside the direct-send field.
- **Batch freeze/unfreeze:** new `freezebatch()` call for `POST /wallet/{walletname}/freeze-batch`, taking a `FreezeBatchRequest` (a list of `{ 'utxo-string', freeze }` entries) so multiple utxos can be frozen/unfrozen in one request instead of one call per utxo (joinmarket-ng#596). The batch is applied atomically — either all entries land or none do.
- **API Sync:** Picked up backend changes made since v1.0.0 — `amount` and `source` on `HistoryEntry` (with `cj_amount` and `source_mixdepth` now nullable and `role` narrowed to a union), `scan_range` on `RecoverWalletRequest`, `error` on `RescanInfoResponse`, and `confirmations` on `TxInfo`.

### Fixed
- `scripts/fetch-schema.mjs` importing a default export from `js-yaml`, which has not existed since the bump to v5 and made the script fail to run.

## [v1.0.0] - 2026-06-28

### Added
- **Migration to JoinMarket-NG:** Updated the package to target the new JoinMarket-NG backend OpenAPI specification.
- **Client & SDK Regeneration:** Fully regenerated all client TypeScript definitions, SDK options, and React Query integration hooks.
- **API Sync:** Synchronized latest API changes from the running JoinMarket-NG backend (e.g., adding `backend` to `GetInfoResponse`).


### Changed
- @tanstack/react-query is an optional peer dependency

## [v0.3.0] - 2025-11-15

### Changed
- @tanstack/react-query is an optional dependency

## [v0.2.0] - 2025-11-15

### Changed
- Update @hey-api/openapi-ts from v0.82.5 to v0.87.5
- Update @tanstack/react-query from v5.89.0 to v5.90.9

## [v0.1.0] - 2025-11-14

### Added
- Initial release

[Unreleased]: https://github.com/joinmarket-webui/joinmarket-ng-api-ts/compare/v1.0.0...HEAD
[v1.0.0]: https://github.com/joinmarket-webui/joinmarket-ng-api-ts/compare/v0.3.0...v1.0.0
[v0.3.0]: https://github.com/joinmarket-webui/joinmarket-ng-api-ts/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/joinmarket-webui/joinmarket-ng-api-ts/compare/v0.1.0...v0.2.0
[v0.1.0]: https://github.com/joinmarket-webui/joinmarket-ng-api-ts/releases/tag/v0.1.0
