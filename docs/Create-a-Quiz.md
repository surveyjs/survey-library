# Create a Quiz

SurveyJS allows you to create quizzes, i.e., time limited surveys. This document describes how to create a quiz in SurveyJS.

## Step 1. Setup the Start Page

Unlike a survey or form, a quiz should have a start page, with a text on it, optionally some inputs, like name/e-mails, and a start button. 

To create the start page, set the [survey.firstPageIsStarted](https://surveyjs.io/Documentation/Library/?id=surveymodel#firstPageIsStarted) property to `true`.

```javascript
survey.firstPageIsStarted = true;
```


### Start Button 

When a survey is run, it displays a start page with a "start" button. After users click the "start" button, they cannot navigate back by pressing the "previous" button: the start page is not the first page of survey. The first survey page is opened when a user clicks "start".

To change the "start" button text, use [survey.startSurveyText](https://surveyjs.io/Documentation/Library/?id=surveymodel#startSurveyText) property.

```javascript
survey.startSurveyText = "Click to start my Quiz";
```

### Previous Button

Set the [survey.showPrevButton](https://surveyjs.io/Documentation/Library/?id=surveymodel#showPrevButton) property to `false` to make the "previous" button invisible in your survey, so your users will not be able to navigate back to a previous page.

```javascript
survey.showPrevButton = false;
```

### Quiz Explain Text

To explain what the current quiz is about, we suggest you to use the [Html question](https://surveyjs.io/Documentation/Library/?id=questionhtmlmodel). In this question type, you can display any html, including video and audio. 

You can also ask your users to enter their names or/and e-mails using a text question. 

Your start page JSON may look like:

```json
{
    elements: [
        {
            type: "html",
            html: "You are about to start my quiz. Please be ready to answer 10 questions in 2 minutes after clicking the start button."
        },
        {
            type: "text",
            name: "userName",
            title: "Enter your name:"
        }
    ]
}
```

## Step 2. Show the Results After Quiz Finish

SurveyJS allows you to immediately display quiz results.

Every question in SurveyJS exposes the [question.correctAnswer](https://surveyjs.io/Documentation/Library/?id=Question#correctAnswer) property. On every request, SurveyJS compares answers (question values) with the **correctAnswer** property. If you use this property for all questions, you can use the computed SurveyJS [survey.correctAnswers](https://surveyjs.io/Documentation/Library/?id=SurveyModel#correctAnswers) and [survey.inCorrectAnswers](https://surveyjs.io/Documentation/Library/?id=SurveyModel#inCorrectAnswers) properties to show calculated quiz results.

The code sample below illustrates how you can use the [survey.completedHtml](https://surveyjs.io/Documentation/Library/?id=SurveyModel#completedHtml) property to display quiz results.

```json
completedHtml: "You have answered correctly {correctAnswers} questions from {questionCount}."
```

The **questionCount** property returns the number of visible questions in your quiz. 

You can handle the **onComplete** event to change **completedHtml** dynamically and show, for example, the user's answers vs. correct answers.

## Step 3. Set a Time Limit

SurveyJS provides the following time limit options:
- Max time per page (for all survey's pages)

  Specified by the [survey.maxTimeToFinishPage](https://surveyjs.io/Documentation/Library/?id=surveymodel#maxTimeToFinishPage) property. 

- Max time per each individual page

  Specified by the [page.maxTimeToFinish](https://surveyjs.io/Documentation/Library/?id=pagemodel#maxTimeToFinish) property.

- Max time per quiz 
  
  Specified by the [survey.maxTimeToFinish](https://surveyjs.io/Documentation/Library/?id=surveymodel#maxTimeToFinish) property.
 

The default value is **0** and it means that there is no time limit. 

### Timer

The timer starts when a user presses the "start" button on the starting page. You can start and stop the timer when needed by calling the [survey.startTimer](https://surveyjs.io/Documentation/Library/?id=surveymodel) and [survey.stopTimer](https://surveyjs.io/Documentation/Library/?id=surveymodel#stopTimer) functions.

```javascript
survey.startTimer();
survey.stopTimer();
```

Set the [survey.showTimerPanel](https://surveyjs.io/Documentation/Library/?id=surveymodel#showTimerPanel) to "top" or "bottom" to show the timer panel.

```javascript
survey.showTimerPanel = "top";
```

To show information about time left, set the [survey.showTimerPanelMode](https://surveyjs.io/Documentation/Library/?id=surveymodel#showTimerPanelMode) property to:

 - `survey` - show time left for the current quiz in total;
 - `page` - show time left for the current page;
 - `all` (default) - show time left in total and for the current page.

## Step 4. Integrate a Quiz Into Your Web Application

SurveyJS quiz does not differ from any other survey. You may integrate it or use it on our service in the same way as for any other survey. Refer to the [Getting Started Page](https://surveyjs.io/Documentation/Library/?id=Add-Survey-into-your-Web-Page) for more information. 

To see a quiz in action, try the [Quiz](https://surveyjs.io/Examples/Library/?id=survey-quiz) example.