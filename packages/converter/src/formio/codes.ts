// Stable report codes for the Form.io converter. NEVER rename a code without a
// REPORT_VERSION bump - telemetry and the Creator plugin key off these strings.
// Add new codes; do not repurpose old ones.

export const FormioCodes = {
  // A component `type` we do not have a mapping for yet. Our gap.
  UNSUPPORTED_COMPONENT: "formio.unsupported-component",
  // `multiple` on a text-like field: SurveyJS `text` and `comment` hold one value, so the field
  // keeps one input.
  UNSUPPORTED_MULTIPLE: "formio.unsupported-multiple",
  // A `select` whose choices come from a resource or custom code, inline JSON that gives no
  // choice for some item, or a URL the form cannot call as written (an interpolation that is not
  // a field, authentication, request headers).
  UNSUPPORTED_DATA_SOURCE: "formio.unsupported-data-source",
  // A component option set to something other than Form.io's default that SurveyJS cannot express
  // (word counts, `unique`, a server storage, an input mask with tokens survey-core lacks, ...).
  // The field converts without it; the pointer names the option.
  UNSUPPORTED_OPTION: "formio.unsupported-option",

  // `customConditional` / `validate.custom`: arbitrary JS. We REFUSE to parse
  // it - path and count only, never the source string (content-free rule).
  CUSTOM_CONDITIONAL: "formio.custom-conditional",
  CUSTOM_VALIDATION: "formio.custom-validation",
  // `logic`: rules and actions that change the form at run time.
  CUSTOM_LOGIC: "formio.custom-logic",
  // `calculateValue` / `customDefaultValue`: code or JSON logic that computes a value.
  CUSTOM_VALUE: "formio.custom-value",
  // A `{{ ... }}` in an HTML or content component that is not a plain `data.x` path to a field.
  // Form.io evaluates it as a template; the text is kept as written.
  CUSTOM_TEMPLATE: "formio.custom-template",

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
  // A URL or inline JSON data source whose item template is not a single `{{ item.x }}`, so the
  // choice text is a guess.
  ASSUMED_DATA_SOURCE_TITLE: "formio.assumed-data-source-title",
  // A `container` stores its fields' data under its own key, and a nested `form` with inline
  // components under `<key>.data`; its panel keeps the fields at the level around it, so the data
  // has another shape.
  ASSUMED_CONTAINER_DATA: "formio.assumed-container-data",
  // A date or time default in a format that does not parse to the input's ISO value, so the field
  // gets no default.
  ASSUMED_DEFAULT_VALUE: "formio.assumed-default-value",

  // Knowingly discarded: presentation/layout/vendor metadata with no SurveyJS
  // equivalent. Silent unless --verbose.
  DROPPED_STYLING: "formio.dropped-styling",
  DROPPED_VENDOR_META: "formio.dropped-vendor-meta"
} as const;
