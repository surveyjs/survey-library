---
title: Access and Modify Survey Results | SurveyJS
description: Learn how to access, modify, and manage individual question values and full survey results using ready-to-use code examples of this comprehensive guide.
---

# Access Survey Results

This help topic describes how you can access, modify, and display individual question values and full survey results.

- [Access Individual Question Values](#access-individual-question-values)
- [Access Full Survey Results](#access-full-survey-results)
- [Modify Survey Results](#modify-survey-results)

## Access Individual Question Values

To access an individual question value, use the question's [`value`](/Documentation/Library?id=Question#value) property. You can assign a new value to it if you want to update the question value programmatically. Alternatively, you can call the Survey's [`getValue(questionName)`](/Documentation/Library?id=surveymodel#getValue) and [`setValue(questionName, newValue)`](/Documentation/Library?id=surveymodel#setValue) methods.

The following code configures an `nps_score` question and uses the API members described above to access the question's value:

```js
import { Model } from "survey-core";

const surveyJson = {
  "elements": [{
    "type": "rating",
    "name": "nps_score",
    "title": "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
    "rateMin": 0,
    "rateMax": 10,
  }]
};
const survey = new Model(surveyJson);
const npsQuestion = survey.getQuestionByName("nps_score");

console.log(npsQuestion.value);
// ===== or =====
// console.log(survey.getValue("nps_score"));

npsQuestion.value = 10;
// ===== or =====
// console.log(survey.setValue("nps_score", 10));
```

If you need to access an individual question value before or immediately after it is changed, handle the Survey's [`onValueChanging`](/Documentation/Library?id=surveymodel#onValueChanging) or [`onValueChanged`](/Documentation/Library?id=surveymodel#onValueChanged) events:

```js
survey.onValueChanging.add((survey, { name, question, oldValue, value }) => {
  console.log(`The ${name} question value is about to change from ${oldValue} to ${value}.`);
  // You can redefine the `value` argument if you want to change the question value:
  // value = myNewValue;
});

survey.onValueChanged.add((survey, { name, question, value }) => {
  console.log(`The ${name} question value has changed to ${value}.`);
});
```

[View Demo](https://surveyjs.io/form-library/examples/auto-populate-form-fields/ (linkStyle))

## Access Full Survey Results

To access full survey results, use the Survey's [`data`](/Documentation/Library?id=surveymodel#data) property. It contains a JSON object with answered questions and has the following structure:

```js
{
  "question1Name": "question1Value",
  "question2Name": "question2Value",
  // ...
  "questionNName": "questionNValue",
}
```

Depending on the question type, question values can also be nested objects or arrays that contain objects or primitive values:

```js
{
  "question1Name": [ "value1", "value2", ... ],
  "question2Name": {
    "nestedQuestion1Name": "nestedQuestion1Value",
    "nestedQuestion2Name": "nestedQuestion2Value",
    // ...
  },
  // ...
}
```

The following code outputs the `data` property into the browser's console:

```js
import { Model } from "survey-core";

const surveyJson = { ... };
const survey = new Model(surveyJson);

console.log(survey.data);
```

[View Demo](https://surveyjs.io/form-library/examples/survey-editprevious/ (linkStyle))

If you need to get survey results as an array of JavaScript objects, call the Survey's [`getPlainData()`](/Documentation/Library?id=surveymodel#getPlainData) method. The objects in the array have the following structure:

```js
{
  name: string, // Question name
  title: string, // Question title
  value: any, // Question value
  displayValue: string, // Question value converted to a string
  isNode: Boolean, // `true` if the question contains more than one value
  // Details about the values. Present only if `isNode` is `true`
  data: Array<{ name, title, value, displayValue, isNode, data}>
}
```

The following code shows how to call the `getPlainData()` method and output the result into the browser's console:

```js
console.log(survey.getPlainData());
```

## Modify Survey Results

The previous section described the default format of survey results. If you want to use a different format, modify survey results in a custom function. For example, you can bring survey result objects to the following structure:

```js
{
  name: string, // Question name
  title: string, // Question title
  value: any, // Question value
  displayValue: string // Question value converted to a string
}
```

The code below converts survey results to this structure when a user [completes the survey](https://surveyjs.io/Documentation/Library?id=surveymodel#onComplete):

```js
survey.onComplete.add((survey) => {
  const resultData = [];
  for (const key in survey.data) {
    const question = survey.getQuestionByName(key);
    if (!!question) {
      const item = {
        name: key,
        value: question.value,
        title: question.displayValue,
        displayValue: question.displayValue
      };
      resultData.push(item);
    }
  }
  // ...
  // Send `resultData` to your web server
  // ...
});
```

## See Also

- [Store Survey Results](/Documentation/Library?id=handle-survey-results-store)
- [Continue an Incomplete Survey](/Documentation/Library?id=handle-survey-results-continue-incomplete)
- [Merge Question Values](/Documentation/Library?id=design-survey-merge-question-values)