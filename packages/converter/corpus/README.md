# Eval corpus

Real form definitions scraped from public repositories (Form.io, JSONForms,
RJSF examples — all on GitHub). Used to score conversion **fidelity** in CI.

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

## Two jobs, one schedule (weekly)

1. **Re-scrape upstream** into `corpus/<source>/` and diff against the previous
   snapshot. A new construct → alert.
2. **Diff the vendored schema snapshots** (`src/formio/vendor/@formio-core` and
   the JSON Schema meta-schemas). These go stale silently for the same reason.

`npm run corpus:refresh` performs the scrape+diff. `npm run corpus:score` runs
the fidelity scoring specs (`corpus/**/*.spec.ts`).

See `../promts/03-eval-corpus.md` for the full spec: sources, the fidelity
metric, and the CI wiring.

## Layout

```
corpus/
  refresh.mjs          # scrape + diff entrypoint (npm run corpus:refresh)
  sources.json         # upstream repos/paths to scrape, per converter
  formio/              # scraped Form.io definitions (gitignored snapshots)
  json-schema/         # scraped JSON Schema + UI schema pairs
  *.spec.ts            # fidelity scoring, run in CI
```
