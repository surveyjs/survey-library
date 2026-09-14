---
title: Survey JSON Validation | SurveyJS Form Libraries
description: Learn how to validate Survey JSON schemas with the SurveyJS model, the SurveyJS Linter, and a server-side JSON Schema Validator.
---

# Survey JSON Validation

Survey JSON validation checks whether a form definition is structurally valid and whether its logic can be resolved before you render the form or store it. Early validation helps prevent silently hidden questions, broken navigation, empty choice lists, and conditions that never fire.

SurveyJS provides several complementary ways to validate a survey JSON schema:

- [Use the SurveyJS model](#validate-survey-json-with-a-survey-model) to detect unknown properties and element types while loading a schema.
- [Use the SurveyJS Linter](#use-the-surveyjs-linter) to find static logic defects such as broken references, dead conditions, and cycles.
- [Deploy the SurveyJS JSON Schema Validator on your server](#validate-survey-json-on-your-server) to validate schemas and user responses through an HTTP API.

## Validate Survey JSON with a Survey Model

Pass a survey JSON schema to the [`Model`](/form-library/documentation/api-reference/survey-data-model) constructor to create a model. The Form Library checks the schema for unknown properties and element types while loading it. Inspect the [`jsonErrors`](/form-library/documentation/api-reference/survey-data-model#jsonErrors) array to access these errors:

```js
import { Model } from "survey-core";

const surveyJson = {
  elements: [{
    type: "text",
    name: "email",
    visiblIf: "{consent} = true"
  }]
};

const survey = new Model(surveyJson);

if (Array.isArray(survey.jsonErrors) && survey.jsonErrors.length > 0) {
  console.error(survey.jsonErrors);
}
```

Model validation does not detect logic defects. In particular, a `visibleIf` expression that references a missing question can load without a model error. To check the JSON schema for logic errors, use the linter or server validator after model validation.

## Use the SurveyJS Linter

> Available in `survey-core` version 3.0.3 and later.

The SurveyJS Linter statically analyzes a survey JSON schema and reports logic defects before the survey reaches runtime.

The linter can find:

- Misspelled question references
- Conditions that can never be true
- Calculated-value and trigger cycles
- Invalid choice comparisons
- Other issues that are not reported by [model validation](#validate-survey-json-with-a-survey-model)

The linter uses pure functions: they analyze the survey JSON without building a survey model, return findings, and do not modify the input.

### Import the Linter

Import linter functions from the `survey-core/linter` entry point:

```js
import { lintSurvey, renderFindings, getRules } from "survey-core/linter";
```

### Run a Basic Check

To lint a survey JSON schema, pass it to the `lintSurvey` function.

The example below contains a typo in the `visibleIf` expression. The linter reports `reference/unknown` and suggests `hasInsurance`.

```js
import { lintSurvey, renderFindings } from "survey-core/linter";

const surveyJson = {
  pages: [{
    name: "page1",
    elements: [
      {
        type: "radiogroup",
        name: "hasInsurance",
        choices: ["yes", "no"]
      },
      {
        type: "text",
        name: "provider",
        visibleIf: "{hasInsurnce} = 'yes'"
      }
    ]
  }]
};

const result = lintSurvey(surveyJson);

if (result.errorCount > 0) {
  console.log(renderFindings(result));
}
```

If the survey JSON schema comes as a string, parse it before passing it to `lintSurvey`:

```js
const surveyJson = JSON.parse(text);
const result = lintSurvey(surveyJson);
```

### Read Lint Results

`lintSurvey` returns an object with the following properties:

| Property | Description |
| --- | --- |
| `findings` | Findings that were not suppressed, sorted by JSON path and then rule ID. |
| `errorCount` | Number of findings with `error` severity. |
| `warningCount` | Number of findings with `warning` severity. |
| `infoCount` | Number of findings with `info` severity. |
| `suppressedCount` | Number of findings filtered out by suppressions. |
| `suppressed` | Suppressed findings, returned only when `reportSuppressed` is `true`. |

Each finding is an object with the following properties:

| Property | Description |
| --- | --- |
| `ruleId` | ID of the rule that reported the finding. |
| `severity` | Finding severity: `error`, `warning`, or `info`. |
| `message` | Human-readable description of the issue. |
| `path` | Path to the affected value in the survey JSON (for example `pages[0].elements[1].visibleIf` or `triggers[0].setToName`). |
| `elementName` | Name of the affected survey element, if available. |
| `elementType` | Type of the affected survey element, if available. |
| `suggestion` | Suggested fix, if available. |
| `related` | Related elements or paths, if available. |
| `reproduction` | Reproduction steps or details that demonstrate the finding, if available. |

Use `renderFindings` to produce a human-readable report:

```js
console.log(renderFindings(result));
```

### Linter Rules

All rules are enabled by default.

| Rule ID | Default severity | Detects |
| --- | --- | --- |
| `choices/dead-source` | Error | `choicesFromQuestion` or related properties that cannot supply choices. |
| `cycle/calculated-value` | Error | Calculated values that depend on one another in a cycle. |
| `cycle/trigger` | Warning | Triggers that react to values set by other triggers in a loop. |
| `element/unknown-type` | Info | An unregistered question or element type. |
| `expression/syntax` | Error | Expressions that cannot be parsed. |
| `expression/type-mismatch` | Warning | Operators applied to incompatible value shapes. |
| `expression/unknown-choice` | Warning | Conditions compared with a value that is not among a question's choices. |
| `expression/unknown-function` | Warning | Calls to functions that are not registered or declared as known. |
| `name/duplicate` | Error | Duplicate element names or a name shared by an element and a calculated value. |
| `page/empty` | Warning | Pages or panels with nothing that can ever render. |
| `reference/self` | Error | A `visibleIf`, `enableIf`, or `requiredIf` that references its own element. |
| `reference/unknown` | Error | References to missing questions, panels, pages, calculated values, or variables. |
| `trigger/unknown-target` | Error | Triggers that target a missing question, page, or variable. |
| `trigger/unknown-type` | Warning | Unknown or missing trigger types. |

#### Configure Rule Severity

Rules support the following severity values:

- `"error"`
- `"warning"`
- `"info"`
- `"off"`

Errors indicate that an expression or reference cannot be evaluated. Warnings often indicate a condition that evaluates but cannot produce the intended result. Info findings usually mean that the linter needs more information about a custom type.

Use `getRules()` if you need to access the installed rule registry as `{ id, defaultSeverity }` pairs.

To override severity for individual rules or disable a rule, specify the `rules` config in the options object passed as the second argument to `lintSurvey`:

```js
const result = lintSurvey(surveyJson, {
  rules: {
    "page/empty": "off",
    "expression/type-mismatch": "error"
  }
});
```

#### Configure Suppressed Rules

Suppressed rules are checked but not included in findings by default and do not break the build.

To configure a suppressed rule, specify its `ruleId`, `elementName` (case-insensitive), and/or `path`. All specified fields must match for the suppression to trigger. A path ending in `.*` matches that path and everything below it.

Suppressed findings are counted in `suppressedCount`. Add `reportSuppressed: true` to inspect them in `result.suppressed` and include them in rendered output when needed:

```js
const result = lintSurvey(surveyJson, {
  suppress: [
    { ruleId: "reference/unknown", elementName: "legacyPatientId" },
    { ruleId: "page/empty", path: "pages[2].*" }
  ],
  reportSuppressed: true
});

console.log(renderFindings(result, { includeSuppressed: true }));
```

> Prefer a narrow suppression with a reason over disabling a rule globally.

### Handle Custom Variables, Functions, and Components

The linter reads customizations from the current `survey-core` process. Register custom functions and components before calling `lintSurvey`:

```js
import { ComponentCollection, FunctionFactory } from "survey-core";
import { lintSurvey } from "survey-core/linter";

FunctionFactory.Instance.register("scoreSection", (params) => {
  // ...
  return params[0];
});

const result = lintSurvey(surveyJson);
```

If linting runs in a separate process, declare runtime-provided names through options instead:

- `knownVariables` resolves references such as `{userRole}` and trigger targets.
- `knownFunctions` prevents custom function calls from being reported as unknown.
- `components` lets the linter resolve paths into specialized and composite questions, such as `{fn.firstName}`.

```js
const result = lintSurvey(surveyJson, {
  knownVariables: ["userRole", "tenant.plan"],
  knownFunctions: ["scoreSection"],
  components: {
    fullname: {
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName" }
      ]
    }
  }
});
```

### Add Linting to a Workflow

#### Lint Survey JSON Files with Node.js

The linter doesn't provide a built-in CLI, but you can create a Node script to run it and output errors and warnings:

```js
// scripts/lint-surveys.mjs
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { lintSurvey, renderFindings } from "survey-core/linter";

const directory = "surveys";
let failed = 0;

for (const entry of await readdir(directory, { recursive: true })) {
  if (!entry.endsWith(".json")) continue;

  const file = join(directory, entry);
  let surveyJson;

  try {
    surveyJson = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    console.error(`${file}: invalid JSON`);
    failed++;
    continue;
  }

  let result;
  try {
    result = lintSurvey(surveyJson);
  } catch (error) {
    console.error(`${file}: expected a Survey JSON object`);
    failed++;
    continue;
  }

  if (result.findings.length === 0) continue;
  console.log(`\n${file}`);
  console.log(renderFindings(result));
  if (result.errorCount > 0) failed++;
}

process.exit(failed > 0 ? 1 : 0);
```

Add this script to the `scripts` section of your `package.json` to run the survey JSON linter with an npm command:

```json
{
  "scripts": {
    "lint:surveys": "node scripts/lint-surveys.mjs"
  }
}
```

#### Run Linting in CI

Run the same Node script in CI after dependencies are installed:

```yaml
- run: npm ci
- run: npm run lint:surveys
```

Since finding order is stable (results are sorted by path and then rule ID), CI output artifacts are easy to compare between runs.

## Validate Survey JSON on Your Server

SurveyJS provides the [JSON Schema Validator](https://github.com/surveyjs/surveyjs-json-schema-validator), which is an open-source backend service that you can deploy as part of your own infrastructure. It validates SurveyJS schemas for structural, syntactic, and logical errors and verifies that user responses conform to those schemas, including required questions and data types.

### Run the Service

Install dependencies and start the service locally:

```sh
npm i
npm run dev
```

The service is available at `http://localhost:3000`. You can also deploy it with Docker:

```sh
docker build -t surveyjs-json-schema-validator .
docker run -d -p 3000:3000 surveyjs-json-schema-validator
```

Refer to the [repository README](https://github.com/surveyjs/surveyjs-json-schema-validator) for the latest deployment instructions.

### Validate a Schema

Send a survey JSON schema in the body of a `POST` request to the `/schema` endpoint. The service returns an empty object when the schema is valid. If validation fails, the response contains an `errors` array that describes the detected issues.

```js
const surveyJson = {
  elements: [{
    type: "text",
    name: "email",
    isRequired: true
  }]
};

fetch("http://localhost:3000/schema", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(surveyJson)
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Request failed:", error));
```

### Validate a User Response

Send the schema and the response object in a `POST` request to the `/response` endpoint. The service returns validation errors when the response does not satisfy the schema requirements.

```js
const userResponse = {
  email: "user@example.com"
};

fetch("http://localhost:3000/response", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    schema: surveyJson,
    response: userResponse
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Request failed:", error));
```

## Combine the Validation Checks

All the checks described above serve different purposes:

| Check | Use it to find |
| --- | --- |
| [Model validation](#validate-survey-json-with-a-survey-model) (`jsonErrors`) | Unknown properties and unknown element types encountered while loading the schema. |
| [Linter](#use-the-surveyjs-linter) (`lintSurvey`) | Broken references, dead conditions, cycles, invalid choice comparisons, and other static logic defects. |
| [SurveyJS JSON Schema Validator](#validate-survey-json-on-your-server) | Structural, syntactic, and logical schema errors, plus user-response errors when called through its `/response` endpoint. |

Combine these checks when implementing a survey JSON validation workflow. For example, the linter does not detect a misspelled property such as `visiblIf`, but `jsonErrors` reports it as an unknown property. On the other hand, the linter checks the schema for logical issues.

## See Also

- [Data Validation](/form-library/documentation/data-validation)
- [Conditional Logic and Dynamic Texts](/form-library/documentation/design-survey/conditional-logic)
