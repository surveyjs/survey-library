# SurveyJS Library Overview

This paper is for developers, who want to get a deep understanding how SurveyJS Library works, understand its concepts and main functionality.

If you want to use SurveyJS library on your website just couple times, then we recommend you go to the [SurveyJS Creator](https://surveyjs.io/create-survey/) page,
create a survey using our visual Survey Creator and then go to "Embed Survey" to insert the code into your web page.
More information about integrating survey into your web page, you may find in the [Add Survey into your Web Page](https://surveyjs.io/Documentation/Library/?id=Add-Survey-into-your-Web-Page) article.

If you want to get the most from our library, then we hope that the following article helps you.

You may read this document from the beginning to the end or just navigate to the topic you are interested in.

- [Supported Platforms](#platforms)
- [Survey Objects](#objects)
  - [Create Simple Survey Model (using JSON or in Code)](#objects-createmodel)
  - [Load Survey From SurveyJS Service](#objects-loadfromservice)
- [Store Survey Results](#storeresults)
  - [Use SurveyJS Service backend](#storeresults-service)
  - [Store survey results in your own database](#storeresults-owndatabase)
  - [Modify Survey results](#modifysurveyresults)
- [Survey States, from running to completed](#states)
- [Survey Data, modify or view Survey results](#data)
- [Pages, visibility and navigation](#pages)
- [Questions and Containers conditional visibility, read-only and required questions](#conditions)
  - [Boolean Expressions](#conditions-expressions)
  - [Using functions in expressions](#conditions-functions)
  - [Using asynchron functions in expressions](#conditions-asynfunctions)
  - [Cascading conditions](#conditions-cascading)
- [Dynamically filter choices, columns and rows](#itemvaluesfiltering)
- [Fill the choices from a restful service](#choicesByUrl)
- [Readonly and EnableIf Expression](#readonly)
- [Text Processing, dynamic titles and html properties](#textprocessing)
- [Calculated Values](#calculatedvalues)
- [Validation, on client and on server](#validation)
- [Localization and Multilanguage support](#localization)
- [Extend SurveyJS Elements by adding properties](#addproperties)
- [Triggers: control the survey logic](#triggers)

<div id="platforms"></div>

## Supported Platforms

The SurveyJS Library is a JavaScript library that available for five platforms: 
- angular2+
- jQuery
- knockout
- react
- vue


The library itself consists of two parts:

- **Survey Model**

  A platform independent part. In the most case, you work with **Survey Model**.
  
- **The platform specific code** 

  This part deals with rendering and processing mouse and keyboard events. 
  
  The **jQuery** and **angular2+** versions are the wrappers around the **knockout** version with built-in **knockout** library in them. **Knockout**, **react**, and **vue** implementations are native.



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


#### Using JSON

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

In the example above, the survey model contains a single page, so you may remove the "pages" and "page1" definition. **SurveyJS** will create a page automatically for you. As result, the JSON may look like follows:

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

#### In JSON and In Code 

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

**SurveyJS** allows you to load a survey model JSON from [SurveyJS Service](https://surveyjs.io/Service/MySurveys). The main benefit from this approach – you can modify the survey without modifying your web page.

To load survey model from SurveyJS Service, do the following:

1. Register on [SurveyJS web site](https://surveyjs.io/Account/Register). 
2. Create a new Survey in the [SurveyJS Service](https://surveyjs.io/Service/MySurveys).
3. In the [SurveyJS Service](https://surveyjs.io/Service/MySurveys) page, copy your Survey Id. 

    ![](images/survey-id.png)

4. Create a survey as shown in a code sample below.

    ```javascript
    var json = {
      surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1'
      };
    var survey = new Survey.Survey(json);
    ```


> **TIP**
> 
> You may play with a live [demo, that loads the survey from our Service](https://surveyjs.io/Examples/Library/?id=service-load).

<div id="storeresults"></div>


## Store Survey Results

After you have built your survey and integrated it into your web site, you need to save the survey results.

You may store survey results:

- [in SurveyJS backend](#storeresults-service)
- [in your own database](#storeresults-owndatabase).

<div id="storeresults-service"></div>

### Use SurveyJS Service Backend

You can use the SurveyJS backend [SurveyJS Service](https://surveyjs.io/Service/) to store your surveys' results. This approach doesn't require to write any code and is free now.

To store survey results on SurveyJS backend, do the following:

1. Register on [SurveyJS web site](https://surveyjs.io/Account/Register).
2. [Create a new survey](https://surveyjs.io/Service/MySurveys). If you do not want to load the survey from SurveyJS service, then you do not need to keep the survey definition in the service. 
3. Get a Post Id for a new survey:
    
    ![](images/survey-get-postid.png)

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

You can optionally show the saving progress by setting the [surveyShowDataSaving](https://surveyjs.io/Documentation/Library/?id=surveymodel#surveyShowDataSaving) property to `true`. When the option is enabled, the survey shows the "Saving..." message. Then, the survey shows if the operation was successful or an error occured after the callback from SurveyJS service. 

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

The implementation of the storing survey results in the database is fully depends on your server backend and database. 

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

```
{questionName: questionValue, ... }
```

The code sample below demonstrates how to change the standard format to 

```
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

### State 'loading'

If the **SurveyJS** loads a survey model from [SurveyJS Service](https://surveyjs.io/Service/), the survey is in the **loading** state. The message about survey loading is showing. The widget shows a message that a survey is loading. You can change this text like follows:

```javascript
Survey.surveyStrings.loadingSurvey = "Please wait. Your survey is loading…";
```

### State 'starting'

**SurveyJS** can display a start page (with any introduction info about the survey, start button, etc.) before displaying the first survey page. Displaying a start page is necessary when you [create a quiz](https://surveyjs.io/Documentation/Library/?id=Create-a-quiz) (a limited to time survey).

Set the [firstPageIsStarted](https://surveyjs.io/Documentation/Library/?id=surveymodel#firstPageIsStarted) property to `true` to show a start page instead a first survey page when a survey is loaded. An end user cannot come back to a start page after clicking the "start" button. 

If the **SurveyJS** shows a start page, the survey is in the **starting** state.

You can change the [startSurveyText](https://surveyjs.io/Documentation/Library/?id=surveymodel#startSurveyText) property value to modify the "start" button text.

<div id="states-running"></div>

### State 'running'

While survey pages (with "Previous", "Next" and "Complete" buttons) are displayed to an end user, the survey is in the **running** state.

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
- restore the answered questions if an end user leaves a survey incompleted
- clear data for invisible questions
- depending on question's answer, modify other question answers.


### Survey Data API

Survey expose the [surveymodel.data](https://surveyjs.io/Documentation/Library/?id=surveymodel#data) property, that contains survey results in JSON format `question name: questions value`. 

Every question, except **html question** that does not have input, has a writable [question.value](https://surveyjs.io/Documentation/Library/?id=Question#value) property. The **value** property does not store its value. The actual question value is stored in **survey.data**. You can access a question value using the **survey.getValue(name)** and **survey.setValue(name, newValue)** functions. 

Thus, the `myQuestion.value` code returns the same result as `survey.getValue(myQuestion.name)`.

To be more precise, the **question.name** is used, unless **question.valueName** property is empty. We will talk about valueName property later, in one of described scenarios.

<div id="data-predefinedanswers"></div>

### Predefined Answers

You may need to have predefined answers. For example, you need to have a default value for Boolean question as `True`. To specify a default value, use the [question.defaultValue](https://surveyjs.io/Documentation/Library/?id=Question#defaultValue) property. You can specify this property in JSON, or in our [Survey Creator](https://surveyjs.io/create-survey/). After loading the JSON, on starting the survey, the **defaultValue** property is copied to the **question.value** property.


> **Tip**
> 
> You can use the **question.value** property or **survey.setValue(name, newValue)** function to set the needed value in code at any time.

### Review Survey Results

To review survey results, stored in your own data base, you can use a survey in read-only mode:

```javascript
survey.data = JSON.parse(YourResultAsStringFromDatabase);
survey.mode = "display"; //set a survey to read-only mode
```

<div id="data-restoreanswers"></div>

### Restore Answered Questions for In-Completed Survey

When an end user does not complete a survey in a single session, and return to a survey later, you can refill the survey results and a last visited page. You can save the incomplete results in your data base or in a browser local storage.

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

Refer to the [Patient Medical History](https://surveyjs.io/Examples/Library/?id=real-patient-history) example to try this functionality in action.

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

### On question.value changed, modify other Questions or change their values

There are numerous scenarios when on changing a question value, you must modify other questions. 

_Example 1_. In the first question, you ask end users to select producers of cars they drove before. In the second question you ask end users to select a car producer they like the most, from the car producers selected in the previous question. 

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

There is another trick, that allows you to create complex forms without writing a single line of code. Let’s say you need to get information about your user employers. On the first page, the user enters employer names, on the next page(s) enter additional information about each of them.

On the first page, you have a matrix dynamic question, with ability to add/delete rows and one column: Name. On the second page, you are asking an additional information about employers using panel dynamic. It works fine, because for both questions the value is an array of objects. Please review [the following demo](https://surveyjs.io/Examples/Library/?id=survey-shareddata) that shows how it works without writing a single line of code.

<div id="pages"></div>

### Pages, Visibility and Navigation

**Questions** and **panels** (container) are located on **pages**. Every survey should have at least one visible **page**.

#### Page Visibility

The page is visible if: 

- the **visible** property equals to `true` (the default value), 
- the **visibleIf** property is empty (to learn more about **visibileIf** expression, refer to the [Conditions](#conditions) section),
- its expression returns `true` and there is at least one visible question on this page.

SurveyJS doesn't show pages that have no visible questions, it skips them automatically.

#### Navigation

##### Page List

Use the following properties to get the survey pages: 

- **survey.pages** - returns a list of all pages;
- **survey.visiblePages** - returns a list of visible pages. End users navigate visible pages and this array may be changed while a user runs a survey.

##### Current Page

Use the **survey.currentPage** property to get or set the current page. If a survey has no visible pages, this property returns `null`.

To change the current page from the code you may call:

```javascript
survey.currentPage = myPage;

// or change the current page using visible page zero-based index
survey.currentPage = visiblePageIndex;  

// or change the current page by setting the page name
survey.currentPage = "myCurrentPage";
```

##### Navigate Next, Previous Page, or Complete

SurveyJS allows you to navigate survey pages in code:

- to a previous page - call **survey.prevPage()**;
- to a next page - call **survey.nextPage()**;
- to complete a survey - call **survey.completeLastPage()**.

The **prevPage()** function returns `false` and do not change a current page, if the current page is already the first page.

The **nextPage** and **completeLastPage** functions return `false` and do not go to the next page or complete a survey if there are any errors on the current page. An end user must fix them first to go further. Refer to [Validation](#validation) for more information.

There are two events that you may use: 

- [survey.onCurrentPageChanged](https://surveyjs.io/Documentation/Library/?id=surveymodel#onCurrentPageChanged) 
- [survey.onCurrentPageChanging](https://surveyjs.io/Documentation/Library/?id=surveymodel#onCurrentPageChanging).

Set **survey.showNavigationButtons** to `false` to hide the default navigation buttons, and create your own navigation by using these functions and events. Here is the [custom navigation example](https://surveyjs.io/Examples/Library/?id=survey-customnavigation).

Here are additional properties that you may find useful:

* **showPrevButton** - set it to `false` to hide the previous button. In this case, your users cannot comeback to the previous page
* **pagePrevText** - specifies the previous button text
* **pageNextText** - specifies the next button text
* **completeText** - specifies the complete button text


##### Automatic Navigation

You can enable the **automatic navigation** by setting the **goNextPageAutomatic** property to `true`. In this case, a survey automatically goes to the next page when a user has answered all questions. Example: [Go to the next page automatically](https://surveyjs.io/Examples/Library/?id=survey-autonextpage).

##### Survey Progress

To show a progress bar, set the **showProgressBar** property to `top` or `bottom`. To change the default text: `Page x of N`, change the localization string **Survey.defaultStrings.progressText**, the default string for English localization is: "_Page {0} of {1}_".

##### All Questions on a Single Page

SurveyJS can display all the questions on a single page. It may be useful when you want your users to review their answers in read-only mode. Set the [survey.isSinglePage](https://surveyjs.io/Documentation/Library/?id=surveymodel#isSinglePage) property to `true` to display all the questions on a single page.

##### Skip Pages

SurveyJS allows you to set a visibility expression for individual pages, panels, and questions. If a page has no visible panels or questions, the page becomes invisible. SurveyJS automatically skips invisible pages. Refer to the next section for more information about visibility expressions.

<div id="visibility"></div>
<div id="conditions"></div>

## Questions and Containers Conditional Visibility, Read-Only and Required Questions


SurveyJS allows you to implement custom logic in surveys. For example, you may need to ask different questions based on age, for loyal or unhappy customers, or you may make some questions read-only or required based on answers in other questions.

SurveyJS has a powerful and flexible expression engine powered by [PEG.js](https://pegjs.org/) parser generator. 


<div id="conditions-expressions"></div>

### Boolean Expressions

Questions, panels and pages have [visibleIf](https://surveyjs.io/Documentation/Library/?id=Question#visibleIf), [enableIf](https://surveyjs.io/Documentation/Library/?id=Question#enableIf) and [requriedIf](https://surveyjs.io/Documentation/Library/?id=Question#requiredIf) properties. 

These properties are empty by default. Each element's behavior depends on the **isVisible**, **isReadOnly** and **isRequired** properties. The question containers (panel and page) become invisible if they have no visible questions.

Before rendering the first page, SurveyJS parses all boolean expressions (**visibleIf**, **enableIf**, and **requriedIf**), creates the expression trees, and run all expressions. Later, SurveyJS runs all expressions after any value change. If the expression returns `false`, the element becomes invisible (or read-only or non requried), if it returns `true` – visible (or enabled or required). The question values should be in braces: `{yourQuestionValueName}`.

Here are some examples of boolean expressions.

| Expression | Description |
| --- | --- |
| _"{age} >= 21"_ | Returns `true` if the _age_ question has value 21 or higher |
| _"({rank1} + {rank2} + {rank3}) > 21 and {isLoyal} == ‘yes’"_   | Use `or` and `and` operators, squares and arithmetic operations |
| _"!({isLoyal} == ‘yes’ and ({rank1} + {rank2} + {rank3}) > 21)"_ | Use "!" or "not" to change the result on opposite |
| _"{name} notempty"_ | Returns `true` if _name_ has a value |
| _{name} empty_ | Returns `true` if _name_ has no value |
| _"{speakinglanguages} = [‘English’, ‘Spanish’]"_ | Returns `true`, if a user selects these two valus in _speakinglanguages_ question. It is typically a checkbox. |
| _"{speakinglanguages} contains ‘Spanish’"_ | Returns `true`, if a user select 'Spanish' in checkbox. They may or may not select other values. |
| _age({birthdate}) >= 21_ | Returns `true`, if function _age_ returns 21 and greater. The function _age_ calculates the age based on the birth date and the current date. |

If your question has the complex values, then you may use dot "." to access the child value.

* multiple text - _{questionname.itemname}_
* matrix - _{questionname.rowname}_
* matrix dropdown - _{questionname.rowname.columnname}_

To access the question value inside the panel dynamic, you will have to use the following syntax: _{dynamicpanelname[index].questionname}_, where index is zero-based.

To access the cell value of the matrix dynamic, write the following code: _{matrix[index].columnname}_, where index is zero-based.

Regarding visibility of cells inside matrix dynamic and matrix dropdown. There many scenarios where you must make cell invisible or disabled based on other cells value on the same row. In this case you may use the prefix "row" to access a cell value on the same row: _{row.columnname}_

The similar story about panel dynamic. To access questions value on the same panel in the expression, you must use prefix "panel": _{panel.questionName}_

<div id="conditions-functions"></div>

### Using functions in expressions

Additionally, SurveyJS expressions supports functions with unlimited parameters number. There are some built-in functions, like age or iif: "age({birthdate}) >= 21"

Here is the code for the age function:

```javascript
// The age() function accepts a birth date
// and returns the number of full years
function age(params) {
  if (!params && params.length < 1) return -1;
  var birthDay = new Date(params[0]);
  var ageDifMs = Date.now() - birthDay.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
// Register the function for use in SurveyJS expressions
Survey.FunctionFactory.Instance.register("age", age);
```

You may write, register, and use your own functions.

Please note, since v1.0.21, you are able to get access to your survey object as _this.survey_ inside the custom function.
As result you may, for example, pass a question name to your function: _myFunc('myQuestionName')_ and then get it as: 
```javascript
questionInstance = this.survey.getQuestionByName(params[0]);
```

Here is the list of built-in functions:

| Function name | Description |
| --- | --- |
| age({birthdate}) | Returns the age by birth date. |
| iif("expression", trueValue, falseValue) | Returns trueValue if expression returns true and falseValue if expression returns false. <br />`iif({question1} + {question2} > 20, 'high', 'low')` |
| isContainerReady("panelname/pagename") | Returns true, if all questions in container (panel or page) are answered correctly. It validates (silently) all questions recursively in the container. If there is an error it returns false, otherwise true. If a question value is empty, but it doesn’t have validators and it is not required then validation would pass successful. |
| isDisplayMode() | Returns true if the survey is in display mode. Here is the example of usage: `isDisplayMode() <> true` |
| sum(par1, par2, ...) | Returns the summary of passed parameters. |
| avg(par1, par2, ...) | Returns the average value for passed parameters. |
| sumInArray({questionName}, 'propertyName') | Returns the summary for array of objects {questionName} by property 'propertyName'. `sumInArray('matrixdynamic', 'total') > 1000</` |
| avgInArray({questionName}, 'propertyName') | Returns the average value for array of objects {questionName} by property 'propertyName'. `avgInArray('matrixdynamic', 'quantity') > 4</` |
| minInArray({questionName}, 'propertyName') | Returns the minimum value for array of objects {questionName} by property 'propertyName'. `minInArray('matrixdynamic', 'quantity') > 1</` |
| maxInArray({questionName}, 'propertyName') | Returns the maximum value for array of objects {questionName} by property 'propertyName'. `maxInArray('matrixdynamic', 'quantity') > 10</` |

If you feel there is a need in a particular function, then [write us](https://github.com/surveyjs/surveyjs/issues) about it.

<div id="conditions-asynfunctions"></div>

### Using asynchron functions in expressions
You may need to make some calculation or return a result from a server. SurveyJS has to make a request to a web service, wait until it gets the result and continue evaluate the expression. Unfortunately, it can’t be done as it is, since calling and getting the result from a web service is an async operation. If there is one async operation in your flow, then all operations that use it should be async too.

The current version of SurveyJS allows to register an async custom functions. We decided to use callback approach to support es5 (IE). 

Here is the simplest example of async function:
```javascript
 function asyncFunc(params: any): any {
   var self = this; //store the context for this.returnResult callback
   setTimeout(function() {
       //return the value via callback
       self.returnResult(yourValue)
    }, 100);
    return false; //The value on this return is ignored.
  }
  //the third parameters tells that function is async
  FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
```

Here is the real example, that checks if the entered country name is exists or not. We can use this function in an expression validator.
```javascript
async function isCountryExist(params) {
  if (params.length < 1) {
    this.returnResult(false);
      return false;
  }
  var countryName = params[0];
  var self = this;
  var res = await $.ajax({
    url: "https://restcountries.eu/rest/v2/all"
  }).then(function(data) {
    var found = false;
    var countries = data;
    for (var i = 0; i < countries.length; i++) {
      if (countries[i].name == countryName) {
        found = true;
        break;
      }
    }
    self.returnResult(found);
  });
  return false;
}
Survey.FunctionFactory.Instance.register(
  "isCountryExist",
  isCountryExist,
  true
);

//Example of using
var json = {
  questions: [
    {
      type: "text",
      name: "country",
      title: "Type a country:",
      validators: [
        {
          type: "expression",
          expression: "isCountryExist({country}) = true",
          text: "Please type the country correctly!"
        }
      ]
    }
  ]
};
var survey = new Survey.Survey(json); 
```

Here is [a live example](https://surveyjs.io/Examples/Library/?id=questiontype-expression-async) on our site of using async expressions.

<div id="conditions-cascading"></div>

### Cascading conditions

Here is another trick we want to talk about. Let’s imagine that you want to ask your user information about their children and you have the first question: "Do you have children?" (hasChildren) and the second question "How many children do you have?" (kidsCount), where the second question has visbileIf expression as: _"{hasChildren} = ‘yes’"_.

Further you have several dropdowns with questions: "The first kid age", "The second kid age" and so on. So their visibleIf is:

_"{hasChildren} = ‘yes’ and {kidsCount} >= 1"_,

_"{hasChildren} = ‘yes’ and kidsCount >= 2"_ and so on.

The reason we have additional _{hasChildren} = ‘yes’_ condition and not _"{kidsCount} >= 1"_, because even the user after set "Do you have children?" to ‘yes’ and "How many children do you have?" to 2, they may set the answer on the first question as ‘no’. As result the second question will become invisible, but its value is still 2 and questions about kids age will be still shown, unless we do not add _"{hasChildren} = ‘yes’"_ condition.

However, there is an elegant solution for this. You may set survey **clearInvisibleValues** property to "onHidden" and on making "How many children do you have?" question invisible, its value would be cleared. As results {kidsCount} becomes undefined and you may use a simple expression as: _"{kidsCount} >=1"_. Here is [the example](https://surveyjs.io/Examples/Library/?id=condition-cascade) of using this trick.

<div id="itemvaluesfiltering"></div>

## Dynamically filter choices, columns and rows

Lots of surveys have some sort of conditional logic and we did allow to filter out questions, or panels with multiple questions, based on a specified condition. You can go for yet another level of control. You can control which answer options are visible based on previous choices in the survey.

### Method #1: Specify Visibility Conditions for Individual Options

Take a look at the following example. There are several communication channel options - Text Messages and WhatsApp - appear only if a phone number has been entered in a previous question.

This behavior can now be enabled without having to write code. We've introduced the "visibleIf" property for answer choices and you'll find the following lines in JSON above:

```
choices: [
  "Email",
  { value: "Text Messages", visibleIf: "{phone} notempty"},
  { value: "WhatsApp", visibleIf: "{phone} notempty"}
  ]
```  

### Method #2: Display Options Selected in Previous Questions

Questions in this example progressively filter out browsers based on user answers.

Here's the logic breakdown.

* Display the complete browser list.
  ```
  name: "installed",
  choices: ["Chrome", "MS Edge", "FireFox", "Internet Explorer", "Safari", "Opera"]
  ```
* Display only browsers checked in the previous question.
```
  name: "default",
  choicesVisibleIf: "{installed} contains {item}",
  choices: ["Chrome", "MS Edge", "FireFox", "Internet Explorer", "Safari", "Opera"]
```
  SurveyJS iterates all "choices" and substitutes each as an "{item}" into "choicesVisibleIf". Only choices that make the expression true will appear on the list.
* Display browsers checked in #1, exclude browser that matches #2.
  ```
  name: "secondChoice",
  choicesVisibleIf: "{installed} contains {item} and {item} != {default}",
  choices: ["Chrome", "MS Edge", "FireFox", "Internet Explorer", "Safari", "Opera"]</code></pre>
  ```

Please review the following examples:

* [Show/Hide choices in radiogroup/checkbox/dropdown example](https://surveyjs.io/Examples/Library/?id=id=condition-choicesVisibleIf)
* [Show/Hide individual items in radiogroup/checkbox/dropdown](https://surveyjs.io/Examples/Library/?id=condition-itemValueVisibleIf)
* [Rows/columns visibleIf matrix example](https://surveyjs.io/Examples/Library/?id=condition-matrixVisibleIf)
* [Rows visibleIf matrix dropdown example](https://surveyjs.io/Examples/Library/?id=condition-matrixDropdownVisibleIf)

<div id="choicesByUrl"></div>

## Fill the choices from a restful service

It is common task when the choices/items from dropdown list, or check boxes and radio group, are getting from a web service. Here is [the example of getting the choices from a web service](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull).

We make it easy for you to bind the data from a web service with our choice list. There is a dialog that helps you to perform the binding.

<p align="center">

![Choices By Url Property Editor](https://github.com/surveyjs/surveyjs/blob/master/docs/images/choicesbyurl.png?raw=true)

_Choices By Url Property Editor_

</p>


| Property Name | Description |
| --- | --- |
| **url** | The link to the web service. You may use the text preprocessing here. For example, the following url: _https://restcountries.eu/rest/v2/region/{region}_ will be changed based on _region_ question value. SurveyJS will automatically get the data from web service on changing the _region_ changing and do nothing if it is undefined.|
| **path** | You need this property, if the web service returns a lot of information and you need only a part of it. For example, the service returns the list of countries and list of capitals. You may need only one list, for example countries, in this case you need to set the correct path from where SurveyJS should get the data, like: _DataList1\DataList2_ |
| **valueName** | The property name in your returning data, that SurveyJS should bind with the value. |
| **titleName** | The property name in your returning data, that SurveyJS should bind with the text. It can be empty. |

**Please note**, during the user session, if the same url is requested, then SurveyJS will return the data from the cached list and would not send another request.

Finally, you may control the process of setting choices into a question from the web service by handing **onLoadChoicesFromServer**. The options parameter in this event has three properties:
**question** - the question where choices are loaded
**choices** - the list of loaded choices that library fills automatically
**surveyResult** - the result object that comes from the web service

<div id="readonly"></div>

## Readonly and EnableIf Expression

Questions and matrix dropdown and matrix dynamic columns have **enableIf** property. It works exactly like **visibleIf**, except it makes control enable/disable instead of visible/invisible. It is useful when you do not want to change your layout and want to make sure that all questions are always visible, but still want to make it impossible for your users to answer some questions. Please review the [following demo](https://surveyjs.io/Examples/Library/?id=condition-enable-kids).

Since v1.0.31, we have introduced readOnly and enableIf property into Panel and Page objects. They work like the same properties in Question object. The only difference, since these objects are containers, then all children (Panels and Questions) inside them becomes read-only if their parent is read-only.

<div id="textprocessing"></div>

## Text Processing, dynamic titles and html properties

Pages, panels and question titles, question description, survey completedHtml and loadingHtml properties, html property in html question are all support text processing.

It means you may set a question title as: _"{name}, could you please provide us your e-mail?"_, where the name is the question name or [calculated value name](#calculatedvalues).

Please note, SurveyJS will set a question display name. Display name may have different for questions like dropdown, for example, where the value can be "UK" and the display name is "United Kingdom".

For a question title, there are additional properties that many people find useful. At first, you may control the question numbering. By default, all questions titles show question number, from 1 till the visible question number in the survey. You may turn it off by setting survey **showQuestionNumbers** property to "off", or start the numbering from the beginning on each page, by setting this property to "onPage".

You may use alphabet numbering by setting survey **questionStartIndex** property to "A" or "a".

As well you may change the required symbol, using survey **requiredText** property. By default we are using the asterisk "_", you may change it to exclamation mark "!" or asterisk in brackets "(_)" or make it empty.

Finally, the default template for the question title is: "{title} {required}", you may change it to what ever you want, using survey **questionTitleTemplate** property, for example: "({title} ({required}):".

Please review [the following demo](https://surveyjs.io/Examples/Library/?id=survey-processtext) to play with these and other properties.

<div id="calculatedvalues"></div>

## Calculated Values

Since v1.1.10 you may use calculated values in your text processing. Calculated Value item has three writable properties: **name** (it should be unique), **expression** (value read-only property is calculated based on this expression) and **includeIntoResult** (a Boolean property, false by default. Set it to true, to include it into survey.data). It has one read-only property: **value** (calculated automatically based on expression).

Please, review [the following example](https://surveyjs.io/Examples/Library/?id=survey-calculatedvalues) to see how it works.

<div id="validation"></div>

## Validation, on client and on server

Before proceeding to the next page or before completing the survey, SurveyJS Library validates all questions on the current page. If there is an error, the current page is not changed, all errors are shown and the input, that belongs to the first question having an error, is focused.

If you want to validate the value and display an error immediately after a user entered the value into the question, then change the survey property **checkErrorsMode** from the default "onNextPage" to "onValueChanged".

`survey.checkErrorsMode = "onValueChanged";`

Since v1.1.10, SurveyJS supports [async expressions](#conditions-asynfunctions). You may add your own async custom functions into the library that your users can use to create surveys.

<div id="validation-standard"></div>

### Standard Validators

The simplest and most used validation is a required value. You must set **question.isRequired** to true and SurveyJS will require the user answer the question. In [SurveyJS Creator](https://surveyjs.io/Survey/Creator) you may simply toggle exclamation mark (!) to make a question a required. To override the error text on required error, please change the survey **requiredText** property.

Except required validation, there is a list of built-in validation classes, that you may use by adding them into question.validators array property. For example, the following code will add validation for e-mail input:

`question.validators.push(new Survey.EmailValidator());`

The same code in JSON will be as:

`validators: [{ type: "email"}]`

To change the default error text, you must set the validator text property.

Here is the list of standard validators

| Name | Validator Class | Description |
| --- | --- | --- |
| numeric | NumericValidator | It raises error, if there is value and it is not a numeric or it is less than minValue (if minValue is defined) or bigger than maxValue (if maxValue is defined).|
| text | TextValidator| It raises error, if there is a text value and its length is less them minLength (if minLength is defined) or bigger than maxLength (if maxLength is defined).|
| expression |ExpressionValidator |This validator was added in v1.0.23. It has **expression** property. If it is not empty, then the validator runs this expression and raises error if the expression returns false.<br/>The following expression validator raises error if the summary is less then 100: _expression: "{price} \* {quantity} >= 100"_. |
| answercount | AnswerCountValidator | It works for questions which value is array, for example: checkbox. It will raise error if a user selects less choices that minCount (if minCount defined) or more than maxCount (if maxCount is defined). |
| regex | RegexValidator | It raises error, if there is a value it doesn’t fit the regular expression defined in the regex property. |
| email | EmailValidator | It raises error, if there is a string value and it is not an e-mail. |

Please review [the standard validators](https://surveyjs.io/Examples/Library/?id=validators-standard) and [the expression validator](https://surveyjs.io/Examples/Library/?id=validators-expression) demos.

<div id="validation-event"></div>

### Use onValidateQuestion event

If there is no built validator you need, and you want to use this particular validation only in one-two surveys, created by yourself, then you may use **onValidateQuestion** event.

Here is the example of using it. The following code shows the error if the value in rateMe is not in the rage from 1 till 9.

```javascript
survey.onValidateQuestion.add(function(sender, options) {
  if(options.name == "rateMe") {
    if(options.value < 1 || options.value > 9) options.error = "Please enter value from 1 till 9.";
  }
});
```

Please review [the example of validating data using a client event](https://surveyjs.io/Examples/Library/?id=validators-event).

<div id="validation-custom"></div>

### Custom Validators

You may introduce your own validator, if you want your power users use them in [SurveyJS Creator](https://surveyjs.io/Survey/Creator), for example, or going to use it in many your own surveys.

Please go to this link to see the [example of writing a custom validator](https://surveyjs.io/Examples/Library/?id=validators-custom#content-js).

<div id="validation-onserver"></div>

### Validate results on server

Sometimes, there is no way you may validate the answers on the client and validation should be performed on your backend or you must call an ajax function to get an additional information.

The [following example](https://surveyjs.io/Examples/Library/?id=validators-server) shows how to use the service to validate the country name.

```javascript
survey.onServerValidateQuestions.add(function(sender, options) {
//You must call this function to tell the survey that your server callback has been processed
//options.complete();
//question values on the current page in format: questionName: value
//You have to send this json object into your server
//options.data
//errors on the current page. You have to set this json object as "questionName": "ErrorText".
//Leave it empty, if there is no error on the current page.
//options.errors
//Your code is here.
});
```

<div id="localization"></div>

## Localization and Multilanguage support

At the current moment, SurveyJS strings have been translated into 26 languages.

Use survey **locale** property in runtime to set to your locale. For example, _survey.locale="es";_ will tell survey to use the Spanish localization. The list of all available localization you may see in our [SurveyJS Creator](https://surveyjs.io/Survey/Creator). Click on Survey Settings button and set the Default Language.

The localization is supported by the community. If you see that there is a non-localized string on your language or do not like the current translation, you may change it locally as:

```javascript>
var myloc = Survey.surveyLocalization.locales["localename"];
myloc.stringName = "My New Localized string";
```

The list of all localized strings you may find in the default, [English localization](https://github.com/surveyjs/surveyjs/blob/master/src/localization/english.ts).

You may go to GitHub and modify the current or create a new localization for your language. Please read the instruction in this [readme file](https://github.com/surveyjs/surveyjs/tree/master/src/localization).

Additionally SurveyJS supports multiple languages. It means that you may have the same survey for several languages and all strings will be different for different languages/locales. To switch between locales, you may just change the survey **locale** property.

By default, all strings in JSON are set as:
_text: "Some text"_

However, the most strings in SurveyJS are localizable and you may write in JSON. This localizable string will return "Dog" for all languages, except German. For Deutsch (de) locale it will return "Der Hund":
_text: { "default": "Dog", "de": "Der Hund" }_
Please note, that _text: {"default: "Dog"}_ is the same as: _text: "Dog"_.

In the code, or in SurveyJS Creator, you should not worry about the locale a lot. If you want to get/set strings into default locale, then set survey.locale to empty string. If you want to get/set strings into Spanish locale, then set survey **locale** into "es" (Spanish).

Please go to [this demo](https://surveyjs.io/Examples/Library/?id=survey-multilanguages) to find out more.

<div id="addproperties"></div>

## Extend SurveyJS Elements by adding properties

Since this topic is mostly for our Survey Creator users, it is described in [Survey Creator Documentation](https://surveyjs.io/Documentation/Creator/?id=Survey-Creator-Overview#addproperties). However, for some scenarios, the described functionality maybe useful for SurveyJS Library without using the Creator.

<div id="triggers"></div>

## Triggers: control the survey logic

Initially the triggers concept has been created to control the questions and pages visibility. On changing a value of a question, the trigger that depends on this value executed and make an element visible or invisible depending on options.

Later, after the [visibleIf](#conditions) property has been added, bringing more flexibility into controlling the visibility, the visible trigger becomes obsolete. It is still available and working, but we highly recommend do not use it and use the [visibleIf](#conditions) property instead.

However, at that time we have already other triggers available and even continue to introduce new since it helps people to achieve the needed results without need to write JavaScript code.

The trigger concept is simple. Every trigger has the expression property. On changing a value, if this value is used in the expression, then the expression is running. If the expression returns true, then the trigger executes the function, a success function, that make a change(s) in the survey logic.

Every type of a trigger overrides this success function in its own way.

Based on our customers survey Jsons, we may say, that “complete” trigger is the most used right now. Before going to the next page, the survey runs all “complete” trigger, in case their expression depends at least on one question on the current page, and if expression returns true the survey is completed.

#### Here the list of all available triggers

---
**complete**

Complete the survey if the expression returns true. It performs on changing the current page into the next. <br/> The following trigger completes the survey if the question "age" on this page will have value less than 18

```
{ "type": "complete", "expression": "{age} < 18" }
```

---
**setvalue**

If expression returns true, then copy a value from **setValue** property into the value/question **setToName**. <br /> The following triggers set the value "ageType" to child or adult based on the "age" question.

```
[{ type: "setvalue", expression: "{age} < 18", setToName: "ageType", setValue: "child" }, 
 { type: "setvalue", expression: "{age} >= 18", setToName: "ageType", setValue: "adult" }]
```

---
**copyvalue**

It works like **setvalue** trigger. It takes a value from a question **fromName** and copy it into **setToName**. The following trigger copies the billing address into delivery address if the question “Shipping address same as billing” is set to "Yes".

```
{ "type": "copyvalue", "expression": "{sameAsBilling} = 'Yes'", setToName: "shippingAddress", fromName: "billingAddress" }
```

---
**runexpression**

If the expression is successful, then it runs the expression in the **runExpression** property. If the property **setToName** is not empty, then the result of the **runExpression** would be set into this value. Here is [the example](https://surveyjs.io/Examples/Library/?id=trigger-runexpression) of using this trigger.

---
**visible**

Obsolete, use the [visibleIf](#conditions) property instead.