// Stable report codes for the JSON Schema (family) converter. NEVER rename a
// code without a REPORT_VERSION bump.

export const JsonSchemaCodes = {
  // A JSON Schema keyword we do not have a rule for yet. Our gap.
  UNSUPPORTED_KEYWORD: "json-schema.unsupported-keyword",

  // Composition keywords whose modelling is decided-and-documented per the
  // converter doc, but which we flag as `assumed` when the target structure
  // (question / panel / page) is inferred rather than dictated by the schema.
  ASSUMED_IF_THEN_ELSE: "json-schema.assumed-if-then-else",
  ASSUMED_ONEOF_DISCRIMINATOR: "json-schema.assumed-oneof-discriminator",
  ASSUMED_DEPENDENCIES: "json-schema.assumed-dependencies",
  ASSUMED_ALLOF_MERGE: "json-schema.assumed-allof-merge",

  // A UI-layer hint we could not map (RJSF widget, JSONForms renderer option).
  UNSUPPORTED_UI_HINT: "json-schema.unsupported-ui-hint",

  // A key that is neither JSON Schema nor a known UI vocabulary - drift alarm.
  UNKNOWN_KEYWORD: "json-schema.unknown-keyword",

  // Out of scope by design: remote `$ref`, custom renderer components.
  DROPPED_REMOTE_REF: "json-schema.dropped-remote-ref",
  DROPPED_CUSTOM_RENDERER: "json-schema.dropped-custom-renderer",
  DROPPED_STYLING: "json-schema.dropped-styling"
} as const;
