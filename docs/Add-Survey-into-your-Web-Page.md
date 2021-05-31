# Add Survey into your Web Page

## Use Survey Creator
The easiest way to add a SurveyJS-powered survey into your web page is to go to our [Survey Creator](https://surveyjs.io/create-survey/) page, construct your survey in a WYSIWYG manner, and click on the **Embed Survey** tab within the Creator. 

There are three sections inside the **Embed Survey** tab - _Scripts and styles_, _HTML_, _JavaScript_ - from which you can copy the code and paste it into your web page.

## Use Plunker from examples
Another easy way is to go to one of our [online examples](https://surveyjs.io/Examples/Library/), select 'Plunker' in the 'Edit in...' combobox, and copy the code from Plunker file editors into your web application.

## Get resource files

### Download from GitHub
If you do not want to use our CDN, you can download our script and stylesheet files from GitHub: [Survey Library Releases](https://github.com/surveyjs/survey-library/releases).

### Install as npm
As an alternative to downloading resource files, you can select one of our npm packages (based on your JavaScript platform) and install it.

**Please note**: If you do not use any of these frameworks and do not use jQuery, then the right choice is to go with [knockout](http://knockoutjs.com). It is a small library that helps creating UI with Model-View-View-Model pattern. You can include knockout script (~25k min+gz) just for SurveyJS and forget about the presence of this library in your application. 

| Platform | npm command |
|---|---|
| [Angular](https://angular.io/) | `npm install survey-angular` |
| [jQuery](https://jquery.com/) |  `npm install survey-jquery` |
| [Knockout.js](http://knockoutjs.com) |  `npm install survey-knockout` |
| [React](https://facebook.github.io/react/) |  `npm install survey-react` |
| [Vue.js](https://vuejs.org/) |  `npm install survey-vue` |

<a id="step-1.add-a-link-to-your-platform"></a>
## Step 1. Add a link to platform resources

| Platform |  |
|---|---|
| [Angular](https://angular.io/) | `import { Component } from '@@angular/core';` |
| [jQuery](https://jquery.com/) |  `<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>` |
| [Knockout.js](http://knockoutjs.com) |  `<script src="https://unpkg.com/knockout@3.5.1/build/output/knockout-latest.js"></script>` |
| [React](https://facebook.github.io/react/) |  `import React from 'react';` and  `import ReactDOM from 'react-dom';` |
| [Vue.js](https://vuejs.org/) |  `<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.10/vue.min.js"></script>` |

<a id="step-2.add-link-to-surveyjs-files"></a>
## Step 2. Add links to SurveyJS resources

### JavaScript
| Platform | JavaScript section  |
|---|---|
| [Angular](https://angular.io/) | `<script src="https://unpkg.com/survey-angular"></script>` |
| [jQuery](https://jquery.com/) |  `<script src="https://unpkg.com/survey-jquery"></script>` |
| [Knockout.js](http://knockoutjs.com) |  `<script src="https://unpkg.com/survey-knockout"></script>` |
| [React](https://facebook.github.io/react/) |  `<script src="https://unpkg.com/survey-react"></script>` |
| [Vue.js](https://vuejs.org/) |  `<script src="https://unpkg.com/survey-vue"></script>` |

### CSS
| Platform | CSS section  |
|---|---|
| [Angular](https://angular.io/) | `<link href="https://unpkg.com/survey-angular/survey.min.css" type="text/css" rel="stylesheet"/>` |
| [jQuery](https://jquery.com/) |  `<link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>` |
| [Knockout.js](http://knockoutjs.com) |  `<link href="https://unpkg.com/survey-knockout/survey.min.css" type="text/css" rel="stylesheet"/>` |
| [React](https://facebook.github.io/react/) |  `<link href="https://unpkg.com/survey-react/survey.min.css" type="text/css" rel="stylesheet"/>` |
| [Vue.js](https://vuejs.org/) |  `<link href="https://unpkg.com/survey-vue/survey.min.css" type="text/css" rel="stylesheet"/>` |

<a id="step-3.build-survey-json"></a>
## Step 3. Build a survey JSON
                    
Build a survey definition in JSON format. Use the visual [Survey Creator](https://surveyjs.io/create-survey/) or define a JSON in code.

Here is an example of a typical survey definition JSON.

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

<a id="step-4.show-survey-on-the-page"></a>
## Step 4. Show a survey on the page


<a id="if-you-are-using-bootstrap-tell-the-library-to-use-the-bootstrap-css-classes"></a>  
### Bootstrap
If you are using Bootstrap, tell the SurveyJS Library to use the bootstrap CSS classes.
```javascript
Survey.StylesManager.applyTheme("bootstrap");
```
-----

<a id="angular-as-survey-window"></a>
### [Angular](https://angular.io/) - As a survey window
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

<a id="angular-inside-your-web-page"></a>
### [Angular](https://angular.io/) - Inside your web page
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
    Survey.SurveyNG.render("surveyElement", {model:survey});
  }
}
```
-----


<a id="jquery-as-survey-window"></a>
### [jQuery](https://jquery.com/) - As a survey window
```javascript
var survey = new Survey.Model(surveyJSON);
survey.onComplete.add(sendDataToServer);
$("#surveyContainer").SurveyWindow({model:survey});
```
-----

<a id="jquery-inside-your-web-page"></a>
### [jQuery](https://jquery.com/)  - Inside your web page
```
<div id="surveyContainer"></div>
```
```javascript
var survey = new Survey.Model(surveyJSON);
survey.onComplete.add(sendDataToServer);
$("#surveyContainer").Survey({model:survey});
```
-----


<a id="knockout.js-as-survey-window"></a>
### [Knockout.js](http://knockoutjs.com) - As a survey window
```javascript
var surveyWindow = new Survey.SurveyWindow(surveyJSON);
surveyWindow.show();
//Use onComplete event to save the data
surveyWindow.survey.onComplete.add(sendDataToServer);
```
-----

<a id="knockout.js-inside-your-web-page"></a>
### [Knockout.js](http://knockoutjs.com)  - Inside your web page
```
<div id="surveyContainer"></div>
```
```javascript
var survey = new Survey.Model(surveyJSON, "surveyContainer");
//Use onComplete event to save the data
survey.onComplete.add(sendDataToServer);
```
-----

<a id="react-as-survey-window"></a>
### [React](https://facebook.github.io/react/) - As a survey window
```
<div id="surveyContainer"></div>
```
```javascript
ReactDOM.render(
  <Survey.SurveyWindow json={surveyJSON} onComplete={sendDataToServer}/>,
  document.getElementById("surveyContainer"));
```
-----

<a id="react-inside-your-web-page"></a>
### [React](https://facebook.github.io/react/)  - Inside your web page
```
<div id="surveyContainer"></div>
```
```javascript
ReactDOM.render(
  <Survey.Survey json={surveyJSON} onComplete={sendDataToServer}/>,
  document.getElementById("surveyContainer"));
```
-----

<a id="vue.js-as-survey-window"></a>
### [Vue.js](https://vuejs.org/) - As a survey window
```
<div id="surveyContainer"><survey-window :survey="survey"></survey-window></div>
```
```javascript
var survey = new Survey.Model(surveyJSON);
new Vue({ el: '#surveyContainer', data: { survey: survey } });
```
-----

<a id="vue.js-inside-your-web-page"></a>
### [Vue.js](https://vuejs.org/)  - Inside your web page
```
<div id="surveyContainer"><survey :survey="survey"></survey></div>
```
```javascript
var survey = new Survey.Model(surveyJSON);
new Vue({ el: '#surveyContainer', data: { survey: survey } });
```
-----


<a id="step-5.save-survey-data-on-the-web-server"></a>
## Step 5. Save survey data on a web server

<a id="your-web-server"></a>
### Your web server
```javascript
function sendDataToServer(sender) {
  var resultAsString = JSON.stringify(sender.data);
  alert(resultAsString); //Send an AJAX request to your web server here...
}
```

<a id="surveyjs-service"></a>
### SurveyJS web service
```javascript
//You should get the Guid for storing survey data in surveyjs.io service storage
survey.surveyPostId = 'e544a02f-7fff-4ffb-b62d-6a9aa16efd7c';
//You may call survey.sendResult function as another option.
function sendDataToServer(sender) {
  sender.sendResult('e544a02f-7fff-4ffb-b62d-6a9aa16efd7c');
}
```

<a id="surveyjs-examples"></a>
## SurveyJS Examples

Refer to [online examples](https://surveyjs.io/Examples/Library/) to find more information about SurveyJS Library use cases and to see them in action. Select any of the supported platforms and review its HTML and JavaScript code. Click on "Edit in Plunker" button to load the example in the Plunker to be able to modify it and see the results.
