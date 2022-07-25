# Predefine Answers

You can set a question's [`defaultValue`](https://surveyjs.io/Documentation/Library?id=Question#defaultValue) that will be used until a proper [`value`](https://surveyjs.io/Documentation/Library?id=Question#value) is specified by a user or programmatically. If the proper `value` is never specified, the `defaultValue` is saved in the survey results.

```js
const surveyJson = {
  "elements": [{
    "name": "subscribed",
    "type": "checkbox",
    "title": "I agree to receive weekly newsletters"
    "defaultValue": true
  }]
}
```

You can set the question `value` property or call the Survey's [`setValue(questionName, newValue)`](https://surveyjs.io/Documentation/Library?id=surveymodel#setValue) method to change the value at any point in your application:

```js
import { Model } from "survey-core";

const survey = new Model(surveyJson);
survey.setValue("subscribed", false);
```