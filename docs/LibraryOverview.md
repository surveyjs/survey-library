# SurveyJS Library Overview

This article describes how SurveyJS Library works, its concepts and main functionality.

We recommend that you use the [SurveyJS Creator](https://surveyjs.io/create-survey) to create a survey without any coding.

For information about integrating a survey into a web page, refer to the [Add Survey into your Web Page](https://surveyjs.io/Documentation/Library?id=get-started) article.

Please visit our [what's new page](https://surveyjs.io/WhatsNew) to see what we have added recently or what is coming soon.

- [Supported Platforms](#platforms)
- [Survey Objects](#objects)
  - [Create Simple Survey Model (Using JSON or in Code)](#objects-createmodel)
  - [Load Survey From SurveyJS Service](#objects-loadfromservice)
- [Store Survey Results](#storeresults)
  - [Use SurveyJS Service Backend](#storeresults-service)
  - [Store Survey Results in Your Own Database](#storeresults-owndatabase)
  - [Modify Survey Results](#modifysurveyresults)
- [Survey States (From 'running' to 'completed')](#states)
  - [State 'empty'](#states-empty)
  - [State 'loading'](#states-loading)
  - [State 'starting'](#states-starting)
  - [State 'running'](#states-running)
  - [State 'preview'](#states-preview)  
  - [State 'completed'](#states-completed)
- [Survey Data, Modify or View Survey Results](#data)
  - [Survey Data API](#survey-data-api)
  - [Predefined Answers](#data-predefinedanswers)
  - [Review Survey Results](#review-survey-results)
  - [Restore Answered Questions for In-Completed Survey](#data-restoreanswers)
  - [Clear Data for Invisible Questions](#data-clearinvisible)
  - [Using Variables](#data-variables)
  - [On question.value Changed, Modify Other Questions or Change Their Values](#data-onvaluechanged)
  - [Share the Same Data Between Two or More Questions](#data-sharedata)
- [Pages, Visibility and Navigation](#pages)
  - [Page Visibility](#page-visibility)
  - [Navigation](#navigation)
- [Questions and Containers Conditional Visibility, Read-Only and Required Questions](#conditions)
  - [Boolean Expressions](#conditions-expressions)
  - [Functions in Expressions](#conditions-functions)
    - [Built-in Functions](#builtin-functions)
    - [Custom Functions](#custom-functions)
  - [Asynchronous Functions in Expressions](#conditions-asyncfunctions)
  - [Cascade Conditions](#conditions-cascading)
- [Dynamically Filter Choices, Columns, and Rows](#itemvaluesfiltering)
  - [Method #1: Specify Visibility Conditions for Individual Options](#method-1-specify-visibility-conditions-for-individual-options)
  - [Method #2: Display Options Selected in Previous Questions](#method-2-display-options-selected-in-previous-questions)
- [Fill the Choices From a Restful Service](#choicesByUrl)
- [Readonly and EnableIf Expression](#readonly)
- [Text Processing, Dynamic Titles, and HTML Properties](#textprocessing)
  - [Question Numbers](#question-numbers)
  - [Question Required Mark](#question-required-mark)
- [Calculated Values](#calculatedvalues)
- [Client and Server-Side Validation](#validation)
  - [Standard Validators](#validation-standard)
  - [Custom Validation (on Event)](#validation-event)
  - [Custom Validators](#validation-custom)
  - [Validate Results on Server](#validation-onserver)
- [Localization and Multilanguage Support](#localization)
  - [Create a Multilanguage Survey](#create-a-multilanguage-survey)
- [Extend SurveyJS Elements by Adding Properties](#addproperties)
- [Triggers: Control the Survey Logic](#triggers)
  - [Available Triggers](#available-triggers)

<div id="platforms"></div>

## Supported Platforms

The SurveyJS Library is a JavaScript library that available for five platforms:

- Angular
- jQuery
- knockout
- react
- vue

**Please note**: If you do not use any of this framework and do not use jQuery, then the right choice is [knockout](http://knockoutjs.com). It is a small library that helps creating UI with Model-View-View-Model pattern. You can include knockout script (~25k min+gz) just for SurveyJS and forget about this library existing in your application. 

The library itself consists of two parts:

- **Survey Model**

  A platform independent part. In the most case, you work with **Survey Model**.
  
- **The platform specific code**

  This part deals with rendering and processing mouse and keyboard events.
  
w  The **jQuery** and **Angular** versions are the wrappers around the **knockout** version with built-in **knockout** library in them. **Knockout**, **react**, and **vue** implementations are native.

<div id="objects"></div>

## Survey Objects

SurveyJS implements three main object types:

- **survey**,
- **containers** (pages and panels),
- **questions**.

The **survey** object is the root element, that contains top level properties/options, methods, and events. It contains top-level containers – **pages**. Every **page** may contain unlimited number of **panels** and **questions**, where **panel** can contain another **panels** and **questions** (nested **panels** are supported).

<div id="objects-createmodel"></div>

### Create Simple Survey Model (Using JSON or in Code)

You can create a survey model in two ways:

- define a survey model in JSON and pass a JSON object to the Survey's constructor as a parameter
- create a survey model in code.

#### In JSON

The example below demonstrates how to create a simple survey model using JSON. This survey contains a single page and a text question in it:

```javascript
var json = {
  pages: [
    {
      name: "page1",
      elements: [
        { type: "text", name: "question1" }
      ]
    }
  ]
}
var survey = new Survey.Survey(json);
```

In the example above, the survey model contains a single page. In this case, you can remove the "pages" and "page1" definition: **SurveyJS** creates a page automatically. As result, the JSON may look like follows:

```javascript
var json = {
    elements: [
      { type: "text", name: "question1" }
    ]
  }
var survey = new Survey.Survey(json);
```

#### In Code

You can create a survey in code:

```javascript
var survey = new Survey.Survey();
var page = survey.addNewPage("page1");
page.addNewQuestion("text", "question1");
```

#### In JSON and in Code

You can combine these two approaches.

The example below demonstrates how to create a survey model in JSON and then modify the model in code.

```javascript
var json = {
  pages: [
    {
      name: "customerContact", elements: [
        { type: "text", name: "name", title: "Please enter your name:" },
        { type: "text", name: "email", title: "Please enter your e-mail:" }
      ]
    }
  ]
  };
  // Create initial survey model using json
  var survey = new Survey.Survey(json);
  // Create a placeholder for an "email" question
  var emailQuestion = survey.getQuestionByName("email");
  if (emailQuestion) emailQuestion.placeHolder = "json.snow@nightwatch.org";
  // Add a new question into an existing page
  var contactPage = survey.getPageByName("customerContact");
  if (contactPage) {
    var fbPageQuestion = contactPage.addNewQuestion("text", "fbPage");
    fbPageQuestion.title = "Please enter your facebook page:"
  }
  //You may create a new page or remove/add pages, add/remove questions, panels, modify them, etc.
```

<div id="objects-loadfromservice"></div>

### Load Survey From SurveyJS Service

**SurveyJS** allows you to load a survey model JSON from [SurveyJS Service](https://surveyjs.io/Service/MySurveys). The main benefit of this approach – you can modify the survey without modifying your web page.

To load survey model from SurveyJS Service, do the following:

1. Register on [SurveyJS web site](https://surveyjs.io/Account/Register).
2. Create a new Survey in the [SurveyJS Service](https://surveyjs.io/Service/MySurveys).
3. In the [SurveyJS Service](https://surveyjs.io/Service/MySurveys) page, copy your Survey Id.

    ![get survey id](https://github.com/surveyjs/surveyjs/blob/master/docs/images/survey-id.png?raw=true)

4. Create a survey as shown in a code sample below.

    ```javascript
    var json = {
      surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1'
      };
    var survey = new Survey.Survey(json);
    ```

> **Example**
>
> Demo: [Load a survey from SurveyJS Service](https://surveyjs.io/Examples/Library/?id=service-load).

<div id="storeresults"></div>

## Store Survey Results

After you have created your survey and integrated it into your web site, you need to save the survey results.

You may store survey results:

- [in SurveyJS backend](#storeresults-service),
- [in your own database](#storeresults-owndatabase).

<div id="storeresults-service"></div>

### Use SurveyJS Service Backend

SurveyJS has the backend [SurveyJS Service](https://surveyjs.io/Service/) to store your surveys' results. This approach doesn't require to write any code and is free for now.

To store survey results on SurveyJS backend, do the following:

1. Register on [SurveyJS web site](https://surveyjs.io/Account/Register).
2. [Create a new survey](https://surveyjs.io/Service/MySurveys). If you do not want to load the survey from SurveyJS service, then you do not need to keep the survey definition in the service.
3. Get a Post Id for a new survey:

    ![survey get post id](https://github.com/surveyjs/surveyjs/blob/master/docs/images/survey-get-postid.png?raw=true)

4. Set the Survey's [surveyPostId](https://surveyjs.io/Documentation/Library/?id=surveymodel#surveyPostId) to the _PostId_ value:

    ```javascript
    var survey = new Survey.Survey(json);
    survey.surveyPostId = "YourPostIdGuid";
    //Optionally, show saving progress and show an error and "Save Again" button if the results can't be stored.
    survey.surveyShowDataSaving = true;
    ```

> **Example**
>
> [Save survey results in SurveyJS backend](https://surveyjs.io/Examples/Library/?id=service-send)

#### Show Progress and Try Again Button

You can optionally show the saving progress by setting the [surveyShowDataSaving](https://surveyjs.io/Documentation/Library/?id=surveymodel#surveyShowDataSaving) property to `true`. When the option is enabled, the survey shows the "Saving..." message. Then, the survey shows if the operation was successful or an error occurred after the callback from SurveyJS service.

If an error occurs, the survey displays the "Save Again" button, so an end user can try to send survey results again.

You can override the default UI and message texts as shown in the code sample below.

```javascript
Survey.surveyStrings.savingData = "Please wait. We are validating and saving your response.";
Survey.surveyStrings.savingDataError = "That is my own text on error.";
Survey.surveyStrings.savingDataSuccess = "That is my own text on success.";
Survey.surveyStrings.saveAgainButton = "Try to save again.";
```

Refer to [Localization and Multilanguages support section](#localization) for more information on SurveyJS strings and localization

<div id="storeresults-owndatabase"></div>

### Store Survey Results in Your Own Database

To store the survey results in your own storage, you use the [onComplete](https://surveyjs.io/Documentation/Library/?id=surveymodel#onComplete) event. It fires when an end user clicks the "Complete" button and a survey completion page is displayed.

The implementation of the storing survey results in the database fully depends on your server backend and database.

The code sample below demonstrates how to send the survey results to your service, in case you have implemented the services on your web site:

```javascript
survey.onComplete.add(function (sender, options) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "YourServiceForStoringSurveyResultsAsJSON_URL");
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(sender.data));
});
```

#### Show Progress and Try Again Button

You can show the progress and error messages:

```javascript
survey.onComplete.add(function (sender, options) {
    //Show message about "Saving..." the results
    options.showDataSaving();//you may pass a text parameter to show your own text
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "YourServiceForStoringSurveyResultsURL");
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.onload = xhr.onerror = function () {
        if (xhr.status == 200) {
            options.showDataSavingSuccess(); // you may pass a text parameter to show your own text
            // Or you may clear all messages:
            // options.showDataSavingClear();
        } else {
            //Error
            options.showDataSavingError(); // you may pass a text parameter to show your own text
        }
    };
    xhr.send(JSON.stringify(sender.data));
});
```

<div id="modifysurveyresults"></div>

### Modify Survey Results

SurveyJS sends survey results in the following format:

```js
{questionName: questionValue, ... }
```

The code sample below demonstrates how to change the standard format to

```js
{ questionName:
    {
        value: questionValue,
        title: questionTitle,
        displayValue: questionDisplayValue,
        tag: question.tag
    }
}
```

... where `tag` is a custom property added into question class.

```javascript
// Adding custom numeric property to a question
// Survey.Serializer.addProperty("question", "tag:number")
function modifySurveyResults(survey) {
  var resultData = [];
  for(var key in survey.data) {
    var question = survey.getQuestionByValueName(key);
    if(!!question) {
      var item = {value: question.value};
      //If question name (question.valueName) doesn't equal to question.title
      if(key !== question.title) {
        item.title = question.title;
      }
      //If question value different from displayValue
      if(item.value != question.displayValue) {
        item.displayValue = question.displayValue
      }
      //If the custom property tag is defined set
      if(question.tag !== undefined) {
        item.tag = question.tag;
      }
      resultData.push(item);
    }
  }
  return resultData;
}
```

Another option is to use the [survey.getPlainData()](https://surveyjs.io/Documentation/Library/?id=surveymodel#getPlainData) function. It returns survey result data as an array of plain objects: with question title, name, value, and displayValue.

You may use _modifySurveyResults_ function as _modifySurveyResults(survey)_ instead of _survey.data_ in _survey.onComplete_ event.

<div id="states"></div>

## Survey States (From 'running' to 'completed')

Survey may have five different states. To get the current state, check the [state](https://surveyjs.io/Documentation/Library/?id=surveymodel#state) read-only property. This section describes all the survey states.

<div id="states-empty"></div>

### State 'empty'

If the survey model has no visible questions/pages, the survey is in the **empty** state. The widget shows a message that a survey is empty: "There is no visible page or question in the survey.". You can change this text like follows:

```javascript
Survey.surveyStrings.emptySurvey = "The current survey is empty";
```

<div id="states-loading"></div>

### State 'loading'

If the **SurveyJS** loads a survey model from [SurveyJS Service](https://surveyjs.io/Service/), the survey is in the **loading** state. The message about survey loading is showing. The widget shows a message that a survey is loading. You can change this text like follows:

```javascript
Survey.surveyStrings.loadingSurvey = "Please wait. Your survey is loading…";
```

<div id="states-starting"></div>

### State 'starting'

**SurveyJS** can display a start page (with any introduction info about the survey, start button, etc.) before displaying the first survey page. Displaying a start page is necessary when you [create a quiz](https://surveyjs.io/Documentation/Library/?id=Create-a-quiz) (a limited to time survey).

Set the [firstPageIsStarted](https://surveyjs.io/Documentation/Library/?id=surveymodel#firstPageIsStarted) property to `true` to show a start page instead a first survey page when a survey is loaded. An end user cannot come back to a start page after clicking the "start" button.

If the **SurveyJS** shows a start page, the survey is in the **starting** state.

You can change the [startSurveyText](https://surveyjs.io/Documentation/Library/?id=surveymodel#startSurveyText) property value to modify the "start" button text.

<div id="states-running"></div>

### State 'running'

While survey pages (with "Previous", "Next" and "Complete" buttons) are displayed to an end user, the survey is in the **running** state.

<div id="states-preview"></div>

### State 'preview'

You can allow respondents to preview and correct their answers before completing a survey. When survey preview mode is available, a survey's last page displays the "Preview" button instead of the "Complete" button. 
A respondent's click on the "Preview" button switches the survey to preview state. In preview, all questions (or, optionally, only answered ones) are displayed on one page in read-only mode. Each survey page converts into a panel, every panel contains an "Edit" button". 
Respondents can then switch to edit mode:
for a panel - by clicking the panel's "Edit" button to edit questions of the corresponding survey page,
for the entire survey (starting from its beginning) - by clicking the "Edit" button on Navigation tab.

If a respondent is satisfied with the answers, he/she can click the "Complete" button to submit the survey results.

Use the [showPreviewBeforeComplete](https://surveyjs.io/Documentation/Library/?id=surveymodel#showPreviewBeforeComplete) option to control the preview mode's availability and settings. The functionality is disabled by default.

`survey.showPreviewBeforeComplete: string, ["noPreview", "showAllQuestions", "showAnsweredQuestions"]`, "noPreview" is the default value.

`noPreview` - Preview mode is not available.  
`showAllQuestions` - Displays all visible questions on the preview page.  
`showAnsweredQuestions` - Displays only answered visible questions on the preview page. If you change this property when a survey is in the "preview" state and the preview page is displayed, then this change will not take effect.

```javascript
survey.showPreviewBeforeComplete = 'showAnsweredQuestions';
```

Example:  
[Show Preview Before Complete](https://surveyjs.io/Examples/Library?id=survey-showpreview)

To dynamically enter/leave preview mode via code, use the [showPreview](https://surveyjs.io/Documentation/Library/?id=surveymodel#showPreview) and [cancelPreview](https://surveyjs.io/Documentation/Library/?id=surveymodel#cancelPreview) methods.  

`survey.showPreview(): boolean` - Switches a survey to the preview state; returns false if there is an error on the page.  
`survey.cancelPreview()` - Switches back to edit mode.

<div id="states-completed"></div>

### State 'completed'

When a survey is completed:

- the survey is in the **completed** state;
- the survey displays a [complete page](#complete-page);
- the **survey.onCompleted** event is fired.

<div id="complete-page"></div>

#### Complete Page

You can turn off the complete page by setting the [showCompletedPage](https://surveyjs.io/Documentation/Library/?id=surveymodel#showCompletedPage) to `false`. When the complete page is disabled, the survey is still in the **completed** state, but the survey widget becomes invisible to end users.

Use the [completedHtml](https://surveyjs.io/Documentation/Library/?id=surveymodel#completedHtml) property to specify the complete page's HTML. This property supports [text preprocessing](#textprocessing). To see how it works in action, refer to the [Process Text](https://surveyjs.io/Examples/Library/?id=survey-processtext) example.

#### Replay Survey in Read-Only Mode

When the survey is completed, the [onComplete](https://surveyjs.io/Documentation/Library/?id=surveymodel#onComplete) event occurs. In most cases, this event is used to save the survey results in [your own database](#storeresults).

However, you can show the same survey to an end user from the beginning, but in read-only mode:

```javascript
survey.onComplete.add(function (sender, options) {
  // By default, the 'clear' method clears all data and go to the first page
  // Make a survey to keep the results by passing the first parameter as 'false'
  sender.clear(false);
  // Turn a survey into read-only mode
  sender.mode = "display";
});
```

<div id="data"></div>

## Survey Data, Modify or View Survey Results

SurveyJS provides access to survey results. This can be helpful in the following cases:

- make predefined answers to particular questions before the survey starts
- review survey results
- restore the answered questions if an end user leaves a survey uncompleted
- clear data for invisible questions
- depending on question's answer, modify other question answers.

<div id="survey-data-api"></div>

### Survey Data API

Survey expose the [surveymodel.data](https://surveyjs.io/Documentation/Library/?id=surveymodel#data) property, that contains survey results in JSON format `question name: questions value`.

Every question, except **html question** that does not have input, has a writable [question.value](https://surveyjs.io/Documentation/Library/?id=Question#value) property. The **value** property does not store its value. The actual question value is stored in **survey.data**. You can access a question value using the **survey.getValue(name)** and **survey.setValue(name, newValue)** functions.

Thus, the `myQuestion.value` code returns the same result as `survey.getValue(myQuestion.name)`.

To be more precise, the **question.name** is used, unless **question.valueName** property is empty. We will talk about valueName property later, in one of described scenarios.

<div id="data-predefinedanswers"></div>

### Predefined Answers

You may need to have predefined answers. For example, you need to have a default value for Boolean question as `True`. To specify a default value, use the [question.defaultValue](https://surveyjs.io/Documentation/Library/?id=Question#defaultValue) property. You can specify this property in JSON, or in our [Survey Creator](https://surveyjs.io/create-survey). After loading the JSON, on starting the survey, the **defaultValue** property is copied to the **question.value** property.

> **Tip**
>
> You can use the **question.value** property or **survey.setValue(name, newValue)** function to set the needed value in code at any time.

<div id="review-survey-results"></div>


### Review Survey Results

To review survey results, stored in your own data base, you can use a survey in read-only mode:

```javascript
survey.data = JSON.parse(YourResultAsStringFromDatabase);
survey.mode = "display"; //set a survey to read-only mode
```

<div id="data-restoreanswers"></div>

### Restore Answered Questions for In-Completed Survey

When an end user does not complete a survey in a single session, and returns to a survey later, you can refill the survey results and a last visited page. You can save the incomplete results in your data base or in a browser local storage.

To save the incomplete results, set the [survey.sendResultOnPageNext](https://surveyjs.io/Documentation/Library/?id=surveymodel#sendResultOnPageNext) property to `true`. Each time an end user navigates the next page, the [survey.onPartialSend](https://surveyjs.io/Documentation/Library/?id=surveymodel#onPartialSend) event occurs.

The code sample below implements restoring answered questions and current page from a local browser storage.

```javascript
survey.sendResultOnPageNext = true;
var storageName = "yourSurveyUniqueNameOrId";
function saveSurveyData(survey) {
  var data = survey.data;
  data.pageNo = survey.currentPageNo;
  window.localStorage.setItem(storageName, JSON.stringify(data));
}
survey.onPartialSend.add(function (survey) {
  saveSurveyData(survey);
});
survey.onComplete.add(function (survey, options) {
  saveSurveyData(survey);
});
var prevData = window.localStorage.getItem(storageName) || null;
if (prevData) {
  var data = JSON.parse(prevData);
  survey.data = data;
  if (data.pageNo) {
  survey.currentPageNo = data.pageNo;
  }
}
```

> **Example**
>
>  [Patient Medical History](https://surveyjs.io/Examples/Library/?id=real-patient-history) 

<div id="data-clearinvisible"></div>

### Clear Data for Invisible Questions

SurveyJS clears values for invisible questions by default. To change this behavior, change the [clearInvisibleValues](https://surveyjs.io/Documentation/Library/?id=surveymodel#clearInvisibleValues) property value to:

- **none** - survey includes the invisible values into the survey data.
- **onHidden** - survey clears the question value when the question becomes invisible. If a question has an answer value and it was invisible initially, a survey clears the value on completing. This option is useful if you have a cascade [condition](#conditions) in `visibleIf` expressions.
- **onComplete** (default) - survey removes property values of invisible questions on survey complete. In this case, the invisible questions will not be stored on the server.

<div id="data-variables"></div>

### Using Variables

SurveyJS allows you to use **variables**:

- you can use variables in [expressions](#conditions) and [text processing](#textprocessing),
- variables are not used in questions and are not stored in survey data.

To create a new value or change its value, call `survey.setVariable("variableName", value)`. Call `survey.getVariable("variableName")` to get the variable value.

<div id="data-onvaluechanged"></div>

### On question.value Changed, Modify Other Questions or Change Their Values

In survey scenarios, changing a question value may require changing other questions.

_Example 1_. In the first question, you ask end users to select producers of cars they drove before. In the second question, you ask end users to select a car producer they like the most, from the car producers selected in the previous question.

_Example 2_. The first question is "Please select the language(s) you are speaking" and the second question "Please select the language(s) you want to learn". The choices from the second question do not contain selected choices from the first question.

Use the [survey.onValueChanged](https://surveyjs.io/Documentation/Library/?id=surveymodel#onValueChanged) event to implement this scenarios.

The code sample below implements the _Example 2_.

```javascript
survey.onValueChanged.add(function(survey, options){
if(options.name !== "know") return;
knownChoices = options.question.choices;
var choices = [];
for(var i = 0; i < knownChoices.length; i ++) {
    var item = knownChoices[i];
    // the item is not selected
    if(options.value.indexOf(item.value) < 0) {
        choices.push(item);
    }
}
var learnQuestion = survey.getQuestionByName("learn");
learnQuestion.choices = choices;
learnQuestion.visible = choices.length > 0;
});
```

Refer to the [Plunker snippet](https://plnkr.co/edit/AtodHh?p=preview) for the complete code sample.

> **Note:**
>
> The second scenario can be implemented without coding, by setting **choicesVisibleIf** property. Refer to the [Dynamically Filter Choices, Columns and Rows](#itemvaluesfiltering) section for more information.

<div id="data-sharedata"></div>

### Share the Same Data Between Two or More Questions

SurveyJS allows you to share data between different questions.

This may be useful in the following cases:

1. Show the same question on different pages (for example, an end user enters their email on the first page, then confirms it on the last page).
2. Create a complex form without additional coding (for example, an end user enters several items, moves to the next page and enters more details for each item).

Having the same **question.name** is not a good idea, those questions may be different and can have their own logic on showing/hiding or enabling/disabling. For this purpose, we have introduced **question.valueName** property. If this property is set, then question is using **valueName** property, instead of **name** property, to get/set its value from the survey data storage.

You can create complex forms without writing a single line of code. For example, you need to get an information about your user employees. On the first page, the user enters employee names, on the next page(s) the user enters additional information about each of them.

On the first page, you have a matrix dynamic question, with ability to add/delete rows and one column: Name. On the second page, you ask an additional information about employees using panel dynamic. It works fine, because for both questions the value is an array of objects. 

> **Example**
>
> [Sharing data between matrix dynamic and panel dynamic questions](https://surveyjs.io/Examples/Library/?id=survey-shareddata)

<div id="pages"></div>

## Pages, Visibility and Navigation

**Questions** and **panels** (container) are located on **pages**. Every survey should have at least one visible **page**.

### Page Visibility

The page is visible if:

- the **visible** property equals to `true` (the default value),
- the **visibleIf** property is empty (for more information about **visibleIf** expression, refer to the [Conditions](#conditions) section),
- its expression returns `true` and the page has at least one visible question.

SurveyJS doesn't show pages that have no visible questions, it skips them automatically.

### Navigation

#### Page List

Use the following properties to get the survey pages:

- **survey.pages** - returns a list of all pages;
- **survey.visiblePages** - returns a list of visible pages. End users navigate visible pages and this array may be changed while a user runs a survey.

#### Current Page

Use the **survey.currentPage** property to get or set the current page. If a survey has no visible pages, this property returns `null`.

To change the current page from the code you may call:

```javascript
survey.currentPage = myPage;

// or change the current page using visible page zero-based index
survey.currentPage = visiblePageIndex;  

// or change the current page by setting the page name
survey.currentPage = "myCurrentPage";
```

#### Navigate Next, Previous Page, or Complete

SurveyJS allows you to navigate survey pages in code:

- to a previous page - call **survey.prevPage()**;
- to a next page - call **survey.nextPage()**;
- to complete a survey - call **survey.completeLastPage()**.

The **prevPage()** function returns `false` and do not change a current page, if the current page is already the first page.

The **nextPage()** and **completeLastPage()** functions return `false` and do not go to the next page or complete a survey if there are any errors on the current page. An end user must fix them first to go further. Refer to [Validation](#validation) for more information.

SurveyJS exposes the following navigation events:

- [survey.onCurrentPageChanged](https://surveyjs.io/Documentation/Library/?id=surveymodel#onCurrentPageChanged)
- [survey.onCurrentPageChanging](https://surveyjs.io/Documentation/Library/?id=surveymodel#onCurrentPageChanging).

Set **survey.showNavigationButtons** to `false` to hide the default navigation buttons, and create your own navigation by using these functions and events. 

> **Example**
>
> [Custom Navigation](https://surveyjs.io/Examples/Library/?id=survey-customnavigation)

Here are additional properties that you may find useful:

- **showPrevButton** - set it to `false` to hide the previous button. In this case, your users cannot comeback to the previous page
- **pagePrevText** - specifies the previous button text
- **pageNextText** - specifies the next button text
- **completeText** - specifies the complete button text

#### Automatic Navigation

You can enable the **automatic navigation** by setting the **goNextPageAutomatic** property to `true`. In this case, a survey automatically goes to the next page when a user has answered all questions. 

> **Example**
>
> [Go to the next page automatically](https://surveyjs.io/Examples/Library/?id=survey-autonextpage)

#### Survey Progress

To show a progress bar, set the **showProgressBar** property to `top`, `bottom` or `both`. To change the default text: `Page x of N`, change the localization string **Survey.defaultStrings.progressText**, the default string for English localization is: "_Page {0} of {1}_".

#### All Questions on a Single Page

SurveyJS can display all the questions on a single page. It may be useful when you want your users to review their answers in read-only mode. Set the [survey.isSinglePage](https://surveyjs.io/Documentation/Library/?id=surveymodel#isSinglePage) property to `true` to display all the questions on a single page.

#### Skip Pages

SurveyJS allows you to set a visibility expression for individual pages, panels, and questions. If a page has no visible panels or questions, the page becomes invisible. SurveyJS automatically skips invisible pages. Refer to the next section for more information about visibility expressions.

<div id="visibility"></div>
<div id="conditions"></div>

## Questions and Containers Conditional Visibility, Read-Only and Required Questions

SurveyJS allows you to implement custom logic in surveys. For example, you may need to ask different questions based on age, for loyal or unhappy customers, or you may make some questions read-only or required based on answers in other questions.

SurveyJS has a powerful and flexible expression engine powered by [PEG.js](https://pegjs.org/) parser generator.

<div id="conditions-expressions"></div>

### Boolean Expressions

Questions, panels and pages have [visibleIf](https://surveyjs.io/Documentation/Library/?id=Question#visibleIf), [enableIf](https://surveyjs.io/Documentation/Library/?id=Question#enableIf) and [requiredIf](https://surveyjs.io/Documentation/Library/?id=Question#requiredIf) properties.

These properties are empty by default. Each element's behavior depends on the **isVisible**, **isReadOnly** and **isRequired** properties. The question containers (panel and page) become invisible if they have no visible questions.

Before rendering the first page, SurveyJS parses all Boolean expressions (**visibleIf**, **enableIf**, and **requiredIf**), creates the expression trees, and run all expressions. Later, SurveyJS runs all expressions after any value change. If the expression returns `false`, the element becomes invisible (or read-only or non required), if it returns `true` – visible (enabled, required). The question values should be in braces: `{yourQuestionValueName}`.

Here are some examples of Boolean expressions.

| Expression | Description |
| --- | --- |
| `"{age} >= 21"` | Returns `true` if the _age_ question has value 21 or higher |
| `"({rank1} + {rank2} + {rank3}) > 21 and {isLoyal} == 'yes'"`   | Use `or` and `and` operators, squares and arithmetic operations |
| `"!({isLoyal} == 'yes' and ({rank1} + {rank2} + {rank3}) > 21)"` | Use "!" or "not" to change the result on opposite |
| `"{name} notempty"` | Returns `true` if _name_ has a value |
| `"{name} empty"` | Returns `true` if _name_ has no value |
| `"{speakinglanguages} = ['English', 'Spanish']"` | Returns `true`, if a user selects these two valus in _speakinglanguages_ question. It is typically a checkbox. |
| `"{speakinglanguages} contains 'Spanish'"` | Returns `true`, if a user select 'Spanish' in checkbox. They may or may not select other values. |
| `"age({birthdate}) >= 21"` | Returns `true`, if function _age_ returns 21 and greater. The function _age_ calculates the age based on the birth date and the current date. |

If your question has complex values, then you may use dot "." to access the child value.

- multiple text - `{questionname.itemname}`
- matrix - `{questionname.rowname}`
- matrix dropdown - `{questionname.rowname.columnname}`

To access the question value inside the panel dynamic, use the following syntax: `{dynamicpanelname[index].questionname}`, where _index_ is zero-based.

To access the cell value of the matrix dynamic, write the following code: `{matrix[index].columnname}`, where _index_ is zero-based.

#### Cell Visibility in Matrix and Dynamic Panel Questions

You can make a cell in a matrix question invisible or disabled based on other cells value on the same row. In this case, use the prefix `row` to access a cell value on the same row: `{row.columnname}`.

You can use the same approach in dynamic panels. To access questions value on the same panel in the expression, use the `panel` prefix: `{panel.questionName}`.

<div id="conditions-functions"></div>

### Use Functions in Expressions

You can use functions in expressions to perform additional calculations.
Functions support an arbitrary number of parameters and share the following general syntax:

`functionName(arg1, arg2, ...argN)`

The following rules apply:

* **functionName**   
A valid function name in lower camel case.
* **()**  
The function name is followed by an open and close parentheses, even if the function takes no arguments.
* **,**  
The comma is the only allowed delimiter to separate the function arguments. Arguments may be optional.

An expression can contain more than one function calls, including calls to **[built-in functions](#builtin-functions)** and **[custom functions](#custom-functions)** that you can create.  

 A function parameter can accept a question value pointer variable - a specific expression that points to a question whose value to obtain and use as a function argument. Such an expression specifies the question by its name in curly brackets, for instance as `{question1}`.

As an example, the following expression uses two built-in functions (`age` and `iif`) to find out whether the value of the "birthdate" question is greater than or equal to 21 and to return `"yes"` or `"no"` correspondingly.
 ```
 "expression": "iif(age({birthdate}) >= 21, 'yes', 'no')"
```

For illustrative purposes, the code sample below shows how the built-in `age` function is implemented in SurveyJS sources (see [source code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L218-L230) for more details).


```javascript
// The age function accepts the birth date
// and returns the current age as the number of full years.
function age(params: any[]): any {
  if (!params && params.length < 1) return null;
  if (!params[0]) return null;
  var birthDate = new Date(params[0]);
  var today = new Date();
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= age > 0 ? 1 : 0;
  }
  return age;
}
// The function is registered for use in SurveyJS expressions.
FunctionFactory.Instance.register("age", age);
```

<div id="builtin-functions"></div>  

#### **Built-in Functions**

A list of built-in functions which are already implemented and registered within SurveyJS Library is given below.




<div id="builtin-functions-iif"></div>  

**_iif_**  
_iif(condition: expression, valueIfTrue: any, valueIfFalse: any): any_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L205-L209)  
Returns the value specified by _valueIfTrue_ if the given _condition_ is truthly and the value specified by _valueIfFalse_ if the _condition_ is falsy. The condition is an expression that can contain typical operands/operators and references to question values (as question names in curly brackets).  
Example:  
`expression: "iif({question1} + {question2} > 20, 'high', 'low')"`


<div id="builtin-functions-isContainerReady"></div>  

**_isContainerReady_**  
_isContainerReady(nameOfPanelOrPage: string): Boolean_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L232-L245)  
Returns `true`, if all questions in the specified container (panel or page) are answered correctly (a respondent provided a valid input). This function recursively validates all questions in the container. If there is an error, the function returns `false`, otherwise `true`. In case a question's value is empty and neither validators no required status are defined for the editor, validation would pass successfully.  
Example:  
`expression: "isContainerReady('page1')"`


<div id="builtin-functions-isDisplayMode"></div>  

**_isDisplayMode_**  
_isDisplayMode(): Boolean_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L247-L250)  
Returns `true` if a survey is in display mode.  
Example:  
`expression: "isDisplayMode()"` 



<div id="builtin-functions-age"></div>  

**_age_**  
_age(birthDate: any): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L218-L230)  
Returns the age according to the date of birth passed. The passed date value (which is typically taken from the referenced question) should be defined as a valid [JavaScript Date](https://www.w3schools.com/jsref/jsref_obj_date.asp).  
Example:  
`expression: "age({birthdate})"`



<div id="builtin-functions-currentDate"></div>  

**_currentDate_**  
_currentDate(): Date_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L252-L255)  
Returns the current date.  
Example:  
`expression: "currentDate()"`



<div id="builtin-functions-today"></div>  

**_today_**  
_today(daysToAdd?: number): Date_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L257-L264)  
Returns the current date or a date calculated using an optional parameter. The parameter specifies the number of days to be added to the current date. For example, "today()" returns the current date 0 hours, 0 minutes, "today(-1) returns yesterday's date, "today(1)" returns tomorrow's date, "today(2) returns day after tomorrow date, and so on.  
Examples:  
`expression: "today()"`  
`expression: "today(2)"`




<div id="builtin-functions-getDate"></div>  

**_getDate_**  
_getDate(questionName: expression): Date_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L211-L216)  
Returns the specified question's date value.  
Example:  
`expression: "getDate({dateQuestionForBirthday})"`



<div id="builtin-functions-diffDays"></div>  

**_diffDays_**  
_diffDays(dateFrom: any, dateTo: any): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L266-L274)   
Returns the number of days between two dates. Dates are typically specified by expressions that correspond to questions (by their names in curly brackets) containing date values.  
Example:  
`expression: "diffDays({startDate}, {endDate}) < 7"`








<div id="builtin-functions-sum"></div>  

**_sum_**  
_sum(par1: number, par2: number, ...): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L247-L250)  
Returns the sum of the passed arguments.  
Example:  
`expression: "sum({total1}, {total2})"`


<div id="builtin-functions-max"></div>  

**_max_**  
_max(par1: number, par2: number, ...): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L106-L109)  
Returns the largest value from a list of the passed arguments. [From v1.5.19.](https://surveyjs.io/whatsnew#v1.5.19)  
Example:  
`expression: "max({total1}, {total2})"`

<div id="builtin-functions-min"></div>  

**_min_**  
min(par1: number, par2: number, ...): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L101-L104)  
Returns the largest value from a list of the passed arguments. [From v1.5.19.](https://surveyjs.io/whatsnew#v1.5.19)  
Example:  
`expression: "min({total1}, {total2})"`


<div id="builtin-functions-avg"></div>  

**_avg_**  
_avg(par1: number, par2: number, ...): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L118-L127)  
Returns the average value of the passed arguments.  
Example:  
`expression: "avg({total1}, {total2}, {total3})"`


<div id="builtin-functions-sumInArray"></div>  

**_sumInArray_**  
_sumInArray(questionName: expression, propertyName: string): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L164-L171)  
Returns the sum of values in a array taken from the specified question property (both - the question and its property - are referenced by their names).  
Example:  
`expression: "sumInArray({matrixdynamic1}, 'total') > 1000"`  
[View code sample](https://www.surveyjs.io/Examples/Library?id=questiontype-expression#content-js)


<div id="builtin-functions-maxInArray"></div>  

**_maxInArray_**  
_maxInArray(questionName: expression, propertyName: string): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L181-L187)  
Returns the maximum of all values in an array specified by a property (_propertyName_) of a matrix question (_questionName_ specified as the question name in curly brackets).  
Example:  
`expression: "maxInArray({matrixdynamic4}, 'quantity') > 20"`



<div id="builtin-functions-minInArray"></div>  

**_minInArray_**  
_minInArray(questionName: expression, propertyName: string): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L173-L179)  
Returns the minimum of all values in an array referenced by a property (_propertyName_) of a matrix question (_questionName_ specified as question name in curly brackets).  
Example:  
`expression: "minInArray({matrixdynamic3}, 'quantity') > 5"`



<div id="builtin-functions-avgInArray"></div>  

**_avgInArray_**  
_avgInArray(questionName: expression, propertyName: string): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L198-L203)  
Returns the average of all values in an array referenced by a property (_propertyName_) of a matrix  question (_questionName_ specified as question name in curly brackets).  
Example:  
`expression: "avgInArray({matrixdynamic2}, 'quantity') > 10"`



<div id="builtin-functions-countInArray"></div>  

**_countInArray_**  
_countInArray(questionName: expression, propertyName: string): number_  
[View source](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L189-L196)  
Returns the total number of items in an array referenced by a property (_propertyName_) of a matrix question (_questionName_ specified as the question name in curly brackets).  
Example:  
`expression: "countInArray({matrixdynamic5}) > 10"`





If you feel there is a need in a particular function, then [write us](https://github.com/surveyjs/surveyjs/issues) about it.

<div id="conditions-asyncfunctions"></div>


<div id="custom-functions"></div>

#### **Custom Functions**

You can write, register, and use your own functions in expressions. 

**Implementation rules**

The following basic rules exist: 

1. Use a valid function name  
A function's name should be in lower camel case (e.g. `myCustomFunction`).   

2. Use a single array-like parameter for arguments  
A function's argument objects should be passed and processed within the function as a single parameter - an array-like object containing the values of the passed arguments.  

    As an example, consider a custom function that accepts more than one parameter and is called with the following syntax in an expression.  
    `expression: "myFunc({question1}, {question2})"`  

    The function should be implemented in the following manner:
    ```
    function myFunc(params) {
       let q1_value = params[0];
       let q1_value = params[1];
       ...
    }
    ```
    instead of: 
    ```
    function myFunc(q1_value, q2_value) {
    }
    ```
    Otherwise, the function will not work.  

3. Register your custom function  
You should register your custom function to make it usable within SurveyJS expressions. Use the `FunctionFactory.Instance.register` method to register a function.  
This method has the following signature:  
`FunctionFactory.Instance.register(funcName: string, func: any, isAsync?: boolean = false);`
   * _funcName_ - the function name,
   * _func_ - a reference to the function,
   * _isAsync_ - whether the function is asynchronous.

    Usage example:  
    ```javascript
    function myFunc(params: any[]): any {
        ...
    }
    // Function registration
    FunctionFactory.Instance.register("myFunc", myFunc); 

    function myAsyncFunc(params: any[]): any {
        ...
    }
    // Registration of async function 
    FunctionFactory.Instance.register("myAsyncFunc", myAsyncFunc, true);  
    ```


**Access survey element instances inside a custom function**

Inside a custom function's implementation, you have access to the entire [survey object](https://surveyjs.io/Documentation/Library/?id=surveymodel) through `this.survey` (available from v1.0.21).

As a result, you are able to access any element (and its values) within a survey.

You can design your custom function so that it accepts the name of a survey element (e.g. a question, panel, or page) as a parameter and then, inside the function, you can use this name to get an instance of the corresponding element.

For example, a question's name can be passed as a function parameter:  
`myFunc('myQuestionName')`  
And you can obtain the question's instance inside the function in the following manner:  
`questionInstance = this.survey.getQuestionByName(params[0]);`






### Use Asynchronous Functions in Expressions

In SurveyJS expressions, you may require to perform some external and time-consuming calculations, and/or return a result from a server. In such cases, SurveyJS has to perform the following sequence of actions:  
 * make a request to a web service, 
 * wait until the service returns the result, 
 * continue to evaluate the expression based on the result returned.  
 
 Calling a web service and getting the result from it is an asynchronous operation. If there is one asynchronous operation in your flow, then all operations that relies on such an asynchronous operation should also be asynchronous.

To manage asynchronous behavior and flow control, SurveyJS allows you to implement and register asynchronous custom functions. 
Note that to support IE browsers, SurveyJS uses a ES5 ([ECMAScript 5](https://kangax.github.io/compat-table/es5/) asynchronous callback technique (not promises).

The code sample below illustrates the key points in asynchronous function implementation:

```javascript
 function asyncFunc(params: any[]): any {
   var self = this; // Store the context for this.returnResult callback
   setTimeout(function() {
       // Return the value via a callback
       self.returnResult(yourValue)
    }, 100);
    return false; // The return value is ignored.
  }
  // The third parameter specifies that the function is asynchronous
  FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
```

The following code example demonstrates how to implement and register a custom asynchronous function (_isCountryExist_). In the example, this function is used in a text question's validator of the expression type.

```javascript
async function isCountryExist(params) {
  if (params.length < 1) {
    this.returnResult(false);
      return false;
  }  
  var countryName = params[0];
  var self = this;
  var res = await $.ajax({
    url: "https://surveyjs.io/api/CountriesExample?name=" + countryName
  }).then(function(data) {
    var found = data.length > 0;
    self.returnResult(found);
  });
  return false;
}
Survey.FunctionFactory.Instance.register(
  "isCountryExist",
  isCountryExist,
  true
);

// The isCoutryExist function is used in the question validator's expressions.
var json = {
  questions: [
    {
      type: "text",
      name: "country",
      title: "Type a country:",
      validators: [
        {
          type: "expression",
          expression: "isCountryExist({country})", // Function usage 
          text: "Please type the country correctly!"
        }
      ]
    }
  ]
};
var survey = new Survey.Survey(json);
```

> **Example**  
> See the example's full code:  
> [Async Function in Expression](https://surveyjs.io/Examples/Library/?id=questiontype-expression-async)


<div id="conditions-cascading"></div>

### Cascade Conditions

_Example_. The first question is "Do you have children?" (_hasChildren_) and the second question is "How many children do you have?" (_kidsCount_). The second question has the following `visbileIf` expression: `"{hasChildren} = 'yes'"`. Then you display dropdowns with questions: "The first kid age", "The second kid age" and so on. Their `visibleIf` expressions are as follows:

`"{hasChildren} = 'yes' and {kidsCount} >= 1"`,

`"{hasChildren} = 'yes' and kidsCount >= 2"` and so on.

In this example, the additional `{hasChildren} = 'yes'` condition is added to `"{kidsCount} >= 1"`, because of the following:

1. A user answers the _"Do you have children?"_ question 'yes' and _"How many children do you have?"_ to _2_.
2. A user answers the first question 'no'.
3. The second question becomes invisible, but its value is still _2_ and the questions about kids' age are still shown, unless you add `"{hasChildren} = 'yes'"` condition.

SurveyJS allows you to avoid additional conditions in cascade questions. Set the [survey.clearInvisibleValues](https://surveyjs.io/Documentation/Library/?id=surveymodel#clearInvisibleValues) property to `onHidden` to clear values for invisible questions.

In the example above, on making _"How many children do you have?"_ question invisible, its value would be cleared. As a result, the _{kidsCount}_ value becomes undefined and you can simplify the expression to: `"{kidsCount} >=1"`.

You can play with the [Cascade Conditions](https://surveyjs.io/Examples/Library/?id=condition-cascade) example to see the [survey.clearInvisibleValues](https://surveyjs.io/Documentation/Library/?id=surveymodel#clearInvisibleValues) property use in action.

<div id="itemvaluesfiltering"></div>

## Dynamically Filter Choices, Columns, and Rows

SurveyJS allows you to control which answer options are visible based on previous choices in a survey.

### Method #1: Specify Visibility Conditions for Individual Options

_Example_. A user can select multiple communication channel options. The "Text Messages" and "WhatsApp" options appear only if a user has entered their phone number in a previous question.

You can implement this behavior without writing any code. SurveyJS exposes the **visibleIf** property for answer choices:

```js
choices: [
    "Email",
    { value: "Text Messages", visibleIf: "{phone} notempty"},
    { value: "WhatsApp", visibleIf: "{phone} notempty"}
  ]
```  

### Method #2: Display Options Selected in Previous Questions

Questions in this example progressively filter out browsers based on user answers.

Here's the logic breakdown.

- Display the complete browser list.

  ```js
  name: "installed",
  choices: ["Chrome", "MS Edge", "FireFox", "Internet Explorer", "Safari", "Opera"]
  ```

- Display only browsers checked in the previous question.

  ```js
  name: "default",
  choicesVisibleIf: "{installed} contains {item}",
  choices: ["Chrome", "MS Edge", "FireFox", "Internet Explorer", "Safari", "Opera"]
  ```

  SurveyJS iterates all `"choices"` and substitutes each as an `"{item}"` into `choicesVisibleIf`. Only choices that make the expression `true` appear in the list.
- Display browsers checked in #1, exclude browser that matches #2.

  ```js
  name: "secondChoice",
  choicesVisibleIf: "{installed} contains {item} and {item} != {default}",
  choices: ["Chrome", "MS Edge", "FireFox", "Internet Explorer", "Safari", "Opera"]
  ```

> **Examples**
>
> - [Show/Hide choices in radiogroup/checkbox/dropdown example](https://surveyjs.io/Examples/Library/?id=id=condition-choicesVisibleIf)
> - [Show/Hide individual items in radiogroup/checkbox/dropdown](https://surveyjs.io/Examples/Library/?id=condition-itemValueVisibleIf)
> - [Rows/columns visibleIf matrix example](https://surveyjs.io/Examples/Library/?id=condition-matrixVisibleIf)
> - [Rows visibleIf matrix dropdown example](https://surveyjs.io/Examples/Library/?id=condition-matrixDropdownVisibleIf)

<div id="choicesByUrl"></div>

## Fill the Choices From a Restful Service

SurveyJS can populate choices/items in a drop-down list, check boxes, and radio groups with items obtained from a web service. 

> **Example**
>
> [Get choices from a web service](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull)

The online Survey Creator allows you to configure a connection to a web service with a dialog:

<p align="center">

![Choices By Url Property Editor](https://github.com/surveyjs/surveyjs/blob/master/docs/images/choicesbyurl.png?raw=true)

_Choices By Url Property Editor_

</p>

| Property Name | Description |
| --- | --- |
| **url** | A link to a web service. You may use the text preprocessing here. For example, the following url: _<https://surveyjs.io/api/CountriesExample?region={region}>_ is changed based on the _region_ question value. SurveyJS automatically gets data from web service on changing the _region_ value.|
| **path** | Use this property, if a web service returns a lot of information and you need only a part of it. For example, the service returns the list of countries and list of capitals. If you need a list of countries, set a correct path from which SurveyJS obtains the data, like: _DataList1\DataList2_ |
| **valueName** | The property name in your obtained data, that SurveyJS should bind with the value. |
| **titleName** | The property name in your obtained data, that SurveyJS should bind with the text. It can be empty. |

> **Note**
>
> During the user session, if the same URL is requested, SurveyJS returns data from a cached list and does not send another request.

You can control the process of setting choices into a question from the web service by handing the **onLoadChoicesFromServer** event. The options parameter in this event has three properties:

- **question** - the question where choices are loaded
- **choices** - the list of loaded choices that library fills automatically
- **surveyResult** - the result object that comes from the web service

<div id="readonly"></div>

## Readonly and EnableIf Expression

Questions, matrix dropdown, and matrix dynamic columns have the **enableIf** property. It works exactly like **visibleIf**, except it makes control enable/disable instead of visible/invisible. It is useful when you do not want to change your layout and want to make sure that all questions are always visible, but still want to make it impossible for your users to answer some questions. 

> **Example**
>
> [Condition - Enable/Disable Elements](https://surveyjs.io/Examples/Library/?id=condition-enable-kids)

Since v1.0.31, we have introduced the **readOnly** and **enableIf** property into **Panel** and **Page** objects. They work like the same properties in **Question** object. The only difference, since these objects are containers, then all children (Panels and Questions) inside them becomes read-only if their parent is read-only.

<div id="textprocessing"></div>

## Text Processing, Dynamic Titles, and HTML Properties

The following survey elements support text processing:

- pages,
- panels,
- question titles,
- question description,
- survey completedHtml and loadingHtml properties,
- **html** property in **html question**.

It means you can set a question title as: `"{name}, could you please provide us your e-mail?"`, where the _name_ is the question name or a [calculated value name](#calculatedvalues).

> **Note**
>
> SurveyJS uses a question's display name. In questions, like dropdown, the display name and value name may differ (e.g., value can be "UK" and the display name is "United Kingdom").

### Question Numbers

You can control the question numbering. All questions titles show question numbers by default: from 1 to the visible question number in the survey. You can hide question numbers by setting [survey.showQuestionNumbers](https://surveyjs.io/Documentation/Library/?id=surveymodel#showQuestionNumbers) property to `off`, or start the numbering from the beginning on each page, by setting this property to `onPage`.

You may use alphabet numbering by setting [survey.questionStartIndex](https://surveyjs.io/Documentation/Library/?id=surveymodel#questionStartIndex) property to `A.` or `a.`.
You can add prefix and change the postfix (default is dot) for this property, for example: `# (1)` or `(A)`.

### Question Required Mark

Use the [survey.requiredText](https://surveyjs.io/Documentation/Library/?id=surveymodel#requiredText) property to change the required symbol. SurveyJS uses the asterisk (`*`) symbol by default. You can change it to another text or make it empty.

> **Example**
>
> [Process Text](https://surveyjs.io/Examples/Library/?id=survey-processtext)

<div id="calculatedvalues"></div>

## Calculated Values

Since v1.1.10 you may use calculated values in your text processing. Calculated Value item has three writable properties:

- **name** (it should be unique),
- **expression** (value read-only property is calculated based on this expression),
- **includeIntoResult** (a Boolean property, `false` by default. Set it to `true`, to include it into `survey.data`). It has one read-only property: **value** (calculated automatically based on expression).

> **Example**
>
> [Use calculated values](https://surveyjs.io/Examples/Library/?id=survey-calculatedvalues)

<div id="validation"></div>

## Client and Server-Side Validation

Before proceeding to the next page or before completing the survey, the SurveyJS Library validates all questions on the current page. If there is an error, the current page is not changed, all errors are shown and the input, the first of invalid questions is focused.

If you want to validate the value and display an error immediately after a user entered the value into the question, change the [survey.checkErrorsMode](https://surveyjs.io/Documentation/Library/?id=surveymodel#checkErrorsMode) property from the default `onNextPage` to `onValueChanged`.

```
survey.checkErrorsMode = "onValueChanged";
```

Since v1.1.10, SurveyJS supports [async expressions](#conditions-asyncfunctions). You may add your own async custom functions into the library that your users can use to create surveys.

<div id="validation-standard"></div>

### Standard Validators

The simplest and most used validation is a required value. You must set **question.isRequired** to `true` and SurveyJS will require the user answer the question. In [SurveyJS Creator](https://surveyjs.io/create-survey), toggle exclamation mark (!) to make a question required. To override the error text on required error, change the survey **requiredText** property.

Except required validation, there is a list of built-in validation classes, that you may use by adding them into [question.validators](https://surveyjs.io/Documentation/Library/?id=Question#validators) array property. For example, the following code adds a validation for e-mail input:

```js
question.validators.push(new Survey.EmailValidator());
```

The same code in JSON will be as:

```js
validators: [{ type: "email"}]
```

To change the default error text, you must set the validator text property.

Here is the list of standard validators

| Name | Validator Class | Description |
| --- | --- | --- |
| numeric | NumericValidator | Raises an error if the question answer is not a number, or if an entered number is outside the `minValue` and `maxValue` range.|
| text | TextValidator| Raises an error the entered text length is outside the `minLength` and `maxLength` range.|
| expression |ExpressionValidator | Raises an error when the expression returns `false`.  Use the **expression** property to specify the validated expression. This validator was added in v1.0.23. <br/>The following expression validator raises error if the summary is less than 100: `expression: "{price} \* {quantity} >= 100"`. |
| answercount | AnswerCountValidator | Works for questions which value is array, for example: checkbox. Raises an error if a user selects less choices that `minCount` (if `minCount` defined) or more than `maxCount` (if `maxCount` is defined). |
| regex | RegexValidator | Raises an error, if the entered value it does not fit the regular expression defined in the `regex` property. |
| email | EmailValidator | Raises an error, if the entered value is not a valid e-mail. |

> **Example**
>
> - [Standard validators](https://surveyjs.io/Examples/Library/?id=validators-standard)
> - [Expression validator](https://surveyjs.io/Examples/Library/?id=validators-expression)

<div id="validation-event"></div>

### Custom Validation

SurveyJS allows you to handle the **onValidateQuestion** event to implement custom validation logic.

 The following code demonstrates how to display an error message if the value in rateMe is not in the rage from 1 to 9.

```javascript
survey.onValidateQuestion.add(function(sender, options) {
  if(options.name == "rateMe") {
    if(options.value < 1 || options.value > 9) options.error = "Please enter value from 1 till 9.";
  }
});
```

> **Example**
>
> [Event Validators](https://surveyjs.io/Examples/Library/?id=validators-event).

<div id="validation-custom"></div>

### Custom Validators

You may implement your own validator, if you want to use it in [SurveyJS Creator](https://surveyjs.io/create-survey), for example, or going to use it in your surveys.

> **Example**
>
> [Custom Validators](https://surveyjs.io/Examples/Library/?id=validators-custom#content-js).

<div id="validation-onserver"></div>

### Validate Results on Server

Sometimes, there is no way you may validate the answers on the client and validation should be performed on your backend or you must call an ajax function to get an additional information.

> **Example**
>
> [Server Validators](https://surveyjs.io/Examples/Library/?id=validators-server).

```javascript
survey.onServerValidateQuestions.add(function(sender, options) {
// question values on the current page have the following format: 'questionName: value'
// Send the 'options.data' json object to your server.
// To specify errors on the current page, set the 'options.errors' json object as "questionName": "ErrorText".
// Leave it empty, if there is no error on the current page.
// Call the 'options.complete()' function to tell the survey that your server callback has been processed

    // options.data contains the data for the current page.
    var countryName = options.data["country"];
    // If the question is empty then do nothing
    if (!countryName)
        options.complete();

    //call the ajax method
    $
        .ajax({url: "https://surveyjs.io/api/CountriesExample?name=" + countryName})
        .then(function (data) {
            var found = data.length > 0;
            //if the country is unknown, add the error
            if (!found)
                options.errors["country"] = "The country name '" + countryName + "' is not in this list: https://surveyjs.io/api/CountriesExample";

            //tell survey that we are done with the server validation
            options.complete();
        });
});
```


<div id="localization"></div>

## Localization and Multilanguage Support

At the current moment, strings of SurveyJS UI elements are translated into more than 30 languages. The localization is supported by the community. 


### Available Translations
To see a list of all available translations, open the [SurveyJS Creator](https://surveyjs.io/create-survey), click on the "Survey Settings" button, and then, within the PROPERTIES window's **General** tab, open the **Default language** property's dropdown window.

Each translation is implemented in a separate locale-specific file. You can view translation files in the [localization](https://github.com/surveyjs/survey-library/tree/master/src/localization) folder in our sources. To localize SurveyJS to your own language, read the instruction in the folder's [readme](https://github.com/surveyjs/surveyjs/tree/master/src/localization) file.



### Switch Locales
Use the [survey.locale](https://surveyjs.io/Documentation/Library/?id=surveymodel#locale) property at runtime to change the survey locale.

```js
// Sets Spanish locale
survey.locale="es";
```


### Translate Individual Strings
If any strings are not translated into your language, or you want to translate them in a different way, you can change the translation on-the-fly using the following approach:

```javascript
var mylocalization = Survey.surveyLocalization.locales["localename"];
mylocalization.stringName = "My new localized string";
```

You can find a list of all localizable strings in the default [English localization](https://github.com/surveyjs/surveyjs/blob/master/src/localization/english.ts).


For an example, the following code sample shows how to modify texts of the "Previous Page" and "Next Page" navigation buttons for the English locale.

```javascript
//Modify strings for the 'en' locale.
var myloc = Survey.surveyLocalization.locales["en"];
myloc.pagePrevText = "My Page Prev";
myloc.pageNextText = "My Page Next";
```

The sample code below demonstrates how to define and add to the library a custom locale with the modified texts of the "Previous Page" and "Next Page" navigation buttons and the "Complete" button.

```javascript
//Add a new locale into the library.
var mycustomSurveyStrings = {
    pagePrevText: "My Page Prev",
    pageNextText: "My Page Next",
    completeText: "OK - Press to Complete"
};
Survey
    .surveyLocalization
    .locales["my"] = mycustomSurveyStrings;
```

> **See Example:**  [Localization](https://surveyjs.io/Examples/Library/survey-localization#content-js)



### Create a Multilanguage Survey
SurveyJS allows you to create a single survey for multiple languages at the same time. To switch between locales, change the [survey.locale](https://surveyjs.io/Documentation/Library/?id=surveymodel#locale) property.

All strings in a survey JSON have the following declaration:

```js
text: "Some text"
```

Most of strings in SurveyJS are localizable and you are able to write multiple localizations directly into a JSON. In JSON, localizations of string properties can be defined as key/value pairs, where the key is a locale and the value is a required translation.

The following code sample demonstrates how to define the `text` property's localization in a JSON to return "Dog" for all languages except German, and to return "Der Hund" for the German locale ("de").

```JavaScript
text: { "default": "Dog", "de": "Der Hund" }
```

Note that the definition `text: {"default: "Dog"}` has the same result as `text: "Dog"`.  
If there is no translation for the selected locale, the default value is used, or the first one, if "default" does not exist.

To work with strings of the default locale (in code, or in Survey Creator) set the [survey.locale](https://surveyjs.io/Documentation/Library/?id=surveymodel#locale) property to an empty string. 

> **See Example:** [Multiple Languages in a Survey](https://surveyjs.io/Examples/Library/?id=survey-multilanguages)



### choicesByUrl Localization
When choices for a [QuestionSelectBase](https://surveyjs.io/Documentation/Library?id=QuestionSelectBase)-derived question (a [checkbox](https://surveyjs.io/Documentation/Library?id=questioncheckboxmodel), [dropdown](https://surveyjs.io/Documentation/Library?id=questiondropdownmodel) or [radiogroup](https://surveyjs.io/Documentation/Library?id=questionradiogroupmodel) question) are loaded from a RESTful service (specified via a question's [choicesByUrl](https://surveyjs.io/Documentation/Library?id=QuestionSelectBase#choicesByUrl) property), SurveyJS is able to recognize and apply text localizations of choices if choice items are defined in the following format within the obtained JSON:

```JSON
{ 
    value: "item", 
    title: {
        en: "item in English", 
        de: "item in Deutch"
    }
}
```

> **See Plunker Sample:** [choicesByUrl Localization](https://plnkr.co/edit/YFQCdVpqVyXtPAzY)



<div id="addproperties"></div>

## Extend SurveyJS Elements by Adding Properties

Since this topic is mostly for our Survey Creator users, it is described in the [Survey Creator Documentation](https://surveyjs.io/Documentation/Survey-Creator/#addproperties). However, for some scenarios, the described functionality maybe useful for SurveyJS Library without using the Creator.

<div id="triggers"></div>

## Triggers: Control the Survey Logic

SurveyJS triggers help you to implement some logic in your surveys without writing JS code.

Every trigger has the **expression** property. On changing a value, if this value is used in the expression, then the expression is running. If the expression returns `true`, then the trigger executes the function, a success function, that make a change(s) in the survey logic.

Every trigger type overrides this success function in its own way.

### Available Triggers

---
**complete**

Complete the survey if the expression returns `true`. It performs on changing the current page into the next. <br/> The following trigger completes the survey if the question "age" on this page will have value less than 18.

```js
{ "type": "complete", "expression": "{age} < 18" }
```

---
**setvalue**

If expression returns `true`, then copy a value from the **setValue** property into the **setToName** value/question. <br /> The following triggers set the value "ageType" to child or adult based on the "age" question.

```js
[{ type: "setvalue", expression: "{age} < 18", setToName: "ageType", setValue: "child" },
 { type: "setvalue", expression: "{age} >= 18", setToName: "ageType", setValue: "adult" }]
```

---
**copyvalue**

It works like the **setvalue** trigger. It takes a value from a question **fromName** and copy it into **setToName**. <br /> The following trigger copies the billing address into delivery address if the question "Shipping address same as billing" is set to "Yes".

```js
{ "type": "copyvalue", "expression": "{sameAsBilling} = 'Yes'", setToName: "shippingAddress", fromName: "billingAddress" }
```

---
**runexpression**

If the expression is successful, then it runs the expression in the **runExpression** property. If the property **setToName** is not empty, then the result of the **runExpression** would be set into this value. <br /> Here is [the example](https://surveyjs.io/Examples/Library/?id=trigger-runexpression) of using this trigger.

---
**visible**

Obsolete, use the [visibleIf](#conditions) property instead.
