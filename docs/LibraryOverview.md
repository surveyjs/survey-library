# SurveyJS Library Overview

This paper is for developers, who want to get a deep understanding how SurveyJS Library works, understand its concepts and main functionality.

If you want to use SurveyJS library on your website just couple times, then we recommend you go to the SurveyJS [Builder page](https://surveyjs.io/Survey/Builder/),
create a survey using our visual builder and then go to "Embed Survey" to insert the code into your web page.
More information about integrating survey into your web page, you may find in the [Add Survey into your Web Page article](https://surveyjs.io/Documentation/Library/?id=Add-Survey-into-your-Web-Page).

If you want to get the most from our library, then we hope that the following article helps you.

You may read this document from the beginning to the end or just navigate to the topic you are interested in.

* [Supported Platforms](#platforms)
* [Survey Objects](#objects)
* [Store Survey Results](#storeresults)
* [Survey States, from running to completed](#states)
* [Survey Data, modify or view Survey results](#data)
* [Pages, visibility and navigation](#pages)
* [Questions and Containers visibility. VisibleIf expressions](#visibility)
* [Dynamically filter choices, columns and rows](#itemvaluesfiltering)
* [Fill the choices from a restful service](#choicesByUrl)
* [Readonly and EnableIf Expression](#readonly)
* [Text Processing, dynamic titles and html properties](#textprocessing)
* [Validation, on client and on server](#validation)
* [Localization and Multilanguage support](#localization)
* [Extend SurveyJS Elements by adding properties](#addproperties)
* [Triggers: control the survey logic](#triggers)

<div id="platforms"></div>

## Supported Platforms

At first, SurveyJS Library is a typical JavaScript library that available for five platforms: angular2+, jQuery, knockout, react and vue.
The library itself divided on two large parts, Survey Model, that is platform independent, and platform specific code that mostly deal with rendering and process mouse and keyboard events. To be more precise, versions for jQuery and angular2+, in fact, use the knockout version with built-in knockout library in it. We have written only a small wrapper for jQuery and angular2+. By the way, this approach works perfectly for jQuery and angular2+ projects. Knockout, react and vue have native implementations.

In the most case, you should not be worried about platform specific difference and you will deal with Survey Model.

<div id="objects"></div>

## Survey Objects

There are three main types of objects in SurveyJS: survey, containers (pages and panels) and questions. The survey object is the root element, that contains top level properties/options, methods and events. It contains top-level containers – pages. Every page may contain unlimited number of panels and questions, where panel can contain another panels and questions (nested panels are supported).

<div id="objects-createmodel"></div>

### Create Simple Survey Model (using JSON or in Code)

There are two ways of creating the survey model. You may pass a survey definition JSON into survey constructor or create survey model totally in the code. Here is the example of creating the simples survey model using json. This survey contains one page and one text question on it:

```javascript
var json = {
pages: [
{
name: "page1",
elements: [
{ type: "text", name: "question1" }
]
}]

}
var survey = new Survey.Survey(json);
```

Since there is only one page, you may remove the "pages" and "page1" definition. Survey will create a page automatically for you. As result the JSON may look like the following:

```javascript
var json = {
  elements: [
  { type: "text", name: "question1" }
  ]
  }
  var survey = new Survey.Survey(json);
```

You may achieve the same result by writing the following code:

```javascript
var survey = new Survey.Survey();
  var page = survey.addNewPage("page1");
  page.addNewQuestion("text", "question1");
```

As you can imagine, you may combine these two approaches. You may initially create survey by using JSON and then modify the model in the code. Here is the example:

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
  //Create initial survey model using json
  var survey = new Survey.Survey(json);
  //set the place holder for "email" question
  var emailQuestion = survey.getQuestionByName("email");
  if (emailQuestion) emailQuestion.placeHolder = "json.snow@nightwatch.org";
  //Add a new question into existing page
  var contactPage = survey.getPageByName("customerContact");
  if (contactPage) {
  var fbPageQuestion = contactPage.addNewQuestion("text", "fbPage");
  fbPageQuestion.title = "Please enter your facebook page:"
  }
  //You may create a new page or remove/add pages, add/remove questions, panels, modify them and so on.
```

<div id="objects-loadfromservice"></div>

### Load Survey From SurveyJS Service

There is an additional way of creating the Survey Model. It is loading the survey JSON from our [SurveyJS Service](https://surveyjs.io/Service/MySurveys). The main benefit from this approach – you can modify the survey without modifying your web page. All you need to do, is to register on our web site. Create a new Survey in our [Service](https://surveyjs.io/Service/MySurveys), and use Survey Id. Your code will look like:

```javascript
var json = {
  surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1'
  };
  var survey = new Survey.Survey(json);
```

You may play with a live [demo, that loads the survey from our Service](https://surveyjs.io/Examples/Library/?id=service-load).

<div id="storeresults"></div>

## Store Survey Results

After you have built your survey and integrate it into your web site, the next question is how to save the survey results.

Again, there are two ways of doing it. You may store results in our backend or in your own database.

### Use SurveyJS Service backend

The simplest one is to use our backend [SurveyJS Service](https://surveyjs.io/Service/). We want you to recommend use it while you are learning and playing with our library, since it doesn’t require to write any code and it is currently totally free.

To store survey results on our backend, you must register on our web site and [create a new survey](https://surveyjs.io/Service/MySurveys). If you do not want to load the survey from our service, then you do not need to keep the survey definition in our service. All you need is to get a Post Id for a new created survey and add one line into your code:

```javascript
var survey = new Survey.Survey(json);
  survey.surveyPostId = "YourPostIdGuid";
  //Optionally, show saving progress and show an error and "Save Again" button if the results can't be stored.
  survey.surveyShowDataSaving = true;
```

And you are done. Here is [the example of saving survey results on our backend](https://surveyjs.io/Examples/Library/?id=service-send)

There is an additional option, as show in the code snippet. You may optionally show the saving progress. It will show the "Saving..." message and after the callback from our service come, it will show if the operation was successful or there was an error. A user will be able to press "Save Again" button.
If you do not like the default text you may override it as show in the following code:

```javascript
Survey.surveyStrings.savingData = "Please wait. We are validating and saving your reponse";
  Survey.surveyStrings.savingDataError = "That is my own text on error";
  Survey.surveyStrings.savingDataSuccess = "That is my own text on success";
  Survey.surveyStrings.saveAgainButton = "Try to save again";
```

To find out more about SurveyJS strings and localizations go to [Localization and Multilanguages support section](#localization).

<div id="storeresults-owndatabase"></div>

### Store survey results in your own database

To store the survey results in your own storage, you must use **onComplete** event. It fires as soon as a user click on the "Complete" button and a page about survey completion is shown.

The implementation of the storing survey results in the database is fully depends on your server backend and database. Unfortunately, this is the code that you must write by yourself. Here is the simplest implementation, in case you have implemented the services on your web site:

```javascript
survey.onComplete.add(function (sender, options) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "YourServiceForStoringSurveyResultsAsJSON_URL");
      xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      xhr.send(JSON.stringify(sender.data));
});
```

Again, you may show the progress and errors. That makes a code a little more complicated:

```javascript
  survey.onComplete.add(function (sender, options) {
  //Show message about "Saving..." the results
  options.showDataSaving();//you may pass a text parameter to show your own text
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "YourServiceForStoringSurveyResultsURL");
  xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhr.onload = xhr.onerror = function () {
  if (xhr.status == 200) {
  options.showDataSavingSuccess(); //you may pass a text parameter to show your own text
  //Or you may clear all messages
  //options.showDataSavingClear();
  } else {
  //Error
  options.showDataSavingError(); //you may pass a text parameter to show your own text
  }
  };
  xhr.send(JSON.stringify(sender.data));
  });
```

As you see, there are not a lot of code on the client for storing the survey results in your own data storage. However, the main part, the server code that stores the data into database, is not here. We can’t provide it to you since it is highly depending on your server platforms and database. Likely it is a typical task for every platform.

<div id="states"></div>

## Survey States, from running to completed

Survey may have five different states. To get the current state you have to check survey.state read-only property. In this section we will describe all of them.

<div id="states-empty"></div>

### State empty

If there is no any visible questions/pages in the survey, then the survey is in the "empty" state. The widget shows the message that survey is empty: "There is no visible page or question in the survey.". You may change this text by changing this property:

```javascript
Survey.surveyStrings.emptySurvey = "The current survey is empty";
```

### State loading

The survey is loading the survey JSON from [SurveyJS Service](https://surveyjs.io/Service/). The message about survey loading is showing. Please use the following property to change the text:

```javascript
Survey.surveyStrings.loadingSurvey = "Please wait. Your survey is loading…";
```

### State starting

In the most cases, you will show the first page of your survey from the beginning. However, sometimes, you need to show a page, before starting a survey. It can be an introduction page that describe what this survey about or you want to [create a quiz](https://surveyjs.io/Documentation/Library/?id=Create-a-quiz) and a user should click a "start" button before the first page with questions would be shown.

To show this introduction page with a start button, we have added a property **firstPageIsStarted** into survey object. After you set it to true, the first page becomes an introduction page. User can’t come back to it after clicking on the "start" button. While this introduction page is showing, the survey is in the "starting" state.
You may change the "start" button text by setting the survey **startSurveyText** property.

<div id="states-running"></div>

### State running

While a survey page is showing to the user, with "Previous", "Next" and "Complete" buttons, the survey is in the running state.

<div id="states-completed"></div>

### State completed

The survey is completed, and a completed html is shown, unless you do not set survey **showCompletedPage** property to false. In this case the survey will be still in the completed state, but widget becomes fully invisible to the end-user.

You may change the completed html by setting survey **completedHtml** property. This property supports [text preprocessing](#textprocessing). To see how it works in action go to [this example](https://surveyjs.io/Examples/Library/?id=survey-processtext).

When the survey goes into completed state the **survey.onCompleted** event is fired. Commonly it is used to save data in [your own database](#storeresults).
However, there are other scenarios. For example, you may show the same survey to the user from the beginning, but in display (read-only) mode. The following code would perform this task:

```javascript
survey.onComplete.add(function (sender, options) {
  //By default clear methods clear all data and go to the first page
  //Here we tell survey keep the data by passing the first parameter as false
  sender.clear(false);
  //Put survey into read-only mode
  sender.mode = "display";
});
```

<div id="data"></div>

## Survey Data, modify or view Survey results

There are many scenarios, where you can’t have an empty data from the beginning or you must modify them when an end-user runs a survey. Let’s review several of them. However, before let’s explain how data layer works in SurveyJS Library.

There is a writable **survey.data** property. It is a survey results storage in JSON format, question name: questions value. Every question, except html question that doesn’t have input, has a writable **question.value** property. However, in fact, question doesn’t store its value, it goes into **survey.data** to read or write its value, by using two functions: **survey.getValue(name)** and **survey.setValue(name, newValue)**. In other words, the following code:
**myQuestion.value** will return the same result as **survey.getValue(myQuestion.name)**

To be more precise, the **question.name** is used, unless **question.valueName** property is empty. We will talk about valueName property later, in one of described scenarios.

<div id="data-predefinedanswers"></div>

### Predefined answers

You may need to have predefined answers. For example, you should have predefined rows in the dynamic matrix (table) or want to have a default value for Boolean question as True, and so on. The easiest solution for it, is to use **question.defaultValue** property. This property could be set in JSON, in our [Survey Builder](https://surveyjs.io/Survey/Builder/). After loading the JSON, on starting the survey, the defaultValue property is copied into **question.value**

Of course, you may always use **question.value** property or **survey.setValue(name, newValue)** function to set the needed value in the code in any moment.

### Review Survey Results

If you store the survey results in your own database, then you should implement a module, where an admin may review all results. Typically, it is tabular data with posting result date, client/user name and "View Results…" button/link. On clicking this button, you may show on your page or in modal window a survey with user’s answers. The code is simple. You are creating a survey, as you commonly do, then load the survey results from your database (commonly it stores as text) and set it into survey.data:

```javascript
survey.data = JSON.parse(YourResultAsStringFromDatabase);
survey.mode = "display"; //make the survey readonly
```

<div id="data-restoreanswers"></div>

### Restore answered questions for in-completed Survey

Another common scenario, when you have a large survey and a user may not want to complete it during one session. Again, the solution is to restore the answered question and additionally the current page. If a survey is filled by login users, you may store the current answered results in your database. However, in the most scenarios, using a browser local storage works great as well, since in the most cases a user will comeback by using the same browser.

Below is the code that implements restoring answered questions and current page from local storage. We are setting the **survey.sendResultOnPageNext** property to true. As result, **survey.onPartialSend** event will be fired, to make our life easier.

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

You may see this functionality in action by playing with [this example (the real survey)](https://surveyjs.io/Examples/Library/?id=real-patient-history).

<div id="data-clearinvisible"></div>

### Clear data for invisible Questions

We started to clear the values for invisible questions on completing survey after many requests from developers. However, if for some reason, you want to keep them then set the **clearInvisibleValues** property from "onComplete" into "none". There is another valid value for this property "onHidden", it is useful if you have a cascade condition in **visibleIf** expressions. Please read more about it in [Questions and Containers Visibility Sections](#visibility).

<div id="data-variables"></div>

### Using variables

SurveyJS has variable concepts. You may use variables in [expressions](#visibility) and [text processing](#textprocessing). The main difference from values, they are not used by questions and they are not stored in survey data, so they are not in the survey results.

To create a new value or change its value, call **survey.setVariable("variablename", value)** to get the variable value call **survey.getVariable("variablename")**.

<div id="data-onvaluechanged"></div>

### On question.value changed, modify other Questions or change their values

There are numerous scenarios when on changing a question value, you must modify other questions. For example, you have the first question with list of all popular Car producers and ask your users select those cars that he/she drove at any time, and you have the second question, where you are asking to select a car producer they like the most, from the car producers selected in the previous question. To deal with it you must use survey.onValueChanged event.

Here is the opposite example. The first question is "Please select the language(s) you are speaking" and the second question "Please select the language(s) you want to learn". The choices from the second question do not contain selected choices from the first question. Here is [the example on plunker](https://plnkr.co/edit/AtodHh?p=preview) and code

```javascript
survey.onValueChanged.add(function(survey, options){
if(options.name !== "know") return;
knownChoices = options.question.choices;
var choices = [];
for(var i = 0; i < knownChoices.length; i ++) {
    var item = knownChoices[i];
    //the item is not selected
    if(options.value.indexOf(item.value) < 0) {
        choices.push(item);
    }
}
var learnQuestion = survey.getQuestionByName("learn");
learnQuestion.choices = choices;
learnQuestion.visible = choices.length > 0;
});
```

**Please Note:** The following scenario can be implemented without coding, by setting **choicesVisibleIf** property, that we have introduced in v1.0.21. Please review the [Dynamically filter choices, columns and rows](#itemvaluesfiltering) section for more information.

<div id="data-sharedata"></div>

### Share the same data between two or more questions

The simple scenario, you may want to show the same question on different questions. For example, to confirm customer name and e-mail on the last page, that has been entered on the first page.

Having the same question.name is not a good idea, those questions may be different and can have their own logic on showing/hiding or enabling/disabling. For this purpose, we have introduced **question.valueName** property. If this property is set, then question is using **valueName** property, instead of **name** property, to get/set its value from the survey data storage.

There is another trick, that allows you to create complex forms without writing a single line of code. Let’s say you need to get information about your user employers. On the first page, the user enters employer names, on the next page(s) enter additional information about each of them.

On the first page, you have a matrix dynamic question, with ability to add/delete rows and one column: Name. On the second page, you are asking an additional information about employers using panel dynamic. It works fine, because for both questions the value is an array of objects. Please review [the following demo](https://surveyjs.io/Examples/Library/?id=survey-shareddata) that shows how it works without writting a single line of code.

<div id="pages"></div>

### Pages, visibility and navigation

If you are not going to ask your users couple questions, then very likely you would prefer to have several pages in your survey/form. Here, lets talk about SurveyJS root containers: **Pages**.

Questions and Panels (container) are located on pages. Every survey should have at least one visible page.

The page is visible if: its **visible** property equals to true (the default value), **visibleIf** property (to learn more about visibileIf expression please go to [this section](#visibility)) is empty or its expression returns true and there is at least one visible question on this page. SurveyJS doesn’t show pages where there are no visible questions, it skips them automatically.

You may use two properties to get the survey pages: **survey.pages** and **survey.visiblePages**. As you can see from their names, the first returns the list of all pages and the second on is the list of visible pages only. Users are navigating through visible pages and this array may be changed while user runs the survey.

To get the current page, you may use **survey.currentPage** property. If there is at least one visible page in the survey, it will return you the current page or null of there is no visible pages.

To change the current page from the code you may call:

```javascript
survey.currentPage = myPage;

//or change the current page using visible page index (from 0 to visible page count – 1)
survey.currentPage = visiblePageIndex;  
 //or change the current page by setting the page name
survey.currentPage = "myCurrentPage";
```

To go to the previous page, call **survey.prevPage()**, to go to the next page, call **survey.nextPage()** and to complete the survey, call **survey.completeLastPage()**.

Please note, **prevPage()** will return false and do not change the page, if the current page is already the first page.

**nextPage** and **completeLastPage** functions may return false and do not go to the next page or complete the survey if there are errors on the current page. The user must fix them first to go further. Please read our [section about validation](#validation).

By setting **goNextPageAutomatic** property to **true**, survey will automatically go to the next page when a user has answered on all questions. Here is an example of using the property: [Go to the next page automatically](https://surveyjs.io/Examples/Library/?id=survey-autonextpage)

There are two events that you may use: **survey.onCurrentPageChanged** and **survey.onCurrentPageChaning**.

To show the progress bar, you must set the **showProgressBar** property to "top" or "bottom". To change the default text: Page x of N, you must change the localization string **Survey.defaultStrings.progressText**, the default string for English localization is: "Page {0} or {1}".

You may hide the default navigation (buttons), set **survey.showNavigationButtons** to false, and create your own navigation by using these functions and events. Here is the [custom navigation example](https://surveyjs.io/Examples/Library/?id=survey-customnavigation).

Here are additional properties that you may find useful:

* **showPrevButton** - set it to false to hide the previous button. In this case your users will not be able to comeback to the previous page
* **pagePrevText** - use it to change the default text for the previous button
* **pageNextText** - use it to change the default text for the next button
* **completeText** - allows to change the text for the complete button

Another popular functionality, you may show all questions on one page. It is a popular scenario when you want your users to review their answers in read only mode. In this case, simply set the **isSinglePage** property to true.

One of the most popular request is to skip Page X in the survey. The reason of this request, because some survey engines, including the most popular ones, provides the skip pages functionality. Again, the reason they do it, because they are using the old client-server web technologies and SurveyJS on opposite is open JavaScript Library. You may set the visibility expression on page or panel or question level and if this page expression returns false then the page becomes invisible and user skips it. As well as, all questions on the page are invisible then the page becomes invisible too. Please read the next section to find out more about visibility expressions.

<div id="visibility"></div>

## Questions and Containers visibility. VisibleIf expressions

If you have a relative complex survey or form, then you will have to implement some visibility logic. For example, you may want to ask different questions based on age or gender, for loyal or unhappy customers, and so on.

We have created a powerful and flexible expression engine. We do not remember a case that can’t be solved by using it. Let’s talk about it in this section.

<div id="visibility-expressions"></div>

### Basic Expressions

Questions, panels and pages has visibleIf property. It is empty by default and it means the element visibility is defined by visible property (true/false). In case of container (panel and page), it becomes invisible if there is no any visible question in it.

Before rendering the first page, SurveyJS parses all visibleIf expressions, creates the expression trees and run all expressions. Later, SurveyJS runs all expressions after any value change. If the expression returns false, the element becomes invisible, if it returns true – visible. The question values should be in braces: _{yourQuestionValueName}_.

Here are some examples.

| Expression | Description |
| --- | --- |
| _"{age} >= 21"_ | Return true if question age has value 21 or higher |
| _"({rank1} + {rank2} + {rank3}) > 21 and {isLoayl} == ‘yes’"_   | Use "or" and "and" operators, squares and arithmetic operations |
| _"!({isLoayl} == ‘yes’ and ({rank1} + {rank2} + {rank3}) > 21)"_ | Use "!" or "not" to change the result on opposite |
| _"{name} notempty"_ | Returns true if name has a value |
| _{name} empty_ | Returns true if name has no value |
| _"{speakinglanguages} = [‘English’, ‘Spanish’]"_ | Returns true, if a user selects these two valus in speakinglanguages question. It is typically a checkbox. |
| _"{speakinglanguages} contains ‘Spanish’"_ | Returns true, if a user select 'Spanish' in checkbox. He may or may not select other values. |
| _age({birthdate}) >= 21_ | Returns true, if function age returns 21 and greater. The function age calculates the age based on the birth date and the current date. |

If your question has the complex values, then you may use dot "." to access the child value.

* multiple text - _{questionname.itemname}_
* matrix - _{questionname.rowname}_
* matrix dropdown - _{questionname.rowname.columnname}_

To access the question value inside the panel dynamic, you will have to use the following syntax: _{dynamicpanelname[index].questionname}_, where index is from 0 to panel count – 1.

To access the cell value of the matrix dynamic, write the following code: _{matrix[index].columnname}_, where index is from 0 to row count – 1.

Regarding visibility of cells inside matrix dynamic and matrix dropdown. There many scenarios where you must make cell invisible or disabled based on other cells value on the same row. In this case you may use the prefix "row" to access a cell value on the same row: _{row.columnname}_

The similar story about panel dynamic. To access questions value on the same panel in the expression, you must use prefix "panel": _{panel.questionName}_

<div id="visibility-functions"></div>

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

You may write, register and use your own functions.

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

If you feel there is a need in a particular function, then [write us](https://github.com/surveyjs/surveyjs/issues) about it.

<div id="visibility-cascading"></div>

### Cascading conditions

Here is another trick we want to talk about. Let’s imagine that you want to ask your user information about his children and you have the first question: "Do you have children?" (hasChildren) and the second question "How many children do you have?" (kidsCount), where the second question has visbileIf expression as: _"{hasChildren} = ‘yes’"_.

Further you have several dropdowns with questions: "The first kid age", "The second kid age" and so on. So their visibleIf is:

_"{hasChildren} = ‘yes’ and {kidsCount} >= 1"_,

_"{hasChildren} = ‘yes’ and kidsCount >= 2"_ and so on.

The reason we have additional _{hasChildren} = ‘yes’_ condition and not _"{kidsCount} >= 1"_, because even the user after set "Do you have children?" to ‘yes’ and "How many children do you have?" to 2, he may set the answer on the first question as ‘no’. As result the second question will become invisible, but its value is still 2 and questions about kids age will be still shown, unless we do not add _"{hasChildren} = ‘yes’"_ condition.

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

![Choices By Url Property Editor](https://github.com/surveyjs/surveyjs/blob/master/docs/images/choicesbyurl.png)

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

It means you may set a question title as: _"{name}, could you please provide us your e-mail?"_, where the name is the question name.

Please note, SurveyJS will set a question display name. Display name may have different for questions like dropdown, for example, where the value can be "UK" and the display name is "United Kingdom".

For a question title, there are additional properties that many people find useful. At first, you may control the question numbering. By default, all questions titles show question number, from 1 till the visible question number in the survey. You may turn it off by setting survey **showQuestionNumbers** property to "off", or start the numbering from the beginning on each page, by setting this property to "onPage".

You may use alphabet numbering by setting survey **questionStartIndex** property to "A" or "a".

As well you may change the required symbol, using survey **requiredText** property. By default we are using the asterisk "_", you may change it to exclamation mark "!" or asterisk in brackets "(_)" or make it empty.

Finally, the default template for the question title is: "{title} {required}", you may change it to what ever you want, using survey **questionTitleTemplate** property, for example: "({title} ({required}):".

Please review [the following demo](https://surveyjs.io/Examples/Library/?id=survey-processtext) to play with these and other properties.

<div id="validation"></div>

## Validation, on client and on server

Before proceeding to the next page or before completing the survey, SurveyJS Library validates all questions on the current page. If there is an error, the current page is not changed, all errors are shown and the input, that belongs to the first question having an error, is focused.

If you want to validate the value and display an error immediately after a user entered the value into the question, then change the survey property **checkErrorsMode** from the default "onNextPage" to "onValueChanged".

`survey.checkErrorsMode = "onValueChanged";`

<div id="validation-standard"></div>

### Standard Validators

The simplest and most used validation is a required value. You must set **question.isRequired** to true and SurveyJS will require the user answer the question. In [SurveyJS Builder](https://surveyjs.io/Survey/Builder) you may simply toggle exclamation mark (!) to make a question a required. To override the error text on required error, please change the survey **requiredText** property.

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

You may introduce your own validator, if you want your power users use them in [SurveyJS Builder](https://surveyjs.io/Survey/Builder), for example, or going to use it in many your own surveys.

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

Use survey **locale** property in runtime to set to your locale. For example, _survey.locale="es";_ will tell survey to use the Spanish localization. The list of all available localization you may see in our [SurveyJS Builder](https://surveyjs.io/Survey/Builder). Click on Survey Settings button and set the Default Language.

The localization is supported by the community. If you see that there is a non-localized string on your language or do not like the current translation, you may change it locally as:

```javascript>
var myloc = Survey. surveyLocalization.locales["localename"];
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

In the code, or in SurveyJS Builder, you should not worry about the locale a lot. If you want to get/set strings into default locale, then set survey.locale to empty string. If you want to get/set strings into Spanish locale, then set survey **locale** into "es" (Spanish).

Please go to [this demo](https://surveyjs.io/Examples/Library/?id=survey-multilanguages) to find out more.

<div id="addproperties"></div>

## Extend SurveyJS Elements by adding properties

Since this topic is mostly for our SurveyJS Builder (Editor) users, it is described in [Builder Documentation](https://surveyjs.io/Documentation/Builder/?id=Survey-Builder-Overview#addproperties). However, for some scenarios, the described functionality maybe useful for SurveyJS Library without using the Builder (Editor).

<div id="triggers"></div>

## Triggers: control the survey logic

Initially the triggers concept has been created to control the questions and pages visibility. On changing a value of a question, the trigger that depends on this value executed and make an element visible or invisible depending on options.

Later, after the [visibleIf](#visibility) property has been added, bringing more flexibility into controlling the visibility, the visible trigger becomes obsolete. It is still available and working, but we highly recommend do not use it and use the [visibleIf](#visibility) property instead.

However, at that time we have already other triggers available and even continue to introduce new since it helps people to achieve the needed results without need to write JavaScript code.

The trigger concept is simple. Every trigger has the expression property. On changing a value, if this value is used in the expression, then the expression is running. If the expression returns true, then the trigger executes the function, a success function, that make a change(s) in the survey logic.

Every type of a trigger overrides this success function in its own way.

Based on our customers survey Jsons, we may say, that “complete” trigger is the most used right now. Before going to the next page, the survey runs all “complete” trigger, in case their expression depends at least on one question on the current page, and if expression returns true the survey is completed.

Here the list of all available triggers

| Trigger Name | Description |
| --- | --- |
| **complete** | Complete the survey if the expression returns true. It performs on changing the current page into the next. <br/> The following trigger completes the survey if the question "age" on this page will have value less than 18 `{ "type": "complete", "expression": "{age} < 18" }` |
| **setvalue** | If expression returns true, then copy a value from **setValue** property into the value/question **setToName**. <br /> The following triggers set the value "ageType" to child or adult based on the "age" question.```javascript>[{ type: "setvalue", expression: "{age} < 18", setToName: "ageType", setValue: "child" }, { type: "setvalue", expression: "{age} >= 18", setToName: "ageType", setValue: "adult" }]`> |
| **copyvalue** | It works like **setvalue** trigger. It takes a value from a question **fromName** and copy it into **setToName**. The following trigger copies the billing address into delivery address if the question “Shipping address same as billing” is set to "Yes".`{ "type": "copyvalue", "expression": "{sameAsBilling} = 'Yes'", setToName: "shippingAddress", fromName: "billingAddress" }` |
| **runexpression** | If the expression is successful, then it runs the expression in the **runExpression** property. If the property **setToName** is not empty, then the result of the **runExpression** would be set into this value. Here is [the example](https://surveyjs.io/Examples/Library/?id=trigger-runexpression) of using this trigger. |
| **visible** | Obsolete, use the [visibleIf](#visibility) property instead. |
