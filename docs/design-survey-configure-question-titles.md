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

Surveys support the following numbering modes:

- Sequential numbering      
Survey elements are numbered in order, regardless of whether they are nested in panels or not.

- Recursive numbering       
Survey elements are numbered in a manner that takes into account their nesting level (for example, 1 → 1.1 → 1.1.1).

- Sequential numbering with a reset on each page      
Survey elements are numbered in order, but the numbering starts anew on each page.

By default, questions are not numbered. To enable one of the numbering modes, set `SurveyModel`'s [`showQuestionNumbers`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showQuestionNumbers) property to `true` (sequential numbering), `"recursive"`, or `"onpage"`. 

```js
const surveyJson = {
  // ...
  "showQuestionNumbers": true // or "recursive" | "onpage"
}
```

Questions within panels can participate in survey-level numbering or have an individual numbering sequence. Use `PanelModel`'s [`showQuestionNumbers`](https://surveyjs.io/form-library/documentation/api-reference/panel-model#showQuestionNumbers) property to specify the desired numbering mode: `"default"` to continue survey-level numbering, `"recursive"` to number nested questions recursively, `"onpanel"` to start numbering within the panel from scratch, or `"off"` to hide numbers for nested questions. For example, the following code enables sequential numbering across the survey but resets numbering for questions within the panel.

```js
const surveyJson = {
  // ...
  "showQuestionNumbers": true,
  "elements": [{
    "type": "panel",
    // ...
    "elements": [ /* ... */ ],
    "showQuestionNumbers": "onpanel"
  }]
}
```

When enabled, question numbering starts with 1. If you want to start numbering with a different number or use letters instead, specify the Survey's [`questionStartIndex`](https://surveyjs.io/Documentation/Library/?id=surveymodel#questionStartIndex) property. You can include desired prefixes and postfixes in the property value:

```js
const surveyJson = {
  // ...
  "questionStartIndex": "a.", // a., b., c., ...
  "questionStartIndex": "#3", // #3, #4, #5, ...
  "questionStartIndex": "(B)." // (B)., (C)., (D)., ...
}
```

## Required Mark

Questions that require an answer are marked with an asterisk `*`. You can use the Survey's [`requiredMark`](https://surveyjs.io/Documentation/Library?id=surveymodel#requiredMark) property to set another symbol or specify an explanatory text string:

```js
const surveyJson = {
  // ...
  "requiredMark": "!"
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
