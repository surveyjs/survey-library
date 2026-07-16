// Stable report codes for the Form.io converter. NEVER rename a code without a
// REPORT_VERSION bump - telemetry and the Creator plugin key off these strings.
// Add new codes; do not repurpose old ones.

export const FormioCodes = {
  // A component `type` we do not have a mapping for yet. Our gap.
  UNSUPPORTED_COMPONENT: "formio.unsupported-component",

  // `customConditional` / `validate.custom`: arbitrary JS. We REFUSE to parse
  // it - path and count only, never the source string (content-free rule).
  CUSTOM_CONDITIONAL: "formio.custom-conditional",
  CUSTOM_VALIDATION: "formio.custom-validation",

  // A key present on a component that is not in the vendored @formio/core
  // types snapshot. Format drift or a vendor/custom extension - the drift
  // alarm, distinct from UNSUPPORTED_COMPONENT.
  UNKNOWN_KEY: "formio.unknown-key",
  UNKNOWN_COMPONENT: "formio.unknown-component",

  // We guessed at a mapping whose branching semantics we could not verify from
  // the definition alone (e.g. a data grid modelled as a dynamic panel).
  ASSUMED_DATAGRID_MODEL: "formio.assumed-datagrid-model",
  ASSUMED_CONDITIONAL: "formio.assumed-conditional",

  // Knowingly discarded: presentation/layout/vendor metadata with no SurveyJS
  // equivalent. Silent unless --verbose.
  DROPPED_STYLING: "formio.dropped-styling",
  DROPPED_VENDOR_META: "formio.dropped-vendor-meta"
} as const;
