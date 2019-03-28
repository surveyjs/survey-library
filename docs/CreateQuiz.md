# Create a Quiz

You may use SurveyJS to create not only surveys and complex forms, but also quizzes. In this article, we will show it show to make a quiz, by setting just some properties.

## Step 1. Setup the start page.

Unlike a survey or form, a quiz should have a start page, with a text on it, optionally some inputs, like name/e-mails, and a start button. 

To create the start page, just set the survey **firstPageIsStarted** property to true.

```javascript
survey.firstPageIsStarted = true;
```

Now, on running the survey, the first page shows as a page with a "start" button. After a user click on the "start" button, he will not be able to comeback by pressing the "previous" button. 
The reason is simple, the "start" page is not the first page. A user will see the first page after clicking on the "start" button. 

To change the "start" button text, use survey **startSurveyText** property.

```javascript
survey.startSurveyText = "Click to start my Quiz";
```

Talking about the "previous" button. You may want to make it invisible in your survey, so your user will not be able to comeback on the previous page(s). 

In this case set **showPrevButton** property to false.

```javascript
survey.showPrevButton = false;
```

You will definately need to explain what this quiz about, and for this purpose. We are suggesting to use our Html question. You may display any html, including video and audio. 
You may ask your users to enter their names or/and e-mails. 

You start page JSON may look like:

```json
{
    elements: [
        {
            type: "html",
            html: "You are about to start my quiz.  You will have to finish it in a short time. Please be ready to answer 10 questions in 2 minutes after clicking the start button."
        },
        {
            type: "text",
            name: "userName",
            title: "Please enter your name:"
        }
    ]
}
```

## Step 2. Show the results after finishing the quiz.

You may want to show the results immediately. In this case you have to compare the correct answers and your user answers.
Every question in SurveyJS has a property **correctedAnswers**. If you use it for all questions, then you will be use a computed SurveyJS variables **correctedAnswers** and **inCorrectedAnswers**. On every request, it compares answers (question values) with the **correctedAnswers** property. 

For example, your survey **htmlCompleted** property, the html showing on finishing the quiz, may look like:

```json
completedHtml: "You have answered correctly {correctedAnswers} questions from {questionCount}."
```

The **questionCount** returns the number of visible questions in your quiz. 

Of course, by using **onComplete** event, you may change **completedHtml** dynamically and show the given answers and correct answeres, for example.

## Step 3. Setup a time limit.

You may set the maximum time a user may spend on your quiz in total or on every page.
Set survey **maxTimeToFinish** property to 60 (seconds), for example, to allow your users spending maximum one minute on your quiz. The default value is 0 and it means that there is no time limit. 
You may set the survey **maxTimeToFinishPage** property, for example to 30, to limit your users on answering every page in 30 seconds in maximum. 
Finally, every page has its own **maxTimeToFinish** property, that allows you to set the different time limit for a particular page. 

The timer is start when a user press the "start" button on the starting page. You may handle it manually by calling **startTimer** and **stopTimer** functions.

```javascript
survey.startTimer();
survey.stopTimer();
```

There are additionally two important properties that you may find usefull: **showTimerPanel** and **showTimerPanelMode**. 

You have to set survey **showTimerPanel** to "top" or "bottom" to show the timer panel.

```javascript
survey.showTimerPanel = "top";
```

To show information about time left for quiz in total, set **showTimerPanelMode** to "survey", and to show time left for the current page to "page". 
The default value is "all", and a user may see information about left time in total and for the current page.

## Step 4. Integrate a quiz into your web application.

#### SurveyJS quiz is a typical survey
SurveyJS quiz does not differs from any other survey. You may integrate it or use it on our service in the same way you would do for any other survey. 
Please go to our [Getting Started Page](https://surveyjs.io/Documentation/Library/?id=Add-Survey-into-your-Web-Page) for more information. 

To see our quiz in action, please go to [this example](https://surveyjs.io/Examples/Library/?id=survey-quiz).