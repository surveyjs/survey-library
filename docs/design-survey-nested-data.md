---
title: Nested Data: Store Panel and Page Values in Objects | SurveyJS Form Libraries
description: Set a panel's or page's valueName to store its questions' values in a nested object, or use the dataNesting survey property to nest every panel and page.
---
# Nested Data: Store Panel and Page Values in Objects

By default, survey results are flat: every question stores its value in a top-level property of the [`data`](/form-library/documentation/api-reference/survey-data-model#data) object, even when the question is inside a panel or on a separate page. If your server, database, or JSON schema expects a nested structure, you can make a panel or a page store the values of its questions in an object.

- [Nest a Panel or a Page](#nest-a-panel-or-a-page)
- [Nest Every Panel or Page](#nest-every-panel-or-page)
- [Nest a Panel Inside Dynamic Panel or a Matrix Detail Panel](#nest-a-panel-inside-dynamic-panel-or-a-matrix-detail-panel)
- [Access Nested Values in Code](#access-nested-values-in-code)
- [Nested Values in Expressions](#nested-values-in-expressions)
- [Clear and Validate Nested Values](#clear-and-validate-nested-values)
- [Structured Data Views](#structured-data-views)
- [Limitations](#limitations)
- [Compatibility](#compatibility)

## Nest a Panel or a Page

Set the `valueName` property of a panel or a page. The questions inside it store their values in an object, and `valueName` is the name of the property that holds this object:

```js
const surveyJson = {
  "elements": [{
    "type": "text",
    "name": "fullName"
  }, {
    "type": "panel",
    "name": "addressPanel",
    "valueName": "address",
    "elements": [
      { "type": "text", "name": "street" },
      { "type": "text", "name": "city" }
    ]
  }]
};
```

The survey produces the following data:

```js
{
  "fullName": "John Smith",
  "address": {
    "street": "Main St",
    "city": "Oslo"
  }
}
```

This is the shape that `survey.data`, the [`onComplete`](/form-library/documentation/api-reference/survey-data-model#onComplete) event, and your server receive. When you load data into the survey, use the same shape: `survey.data = { address: { street: "Main St" } }` fills the `street` question.

Nesting composes:

- A panel with a `valueName` inside another panel or page with a `valueName` nests further: `{ "page1": { "address": { "street": "Main St" } } }`.
- A panel without a `valueName` is transparent: its questions write into the object of the nearest nesting panel or page, or into the top level of the data.
- A comment or an "Other" text of a nested question is stored inside the object, next to the value: `{ "address": { "kind": "other", "kind-Comment": "Office" } }`.
- A question's own `valueName` works inside the object as usual. A `valueName` that contains a dot (`"a.b"`), on a question or on a panel, is a literal property name, not a path.
- Two panels with the same `valueName` share one object, for example, an address split across two pages: one panel fills `street`, the other `city`.

## Nest Every Panel or Page

The `dataNesting` survey property specifies which panels and pages nest their questions' values:

| `dataNesting` | Panels nest | Pages nest |
|---|---|---|
| `"auto"` (default) | When `valueName` is set | When `valueName` is set |
| `"panel"` | Always, under `valueName` or else under the panel's `name` | When `valueName` is set |
| `"page"` | When `valueName` is set | Always, under `valueName` or else under the page's `name` |
| `"panelAndPage"` | Always, under `valueName` or else under `name` | Always, under `valueName` or else under `name` |
| `"none"` | Never | Never |

`"none"` ignores every `valueName` of panels and pages: the data is flat, exactly as in earlier versions.

The following survey uses the `"panelAndPage"` mode:

```js
const surveyJson = {
  "dataNesting": "panelAndPage",
  "pages": [{
    "name": "page1",
    "elements": [
      { "type": "text", "name": "q1" },
      {
        "type": "panel",
        "name": "panel1",
        "elements": [{ "type": "text", "name": "q2" }]
      }
    ]
  }]
};
```

It produces the following data:

```js
{
  "page1": {
    "q1": "...",
    "panel1": {
      "q2": "..."
    }
  }
}
```

If a page or panel has no `name` in the JSON, it receives a generated name (`page1`, `panel1`) and nests under it. Specify names explicitly to keep property names stable.

## Nest a Panel Inside Dynamic Panel or a Matrix Detail Panel

Dynamic Panel stores each panel's values in an object of its value array, and a matrix stores each row's cell values and detail panel values in an object of its value array. A panel with a `valueName` inside the panel template or the detail panel stores its questions' values in an object inside that record:

```js
const surveyJson = {
  "elements": [{
    "type": "paneldynamic",
    "name": "items",
    "templateElements": [
      { "type": "text", "name": "title" },
      {
        "type": "panel",
        "name": "p1",
        "valueName": "address",
        "elements": [{ "type": "text", "name": "street" }]
      }
    ]
  }]
};
```

The survey produces the following data:

```js
{
  "items": [
    { "title": "A", "address": { "street": "Main St" } }
  ]
}
```

The same panel in the `detailElements` of a matrix with [`detailPanelMode`](/form-library/documentation/api-reference/dynamic-matrix-table-question-model#detailPanelMode) nests inside the row:

```js
const surveyJson = {
  "elements": [{
    "type": "matrixdynamic",
    "name": "rows",
    "detailPanelMode": "underRow",
    "columns": [{ "name": "col1", "cellType": "text", "inputType": "number" }],
    "detailElements": [{
      "type": "panel",
      "name": "p1",
      "valueName": "address",
      "elements": [{ "type": "text", "name": "street" }]
    }]
  }]
};

// Produces:
// { "rows": [{ "col1": 1, "address": { "street": "Main St" } }] }
```

Inside a record, nesting follows these rules:

- Only a panel with a `valueName` nests, in every `dataNesting` mode except `"none"`. The `"panel"`, `"page"`, and `"panelAndPage"` modes do not nest panels inside a record by their names, so a record keeps its shape whatever mode the survey uses. `"none"` keeps the records flat.
- The panel template of Dynamic Panel and the detail panel of a matrix are the record itself: they never nest, even if you set their `valueName` in code. Only the panels inside them do.
- Nesting composes inside a record as at the top level: a panel with a `valueName` inside a nesting panel nests further (`{ "address": { "geo": { "lat": 1 } } }`).

Reference a nested value in a record by a path that starts at the record:

- `{panel.address.street}` inside Dynamic Panel and `{row.address.street}` inside a matrix row. `{panel.address}` and `{row.address}` return the whole object.
- `{prevPanel.address.street}` and `{nextPanel.address.street}` read a neighboring panel, and `{items[0].address.street}` reads a record from outside Dynamic Panel.
- Inside the nesting panel, `{street}` also works, and so does the record: `{panel.title}`.

In Dynamic Panel, `{panel.street}` still finds the nested question by its name, but prefer `{panel.address.street}`. In a matrix, `{row.street}` gives no value: use `{row.address.street}`.

In text piping, the question titles inside the nesting panel can use `{street}`. The nesting panel's own title cannot: as with any panel inside a record, a plain `{street}` there is no field of the record. Use `{panel.address.street}` or `{row.address.street}`.

A question inside a nesting panel is not offered as a field for sorting ([`sortCriteria`](/form-library/documentation/api-reference/dynamic-panel-model#sortCriteria)) or filtering the records. A stored sort criterion that names such a question is ignored, as an unknown field is.

If two Dynamic Panels or matrices share one value (they have the same `valueName`), their templates must nest in the same way. The survey does not reconcile two record shapes: each question reads and writes the record in its own shape.

## Access Nested Values in Code

The survey data API works with top-level properties:

```js
const survey = new Model(surveyJson);

// Read and write a nested value through its question
survey.getQuestionByName("street").value = "Main St";

survey.getValue("address");   // { street: "Main St" }
survey.getValue("street");    // undefined: "street" is not a top-level property
survey.setValue("address", { city: "Oslo" });   // Replaces the object: `street` becomes empty
survey.mergeData({ address: { street: "Main St" } });   // Merges into the object: { street: "Main St", city: "Oslo" }
```

- Use a question's [`value`](/form-library/documentation/api-reference/question#value) and [`comment`](/form-library/documentation/api-reference/question#comment) properties to access a nested value.
- `survey.getQuestionByValueName("street")` returns `null` for a nested question. Use `survey.getQuestionByName("street")`. Question names stay unique across the survey.
- `survey.getComment()` and `survey.setComment()` work with top-level comments only.
- When the object becomes empty, it is removed from the data.
- Properties of the object that no question owns (for example, fields loaded from your server that the form does not display) are kept when respondents edit the questions.

When a respondent changes a nested question, the [`onValueChanging`](/form-library/documentation/api-reference/survey-data-model#onValueChanging) and [`onValueChanged`](/form-library/documentation/api-reference/survey-data-model#onValueChanged) events are raised once. `options.name` is the top-level property (`"address"`), `options.value` is the whole object, and `options.question` is the nested question that changed:

```js
survey.onValueChanged.add((_, options) => {
  // Typing into "street":
  // options.name === "address"
  // options.value === { street: "Main St", city: "Oslo" }
  // options.question.name === "street"
});
```

When you call `survey.setValue("address", ...)` in code, `options.question` is not set.

## Nested Values in Expressions

Expressions and text piping can reference a nested question in two ways:

- By the question name: `{street}`. It works inside and outside the nesting panel.
- By the path: `{address.street}`. A path starts at the top level of the data. Inside a nesting panel or page, it can also start at that container's object.

`{address}` returns the whole object, so you can check it with `{address} notempty`. In text piping, `{address}` displays `[object Object]`: reference the nested questions instead (`{address.street}, {address.city}`). A path to a choice-based question displays the choice text, as `{kind}` does.

```js
const surveyJson = {
  "elements": [{
    "type": "panel",
    "name": "addressPanel",
    "valueName": "address",
    "elements": [
      { "type": "text", "name": "street" },
      { "type": "text", "name": "city" }
    ]
  }, {
    "type": "html",
    "name": "summary",
    "visibleIf": "{address} notempty",
    "html": "Ship to: {address.street}, {city}"
  }]
};
```

Calculated values and triggers read nested values in the same way. The `setToName` and `fromName` properties of `setvalue`, `copyvalue`, and `runexpression` triggers accept a question name (`"street"`), a path (`"address.street"`), or a top-level property (`"address"`).

## Clear and Validate Nested Values

Nested questions are ordinary questions for clearing and validation:

- [`clearInvisibleValues`](/form-library/documentation/api-reference/survey-data-model#clearInvisibleValues) and a question's [`clearIfInvisible`](/form-library/documentation/api-reference/question#clearIfInvisible) remove a hidden question's value from the object. With `"onHiddenContainer"`, hiding the nesting panel removes the values of all its questions. Properties that no question owns stay in the object.
- [`clearIncorrectValues()`](/form-library/documentation/api-reference/survey-data-model#clearIncorrectValues) removes nested values that a question cannot hold, for example, a choice that is not in the `choices` array. `clearIncorrectValues(true)` keeps the nesting objects and removes the properties inside them that no question owns.
- [`setData()`](/form-library/documentation/api-reference/survey-data-model#setData) reports issues inside a nesting object with their path, for example, `unknownProperty` at `address.foo` or `invalidChoiceValue` at `address.kind`.
- A required nested question blocks page navigation and survey completion, and the survey focuses it when it has an error.

## Structured Data Views

The [`getData({ includePages, includePanels })`](/form-library/documentation/api-reference/survey-data-model#getData) method and the `setStructuredData()` method work on top of nested data. A nesting panel or page appears in every view as one property that holds its object, under its key and in place of its name:

```js
const surveyJson = {
  "pages": [{
    "name": "page1",
    "elements": [
      { "type": "text", "name": "q0" },
      {
        "type": "panel",
        "name": "panel1",
        "valueName": "address",
        "elements": [{ "type": "text", "name": "street" }]
      }
    ]
  }]
};
const survey = new Model(surveyJson);

survey.data;
// { q0: "a", address: { street: "Main St" } }
survey.getData({ includePages: true });
// { page1: { q0: "a", address: { street: "Main St" } } }
survey.getData({ includePanels: true });
// { q0: "a", address: { street: "Main St" } }
```

`setStructuredData()` accepts any of these views and restores the question values, including the nesting objects with everything they hold. Comments outside a nesting object and properties that no question owns are not restored.

[`panel.getValue()`](/form-library/documentation/api-reference/panel-model#getValue) and `panel.getDisplayValue()` follow the same rule: a nesting panel returns its object, and a panel or page that does not nest shows a nesting panel inside it as one property.

## Limitations

- A composite question already stores its values in an object of its own. A `valueName` on a panel inside the composite question is ignored, and the `"panel"`, `"page"`, and `"panelAndPage"` modes do not nest the panels inside it. Inside Dynamic Panel and a matrix detail panel, a panel with a `valueName` nests (see [Nest a Panel Inside Dynamic Panel or a Matrix Detail Panel](#nest-a-panel-inside-dynamic-panel-or-a-matrix-detail-panel)).
- `survey.getValue()` and `survey.setValue()` do not accept a path: `survey.getValue("address.street")` returns `undefined`. Use the question's `value` property or `survey.getValue("address")`.
- Expressions have no prefix variable for a nesting panel (similar to `{panel.questionName}` in Dynamic Panel). Use `{questionName}` or the path.
- A question inside a nesting panel inside Dynamic Panel or a matrix detail panel cannot be a sort or filter field of the records.
- If you change a panel's `valueName`, its name in a `"panel"` / `"panelAndPage"` mode, the survey's `dataNesting`, or move a question in or out of a nesting panel at runtime, the existing data stays where it is. The questions read their values from the new location, which is usually empty. To move the data, do it in code:

    ```js
    const value = survey.getValue("address");
    survey.setValue("address", undefined);
    survey.setValue("shippingAddress", value);
    ```

## Compatibility

- Surveys whose panels and pages have no `valueName` produce the same data as before.
- If your application registered a custom `valueName` property for panels or pages, that property now nests the data. To keep the data flat, set `"dataNesting": "none"` in the survey JSON, or change the default once in code:

    ```js
    import { Serializer } from "survey-core";

    Serializer.findProperty("survey", "dataNesting").defaultValue = "none";
    ```

- A survey JSON that already has a `valueName` on a panel inside Dynamic Panel or a matrix detail panel (earlier versions ignored it) now nests the panel's values in an object inside the record. Existing flat data under these questions is no longer read, and `clearIncorrectValues()` removes such flat properties. To keep the earlier shape, set `"dataNesting": "none"` or remove the `valueName`.
- An earlier SurveyJS version does not know the `valueName` property of panels and pages and the `dataNesting` survey property. It reports them in [`jsonErrors`](/form-library/documentation/api-reference/survey-data-model#jsonErrors) and stores the data flat. Nested data loaded into an earlier version does not reach the nested questions.

## See Also

- [Merge Question Values](/form-library/documentation/design-survey-merge-question-values)
- [Access Survey Results](/form-library/documentation/handle-survey-results-access)
- [Conditional Logic and Dynamic Texts](/form-library/documentation/design-survey/conditional-logic)
