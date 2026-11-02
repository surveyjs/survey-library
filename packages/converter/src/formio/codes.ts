// Stable report codes for the Form.io converter. NEVER rename a code without a
// REPORT_VERSION bump - telemetry and the Creator plugin key off these strings.
// Add new codes; do not repurpose old ones.

export const FormioCodes = {
  // A component `type` we do not have a mapping for yet. Our gap.
  UNSUPPORTED_COMPONENT: "formio.unsupported-component",
  // `multiple` on a text-like field: SurveyJS `text` and `comment` hold one value, so the field
  // keeps one input.
  UNSUPPORTED_MULTIPLE: "formio.unsupported-multiple",
  // A `select` whose choices come from a resource, custom code, inline JSON, or a URL the form
  // cannot call as written (an interpolated address, authentication, request headers).
  UNSUPPORTED_DATA_SOURCE: "formio.unsupported-data-source",

  // `customConditional` / `validate.custom`: arbitrary JS. We REFUSE to parse
  // it - path and count only, never the source string (content-free rule).
  CUSTOM_CONDITIONAL: "formio.custom-conditional",
  CUSTOM_VALIDATION: "formio.custom-validation",
  // `logic`: rules and actions that change the form at run time.
  CUSTOM_LOGIC: "formio.custom-logic",
  // `calculateValue` / `customDefaultValue`: code or JSON logic that computes a value.
  CUSTOM_VALUE: "formio.custom-value",

  // A key present on a component that is not in the vendored @formio/core
  // types snapshot. Format drift or a vendor/custom extension - the drift
  // alarm, distinct from UNSUPPORTED_COMPONENT.
  UNKNOWN_KEY: "formio.unknown-key",
  UNKNOWN_COMPONENT: "formio.unknown-component",

  // We guessed at a mapping whose branching semantics we could not verify from
  // the definition alone (e.g. a data grid modelled as a dynamic panel).
  ASSUMED_DATAGRID_MODEL: "formio.assumed-datagrid-model",
  ASSUMED_CONDITIONAL: "formio.assumed-conditional",
  // A currency field's display that could not be carried: an unknown currency code, or a prefix
  // or suffix the currency pattern cannot hold.
  ASSUMED_CURRENCY_FORMAT: "formio.assumed-currency-format",
  // A URL data source whose item template is not a single `{{ item.x }}`, so the choice text is
  // a guess.
  ASSUMED_DATA_SOURCE_TITLE: "formio.assumed-data-source-title",

  // Knowingly discarded: presentation/layout/vendor metadata with no SurveyJS
  // equivalent. Silent unless --verbose.
  DROPPED_STYLING: "formio.dropped-styling",
  DROPPED_VENDOR_META: "formio.dropped-vendor-meta"
} as const;
