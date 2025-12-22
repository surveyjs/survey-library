---
title: "Continuing an Incomplete Survey: How to Save and Restore Survey Progress | SurveyJS"
description: Learn how to allow respondents to continue an unfinished survey session by saving and restoring their progress. Read these step-by-step instructions to enable this feature in your SurveyJS form builder, making it easy for users to pick up where they left off.
---

# Continue an Incomplete Survey

Respondents may not complete your survey in a single session. In this case, you can restore their answers from the previous session next time they get to the survey. Incomplete results can be loaded from your database or the browser's [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## Restore Survey Progress from the `localStorage`

To save incomplete results locally, implement functions that store [survey data](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data) and [UI state](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#uiState) under specified keys in the `localStorage` (see the `saveSurveyData` and `saveSurveyUIState` functions in the code below). Call these functions inside the `SurveyModel`'s [`onValueChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onValueChanged) and [`onUIStateChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUIStateChanged) event handlers to capture updates whenever users change a value or modify the UI (for example, expand/collapse a question box or switch pages). When the survey is completed, submit the final results to the server and remove them from the `localStorage` using the [`onComplete`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onComplete) event handler:

```js
import { Model } from "survey-core";

const survey = new Model();

const STORAGE_ITEM_DATA_KEY = "my-survey-data";
const STORAGE_ITEM_UI_STATE_KEY = "my-survey-state";
const SURVEY_ID = /* ... Getting the survey ID ... */;
const ENDPOINT_URL = "https://example.com/api/responses/" + SURVEY_ID;

fetch("https://example.com/api/surveys/" + SURVEY_ID)
  .then(response => response.json())
  .then(loadedSurvey => {
    survey.fromJSON(loadedSurvey.json);
    restoreSurvey(survey);
  })
  .catch(error => console.error(error));

function saveSurveyData(survey) {
  window.localStorage.setItem(STORAGE_ITEM_DATA_KEY, JSON.stringify(survey.data));
}

function saveSurveyUIState(survey) {
  window.localStorage.setItem(STORAGE_ITEM_UI_STATE_KEY, JSON.stringify(survey.uiState));
}

function submitSurveyData(data) {
  fetch(ENDPOINT_URL, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.localStorage.setItem(STORAGE_ITEM_DATA_KEY, "");
      window.localStorage.setItem(STORAGE_ITEM_UI_STATE_KEY, "");
    })
    .catch(error => console.error(error));
}

function restoreSurvey(survey) {
  const prevData = window.localStorage.getItem(STORAGE_ITEM_DATA_KEY) || null;
  if (prevData) {
    const data = JSON.parse(prevData);
    survey.data = data;
  }
  const prevState = window.localStorage.getItem(STORAGE_ITEM_UI_STATE_KEY) || null;
  if (prevState) {
    const state = JSON.parse(prevState);
    survey.uiState = state;
  }
}

// Save survey progress when users change a question value...
survey.onValueChanged.add(saveSurveyData);
// ... and when they modify the UI state (expand/collapse a question box or switch pages)
survey.onUIStateChanged.add(saveSurveyUIState);

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

To save incomplete results in a database, submit them to your server each time users change a question value and when they complete the survey. Handle the [`onValueChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onValueChanged) and [`onComplete`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onComplete) to trigger these updates.

Saving the UI state on a server usually isn't practical because it represents device-specific UI preferences, such as which questions are expanded or which page the respondent last viewed. These preferences are relevant only within the current browser session and do not affect actual survey results. For this reason, UI state is better stored locally using the `localStorage`. To do this, handle the [`onUIStateChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUIStateChanged) event.

```js
import { Model } from "survey-core";

const survey = new Model();

const STORAGE_ITEM_UI_STATE_KEY = "my-survey-state";
const SURVEY_ID = /* ... Getting the survey ID ... */
const USER_ID = /* ... Getting the user ID ... */
const ENDPOINT_URL = "https://example.com/api/responses/" + SURVEY_ID + "/" + USER_ID;

fetch("https://example.com/api/surveys/" + SURVEY_ID)
  .then(response => response.json())
  .then(loadedSurvey => {
    survey.fromJSON(loadedSurvey.json);
    restoreSurvey(survey);
  })
  .catch(error => console.error(error));

function saveSurveyData(survey) {
  submitSurveyData(survey.data);
}

function saveSurveyUIState(survey) {
  window.localStorage.setItem(STORAGE_ITEM_UI_STATE_KEY, JSON.stringify(survey.uiState));
}

function submitSurveyData(data) {
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function restoreSurvey(survey) {
  fetch(ENDPOINT_URL)
    .then(response => response.json())
    .then(prevData => {
      if (prevData) {
        const data = JSON.parse(prevData);
        survey.data = data;
      }
      const prevState = window.localStorage.getItem(STORAGE_ITEM_UI_STATE_KEY) || null;
      if (prevState) {
        const state = JSON.parse(prevState);
        survey.uiState = state;
      }
    })
    .catch(error => console.error(error));
}

// Submit survey progess when users change a question value...
survey.onValueChanged.add(saveSurveyData);
// ... and when they complete the survey
survey.onComplete.add(saveSurveyData);
// Store the UI state when users modify it
survey.onUIStateChanged.add(saveSurveyUIState);
```

## See Also

- [Access Survey Results](/Documentation/Library?id=handle-survey-results-access)
- [Store Survey Results](/Documentation/Library?id=handle-survey-results-store)
- [Merge Question Values](/Documentation/Library?id=design-survey-merge-question-values)