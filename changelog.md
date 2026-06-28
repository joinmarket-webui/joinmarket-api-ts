# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
