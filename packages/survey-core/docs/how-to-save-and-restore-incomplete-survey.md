---
title: "Continuing an Incomplete Survey: How to Save and Restore Survey Progress | SurveyJS"
description: Learn how to allow respondents to continue an unfinished survey session by saving and restoring their progress. Read these step-by-step instructions to enable this feature in your SurveyJS form builder, making it easy for users to pick up where they left off.
---

# Continue an Incomplete Survey

Respondents may not complete your survey in a single session. In this case, you can restore their answers from the previous session next time they get to the survey. Incomplete results can be loaded from your database or the browser's [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## Restore Survey Progress from the `localStorage`

To save incomplete survey results locally, implement a function that stores them under a specified key in the `localStorage` (see the `saveSurveyData` function in the code below). Call this function within `SurveyModel`'s [`onValueChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onValueChanged) and [`onCurrentPageChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCurrentPageChanged) event handlers to save the survey results each time users change a question value or switch between pages. When the survey is completed, submit final survey results to the server using the [`onComplete`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onComplete) event handler:

```js
import { Model } from "survey-core";

const survey = new Model();

const STORAGE_ITEM_KEY = "my-survey";
const SURVEY_ID = /* ... Getting the survey ID ... */;
const ENDPOINT_URL = "https://example.com/api/responses/" + SURVEY_ID;

fetch("https://example.com/api/surveys/" + SURVEY_ID)
  .then(response => response.json())
  .then(loadedSurvey => {
    survey.fromJSON(loadedSurvey.json);
    restoreSurveyData(survey);
  })
  .catch(error => console.error(error));

function saveSurveyData (survey) {
  const data = survey.data;
  data.pageNo = survey.currentPageNo;
  window.localStorage.setItem(STORAGE_ITEM_KEY, JSON.stringify(data));
}

function submitSurveyData (data) {
  fetch(ENDPOINT_URL, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.localStorage.setItem(STORAGE_ITEM_KEY, "");
    })
    .catch(error => console.error(error));
}

function restoreSurveyData (survey) {
  const prevData = window.localStorage.getItem(STORAGE_ITEM_KEY) || null;
  if (prevData) {
    const data = JSON.parse(prevData);
    survey.data = data;
    if (data.pageNo) {
      survey.currentPageNo = data.pageNo;
    }
  }
}

// Save survey results when users change a question value...
survey.onValueChanged.add(saveSurveyData);
// ... and switch to the next page
survey.onCurrentPageChanged.add(saveSurveyData);

// Submit final survey results after the survey is completed
survey.onComplete.add((survey) => {
  const userId = /* ... Getting the user ID ... */
  survey.setValue("userId", userId);
  submitSurveyData(survey.data);
});
```

[View Demo](/form-library/examples/survey-editprevious/ (linkStyle))

> `localStorage` is limited to 5 MB of data per domain. If you expect incomplete responses to exceed this limit (which may happen if they contain encoded images or files), store them in a database, as described below.

## Restore Survey Progress from a Database

To save incomplete results in a database, submit them to your server each time users change a question value or switch between pages and when they complete the survey. Handle the [`onValueChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onValueChanged), [`onCurrentPageChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCurrentPageChanged), and [`onComplete`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onComplete) events for this purpose.

```js
import { Model } from "survey-core";

const survey = new Model();

const SURVEY_ID = /* ... Getting the survey ID ... */
const USER_ID = /* ... Getting the user ID ... */
const ENDPOINT_URL = "https://example.com/api/responses/" + SURVEY_ID + "/" + USER_ID;

fetch("https://example.com/api/surveys/" + SURVEY_ID)
  .then(response => response.json())
  .then(loadedSurvey => {
    survey.fromJSON(loadedSurvey.json);
    restoreSurveyData(survey);
  })
  .catch(error => console.error(error));

function saveSurveyData (survey) {
  const data = survey.data;
  data.pageNo = survey.currentPageNo;
  submitSurveyData(data);
}

function submitSurveyData (data) {
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function restoreSurveyData (survey) {
  fetch(ENDPOINT_URL)
    .then(response => response.json())
    .then(prevData => {
      if (prevData) {
        const data = JSON.parse(prevData);
        survey.data = data;
        if (data.pageNo) {
          survey.currentPageNo = data.pageNo;
        }
      }
    })
    .catch(error => console.error(error));
}

// Submit survey results when users change a question value...
survey.onValueChanged.add(saveSurveyData);
// ... switch to the next page...
survey.onCurrentPageChanged.add(saveSurveyData);
// ... and complete the survey
survey.onComplete.add(saveSurveyData);
```

## See Also

- [Access Survey Results](/Documentation/Library?id=handle-survey-results-access)
- [Store Survey Results](/Documentation/Library?id=handle-survey-results-store)
- [Merge Question Values](/Documentation/Library?id=design-survey-merge-question-values)