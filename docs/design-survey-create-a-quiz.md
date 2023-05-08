---
title: Create a Quiz | SurveyJS Form Libraries
description: Learn how to build your own interactive timed quizzes and tests with SurveyJS. A step-by-step tutorial plus access to the full demo source code.
---
# Create a Quiz

This tutorial shows you how to create the following quiz&mdash;a multi-page survey that limits response time and tracks correct/incorrect answers. 

<iframe src="/proxy/github/code-examples/quiz/jquery/index.html"
    style="width:100%; border:0; border-radius: 4px; overflow:hidden;"
></iframe>

Follow the steps below:

- [Configure Questions](#configure-questions)
- [Specify Time Limits](#specify-time-limits)
- [Set Up a Start Page](#set-up-a-start-page)
- [Display Quiz Results](#display-quiz-results)
- [Render the Quiz](#render-the-quiz)

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/quiz/ (linkStyle))

## Configure Questions

Quizzes can include any question type supported by the SurveyJS Form Library. The following code sets up three [Radiogroup](https://surveyjs.io/Documentation/Library?id=questionradiogroupmodel) questions. Note that for each question, the [`correctAnswer`](https://surveyjs.io/Documentation/Library?id=Question#correctAnswer) property is specified.

```js
const surveyJson = {
    title: "American History",
    pages: [{
        elements: [{
            type: "radiogroup",
            name: "civilwar",
            title: "When was the American Civil War?",
            choices: [
                "1796-1803", "1810-1814", "1861-1865", "1939-1945"
            ],
            correctAnswer: "1861-1865"
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "libertyordeath",
            title: "Whose quote is this: \"Give me liberty, or give me death\"?",
            choicesOrder: "random",
            choices: [
                "John Hancock", "James Madison", "Patrick Henry", "Samuel Adams"
            ],
            correctAnswer: "Patrick Henry"
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "magnacarta",
            title: "What is Magna Carta?",
            choicesOrder: "random",
            choices: [
                "The foundation of the British parliamentary system",
                "The Great Seal of the monarchs of England",
                "The French Declaration of the Rights of Man",
                "The charter signed by the Pilgrims on the Mayflower"
            ],
            correctAnswer: "The foundation of the British parliamentary system"
        }]
    }]
};
```

## Specify Time Limits

You can set time limits for a page and for the entire quiz. Use the following properties to do this:

- [`Survey.maxTimeToFinish`](https://surveyjs.io/Documentation/Library?id=surveymodel#maxTimeToFinish)      
Time limit to finish the entire survey.

- [`Survey.maxTimeToFinishPage`](https://surveyjs.io/Documentation/Library?id=surveymodel#maxTimeToFinishPage)      
Time limit to finish one page.

- [`Page.maxTimeToFinish`](https://surveyjs.io/Documentation/Library?id=pagemodel#maxTimeToFinish)        
Time limit to finish a specific page. Overrides the survey's `maxTimeToFinishPage` property.

These properties specify the time limit in seconds. If the time limit is negative or 0, it does not apply.

The timer starts when a user begins the quiz. You can call the `stopTimer()` and `startTimer()` methods to suspend and resume the timer programmatically:

```js
const surveyJson = { ... };
const survey = new Survey.Model(surveyJson);

survey.startTimer();
survey.stopTimer();
```

To display elapsed and remaining time, set the `showTimerPanel` property to `top` or `bottom`:

```js
const surveyJson = {
    showTimerPanel: "top"
};
```

The timer panel can include information about time spent on the current page, on the entire quiz, or both. Use the `showTimerPanelMode` property to specify the desired mode:

```js
const surveyJson = {
    showTimerPanelMode: "all" // or "page" | "survey"
};
```

<details>
  <summary>View Full Survey Model</summary>

```js
const surveyJson = {
    title: "American History",
    showProgressBar: "bottom",
    showTimerPanel: "top",
    maxTimeToFinishPage: 10,
    maxTimeToFinish: 25,
    pages: [{
        elements: [{
            type: "radiogroup",
            name: "civilwar",
            title: "When was the American Civil War?",
            choices: [
                "1796-1803", "1810-1814", "1861-1865", "1939-1945"
            ],
            correctAnswer: "1861-1865"
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "libertyordeath",
            title: "Whose quote is this: \"Give me liberty, or give me death\"?",
            choicesOrder: "random",
            choices: [
                "John Hancock", "James Madison", "Patrick Henry", "Samuel Adams"
            ],
            correctAnswer: "Patrick Henry"
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "magnacarta",
            title: "What is Magna Carta?",
            choicesOrder: "random",
            choices: [
                "The foundation of the British parliamentary system",
                "The Great Seal of the monarchs of England",
                "The French Declaration of the Rights of Man",
                "The charter signed by the Pilgrims on the Mayflower"
            ],
            correctAnswer: "The foundation of the British parliamentary system"
        }]
    }]
};
```
</details>

## Set Up a Start Page

A start page is used to show an introduction to your quiz. Configure the start page in the first object of the [`pages`](https://surveyjs.io/Documentation/Library?id=surveymodel#pages) array. In the code below, the start page contains an introductory message and an input field for the user to enter their name:

```js
const surveyJson = {
    pages: [{
        elements: [{
            type: "html",
            html: "You are about to start a quiz on American history. <br>You will have 10 seconds for every question and 25 seconds to end the quiz.<br>Enter your name below and click <b>Start Quiz</b> to begin."
        }, {
            type: "text",
            name: "username",
            titleLocation: "hidden",
            isRequired: true
        }]
    },
    // ...
    // Other quiz pages are configured here
    // ...
    ]
};
```

Enable the [`firstPageIsStarted`](https://surveyjs.io/Documentation/Library?id=surveymodel#firstPageIsStarted) property to add a Start button to the start page markup. You can use the [`startSurveyText`](https://surveyjs.io/Documentation/Library?id=surveymodel#startSurveyText) property to change the button caption:

```js
const surveyJson = {
    firstPageIsStarted: true,
    startSurveyText: "Start Quiz",
};
```

<details>
  <summary>View Full Survey Model</summary>

```js
const surveyJson = {
    title: "American History",
    showProgressBar: "bottom",
    showTimerPanel: "top",
    maxTimeToFinishPage: 10,
    maxTimeToFinish: 25,
    firstPageIsStarted: true,
    startSurveyText: "Start Quiz",
    pages: [{
        elements: [{
            type: "html",
            html: "You are about to start a quiz on American history. <br>You will have 10 seconds for every question and 25 seconds to end the quiz.<br>Enter your name below and click <b>Start Quiz</b> to begin."
        }, {
            type: "text",
            name: "username",
            titleLocation: "hidden",
            isRequired: true
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "civilwar",
            title: "When was the American Civil War?",
            choices: [
                "1796-1803", "1810-1814", "1861-1865", "1939-1945"
            ],
            correctAnswer: "1861-1865"
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "libertyordeath",
            title: "Whose quote is this: \"Give me liberty, or give me death\"?",
            choicesOrder: "random",
            choices: [
                "John Hancock", "James Madison", "Patrick Henry", "Samuel Adams"
            ],
            correctAnswer: "Patrick Henry"
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "magnacarta",
            title: "What is Magna Carta?",
            choicesOrder: "random",
            choices: [
                "The foundation of the British parliamentary system",
                "The Great Seal of the monarchs of England",
                "The French Declaration of the Rights of Man",
                "The charter signed by the Pilgrims on the Mayflower"
            ],
            correctAnswer: "The foundation of the British parliamentary system"
        }]
    }]
};
```
</details>

## Display Quiz Results

Quiz results are displayed on the [complete page](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-multi-page-survey#complete-page). To configure its content, assign HTML markup to the [`completedHtml`](https://surveyjs.io/Documentation/Library?id=surveymodel#completedHtml) property. The markup can include the following placeholders:

- `{correctAnswers}` - The number of correct answers.
- `{incorrectAnswers}` - The number of incorrect answers.
- `{questionCount}` - The number of questions.

```js
const surveyJson = {
    completedHtml: "<h4>You got <b>{correctAnswers}</b> out of <b>{questionCount}</b> correct answers.</h4>",
};
```

Your application may require multiple versions of the complete page. For example, you can change element styles to highlight poor or excellent results. To specify page variants, populate the [`completedHtmlOnCondition`](https://surveyjs.io/Documentation/Library?id=surveymodel#completedHtmlOnCondition) array. Each object in this array should contain a [Boolean expression](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-display#boolean-expressions) and HTML markup that applies when this expression evaluates to `true`. The expressions and the markup can use the same data placeholders:

```js
const surveyJson = {
    completedHtmlOnCondition: [{
        expression: "{correctAnswers} == 0",
        html: "<h4>Unfortunately, none of your answers are correct. Please try again.</h4>"
    }, {
        expression: "{correctAnswers} == {questionCount}",
        html: "<h4>Congratulations! You answered all the questions correctly!</h4>"
    }]
};
```

The `completedHtml` and `completedHtmlOnCondition` properties can be used together. In this case, if none of the `completedHtmlOnCondition` expressions evaluate to `true`, the complete page displays the HTML markup from the `completedHtml` property.

<details>
  <summary>View Full Survey Model</summary>

```js
const surveyJson = {
    title: "American History",
    showProgressBar: "bottom",
    showTimerPanel: "top",
    maxTimeToFinishPage: 10,
    maxTimeToFinish: 25,
    firstPageIsStarted: true,
    startSurveyText: "Start Quiz",
    pages: [{
        elements: [{
            type: "html",
            html: "You are about to start a quiz on American history. <br>You will have 10 seconds for every question and 25 seconds to end the quiz.<br>Enter your name below and click <b>Start Quiz</b> to begin."
        }, {
            type: "text",
            name: "username",
            titleLocation: "hidden",
            isRequired: true
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "civilwar",
            title: "When was the American Civil War?",
            choices: [
                "1796-1803", "1810-1814", "1861-1865", "1939-1945"
            ],
            correctAnswer: "1861-1865"
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "libertyordeath",
            title: "Whose quote is this: \"Give me liberty, or give me death\"?",
            choicesOrder: "random",
            choices: [
                "John Hancock", "James Madison", "Patrick Henry", "Samuel Adams"
            ],
            correctAnswer: "Patrick Henry"
        }]
    }, {
        elements: [{
            type: "radiogroup",
            name: "magnacarta",
            title: "What is Magna Carta?",
            choicesOrder: "random",
            choices: [
                "The foundation of the British parliamentary system",
                "The Great Seal of the monarchs of England",
                "The French Declaration of the Rights of Man",
                "The charter signed by the Pilgrims on the Mayflower"
            ],
            correctAnswer: "The foundation of the British parliamentary system"
        }]
    }],
    completedHtml: "<h4>You got <b>{correctAnswers}</b> out of <b>{questionCount}</b> correct answers.</h4>",
    completedHtmlOnCondition: [{
        expression: "{correctAnswers} == 0",
        html: "<h4>Unfortunately, none of your answers are correct. Please try again.</h4>"
    }, {
        expression: "{correctAnswers} == {questionCount}",
        html: "<h4>Congratulations! You answered all the questions correctly!</h4>"
    }]
};
```
</details>

## Render the Quiz

Refer to the following platform-specific articles for information on how to render the quiz in your application:

- [Render the Survey - Angular](https://surveyjs.io/form-library/documentation/get-started-angular#render-the-survey)
- [Render the Survey - Vue](https://surveyjs.io/form-library/documentation/get-started-vue#render-the-survey)
- [Render the Survey - React](https://surveyjs.io/form-library/documentation/get-started-react#render-the-survey)
- [Render the Survey - Knockout](https://surveyjs.io/form-library/documentation/get-started-knockout#render-the-survey)
- [Render the Survey - jQuery](https://surveyjs.io/form-library/documentation/get-started-jquery#render-the-survey)

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/quiz/ (linkStyle))

## See Also

- [Create a Multi-Page Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-multi-page-survey)
- [Conditional Logic and Dynamic Texts](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-logic)
- [Access Survey Results](https://surveyjs.io/Documentation/Library?id=handle-survey-results-access)
- [Review Quiz Results demo](https://surveyjs.io/form-library/examples/survey-quiz-results/)