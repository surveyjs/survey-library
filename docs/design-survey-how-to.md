- [Configure Question Titles](#configure-question-titles)
  - [Title Pattern](#title-pattern)
  - [Question Numbers](#question-numbers)
  - [Required Mark](#required-mark)
- [Predefine Answers](#predefine-answers)
- [Share the Same Data Between Two or More Questions](#share-the-same-data-between-two-or-more-questions)
- [Replay Survey in Read-Only Mode](#replay-survey-in-read-only-mode)
- [Fill Choices from a RESTful Service](#fill-choices-from-a-restful-service)

## Configure Question Titles

You can specify the [`title`](https://surveyjs.io/Documentation/Library?id=Question#title) property to set a question title. If you leave it unspecified, the question its [`name`](https://surveyjs.io/Documentation/Library?id=Question#name) value as a title. However, questions title can have additional elements that you can configure, such as question numbers and required marks.

### Question Numbers

Questions are numbered beginning with 1. If you want to start numbering with a different number or use letters instead, specify the Survey's [`questionStartIndex`](https://surveyjs.io/Documentation/Library/?id=surveymodel#questionStartIndex) property. You can include desired prefixes and postfixes into the property value:

```js
const surveyJson = {
  // ...
  "questionStartIndex": "a.", // a., b., c., ...
  "questionStartIndex": "#3", // #3, #4, #5, ...
  "questionStartIndex": "(B)." // (B)., (C)., (D)., ...
}
```

Surveys use continuous numbering across all pages. If you want to start numbering on each page from scratch, set the Survey's [`showQuestionNumbers`](https://surveyjs.io/Documentation/Library/?id=surveymodel#showQuestionNumbers) property to `"onpage"`:

```js
const surveyJson = {
  // ...
  "showQuestionNumbers": "onpage"
}
```

If you want to hide question numbers, set the same property to `"off"`:

```js
const surveyJson = {
  // ...
  "showQuestionNumbers": "off"
}
```

[View the "Process Text" example](https://surveyjs.io/Examples/Library/?id=survey-processtext)

### Required Mark

Questions that require an answer are marked with an asterisk `*`. You can use the Survey's [`requiredText`](https://surveyjs.io/Documentation/Library?id=surveymodel#requiredText) set another symbol or specify an explanatory text string:

```js
const surveyJson = {
  // ...
  "requiredText": "!"
}
```

[View the "Process Text" example](https://surveyjs.io/Examples/Library/?id=survey-processtext)

### Title Pattern

You can arrange the question title, number, and required mark in different sequences. To do this, specify one of the [`questionTitlePattern`](https://surveyjs.io/Documentation/Library?id=surveymodel#questionTitlePattern) property values as shown in the following code:

```js
const surveyJson = {
  // ...
  "questionTitlePattern": "numTitleRequire", // 1. Question Title *
  "questionTitlePattern": "numRequireTitle", // 1. * Question Title
  "questionTitlePattern": "requireNumTitle", // * 1. Question Title
  "questionTitlePattern": "numTitle",        // 1. Question Title
}
```

[View the "Process Text" example](https://surveyjs.io/Examples/Library/?id=survey-processtext)

## Predefine Answers

You can set a question's [`defaultValue`](https://surveyjs.io/Documentation/Library?id=Question#defaultValue) that will be used until a proper [`value`](https://surveyjs.io/Documentation/Library?id=Question#value) is not specified by a user or programmatically. If the proper `value` is never specified, the `defaultValue` is saved in the survey results.

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

## Merge Question Values

You can merge values from multiple questions into a single array or object. This functionality enables you to split complex forms into connected parts. For example, you can create a form in which users enter a list of employees in one question and fill out details about them in another question. If you associate the questions with each other, their values will be merged into a single array.

To associate two questions, assign the `name` value of a main question to the `valueName` property of other questions. For example, the following code associates a [Matrix Dynamic](https://surveyjs.io/Documentation/Library?id=questionmatrixdynamicmodel) with a [Panel Dynamic](https://surveyjs.io/Documentation/Library?id=questionpaneldynamicmodel). Together they produce an `employees` array of objects. The Matrix Dynamic supplies the `employess-name` field values; the Panel Dynamic supplies the `address` and `phone` field values. 

```js
const surveyJson = {
  "elements": [{
    "type": "matrixdynamic",
    "name": "employees",
    "title": "Employees",
    "columns": [{
      "name": "employee-name",
      "cellType": "text"
    }],
  }, {
    "type": "paneldynamic",
    "name": "employee-info",
    "title": "Your employees",
    "valueName": "employees",
    "templateElements": [{
      "type": "panel",
      "name": "contacts",
      "elements": [{
        "type": "text",
        "name": "address",
        "title": "Address:"
      }, {
        "type": "text",
        "name": "phone",
        "title": "Phone:"
      }]
    }],
    "templateTitle": "Employee: {panel.employee-name}"
  }]
}
```

Matrix Dynamic and Panel Dynamic are compatible because they both produce arrays of objects. In some instances, you need to associate two or more questions that produce results in different formats. This is the case with the Checkbox question type. It produces an array of primitive values that cannot be merged with an array of objects. To force a Checkbox question to produce an array of objects, specify the [`valuePropertyName`](https://surveyjs.io/Documentation/Library?id=questioncheckboxmodel#valuePropertyName) property with a field name that should store question values. In the following example, a Checkbox question stores values in the `car` field. A Panel Dynamic adds the `years-owned` and `rating` fields to each object in the `cars` array:

```js
const surveyJson = {
  "elements": [{
    "type": "checkbox",
    "name": "cars",
    "valuePropertyName": "car",
    "title": "Which car(s) have you ever owned?",
    "choices": [ "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi",
      "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen", "Tesla" ]
  }, {
    "type": "paneldynamic",
    "name": "cars-info",
    "title": "Car Information",
    "valueName": "cars",
    "templateElements": [{
      "type": "dropdown",
      "name": "years-owned",
      "title": "How long did you own this car?",
      "choicesMin": 1,
      "choicesMax": 50
    }, {
      "type": "rating",
      "name": "rating",
      "title": "How would you rate it?",
    }],
    "templateTitle": "Car: {panel.car}"
  }]
}
```

[View example](https://surveyjs.io/Examples/Library?id=survey-shareddata)

## Replay Survey in Read-Only Mode

When the survey is completed, the [onComplete](https://surveyjs.io/Documentation/Library/?id=surveymodel#onComplete) event occurs. In most cases, this event is used to save the survey results in [your own database](#storeresults).

However, you can show the same survey to an end user from the beginning, but in read-only mode:

```javascript
survey.onComplete.add(function (sender, options) {
  // By default, the 'clear' method clears all data and go to the first page
  // Make a survey to keep the results by passing the first parameter as 'false'
  sender.clear(false);
  // Turn a survey into read-only mode
  sender.mode = "display";
});
```

## Fill Choices from a RESTful Service

SurveyJS can populate choices/items in a drop-down list, check boxes, and radio groups with items obtained from a web service. 

> **Example**
>
> [Get choices from a web service](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull)

The online Survey Creator allows you to configure a connection to a web service with a dialog:

<p align="center">

![Choices By Url Property Editor](https://github.com/surveyjs/surveyjs/blob/master/docs/images/choicesbyurl.png?raw=true)

_Choices By Url Property Editor_

</p>

| Property Name | Description |
| --- | --- |
| **url** | A link to a web service. You may use the text preprocessing here. For example, the following url: _<https://surveyjs.io/api/CountriesExample?region={region}>_ is changed based on the _region_ question value. SurveyJS automatically gets data from web service on changing the _region_ value.|
| **path** | Use this property, if a web service returns a lot of information and you need only a part of it. For example, the service returns the list of countries and list of capitals. If you need a list of countries, set a correct path from which SurveyJS obtains the data, like: _DataList1\DataList2_ |
| **valueName** | The property name in your obtained data, that SurveyJS should bind with the value. |
| **titleName** | The property name in your obtained data, that SurveyJS should bind with the text. It can be empty. |

> **Note**
>
> During the user session, if the same URL is requested, SurveyJS returns data from a cached list and does not send another request.

You can control the process of setting choices into a question from the web service by handing the **onLoadChoicesFromServer** event. The options parameter in this event has three properties:

- **question** - the question where choices are loaded
- **choices** - the list of loaded choices that library fills automatically
- **surveyResult** - the result object that comes from the web service