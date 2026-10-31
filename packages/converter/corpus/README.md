# Eval corpus

Real form definitions scraped from public repositories (Form.io, JSONForms,
RJSF examples — all on GitHub). Used to score conversion **fidelity** as a
regression gate.

This directory is **top-level and excluded from the published tarball** (it is
not in `package.json` `files`). Only the hand-written unit fixtures under
`src/<converter>/fixtures/` ship.

## Why this is not a pinned fixture set

A pinned corpus tests our assumptions against themselves and never detects
drift: the frozen files pass forever while Form.io ships a new construct, and
the thing that tells us is a customer.

The failure this exists to catch is **not a throw**. It is a 400-field wizard
that renders perfectly and branches wrong because we guessed at one
`conditional`. Only fidelity scoring against known-good output finds that.

## Two jobs, one command

There is no scheduled workflow — `npm run corpus:refresh` is run by hand (weekly
is the cadence it was designed for: upstream moves on its own clock, not on
ours). It runs both jobs:

1. **Job A — re-scrape upstream** into `corpus/<source>/` and diff the set of
   **construct tokens** (a Form.io component `type`, a JSON Schema keyword)
   against the committed `<source>/_manifest.json`. A construct the converter
   has no rule for → **alert**.
2. **Job B — diff the vendored schema snapshots** (`src/formio/vendor/` and the
   JSON Schema draft meta-schemas) against upstream. These go stale silently for
   the same reason → **alert**.

Alerts are written **content-free** (tokens, paths, counts — never form content)
to `corpus/.alerts.json`; review the *high* ones and act on them by adding a
mapping (or refreshing the vendored snapshot), never by silencing the alarm.
The refreshed snapshots and manifests land in the working tree, so the scrape
itself is reviewed as an ordinary diff. `npm run corpus:refresh:self-test`
proves the alert paths fire against a synthetic diff, offline — run it whenever
the diff/alert code changes, since nothing else covers the alarm itself.

## Scoring — the regression gate

`npm run corpus:score` runs `corpus/fidelity.spec.ts` over the **committed**
snapshots (fast, deterministic, no network):

- **Oracle (hard gate):** every `convert(def).output` must construct a
  survey-core `SurveyModel` with zero `jsonErrors`. One failure fails the run.
- **Fidelity (tracked metric):** `fields_out / fields_in` and a weighted "clean"
  score (`assumed` weighted highest — the silent mis-branch), per definition and
  aggregated. A regression of the aggregate below `corpus/fidelity-baseline.json`
  fails the run; per-definition drops are logged. The corpus is scored in full — any
  file that cannot be scored is logged, never silently skipped.

Regenerate the baseline intentionally with
`npm run corpus:score:update-baseline` and commit the diff.

See `../promts/03-eval-corpus.md` for the full spec.

## Layout

```
corpus/
  refresh.mjs            # scrape + diff entrypoint (npm run corpus:refresh)
  lib.mjs               # fetch / extract / construct-token / diff helpers
  scoring.mjs           # pure fidelity metric (shared by the spec)
  sources.json          # upstream repos/paths to scrape, per converter
  fidelity.spec.ts      # oracle + fidelity gate (npm run corpus:score)
  fidelity-baseline.json# committed aggregate baseline (regression gate)
  formio/               # scraped Form.io definitions + _manifest.json (committed)
  json-schema/          # scraped JSON Schema (+ UI schema) defs + _manifest.json
  .alerts.json          # per-run refresh output (gitignored)
```
