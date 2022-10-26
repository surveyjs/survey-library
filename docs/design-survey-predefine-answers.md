---
title: Populate Form Fields | SurveyJS Form Libraries
description: You can pass a value for a form field by setting a question value property. To retrieve and pre-fill multiple question values use the data property.
---
# Populate Form Fields

SurveyJS Form Library allows you to control and populate form fields programmatically. This help topic describes how to set one or more question values in code and how to specify a default value for a survey question.

- [Single Question Value](#single-question-value)
- [Multiple Question Values](#multiple-question-values)
- [Default Question Values](#default-question-values)

## Single Question Value

You can set a question's [`value`](https://surveyjs.io/form-library/documentation/questiontextmodel#value) property directly to populate a form field. Call the Survey's [`getQuestionByName(questionName)`](https://surveyjs.io/form-library/documentation/surveymodel#getQuestionByName) method to obtain the question's instance and then set the `value` property of this instance:

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

Alternatively, you can call the Survey's [`setValue(questionName, newValue)`]() method:

```js
import { Model } from "survey-core";

const surveyJson = {
  // ...
}

const survey = new Model(surveyJson);
survey.setValue("subscribed", false);
```

## Multiple Question Values

To populate multiple form fields, use the [`data`](https://surveyjs.io/Documentation/Library?id=surveymodel#data) property of a Survey instance. This property contains survey result data as an object in which keys are question names and values are answers. You can assign a new object to the `data` property:

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

The code above *replaces* the old `data` object and erases entered data if there was any. If you want to *merge* the new and old objects, call the [`mergeData(newDataObj)`](https://surveyjs.io/form-library/documentation/surveymodel#mergeData) method:

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

## See Also

- [Merge Question Values](/form-library/documentation/design-survey-merge-question-values)
