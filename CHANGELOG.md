# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.11.0] - 2026-09-07

### Added

- Session `total` is the prayer count for this rosary (73 by default, 71 without concluding prayers).

## [0.10.0] - 2026-09-04

### Added

- Decade prayers include `mystery` (`set`, `key`, `text`, `decade`) on `current()`.

### Changed

- `done()` is true after `next()` on the last prayer; `current()` still returns that prayer.
- Hail Holy Queen and the closing prayer follow the fifth decade by default. Pass `includeConcludingPrayers: false` to omit them.
- `current()` is always `{ key, text }` (optional `mystery`). The `type` field is removed.
- Prayer key `apostlesCreed` renamed to `creed`. Each locale keeps its customary creed text (Apostles' in en/la/it, Nicene in ar).

### Removed

- Mystery as its own session step. Opening and concluding prayers have no `mystery`.

