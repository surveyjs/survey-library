---
title: Configure Question Titles | SurveyJS Form Libraries
description: You can define a question title and configure its additional elements, such as a question sequence number or 'required' marks.
---
# Configure Question Titles

You can specify the [`title`](https://surveyjs.io/Documentation/Library?id=Question#title) property to set a question title. If you leave it unspecified, the question displays its [`name`](https://surveyjs.io/Documentation/Library?id=Question#name) value as a title. However, question titles can have additional elements that you can configure, such as question numbers and required marks.

- [Question Numbers](#question-numbers)
- [Required Mark](#required-mark)
- [Title Pattern](#title-pattern)

## Question Numbers

Questions are numbered starting with 1. If you want to start numbering with a different number or use letters instead, specify the Survey's [`questionStartIndex`](https://surveyjs.io/Documentation/Library/?id=surveymodel#questionStartIndex) property. You can include desired prefixes and postfixes in the property value:

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

## Required Mark

Questions that require an answer are marked with an asterisk `*`. You can use the Survey's [`requiredText`](https://surveyjs.io/Documentation/Library?id=surveymodel#requiredText) property to set another symbol or specify an explanatory text string:

```js
const surveyJson = {
  // ...
  "requiredText": "!"
}
```

## Title Pattern

You can arrange the question title, number, and required mark in different sequences. To do this, specify one of the [`questionTitlePattern`](https://surveyjs.io/Documentation/Library?id=surveymodel#questionTitlePattern) property values as shown in the following code:

```js
const surveyJson = {
  // ...
  "questionTitlePattern": "numTitleRequire", // 1. Question Title *
  "questionTitlePattern": "numRequireTitle", // 1. * Question Title  
  "questionTitlePattern": "numTitle",        // 1. Question Title
}
```

[View Demo](https://surveyjs.io/form-library/examples/survey-processtext/ (linkStyle))
