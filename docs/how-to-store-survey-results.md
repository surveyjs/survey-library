---
title: How to Store Survey Results | SurveyJS
description: With SurveyJS, you can store survey results in your own database or use Azure storage facilities of the SurveyJS Service. Read these step-by-step instructions to learn more about secure survey data management and storage options for your survey data.
---

# Store Survey Results

Survey results are JSON objects that you can store in your own database. For information on backend architecture for SurveyJS integration, refer to the following help topic:

[Integrate SurveyJS Libraries with Backend](https://surveyjs.io/documentation/backend-integration#server-side-implementation (linkStyle))

On the client side, handle the [`onComplete`](https://surveyjs.io/Documentation/Library?id=surveymodel#onComplete) event raised in response to a click on the Complete button to send survey results to your server:

```js
import { Model } from "survey-core";

const surveyJson = { ... };

const survey = new Model(surveyJson);
survey.onComplete.add((survey, options) => {
  options.showSaveInProgress();
  const dataObj = { postId: surveyPostId, surveyResult: resultAsStr };
  const dataStr = JSON.stringify(dataObj);
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
  fetch(surveyServiceUrl + "/post/", {
    method: "POST",
    body: dataStr,
    headers: headers
  }).then(response => {
    if (!response.ok) {
      throw new Error("Could not post the survey results");
    }
    // Display the "Success" message (pass a string value to display a custom message)
    options.showSaveSuccess();
    // Alternatively, you can clear all messages:
    // options.clearSaveMessages();
  }).catch(error => {
    // Display the "Error" message (pass a string value to display a custom message)
    options.showSaveError();
    console.log(error);
  });
});
```

The `onComplete` event handler only sends survey results in JSON format to your server. The way you store them fully depends on your backend.

If you are running a NodeJS server, you can check survey results before saving them. On the server, create a `SurveyModel` and call its [`clearIncorrectValues(true)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#clearIncorrectValues) method. This method verifies a survey result JSON object against the survey JSON schema and deletes property values that cannot be assigned to a question (such as choice options unlisted in a `choices` array) and property values that do not correspond to any question or [calculated value](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#calculated-values).

```js
// Server-side code for a NodeJS backend
import { Model } from "survey-core";

const surveyJson = { ... };
const survey = new Model(surveyJson);

survey.data = initialSurveyResultJson;
survey.clearIncorrectValues(true);

const correctSurveyResultJson = survey.data;
```

## See Also

- [Access Survey Results](/Documentation/Library?id=handle-survey-results-access)
- [Continue an Incomplete Survey](/Documentation/Library?id=handle-survey-results-continue-incomplete)
- [Merge Question Values](/Documentation/Library?id=design-survey-merge-question-values)