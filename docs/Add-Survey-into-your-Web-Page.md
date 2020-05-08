# Add Survey into your Web Page

The easiest way to add the survey into your web page, is to go to our [Survey Builder page](https://surveyjs.io/Survey/Builder/), construct your survey and click on the **Embed Survey** tab. 

There are three sections inside **Embed Survey** tab: _head_, _html_, _javascript_, from where you may copy the code into your web page.

Another easy way, is to go to  [one of our examples](https://surveyjs.io/Examples/Library/), click on plunker button and copy the code from plunker editors into your web application.

If you do not want to use our Azure CDN, you may download our script files from GitHub: [Survey library](https://github.com/surveyjs/survey-library/releases), or go to our [cdn repository](https://github.com/surveyjs/builds). It contains all versions since 0.12.0 (early 2017).


Finally you may select one of our npm packages, based on your JavaScript platform, and install it.

**Please note**: If you do not use any of this framework and do not use jQuery, then the right choice is [knockout](http://knockoutjs.com). It is a small library that helps creating UI with Model-View-View-Model pattern. You can include knockout script (~25k min+gz) just for SurveyJS and forget about this library existing in your application. 

| Platform | npm command |
|---|---|
| [Angular2+](https://angular.io/) | `npm install survey-angular` |
| [jQuery](https://jquery.com/) |  `npm install survey-jquery` |
| [Knockout.js](http://knockoutjs.com) |  `npm install survey-knockout` |
| [React](https://facebook.github.io/react/) |  `npm install survey-react` |
| [Vue.js](https://vuejs.org/) |  `npm install survey-vue` |

## Step 1. Add a link to your platform

| Platform |  |
|---|---|
| [Angular2+](https://angular.io/) | `import { Component } from '@@angular/core';` |
| [jQuery](https://jquery.com/) |  `<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>` |
| [Knockout.js](http://knockoutjs.com) |  `<script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js"></script>` |
| [React](https://facebook.github.io/react/) |  `import React from 'react';` and  `import ReactDOM from 'react-dom';` |
| [Vue.js](https://vuejs.org/) |  `<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.10/vue.min.js"></script>` |

## Step 2. Add link to SurveyJS files.

| Platform | JavaScript section  |
|---|---|
| [Angular2+](https://angular.io/) | `<script src="https://unpkg.com/survey-angular"></script>` |
| [jQuery](https://jquery.com/) |  `<script src="https://unpkg.com/survey-jquery"></script>` |
| [Knockout.js](http://knockoutjs.com) |  `<script src="https://unpkg.com/survey-knockout"></script>` |
| [React](https://facebook.github.io/react/) |  `<script src="https://unpkg.com/survey-react"></script>` |
| [Vue.js](https://vuejs.org/) |  `<script src="https://unpkg.com/survey-vue"></script>` |

| Platform | css section  |
|---|---|
| [Angular2+](https://angular.io/) | `<link href="https://unpkg.com/survey-angular/survey.min.css" type="text/css" rel="stylesheet"/>` |
| [jQuery](https://jquery.com/) |  `<link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>` |
| [Knockout.js](http://knockoutjs.com) |  `<link href="https://unpkg.com/survey-knockout/survey.min.css" type="text/css" rel="stylesheet"/>` |
| [React](https://facebook.github.io/react/) |  `<link href="https://unpkg.com/survey-react/survey.min.css" type="text/css" rel="stylesheet"/>` |
| [Vue.js](https://vuejs.org/) |  `<link href="https://unpkg.com/survey-vue/survey.min.css" type="text/css" rel="stylesheet"/>` |

## Step 3. Build Survey JSON
                    
Build JSON using [Visual Survey Builder](https://surveyjs.io/Survey/Builder/)

Here is the JSON example

```javascript
var surveyJSON = { title: "Tell us, what technologies do you use?", pages: [
  { name:"page1", questions: [ 
      { type: "radiogroup", choices: [ "Yes", "No" ], isRequired: true, name: "frameworkUsing",title: "Do you use any front-end framework like Bootstrap?" },
      { type: "checkbox", choices: ["Bootstrap","Foundation"], hasOther: true, isRequired: true, name: "framework", title: "What front-end framework do you use?", visibleIf: "{frameworkUsing} = 'Yes'" }
   ]},
  { name: "page2", questions: [
    { type: "radiogroup", choices: ["Yes","No"],isRequired: true, name: "mvvmUsing", title: "Do you use any MVVM framework?" },
    { type: "checkbox", choices: [ "AngularJS", "KnockoutJS", "React" ], hasOther: true, isRequired: true, name: "mvvm", title: "What MVVM framework do you use?", visibleIf: "{mvvmUsing} = 'Yes'" } ] },
  { name: "page3",questions: [
    { type: "comment", name: "about", title: "Please tell us about your main requirements for Survey library" } ] }
 ]
}
```
## Step 4. Show Survey on the page

#### If you are using Bootstrap, tell the library to use the bootstrap css classes
```javascript
Survey.StylesManager.applyTheme("bootstrap");
```
-----

#### [Angular2+](https://angular.io/) - As Survey Window.
```
<ng-app></ng-app>
```
```javascript
@@Component({
  selector: 'ng-app',
  template: `<div id='surveyElement'></div>`,
})
export class AppComponent  {
  ngOnInit() {
    var survey = new Survey.Model(surveyJSON);
    survey.onComplete.add(sendDataToServer);
    Survey.SurveyWindowNG.render("surveyElement", {model:survey});
  }
}
```
-----

#### [Angular2+](https://angular.io/) - Inside your web page.
```
<ng-app></ng-app>
```
```javascript
@@Component({
  selector: 'ng-app',
  template: `<div id='surveyElement'></div>`,
})
export class AppComponent  {
  ngOnInit() {
    var survey = new Survey.Model(surveyJSON);
    survey.onComplete.add(sendDataToServer);
    Survey.SurveyWindowNG.render("surveyElement", {model:survey});
  }
}
```
-----

#### [jQuery](https://jquery.com/) - As Survey Window.
```javascript
var survey = new Survey.Model(surveyJSON);
$("#surveyContainer").SurveyWindow({
    model:survey,
    onComplete:sendDataToServer
});
```
-----

#### [jQuery](https://jquery.com/)  - Inside your web page.
```
<div id="surveyContainer"></div>
```
```javascript
var survey = new Survey.Model(surveyJSON);
$("#surveyContainer").Survey({
    model:survey,
    onComplete:sendDataToServer
});
```
-----

#### [Knockout.js](http://knockoutjs.com) - As Survey Window.
```javascript
var surveyWindow = new Survey.SurveyWindow(surveyJSON);
surveyWindow.show();
//Use onComplete event to save the data
surveyWindow.survey.onComplete.add(sendDataToServer);
```
-----

#### [Knockout.js](http://knockoutjs.com)  - Inside your web page.
```
<div id="surveyContainer"></div>
```
```javascript
var survey = new Survey.Model(surveyJSON, "surveyContainer");
//Use onComplete event to save the data
survey.onComplete.add(sendDataToServer);
```
-----

#### [React](https://facebook.github.io/react/) - As Survey Window.
```
<div id="surveyContainer"></div>
```
```javascript
ReactDOM.render(
  <Survey.SurveyWindow json={surveyJSON} onComplete={sendDataToServer}/>,
  document.getElementById("surveyContainer"));
```
-----

#### [React](https://facebook.github.io/react/)  - Inside your web page.
```
<div id="surveyContainer"></div>
```
```javascript
ReactDOM.render(
  <Survey.Survey json={surveyJSON} onComplete={sendDataToServer}/>,
  document.getElementById("surveyContainer"));
```
-----

#### [Vue.js](https://vuejs.org/) - As Survey Window.
```
<div id="surveyContainer"><survey-window :survey="survey"></survey-window></div>
```
```javascript
var survey = new Survey.Model(surveyJSON);
new Vue({ el: '#surveyContainer', data: { survey: survey } });
```
-----

#### [Vue.js](https://vuejs.org/)  - Inside your web page.
```
<div id="surveyContainer"><survey :survey="survey"></survey></div>
```
```javascript
var survey = new Survey.Model(surveyJSON);
new Vue({ el: '#surveyContainer', data: { survey: survey } });
```
-----

## Step 5. Save survey data on the web server.

#### Your web server
```javascript
function sendDataToServer(survey) {
  var resultAsString = JSON.stringify(survey.data);
  alert(resultAsString); //send Ajax request to your web server.
}
```

#### SurveyJS service
```javascript
//You should get the Guid for storing survey data in surveyjs.io service storage
survey.surveyPostId = 'e544a02f-7fff-4ffb-b62d-6a9aa16efd7c';
//You may call survey.sendResult function as another option.
function sendDataToServer(survey) {
  survey.sendResult('e544a02f-7fff-4ffb-b62d-6a9aa16efd7c');
}
```

## SurveyJS Examples

Please visit [our examples](https://surveyjs.io/Examples/Library/) to find out more about the library. Select any of supported platforms and review html and JavaScript code. Click on "Edit in Plunker" button to load the example in the Plunker, so you may be able to modify it and see the results.