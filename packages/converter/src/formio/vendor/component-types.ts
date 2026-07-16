// Vendored snapshot of the built-in Form.io component `type` values.
//
// Form.io has NO published JSON Schema of its form definition; the authoritative
// shape is the TypeScript types in `@formio/core`. Rather than add `@formio/core`
// as a dependency (zero runtime deps, and we do not want to track their release
// train), we freeze the set of component types they ship here and diff it on a
// schedule (see `promts/03-eval-corpus.md`, "vendored-schema diff").
//
// This set is what powers the `unknown` vs `unsupported` distinction:
//   - a `type` IN this set that `index.ts` has no mapping for  -> `unsupported`
//     (our backlog: Form.io defines it, we have not written the rule).
//   - a `type` NOT in this set                                 -> `unknown`
//     (the drift alarm: Form.io shipped something new, or the form uses a
//     custom / vendor component).
//
// Source: `@formio/core` builtin component modules (Components + Layout +
// Premium builtins commonly present in exported forms). Snapshot ref recorded
// in `vendor.snapshot.json`. DO NOT edit by hand to silence an alarm -- a new
// upstream type is a signal, not a bug: add a mapping in `index.ts` and let the
// diff job (step 03) refresh this list.

/** The frozen set of Form.io builtin component `type` values. */
export const KNOWN_FORMIO_COMPONENT_TYPES: ReadonlySet<string> = new Set([
  // Basic inputs
  "textfield",
  "textarea",
  "number",
  "password",
  "checkbox",
  "selectboxes",
  "select",
  "radio",
  "button",
  // Advanced inputs
  "email",
  "url",
  "phoneNumber",
  "tags",
  "address",
  "datetime",
  "day",
  "time",
  "currency",
  "survey",
  "signature",
  // Layout / containers
  "htmlelement",
  "content",
  "columns",
  "fieldset",
  "panel",
  "table",
  "tabs",
  "well",
  "container",
  // Data
  "datagrid",
  "editgrid",
  "datamap",
  "tree",
  // Premium / misc that still appear in exported forms
  "file",
  "hidden",
  "form",
  "recaptcha",
  "resource",
  "sketchpad",
  "select2",
  "nested",
  // `custom`: a user-defined component slot. Added from a Job B vendored-diff
  // alert (see promts/03-eval-corpus.md); it ships upstream in formio.js.
  "custom"
]);

/** True when Form.io defines this component type (i.e. it is not format drift). */
export function isKnownFormioType(type: string): boolean {
  return KNOWN_FORMIO_COMPONENT_TYPES.has(type);
}
