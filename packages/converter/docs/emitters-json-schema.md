---
title: Everything that emits JSON Schema converts to a SurveyJS form
description: OpenAPI 3.1 request bodies, Zod/Yup/TypeBox/Valibot, ngx-formly, Uniforms, RJSF and JSONForms all emit JSON Schema — which survey-converter/json-schema ingests directly. One line each.
---
# Everything that emits JSON Schema converts

You do not need a new tool to get a SurveyJS form out of the JSON Schema you
already have. The [`survey-converter/json-schema`](../README.md#the-report)
converter is the ingest path for **anything that emits JSON Schema** — and a
large part of the ecosystem does. If you can produce a JSON Schema, you are one
function call away from a SurveyJS survey:

```ts
import { convert } from "survey-converter/json-schema";

const { output, report } = convert(jsonSchema);
// output -> SurveyJS survey JSON   report -> what did not round-trip cleanly
```

## Two ways in — migration and ingest

- **Migration** — you are moving off another form stack (RJSF, JSONForms,
  Uniforms) and its data schema comes along. This is the smaller story.
- **Ingest** — the bigger one. JSON Schema is what an LLM emits when you ask it
  for a form definition, and what your backend teams already hold as API request
  contracts. Point either at the converter and you have a live form. This
  compounds with the MCP server / `llms.txt` work — an agent that can emit JSON
  Schema can now emit a working SurveyJS form. See
  [Convert forms from an LLM or an MCP server](#see-also).

## The ceiling — read this first

> **A bare JSON Schema converts to a _flat form_: no multi-page wizard, no
> sections beyond nested objects, and no labels beyond what the schema carries
> (`title` / `description`).**
>
> This is a property of the **format**, not a converter gap. JSON Schema
> describes *data shape*, not *presentation* — so there is nothing to lay a
> wizard out from. The converter maps every field, every validator, and the
> conditional keywords (`if`/`then`, `oneOf` + discriminator, `dependencies`),
> then stops where the schema stops.
>
> Two exceptions carry real layout, and the converter uses it: a **JSONForms UI
> Schema** (`Categorization` → pages, `Group` → panels) and an **RJSF
> `uiSchema`** (widget hints, `ui:order`). Pass those as `{ schema, uiSchema }`.
> Everything else on this page is a **bridge** case and lands as a flat form.

If you expect a Zod schema to produce a laid-out multi-page wizard, it will not —
and that is correct. Add the layout in the SurveyJS Creator after import.

## The list — one line each

Every row below emits JSON Schema, so every row already converts. The only work
is getting to the schema; the conversion is always the same `convert(schema)`.

### OpenAPI 3.1 request bodies

The largest population here by an order of magnitude, and the canonical "our
backend already has this" case. **OpenAPI 3.1 _is_ JSON Schema 2020-12** — the
request-body schema is a JSON Schema with no translation step. Pull it straight
out of the operation:

```ts
import { convert } from "survey-converter/json-schema";

const schema = openapi.paths["/support/tickets"].post
  .requestBody.content["application/json"].schema;

const { output } = convert(schema);
```

Runnable demo below → [Try it](#demo).

### Zod, Yup, TypeBox, Valibot — via their JSON Schema bridges

Validation libraries define your data shape in code; each has a bridge (or is
already JSON Schema) that hands you a JSON Schema to convert.

```ts
// Zod  — npm i zod-to-json-schema
import { zodToJsonSchema } from "zod-to-json-schema";
convert(zodToJsonSchema(myZodSchema));

// Valibot — npm i @valibot/to-json-schema
import { toJsonSchema } from "@valibot/to-json-schema";
convert(toJsonSchema(myValibotSchema));

// Yup — npm i yup-to-json-schema
import { convertSchema as yupToJsonSchema } from "yup-to-json-schema";
convert(yupToJsonSchema(myYupSchema));

// TypeBox — @sinclair/typebox values ARE JSON Schema, no bridge needed
import { Type } from "@sinclair/typebox";
const T = Type.Object({ email: Type.String({ format: "email" }) });
convert(T);
```

Flat form (see [the ceiling](#the-ceiling--read-this-first)) — these formats
carry validation and field names, not layout.

### ngx-formly — JSON Schema mode

`@ngx-formly/core/json-schema` drives Formly from a JSON Schema. That schema is
the ingest artifact:

```ts
// The schema you pass to Formly's JSON Schema mode is a plain JSON Schema.
convert(mySchema); // the same object handed to <formly-json-schema [schema]="...">
```

> Native `ngx-formly` `FormlyFieldConfig` (the `.ts` field-config closures) is
> **not** JSON and does not convert — see [Not on this page](#not-on-this-page).

### Uniforms — JSON Schema bridge

Uniforms' `JSONSchemaBridge` wraps a JSON Schema. Convert the schema you gave the
bridge:

```ts
// new JSONSchemaBridge({ schema, validator }) — convert that same `schema`.
convert(schema);
```

Uniforms carries no serializable layout, so its ceiling is a flat form from the
data schema. (Uniforms' GraphQL and SimpleSchema bridges are **not** JSON Schema
— see [Not on this page](#not-on-this-page).)

### RJSF and JSONForms — the data schema

The UI layer of RJSF / JSONForms is covered by the
[JSON Schema converter itself](../README.md) (pass the `uiSchema` and it becomes
pages, panels, widget hints and ordering). The **bare data schema** — no UI
layer — is the flat-form case and lives here:

```ts
// bare data schema -> flat form
convert(rjsfSchema);

// data schema + presentation -> layout is honored
convert({ schema: rjsfSchema, uiSchema });          // RJSF ui:widget / ui:order
convert({ schema, uiSchema: jsonFormsUiSchema });   // JSONForms Categorization/Group
```

## The report tells you what it assumed

`convert()` never throws on a construct it cannot map exactly — it records it.
Read the `report` after every conversion; the codes that matter most are
`assumed` (renders right, may branch wrong — review these) and `unknown` (a key
that is neither JSON Schema nor a known UI vocabulary — a drift alarm). The
report is **content-free**: stable codes, structural pointers, and counts, never
a fragment of your form. See [the report contract](../README.md#the-report).

## Demo

Paste an OpenAPI 3.1 operation, get the converted SurveyJS JSON, the conversion
report, and a live rendered survey. Runnable, in-repo:

**[`demo/openapi-to-surveyjs.html`](./demo/openapi-to-surveyjs.html)** — open it
in a browser (it loads `survey-core` + `survey-js-ui` from the CDN and the local
converter bundle).

The whole integration is the schema-extraction glue plus one `convert()` call:

```js
// Pull requestBody.content["application/json"].schema out of the OpenAPI doc...
const schema = openapiDoc.paths["/support/tickets"].post
  .requestBody.content["application/json"].schema;

// ...convert it...
const { output, report } = SurveyConverterJsonSchema.convert(schema);

// ...and render the result with the standard SurveyJS Form Library.
const survey = new Survey.Model(output);
survey.render(document.getElementById("surveyContainer"));
```

For example, this OpenAPI 3.1 request body:

```jsonc
{
  "title": "Support Ticket",
  "type": "object",
  "required": ["subject", "severity"],
  "properties": {
    "subject":          { "type": "string",  "title": "Subject", "maxLength": 120 },
    "severity":         { "type": "string",  "title": "Severity", "enum": ["low", "normal", "high", "urgent"] },
    "description":      { "type": "string",  "title": "What happened?" },
    "contactEmail":     { "type": "string",  "title": "Contact email", "format": "email" },
    "affectedUsers":    { "type": "integer", "title": "Affected users", "minimum": 1 },
    "consentToContact": { "type": "boolean", "title": "You may contact me" }
  }
}
```

converts to a six-question SurveyJS form — `text` (with a `maxLength` validator),
a `dropdown` of the four severities, a `text`, an `email`-typed `text`, a
number-typed `text` (with a `minValue` validator), and a `boolean` — that
constructs in `survey-core` with **zero errors** and an **empty report** (every
construct mapped cleanly).

## Not on this page

These do **not** emit JSON Schema, so they do **not** convert here. If you ask
"does my X convert?" and X is on this list, the honest answer is no:

| Source | Why it is out |
| --- | --- |
| Native `ngx-formly` `FormlyFieldConfig` | `.ts` field-config closures — code, not JSON |
| Uniforms GraphQL / SimpleSchema bridges | not JSON Schema (different schema languages) |
| Formily | `x-*` vocabulary — a different format, would be a different converter |
| Typeform / Jotform / Google Forms | SaaS exports — a different format and a ToS question |

`survey-converter` also has a [Form.io converter](../README.md); that is a
separate format, not JSON Schema.

## See also

- **[survey-converter README](../README.md)** — install, the report contract,
  the CLI, and the full JSON Schema modelling rules (`if`/`then`, `oneOf` +
  discriminator, `allOf`, `$ref`, `dependencies`).
- **Convert forms from an LLM or an MCP server** *(MCP / `llms.txt` page —
  forthcoming)* — the ingest story: an agent emits JSON Schema, this converter
  turns it into a working form.
