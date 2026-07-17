---
title: ISaveToJSONOptions
product: Form Library
api-type: interface
description: An interface with configuration options that control how a `SurveyModel` instance is serialized by the `toJSON()` method.
source: https://surveyjs.io/form-library/documentation/api-reference/isavetojsonoptions
---

# `ISaveToJSONOptions`

An interface with configuration options that control how a `SurveyModel` instance is serialized by the [`toJSON()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#toJSON) method.

## Properties

### `locales`

**Type**: `string[]`

Specifies the locales to include in the exported JSON schema. Applies only when [`storeLocaleStrings`](#storeLocaleStrings) is `true` or `"stringsOnly"`.

### `storeDefaults`

**Type**: `boolean`

Specifies whether the exported JSON schema should include properties whose values are equal to their defaults.

Default value: `false`

### `storeLocaleStrings`

**Type**: `boolean | "stringsOnly"`

Specifies how locale-specific strings are handled during JSON export.

Possible values:

- `true` (default)\
Export the full JSON schema, including all locale strings. Use the [`locales`](#locales) array to restrict the output to specific locales.
- `false`\
Export the JSON schema without any textual content.
- `"stringsOnly"`\
Export a JSON schema that contains only locale strings and the minimal set of properties required to identify survey elements. Use the [`locales`](#locales) array to restrict the output to specific locales. To apply a locale-strings-only schema to a survey model, call the [`mergeLocalizationJSON(json, locales)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#mergeLocalizationJSON) method.

> As an alternative to calling `toJSON()` with `"stringsOnly"`, you can call the [`getLocalizationJSON(locales)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#getLocalizationJSON) method, which is syntactic sugar.
