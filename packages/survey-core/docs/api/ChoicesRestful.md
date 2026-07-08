---
title: ChoicesRestful
product: Form Library
api-type: class
description: "Configures access to a RESTful service that returns choices for [Checkbox](https://surveyjs.io/Examples/Library?id=questiontype-checkbox), [Dropdown](https://surveyjs.io/Examples/Library?id=questiontype-dropdown), [Radiogroup](https://surveyjs.io/Examples/Library?id=questiontype-radiogroup), and other multiple-choice question types. Use the following properties to configure this object: ```js { url: \"http://...\", // A RESTful service's URL. valueName: \"value\", // Specifies which field contains choice values. titleName: \"title\", // Specifies which field contains display texts for choice values. imageLinkName: \"imageUrl\", // Specifies which field contains image URLs. Used in Image Picker questions. // Path to the array of choices. Specify `path` only if the array of choices is nested within the object returned by the service. // The following path separators are allowed: semicolon `;`, comma `,`. path: \"myNestedArray\" } ``` Typically, you should assign this object to a question's [`choicesByUrl`](https://surveyjs.io/Documentation/Library?id=QuestionSelectBase#choicesByUrl) property. You can also specify additional application-wide settings using the [`settings.web`](https://surveyjs.io/form-library/documentation/api-reference/settings#web) object."
source: 
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

`Base` &rarr; `ChoicesRestful`

## Properties

### `cacheText`

**Type**: `string`

### `noCacheText`

**Type**: `string`

### `EncodeParameters`

**Type**: `boolean`

### `itemsResult`

**Type**: `{ [index: string]: any; }`

### `sendingSameRequests`

**Type**: `{ [index: string]: ChoicesRestful[]; }`

### `onBeforeSendRequest`

**Type**: `(sender: ChoicesRestful, options: IBeforeRequestChoicesOptions) => void`

### `lastObjHash`

**Type**: `string`

### `isRunningValue`

**Type**: `boolean`

### `isUsingCacheFromUrl`

**Type**: `boolean`

### `onProcessedUrlCallback`

**Type**: `(url: string, path: string) => void`

### `getResultCallback`

**Type**: `(items: ItemValue[]) => void`

### `beforeSendRequestCallback`

**Type**: `() => void`

### `updateResultCallback`

**Type**: `(items: ItemValue[], serverResult: any) => ItemValue[]`

### `getItemValueCallback`

**Type**: `(item: any) => any`

### `error`

**Type**: `SurveyError`

### `owner`

**Type**: `IQuestion`

### `createItemValue`

**Type**: `(value: any) => ItemValue`

### `isUsingCache`

**Type**: `boolean`

### `isRunning`

**Type**: `boolean`

### `isWaitingForParameters`

**Type**: `boolean`

### `isEmpty`

**Type**: `boolean`

### `url`

A RESTful service's URL.

This property supports [dynamic URLs](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-logic#dynamic-texts). For example, the URL below depends on the `region` question's value. When the value changes, the survey automatically loads a new dataset that corresponds to the selected region.

```js
url: "https://surveyjs.io/api/CountriesExample?region={region}"
```

[View Demo](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull (linkStyle))

**Type**: `string`

### `path`

Path to the array of choices. The following path separators are allowed: semicolon `;`, comma `,`.

Specify this property only if the array of choices is nested within the object returned by the service. For example, the service returns the following object:

```js
{
  countries: [ ... ],
  capitals: [ ... ]
}
```

To populate choices with values from the `countries` array, set the `path` property to `"countries"`. To use the `capitals` array, set this property to `"capitals"`.

**Type**: `string`

### `valueName`

Specifies which property in the obtained data object contains choice values.

[View Demo](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull (linkStyle))

**Type**: `string`

### `titleName`

Specifies which property in the obtained data object contains display texts for choices.

**Type**: `string`

### `imageLinkName`

Specifies which property in the obtained data object contains image URLs. Used only in [Image Picker](https://surveyjs.io/Examples/Library?id=questiontype-imagepicker) questions.

**Type**: `string`

### `allowEmptyResponse`

Specifies whether the service is allowed to return an empty response or an empty array in a response.

Default value: `false`

**Type**: `boolean`

### `attachOriginalItems`

**Type**: `boolean`

### `attachData`

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

**Type**: `boolean`

### `itemValueType`

**Type**: `string`

## Methods

### `clearCache()`

### `getSurvey()`

**Return value:** `ISurvey`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `live` | `boolean` |  |

### `run()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `textProcessor` | `ITextProcessor` |  |

### `getType()`

**Return value:** `string`

### `dispose()`

### `getCustomPropertiesNames()`

**Return value:** `string[]<any>`

### `setData()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `json` | `any` |  |

### `getData()`

**Return value:** `any`

### `clear()`
