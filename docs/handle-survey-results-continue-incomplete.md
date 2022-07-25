# Continue an Incomplete Survey

Your respondents may not complete your survey in a single session. In this case, you can restore their answers from the previous session next time they get to the survey. Incomplete results can be loaded from your database or the browser's [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

To save incomplete results, enable the Survey's [`sendResultOnPageNext`](/Documentation/Library?id=surveymodel#sendResultOnPageNext) property. With this setting, the Survey raises the [`onPartialSend`](/Documentation/Library?id=surveymodel#onPartialSend) event each time a respondent navigates to the next survey page. Handle this event to send incomplete results to your database or `localStorage`:

```js
import { Model } from "survey-core";

const surveyJson = { ... };
const survey = new Model(surveyJson);

survey.sendResultOnPageNext = true;

const storageItemKey = "my-survey";

function saveSurveyData (survey) {
  const data = survey.data;
  data.pageNo = survey.currentPageNo;
  window.localStorage.setItem(storageItemKey, JSON.stringify(data));
}

// Save survey results
survey.onPartialSend.add((survey) => {
  saveSurveyData(survey);
});
survey.onComplete.add((survey) => {
  saveSurveyData(survey);
});

// Restore survey results
const prevData = window.localStorage.getItem(storageItemKey) || null;
if (prevData) {
  const data = JSON.parse(prevData);
  survey.data = data;
  if (data.pageNo) {
    survey.currentPageNo = data.pageNo;
  }
}
```

[View example](https://surveyjs.io/Examples/Library?id=real-patient-history)

## See Also

- [Access Survey Results](/Documentation/Library?id=handle-survey-results-access)
- [Store Survey Results](/Documentation/Library?id=handle-survey-results-store)
- [Merge Question Values](/Documentation/Library?id=design-survey-merge-question-values)