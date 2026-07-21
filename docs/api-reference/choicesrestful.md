---
title: ChoicesRestful
product: Form Library
api-type: class
description: Configures access to a RESTful service that returns choices for Checkbox, Dropdown, Radiogroup, and other multiple-choice question types.
source: https://surveyjs.io/form-library/documentation/api-reference/choicesrestful
---

# `ChoicesRestful`

Configures access to a RESTful service that returns choices for [Checkbox](https://surveyjs.io/Examples/Library?id=questiontype-checkbox), [Dropdown](https://surveyjs.io/Examples/Library?id=questiontype-dropdown), [Radiogroup](https://surveyjs.io/Examples/Library?id=questiontype-radiogroup), and other multiple-choice question types.

Use the following properties to configure this object:

```js
{
  url: "http://...", // A RESTful service's URL.
  valueName: "value", // Specifies which field contains choice values.
  titleName: "title", // Specifies which field contains display texts for choice values.
  imageLinkName: "imageUrl", // Specifies which field contains image URLs. Used in Image Picker questions.
  // Path to the array of choices. Specify `path` only if the array of choices is nested within the object returned by the service.
  // The following path separators are allowed: semicolon `;`, comma `,`.
  path: "myNestedArray"
}
```

Typically, you should assign this object to a question's [`choicesByUrl`](https://surveyjs.io/Documentation/Library?id=QuestionSelectBase#choicesByUrl) property. You can also specify additional application-wide settings using the [`settings.web`](https://surveyjs.io/form-library/documentation/api-reference/settings#web) object.

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; `ChoicesRestful`

## Properties

### `allowEmptyResponse`

**Type**: `boolean`

Specifies whether the service is allowed to return an empty response or an empty array in a response.

Default value: `false`

### `attachData`

**Type**: `boolean`

Specifies whether to attach original data objects to choice items.

Default value: `false`

If you enable this property, original data objects will be stored in the `data` property of choice items. For instance, the following code shows how to access a data object of a selected choice item in a Dropdown question:

```js
import { Model } from "survey-core";

const surveyJson = {
  "elements": [{
    "type": "dropdown",
    "name": "country",
    "title": "Select a country",
    "choicesByUrl": {
      "url": "https://surveyjs.io/api/CountriesExample",
      "valueName": "name",
      "attachData": true
    }
  }]
}

const survey = new Model(surveyJson);

function retrieveItemData(survey, qName) {
  const q = survey.getQuestionByName(qName);
  if (q && q.selectedItem) {
    return q.selectedItem.data;
  }
  return null;
}
```

Available since: v2.0.7

### `imageLinkName`

**Type**: `string`

Specifies which property in the obtained data object contains image URLs. Used only in [Image Picker](https://surveyjs.io/Examples/Library?id=questiontype-imagepicker) questions.

**Related APIs:** [`url`](#url), [`path`](#path), [`valueName`](#valueName)

### `path`

**Type**: `string`

Path to the array of choices. The following path separators are allowed: semicolon `;`, comma `,`.

Specify this property only if the array of choices is nested within the object returned by the service. For example, the service returns the following object:

```js
{
  countries: [ ... ],
  capitals: [ ... ]
}
```

To populate choices with values from the `countries` array, set the `path` property to `"countries"`. To use the `capitals` array, set this property to `"capitals"`.

**Related APIs:** [`url`](#url), [`valueName`](#valueName), [`titleName`](#titleName)

### `titleName`

**Type**: `string`

Specifies which property in the obtained data object contains display texts for choices.

**Related APIs:** [`url`](#url), [`path`](#path), [`valueName`](#valueName)

### `url`

**Type**: `string`

A RESTful service's URL.

This property supports [dynamic URLs](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-logic#dynamic-texts). For example, the URL below depends on the `region` question's value. When the value changes, the survey automatically loads a new dataset that corresponds to the selected region.

```js
url: "https://surveyjs.io/api/CountriesExample?region={region}"
```

[View Demo](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull (linkStyle))

**Related APIs:** [`path`](#path), [`valueName`](#valueName), [`titleName`](#titleName)

### `valueName`

**Type**: `string`

Specifies which property in the obtained data object contains choice values.

[View Demo](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull (linkStyle))

**Related APIs:** [`url`](#url), [`path`](#path), [`titleName`](#titleName)
