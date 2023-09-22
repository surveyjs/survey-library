---
title: "Continuing an Incomplete Survey: How to Save and Restore Survey Progress | SurveyJS"
description: Learn how to allow respondents to continue an unfinished survey session by saving and restoring their progress. Read these step-by-step instructions to enable this feature in your SurveyJS form builder, making it easy for users to pick up where they left off.
---

# Continue an Incomplete Survey

Respondents may not complete your survey in a single session. In this case, you can restore their answers from the previous session next time they get to the survey. Incomplete results can be loaded from your database or the browser's [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

To save incomplete results, implement a function that sends them to your server or saves them in the `localStorage`. Call this function within `SurveyModel`'s [`onValueChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onValueChanged) and [`onCurrentPageChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCurrentPageChanged) event handlers to save survey results when users change a question value or switch between pages. If you use the `localStorage`, you also need to delete survey results from it when the survey is completed. Handle the [`onComplete`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onComplete) event for this purpose.

```js
import { Model } from "survey-core";

const surveyJson = { ... };
const survey = new Model(surveyJson);

const storageItemKey = "my-survey";

function saveSurveyData (survey) {
  const data = survey.data;
  data.pageNo = survey.currentPageNo;
  window.localStorage.setItem(storageItemKey, JSON.stringify(data));
}

// Save survey results to the local storage
survey.onValueChanged.add(saveSurveyData);
survey.onCurrentPageChanged.add(saveSurveyData);

// Restore survey results
const prevData = window.localStorage.getItem(storageItemKey) || null;
if (prevData) {
  const data = JSON.parse(prevData);
  survey.data = data;
  if (data.pageNo) {
    survey.currentPageNo = data.pageNo;
  }
}

// Empty the local storage after the survey is completed
survey.onComplete.add(() => {
  window.localStorage.setItem(storageItemKey, "");
});
```

[View Demo](/form-library/examples/survey-editprevious/ (linkStyle))

## See Also

- [Access Survey Results](/Documentation/Library?id=handle-survey-results-access)
- [Store Survey Results](/Documentation/Library?id=handle-survey-results-store)
- [Merge Question Values](/Documentation/Library?id=design-survey-merge-question-values)