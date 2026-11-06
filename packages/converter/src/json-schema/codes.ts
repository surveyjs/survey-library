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
  // An exclusive bound on a `number`: survey-core's numeric validator is inclusive, so a value
  // equal to the bound is accepted.
  ASSUMED_EXCLUSIVE_BOUND: "json-schema.assumed-exclusive-bound",
  // A JSONForms `rule` that could not be expressed, names a scope with no Control, or sits on a node
  // with no element (the flattened root layout). The element stays visible and enabled.
  ASSUMED_UI_RULE: "json-schema.assumed-ui-rule",
  // A JSONForms Control on a nested scope (`#/properties/a/properties/b`) outside the object's own
  // detail: survey-core keeps a question's value under one key of the form (or of the row), so the
  // value is stored under the question's name, not at `a.b`.
  ASSUMED_NESTED_SCOPE: "json-schema.assumed-nested-scope",

  // A UI-layer hint we could not map (RJSF widget, JSONForms renderer option).
  UNSUPPORTED_UI_HINT: "json-schema.unsupported-ui-hint",

  // Keys a schema leaves free, which no question holds. An object that declares no `properties` (a
  // free-form object, or one whose keys come only from `additionalProperties` / `patternProperties`)
  // is reported at the object: its panel, or its dynamic panel's rows, stay empty, and JSONForms and
  // RJSF render an empty group there, RJSF with an "Add" button when either keyword is set. Beside
  // `properties`, the keyword itself is reported. A key an object's `required` lists that none of its
  // schemas declares (or, in a JSONForms object Control's walk, that only a branch declares) has no
  // question either, and is reported at its place in the list (`.../required/<i>`).
  UNSUPPORTED_FREE_FORM_OBJECT: "json-schema.unsupported-free-form-object",

  // A key that is neither JSON Schema nor a known UI vocabulary - drift alarm.
  UNKNOWN_KEYWORD: "json-schema.unknown-keyword",

  // A JSONForms Control whose `scope` resolves to nothing in the schema, so it gives no question.
  UNRESOLVED_SCOPE: "json-schema.unresolved-scope",

  // A `$ref` that names nothing in the document: a pointer, or the fragment of an `$id` the document
  // declares, that resolves nowhere, or a cycle of refs. The converter cannot follow it, and the
  // property is a bare `text`.
  UNRESOLVED_REF: "json-schema.unresolved-ref",

  // Out of scope by design: remote `$ref`, custom renderer components.
  DROPPED_REMOTE_REF: "json-schema.dropped-remote-ref",
  DROPPED_CUSTOM_RENDERER: "json-schema.dropped-custom-renderer",
  DROPPED_STYLING: "json-schema.dropped-styling"
} as const;
