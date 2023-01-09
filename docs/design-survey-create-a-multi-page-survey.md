---
title: Create a Multi-Page Survey | SurveyJS Form Libraries
description: SurveyJS Form Library lets you add multiple pages to your survey. Learn how to control page visibility and navigation, and configure the introductory and thank you pages.
---
# Create a Multi-Page Survey

This step-by-step tutorial will help you create a survey with multiple pages.

- [Add Multiple Pages to a Survey](#add-multiple-pages-to-a-survey)
- [Configure Page Visibility](#configure-page-visibility)
- [Configure Page Navigation](#configure-page-navigation)
  - [Switch Between Pages](#switch-between-pages)
  - [Page Navigation UI](#page-navigation-ui)
- [Configure Special Pages](#configure-special-pages)
  - [Start Page](#start-page)
  - [Complete Page](#complete-page)
  - [Preview Page](#preview-page)
- [Render the Survey](#render-the-survey)

The survey below illustrates the result:

<iframe src="/proxy/github/code-examples/multi-page-survey/jquery/index.html"
    style="width:100%; border:0; border-radius: 4px; overflow:hidden;"
></iframe>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/multi-page-survey (linkStyle))

## Add Multiple Pages to a Survey

A page is a container for other survey elements ([panels and questions](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-simple-survey#survey-structure)). Pages cannot be nested into each other. Every survey should have at least one visible page.

To configure pages, define the [`pages`](https://surveyjs.io/Documentation/Library?id=surveymodel#pages) array in the [survey model](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-simple-survey#create-a-survey-model). Each object in this array configures a single [Page](https://surveyjs.io/Documentation/Library?id=pagemodel). Within the object, specify the [`elements`](https://surveyjs.io/Documentation/Library?id=pagemodel#elements) array to configure the page's questions and panels.

The following model defines a four-page survey that contains the [Radiogroup](https://surveyjs.io/Documentation/Library?id=questionradiogroupmodel), [Comment](https://surveyjs.io/Documentation/Library?id=questioncommentmodel), and [Rating](https://surveyjs.io/Documentation/Library?id=questionratingmodel) question types. The pages are shown in order. The next step is to implement logic that hides specific pages based on the `"satisfaction-score"` question value.

```js
const surveyJson = {
    pages: [{
        elements: [{
            name: "satisfaction-score",
            title: "How would you describe your experience with our product?",
            type: "radiogroup",
            choices: [
                { value: 5, text: "Fully satisfying" },
                { value: 4, text: "Generally satisfying" },
                { value: 3, text: "Neutral" },
                { value: 2, text: "Rather unsatisfying" },
                { value: 1, text: "Not satisfying at all" }
            ],
            isRequired: true
        }]
    }, {
        elements: [{
            name: "what-would-make-you-more-satisfied",
            title: "What can we do to make your experience more satisfying?",
            type: "comment",
        }, {
            name: "nps-score",
            title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
            type: "rating",
            rateMin: 0,
            rateMax: 10
        }],
    }, {
        elements: [{
            name: "how-can-we-improve",
            title: "In your opinion, how could we improve our product?",
            type: "comment"
        }],
    }, {
        elements: [{
            name: "disappointing-experience",
            title: "Please let us know why you had such a disappointing experience with our product",
            type: "comment"
        }],
    }]
};
```

## Configure Page Visibility

You can use the following properties to control page visibility:

- [`visible`](https://surveyjs.io/Documentation/Library?id=pagemodel#visible)     
A Boolean value that specifies whether the page is visible.

- [`visibleIf`](https://surveyjs.io/Documentation/Library?id=pagemodel#visibleIf)     
A [Boolean expression](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-display#boolean-expressions) used to calculate the `visible` property value. If the expression evaluates to `true`, the page is visible; if it evaluates to `false`, the page is hidden. The expression is evaluated for the first time when the survey begins, and then re-evaluated again each time any of the question values change.

The `visible` and `visibleIf` properties are supported by pages, but you can also set these properties for nested panels and questions. If a page is hidden or all panels and questions on it are hidden, the survey skips this page automatically.

In the following code, the `visibleIf` property is set to a Boolean expression that specifies the visibility of pages and questions based on the `"satisfaction-score"` question value:

```js
const surveyJson = {
    pages: [{
        elements: [{
            name: "satisfaction-score",
            // ...
        }]
    }, {
        elements: [{
            name: "what-would-make-you-more-satisfied",
            // ...
            visibleIf: "{satisfaction-score} = 4"
        }, {
            name: "nps-score",
            // ...
        }],
        visibleIf: "{satisfaction-score} >= 4"
    }, {
        elements: [{
            name: "how-can-we-improve",
            // ...
        }],
        visibleIf: "{satisfaction-score} = 3"
    }, {
        elements: [{
            name: "disappointing-experience",
            // ...
        }],
        visibleIf: "{satisfaction-score} =< 2"
    }],
};
```

If you need to access an array of visible pages, use the [SurveyModel](https://surveyjs.io/Documentation/Library?id=surveymodel)'s [`visiblePages`](https://surveyjs.io/Documentation/Library?id=surveymodel#visiblePages) property. If you only need the number of visible pages, use the [`visiblePageCount`](https://surveyjs.io/Documentation/Library?id=surveymodel#visiblePageCount) property. Both properties update dynamically as the respondent progresses in the survey.

<details>
  <summary>View Full Survey Model</summary>

```js
const surveyJson = {
    pages: [{
        elements: [{
            name: "satisfaction-score",
            title: "How would you describe your experience with our product?",
            type: "radiogroup",
            choices: [
                { value: 5, text: "Fully satisfying" },
                { value: 4, text: "Generally satisfying" },
                { value: 3, text: "Neutral" },
                { value: 2, text: "Rather unsatisfying" },
                { value: 1, text: "Not satisfying at all" }
            ],
            isRequired: true
        }]
    }, {
        elements: [{
            name: "what-would-make-you-more-satisfied",
            title: "What can we do to make your experience more satisfying?",
            type: "comment",
            visibleIf: "{satisfaction-score} = 4"
        }, {
            name: "nps-score",
            title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
            type: "rating",
            rateMin: 0,
            rateMax: 10
        }],
        visibleIf: "{satisfaction-score} >= 4"
    }, {
        elements: [{
            name: "how-can-we-improve",
            title: "In your opinion, how could we improve our product?",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} = 3"
    }, {
        elements: [{
            name: "disappointing-experience",
            title: "Please let us know why you had such a disappointing experience with our product",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} =< 2"
    }],
    showQuestionNumbers: "off",
};
```
</details>

## Configure Page Navigation

### Switch Between Pages

To switch between pages, use the [`currentPage`](https://surveyjs.io/Documentation/Library?id=surveymodel#currentPage) property. It contains the page the respondent currently works with. You can set this property to one of the following values:

```js
const survey = new Survey.Model(surveyJson);

// A page instance
survey.currentPage = myPage;

// A zero-based index of the desired page in the `visiblePages` array
survey.currentPage = visiblePageIndex;

// A page name
survey.currentPage = "myCurrentPage";
```

If you need to get the index of the current page in the [`visiblePages`](https://surveyjs.io/Documentation/Library?id=surveymodel#visiblePages) array, use the [`currentPageNo`](https://surveyjs.io/Documentation/Library?id=surveymodel#currentPageNo) property:

```js
const visiblePageIndex = survey.currentPageNo;
```

You can also use the following methods for page navigation:

- [`start()`](https://surveyjs.io/Documentation/Library?id=surveymodel#start)     
Begins the survey. Use this method only if you have a [start page](#start-page).

- [`nextPage()`](https://surveyjs.io/Documentation/Library?id=surveymodel#nextPage)      
Navigates the respondent to the next page. Returns `false` if the navigation did not happen, for instance, because of validation errors or if the current page is the last page.

- [`prevPage()`](https://surveyjs.io/Documentation/Library?id=surveymodel#prevPage)      
Navigates the respondent to the previous page. Returns `false` if the navigation did not happen, for instance, because the current page is the first page. Unlike with `nextPage()`, validation errors are ignored.

- [`completeLastPage()`](https://surveyjs.io/Documentation/Library?id=surveymodel#completeLastPage)      
Completes the survey. Fails and returns `false` if the current page has validation errors.

- [`doComplete()`](https://surveyjs.io/Documentation/Library?id=surveymodel#doComplete)       
Completes the survey regardless of present validation errors.

The following code shows how to call the described methods and handle possible navigation errors:

```js
const survey = new Survey.Model(surveyJson);

survey.start();

const navigatedForward = survey.nextPage();
if (!navigatedForward) {
    alert("Navigation failed!")
}

const navigatedBack = survey.prevPage();
if (!navigatedBack) {
    alert("Navigation failed!")
}

const completedSuccessfully = survey.completeLastPage();
if (!completedSuccessfully) {
    alert("Check the answers for validation errors")
}

survey.doComplete();
```

In this tutorial, the survey uses out-of-the-box page navigation and does not demonstrate the described API members. However, the given information should help you implement custom page navigation if you find it more suitable in your scenario.

[View Demo](https://surveyjs.io/Examples/Library?id=survey-customnavigation (linkStyle))

### Page Navigation UI

Respondents can click the Next, Previous, and Complete buttons to navigate survey pages. To change button captions, you can specify the [SurveyModel](https://surveyjs.io/Documentation/Library?id=surveymodel)'s [`pageNextText`](https://surveyjs.io/Documentation/Library?id=surveymodel#pagePrevText), [`pagePrevText`](https://surveyjs.io/Documentation/Library?id=surveymodel#pageNextText), and [`completeText`](https://surveyjs.io/Documentation/Library?id=surveymodel#completeText) properties.

```js
const surveyJson = {
    pageNextText: "Forward",
    pagePrevText: "Back",
    completeText: "Submit"
};
```

If you want to hide the buttons, set the [`showNavigationButtons`](https://surveyjs.io/Documentation/Library?id=surveymodel#showNavigationButtons) property to `"none"`. In this case, you can use the API described in the [Switch Between Pages](#switch-between-pages) article to implement custom page navigation. Alternatively, you can enable the [`goNextPageAutomatic`](https://surveyjs.io/Documentation/Library?id=surveymodel#goNextPageAutomatic) and [`allowCompleteSurveyAutomatic`](https://surveyjs.io/Documentation/Library?id=surveymodel#allowCompleteSurveyAutomatic) properties to proceed to the next page or complete the survey automatically when all questions are answered.

```js
const surveyJson = {
    showNavigationButtons: "none",
    goNextPageAutomatic: true,
    allowCompleteSurveyAutomatic: true
};
```

If you only want to hide the Previous button, disable the [`showPrevButton`](https://surveyjs.io/Documentation/Library?id=surveymodel#showPrevButton) property. Note that respondents will still be able to edit their previous answers on the [preview page](#preview-page) if you add it to your survey.

```js
const surveyJson = {
    showPrevButton: false,
};
```

You can also indicate survey progress on a progress bar. To display and position it on the page, set the `showProgressBar` property to `"top"`, `"bottom"`, or `"both"`.

```js
const surveyJson = {
    showProgressBar: "top"
};
```

[View Demo](https://surveyjs.io/form-library/examples/navigation-default/ (linkStyle)) 

The example in this tutorial uses only the `pageNextText`, `completeText`, and `showPrevButton` properties:

<details>
  <summary>View Full Survey Model</summary>

```js
const surveyJson = {
    pages: [{
        elements: [{
            name: "satisfaction-score",
            title: "How would you describe your experience with our product?",
            type: "radiogroup",
            choices: [
                { value: 5, text: "Fully satisfying" },
                { value: 4, text: "Generally satisfying" },
                { value: 3, text: "Neutral" },
                { value: 2, text: "Rather unsatisfying" },
                { value: 1, text: "Not satisfying at all" }
            ],
            isRequired: true
        }]
    }, {
        elements: [{
            name: "what-would-make-you-more-satisfied",
            title: "What can we do to make your experience more satisfying?",
            type: "comment",
            visibleIf: "{satisfaction-score} = 4"
        }, {
            name: "nps-score",
            title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
            type: "rating",
            rateMin: 0,
            rateMax: 10
        }],
        visibleIf: "{satisfaction-score} >= 4"
    }, {
        elements: [{
            name: "how-can-we-improve",
            title: "In your opinion, how could we improve our product?",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} = 3"
    }, {
        elements: [{
            name: "disappointing-experience",
            title: "Please let us know why you had such a disappointing experience with our product",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} =< 2"
    }],
    showQuestionNumbers: "off",
    pageNextText: "Forward",
    completeText: "Submit",
    showPrevButton: false,
};
```
</details>

## Configure Special Pages

### Start Page

A start page usually shows an introduction to your survey. It does not affect the survey progress, and users cannot return to it once they start the survey. If you want to add a start page to your survey, configure the page in the first object of the [`pages`](https://surveyjs.io/Documentation/Library?id=surveymodel#pages) array. In the code below, the start page contains HTML markup:

```js
const surveyJson = {
    pages: [{
        elements: [{
            type: "html",
            html: "<h2>In this survey, we will ask you a couple questions about your impressions of our product.</h2>"
        }]
    },
    // ...
    // Other pages are configured here
    // ...
    ],
};
```

Enable the [`firstPageIsStarted`](https://surveyjs.io/Documentation/Library?id=surveymodel#firstPageIsStarted) property to let the survey know that the first page is a start page and add a Start button to the page markup. You can use the [`startSurveyText`](https://surveyjs.io/Documentation/Library?id=surveymodel#startSurveyText) property to change the button caption:

```js
const surveyJson = {
    firstPageIsStarted: true,
    startSurveyText: "Take the Survey",
};
```

If you need to access the start page in code, you can use the [`startedPage`](https://surveyjs.io/Documentation/Library?id=surveymodel#startedPage) property:

```js
const survey = new Survey.Model(surveyJson);

const startPage = survey.startedPage;
```

<details>
  <summary>View Full Survey Model</summary>

```js
const surveyJson = {
    pages: [{
        elements: [{
            type: "html",
            html: "<h2>In this survey, we will ask you a couple questions about your impressions of our product.</h2>"
        }]
    }, {
        elements: [{
            name: "satisfaction-score",
            title: "How would you describe your experience with our product?",
            type: "radiogroup",
            choices: [
                { value: 5, text: "Fully satisfying" },
                { value: 4, text: "Generally satisfying" },
                { value: 3, text: "Neutral" },
                { value: 2, text: "Rather unsatisfying" },
                { value: 1, text: "Not satisfying at all" }
            ],
            isRequired: true
        }]
    }, {
        elements: [{
            name: "what-would-make-you-more-satisfied",
            title: "What can we do to make your experience more satisfying?",
            type: "comment",
            visibleIf: "{satisfaction-score} = 4"
        }, {
            name: "nps-score",
            title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
            type: "rating",
            rateMin: 0,
            rateMax: 10
        }],
        visibleIf: "{satisfaction-score} >= 4"
    }, {
        elements: [{
            name: "how-can-we-improve",
            title: "In your opinion, how could we improve our product?",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} = 3"
    }, {
        elements: [{
            name: "disappointing-experience",
            title: "Please let us know why you had such a disappointing experience with our product",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} =< 2"
    }],
    showQuestionNumbers: "off",
    pageNextText: "Forward",
    completeText: "Submit",
    showPrevButton: false,
    firstPageIsStarted: true,
    startSurveyText: "Take the Survey",
};
```
</details>

### Complete Page

A complete page displays a "Thank you" message when the survey ends. If you want to specify a custom message, use the following properties:

- [`completedHtml`](https://surveyjs.io/Documentation/Library?id=surveymodel#completedHtml)       
Custom HTML content displayed on the complete page.

    ```js
    const surveyJson = {
        completedHtml: "Thank you for your feedback!",
    };
    ```

- [`completedHtmlOnCondition`](https://surveyjs.io/Documentation/Library?id=surveymodel#completedHtmlOnCondition)        
An array that allows you to specify different complete page content based on conditions. Each object is this array should contain a [Boolean expression](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-display#boolean-expressions) and HTML markup that applies when this expression evaluates to `true`:

    ```js
    const surveyJson = {
        completedHtmlOnCondition: [{
            expression: "{some_field} > 10",
            html: "Custom markup to show when some_field is greater than 10"
        }, {
            expression: "{some_field} < 10",
            html: "Custom markup to show when some_field is less than 10"
        },
        // ...
        ]
    };
    ```

    When none of the expressions evaluate to `true`, the complete page displays the HTML markup from the `completedHtml` property.

If your survey should not display a complete page, disable the [`showCompletedPage`](https://surveyjs.io/Documentation/Library?id=surveymodel#showCompletedPage) property.

<details>
  <summary>View Full Survey Model</summary>

```js
const surveyJson = {
    pages: [{
        elements: [{
            type: "html",
            html: "<h2>In this survey, we will ask you a couple questions about your impressions of our product.</h2>"
        }]
    }, {
        elements: [{
            name: "satisfaction-score",
            title: "How would you describe your experience with our product?",
            type: "radiogroup",
            choices: [
                { value: 5, text: "Fully satisfying" },
                { value: 4, text: "Generally satisfying" },
                { value: 3, text: "Neutral" },
                { value: 2, text: "Rather unsatisfying" },
                { value: 1, text: "Not satisfying at all" }
            ],
            isRequired: true
        }]
    }, {
        elements: [{
            name: "what-would-make-you-more-satisfied",
            title: "What can we do to make your experience more satisfying?",
            type: "comment",
            visibleIf: "{satisfaction-score} = 4"
        }, {
            name: "nps-score",
            title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
            type: "rating",
            rateMin: 0,
            rateMax: 10
        }],
        visibleIf: "{satisfaction-score} >= 4"
    }, {
        elements: [{
            name: "how-can-we-improve",
            title: "In your opinion, how could we improve our product?",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} = 3"
    }, {
        elements: [{
            name: "disappointing-experience",
            title: "Please let us know why you had such a disappointing experience with our product",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} =< 2"
    }],
    showQuestionNumbers: "off",
    pageNextText: "Forward",
    completeText: "Submit",
    showPrevButton: false,
    firstPageIsStarted: true,
    startSurveyText: "Take the Survey",
    completedHtml: "Thank you for your feedback!",
};
```
</details>

### Preview Page

A preview page allows respondents to preview and correct their answers before the survey is completed. The preview page displays all visible survey pages as panels. Each panel has an Edit button that sends the respondent back to the corresponding page.

To enable the preview page, specify whether it should display all visible questions or only those that have answers. Set the [`showPreviewBeforeComplete`](https://surveyjs.io/Documentation/Library?id=surveymodel#showPreviewBeforeComplete) property to `"showAllQuestions"` or `"showAnsweredQuestions"`:

```js
const surveyJson = {
    showPreviewBeforeComplete: "showAnsweredQuestions"
};
```

[View Demo](https://surveyjs.io/form-library/examples/survey-showpreview/ (linkStyle))

When the preview page is enabled, the last page in the survey displays a Preview button instead of a Complete button. Set the [`previewText`](https://surveyjs.io/Documentation/Library?id=surveymodel#previewText) property if you want to change the Preview button caption:

```js
const surveyJson = {
    previewText: "Preview answers"
};
```

You can also call the following methods to control preview page visibility in code:

- [`showPreview()`](https://surveyjs.io/Documentation/Library?id=surveymodel#showPreview)       
Shows the preview page. Fails and returns `false` if the current page has validation errors.

- [`cancelPreview()`](https://surveyjs.io/Documentation/Library?id=surveymodel#cancelPreview)     
Hides the preview page and switches the survey back to edit mode.

The following code shows how to call these methods and handle possible errors:

```js
const survey = new Survey.Model(surveyJson);

const previewShown = survey.showPreview();
if (!previewShown) {
    alert("Check the answers for validation errors")
}

survey.cancelPreview();
```

The example in this tutorial uses only the `showPreviewBeforeComplete` property:

<details>
  <summary>View Full Survey Model</summary>

```js
const surveyJson = {
    pages: [{
        elements: [{
            type: "html",
            html: "<h2>In this survey, we will ask you a couple questions about your impressions of our product.</h2>"
        }]
    }, {
        elements: [{
            name: "satisfaction-score",
            title: "How would you describe your experience with our product?",
            type: "radiogroup",
            choices: [
                { value: 5, text: "Fully satisfying" },
                { value: 4, text: "Generally satisfying" },
                { value: 3, text: "Neutral" },
                { value: 2, text: "Rather unsatisfying" },
                { value: 1, text: "Not satisfying at all" }
            ],
            isRequired: true
        }]
    }, {
        elements: [{
            name: "what-would-make-you-more-satisfied",
            title: "What can we do to make your experience more satisfying?",
            type: "comment",
            visibleIf: "{satisfaction-score} = 4"
        }, {
            name: "nps-score",
            title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
            type: "rating",
            rateMin: 0,
            rateMax: 10
        }],
        visibleIf: "{satisfaction-score} >= 4"
    }, {
        elements: [{
            name: "how-can-we-improve",
            title: "In your opinion, how could we improve our product?",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} = 3"
    }, {
        elements: [{
            name: "disappointing-experience",
            title: "Please let us know why you had such a disappointing experience with our product",
            type: "comment"
        }],
        visibleIf: "{satisfaction-score} =< 2"
    }],
    showQuestionNumbers: "off",
    pageNextText: "Forward",
    completeText: "Submit",
    showPrevButton: false,
    firstPageIsStarted: true,
    startSurveyText: "Take the Survey",
    completedHtml: "Thank you for your feedback!",
    showPreviewBeforeComplete: "showAnsweredQuestions"
};
```
</details>

## Render the Survey

Refer to the following platform-specific articles for information on how to render the survey in your application:

- [Render the Survey - Angular](https://surveyjs.io/form-library/documentation/get-started-angular#render-the-survey)
- [Render the Survey - Vue](https://surveyjs.io/form-library/documentation/get-started-vue#render-the-survey)
- [Render the Survey - React](https://surveyjs.io/form-library/documentation/get-started-react#render-the-survey)
- [Render the Survey - Knockout](https://surveyjs.io/form-library/documentation/get-started-knockout#render-the-survey)
- [Render the Survey - jQuery](https://surveyjs.io/form-library/documentation/get-started-jquery#render-the-survey)

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/multi-page-survey (linkStyle))

## See Also

- [Create a Quiz](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-quiz)
- [Conditional Logic and Dynamic Texts](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-logic)
- [Access Survey Results](https://surveyjs.io/Documentation/Library?id=handle-survey-results-access)
