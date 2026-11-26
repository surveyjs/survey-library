---
title: ISurveyOptions
product: Form Library
api-type: interface
description: Options passed as the second argument to the `SurveyModel` constructor.
source: https://surveyjs.io/form-library/documentation/api-reference/isurveyoptions
---

# `ISurveyOptions`

Options passed as the second argument to the [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model) constructor. The constructor reads these options once, before loading the survey JSON.

```ts
import { SurveyModel, type ISurveyOptions } from "survey-core";

const options: ISurveyOptions = {
  runtimeSettings: {
    // Configure how the survey behaves at runtime
  },
  events: {
    // Register handlers before the survey JSON loads
  },
  propertyDefaults: {
    // Set property defaults by class
  }
};

// Pass your survey JSON as the first argument
const survey = new SurveyModel(surveyJson, options);
```

## Properties

### `events`

**Type**: `SurveyEventHandlers`

Attaches one or more handlers to each specified survey event.

To attach multiple handlers to the same event, pass them in an array in the order they should run. To remove a handler, pass the original function to the event's `remove()` method.

```js
import { SurveyModel } from "survey-core";

function logQuestionName(_, { question }) {
  console.log(question.name);
}

function logQuestionType(_, { question }) {
  console.log(question.getType());
}

const survey = new SurveyModel(surveyJson, {
  events: {
    onQuestionCreated: [logQuestionName, logQuestionType]
  }
});

survey.onQuestionCreated.remove(logQuestionName);
```

> You can also attach a handler with the event's `.add()` method after creating the survey. By then, the constructor has loaded any survey JSON passed to it, and the handler runs the next time the event is raised. Use the `events` object instead if you need to handle events raised during that load.

### `propertyDefaults`

**Type**: `IPropertyDefaults`

Sets property defaults by class.

An unset property uses the nearest class default in the inheritance chain, with the `Serializer` default as a fallback.

```js
import { SurveyModel } from "survey-core";

const survey = new SurveyModel(surveyJson, {
  propertyDefaults: {
    question: { titleLocation: "left" },
    text: { titleLocation: "bottom" }
  }
});
```

### `runtimeSettings`

**Type**: `ISurveyRuntimeSettings`

Controls how this survey behaves at runtime.

This object supports the following settings:

- [`comparator`](https://surveyjs.io/form-library/documentation/api-reference/settings#comparator)
- [`keepEmptyValues`](https://surveyjs.io/form-library/documentation/api-reference/settings#keepEmptyValues)

Each omitted option uses its current value from the global [`settings`](https://surveyjs.io/form-library/documentation/api-reference/settings) object. For example, the following code set an individual `comparator` option and inherits the rest:

```js
import { SurveyModel } from "survey-core";

const survey = new SurveyModel(surveyJson, {
  runtimeSettings: {
    comparator: { caseSensitive: true }
  }
});
```
