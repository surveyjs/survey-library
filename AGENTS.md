# AGENTS.md

Instructions for AI coding agents working in this repository, usually while preparing a pull request.

## Build, test and architecture

See [CLAUDE.md](./CLAUDE.md). It covers the package layout, build order (build `survey-core` first), lint (`--max-warnings=0`), unit tests and the model architecture. Commit messages follow Conventional Commits.

## Bug fixes

Bug fixes are welcome as pull requests when they include a unit test that fails before the fix and passes after it. Put model fixes in `packages/survey-core` with a Vitest test under `packages/survey-core/tests`.

## New public API

New public API (properties, events, methods, JSON schema changes) starts with an issue, not a pull request:

- Open an issue at https://github.com/surveyjs/survey-library/issues with the `[API gap]` title prefix.
- Describe the need and the workaround you wrote in application code, with a minimal survey JSON.
- Maintainers design the API shape, because it has to fit serialization, the Survey Creator property grid, localization and all four renderers (React, Angular, Vue 3, HTML/JS).
- A pull request may accompany the issue, but it must link to it (`#<issue number>` or the issue URL).

Survey Creator issues go to https://github.com/surveyjs/survey-creator/issues. Report security issues by email to info@devsoftbaltic.com, not in public issues or pull requests.

## Privacy

Never include code or data from the developer's own application in issues or pull requests. Reduce the case to a minimal survey JSON plus the SurveyJS calls that reproduce it.
