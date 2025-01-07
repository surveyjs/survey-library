---
title: Populate Form Fields | SurveyJS Form Libraries
description: You can pass a value for a form field by setting a question's 'value' property. To retrieve and pre-fill multiple question values use the 'data' property.
---
# Populate Form Fields

SurveyJS Form Library allows you to control and populate form fields programmatically. This help topic describes how to set one or more question values in code and how to specify a default value for a survey question.

- [Single Question Value](#single-question-value)
- [Multiple Question Values](#multiple-question-values)
- [Default Question Values](#default-question-values)

## Single Question Value

You can set a question's `value` property directly to populate a form field. Call `SurveyModel`'s [`getQuestionByName(questionName)`](https://surveyjs.io/form-library/documentation/surveymodel#getQuestionByName) method to obtain the question's instance and set the `value` property on this instance. Refer to the [`value` property description](https://surveyjs.io/form-library/documentation/questiontextmodel#value) to find information about value types for different question types.

```js
import { Model } from "survey-core";

const surveyJson = {
  "elements": [{
    "name": "subscribed",
    "type": "boolean",
    "renderAs": "checkbox",
    "title": "I agree to receive weekly newsletters"
  }]
}

const survey = new Model(surveyJson);
const subscribedQuestion = survey.getQuestionByName("subscribed");
subscribedQuestion.value = true;
```

Alternatively, you can call `SurveyModel`'s [`setValue(questionName, newValue)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#setValue) method:

```js
import { Model } from "survey-core";

const surveyJson = {
  // ...
}

const survey = new Model(surveyJson);
survey.setValue("subscribed", false);
```

## Multiple Question Values

To populate multiple form fields, use the [`data`](https://surveyjs.io/Documentation/Library?id=surveymodel#data) property of a `SurveyModel` instance. This property contains survey result data as an object in which keys are question names and values are answers. You can assign a new object to the `data` property:

```js
import { Model } from "survey-core";

const surveyJson = {
  "elements": [{
    "name": "firstName",
    "title": "First Name"
  }, {
    "name": "lastName",
    "title": "Last Name"
  }]
}

const survey = new Model(surveyJson);
survey.data = {
  "firstName": "John",
  "lastName": "Doe"
}
```

The code above *replaces* the old `data` object and erases default question values and entered data. If you want to *merge* the new and old objects, call the [`mergeData(newDataObj)`](https://surveyjs.io/form-library/documentation/surveymodel#mergeData) method:

```js
import { Model } from "survey-core";

const surveyJson = {
  // ...
}

const survey = new Model(surveyJson);
survey.mergeData({
  "lastName": "Doe"
});
```

## Default Question Values

You can set a question's [`defaultValue`](https://surveyjs.io/Documentation/Library?id=Question#defaultValue). It will be used until a proper [`value`](https://surveyjs.io/Documentation/Library?id=Question#value) is specified by a user or programmatically. If the proper `value` is never specified, `defaultValue` is saved in the survey results.

```js
const surveyJson = {
  "elements": [{
    "name": "subscribed",
    "type": "checkbox",
    "title": "I agree to receive weekly newsletters",
    "defaultValue": true
  }]
}
```

You can also specify default values dynamically. Assign a [logical expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) to a question's [`defaultValueExpression`](https://surveyjs.io/form-library/documentation/api-reference/question#defaultValueExpression) property. This expression will be evaluated for the first time when the survey begins, and then re-evaluated again each time any question value changes.

```js
const surveyJson = {
  "elements": [{
    "name": "start-date",
    "title": "Select a vacation start date",
    "type": "text",
    "inputType": "date",
    "defaultValueExpression": "today()"
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/specify-default-question-value-dynamically/ (linkStyle))

## See Also

- [Merge Question Values](/form-library/documentation/design-survey-merge-question-values)
