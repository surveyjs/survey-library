# Add a Survey to an Angular Application

This step-by-step tutorial will help you get started with the SurveyJS Library in an Angular application. To add a survey to your Angular application, follow the steps below:

- [Install the `survey-angular` npm Package](#install-the-survey-angular-npm-package)
- [Configure Styles](#configure-styles)
- [Create a Model](#create-a-model)
- [Render the Survey](#render-the-survey)
- [Handle Survey Completion](#handle-survey-completion)

As a result, you will create a survey displayed below:

<iframe src="https://codesandbox.io/embed/unruffled-breeze-3e1rx?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fapp.component.ts&theme=dark"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    title="SurveyJS - Add a Survey to an Angular Application"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

You can find the full code in the following GitHub repository: <a href="https://github.com/surveyjs/code-examples/tree/main/get-started-library/angular" target="_blank">Get Started with SurveyJS - Angular</a>.

## Install the `survey-angular` npm Package

The SurveyJS Library for Angular is distributed as a <a href="https://www.npmjs.com/package/survey-angular" target="_blank">survey-angular</a> npm package. Run the following command to install it:

```cmd
npm install survey-angular --save
```

## Configure Styles

SurveyJS ships with the Modern and Default V2 UI themes illustrated below.

![Themes in SurveyJS Library](images/survey-library-themes.png)

Open the `angular.json` file and reference a style sheet that implements the required theme:

```js
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  // ...
  "projects": {
    "project-name": {
      "projectType": "application",
      // ...
      "architect": {
        "build": {
          // ...
          "options": {
            // ...
            "styles": [
              "src/styles.css",
              // Default V2 theme
              "node_modules/survey-angular/defaultV2.min.css",
              // Modern theme
              // "node_modules/survey-angular/modern.min.css"
            ],
            // ...
          }
        }
      }
    }
  }
}
```

To apply the referenced theme, call the `applyTheme(themeName)` method. Depending on the theme, pass `"modern"` or `"defaultV2"` as the method's argument. For instance, the following code applies the Default V2 theme:

```js
import { Component } from '@angular/core';
import { StylesManager } from "survey-angular";

StylesManager.applyTheme("defaultV2");

@Component({
  // ...
})
export class AppComponent {
  // ...
}
```

## Create a Model

A model describes the layout and contents of your survey. The simplest survey model contains one or several questions without layout modifications.

Models are specified by model schemas (JSON objects). For example, the following model schema declares two [textual questions](https://surveyjs.io/Documentation/Library?id=questiontextmodel), each with a [title](https://surveyjs.io/Documentation/Library?id=questiontextmodel#title) and a [name](https://surveyjs.io/Documentation/Library?id=questiontextmodel#name). Titles are displayed on screen. Names are used to identify the questions in code.

```js
const surveyJson = {
  elements: [{
    name: "FirstName",
    title: "Enter your first name:",
    type: "text"
  }, {
    name: "LastName",
    title: "Enter your last name:",
    type: "text"
  }]
};
```

To instantiate a model, pass the model schema to the [Model](https://surveyjs.io/Documentation/Library?id=surveymodel) constructor as shown in the code below. The model instance will be later used to render the survey. 

```js
import { Component, OnInit } from '@angular/core';
import { ..., Model } from "survey-angular";

@Component({
  // ...
})
export class AppComponent implements OnInit {
  ngOnInit() {
    const survey = new Model(surveyJson);
  }
}
```

<details>
    <summary>View full code</summary>  

```js
import { Component, OnInit } from '@angular/core';
import { Model, StylesManager } from "survey-angular";

StylesManager.applyTheme("defaultV2");

const surveyJson = {
  elements: [{
    name: "FirstName",
    title: "Enter your first name:",
    type: "text"
  }, {
    name: "LastName",
    title: "Enter your last name:",
    type: "text"
  }]
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My First Survey';
  ngOnInit() {    
    const survey = new Model(surveyJson);
  }
}
```
</details>

## Render the Survey

A survey should be rendered in an HTML element. Add this element to your component template:

```html
<div id="surveyContainer"></div>
```

To render a survey, call the `render()` method on the `SurveyNG` object as shown in the code below. Pass the model instance you created in the previous step to this method as the `model` property:

```js
import { Component, OnInit } from '@angular/core';
import { ..., SurveyNG } from "survey-angular";

@Component({
  // ...
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // ...
    SurveyNG.render("surveyContainer", { model: survey });
  }
}
```

If you replicate the code correctly, you should see the following survey:

![Get Started with SurveyJS - Primitive Survey](images/get-started-primitive-survey.png)

<details>
    <summary>View full code</summary>  

```html
<div id="surveyContainer"></div>
```

```js
import { Component, OnInit } from '@angular/core';
import { Model, SurveyNG, StylesManager } from "survey-angular";

StylesManager.applyTheme("defaultV2");

const surveyJson = {
  elements: [{
    name: "FirstName",
    title: "Enter your first name:",
    type: "text"
  }, {
    name: "LastName",
    title: "Enter your last name:",
    type: "text"
  }]
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My First Survey';
  ngOnInit() {    
    const survey = new Model(surveyJson);
    SurveyNG.render("surveyContainer", { model: survey });
  }
}
```
</details>

## Handle Survey Completion

After a respondent completes a survey, the results are available within the [onComplete](https://surveyjs.io/Documentation/Library?id=surveymodel#onComplete) event handler. In real-world applications, you should send the results to a server where they will be stored in a database and processed:

```js
import { Component, OnInit } from '@angular/core';
import { ..., Model } from "survey-angular";

const SURVEY_ID = 1;

@Component({
  // ...
})
export class AppComponent implements OnInit {
  surveyComplete (sender) {
    saveSurveyResults(
      "https://your-web-service.com/" + SURVEY_ID,
      sender.data
    )
  }
  ngOnInit() {    
    const survey = new Model(surveyJson);
    survey.onComplete.add(this.surveyComplete);
    // ...
  }
}

function saveSurveyResults(url, json) {
    const request = new XMLHttpRequest();
    request.open('POST', url);
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    request.addEventListener('load', () => {
        // Handle "load"
    });
    request.addEventListener('error', () => {
        // Handle "error"
    });
    request.send(JSON.stringify(json));
}
```

In this tutorial, the results are simply output in an alert dialog:

```js
import { Component, OnInit } from '@angular/core';
import { ..., Model } from "survey-angular";

@Component({
  // ...
})
export class AppComponent implements OnInit {
  alertResults (sender) {
    const results = JSON.stringify(sender.data);
    alert(results);
  }
  ngOnInit() {
    // ...
    const survey = new Model(surveyJson);
    survey.onComplete.add(this.alertResults);
    // ...
  }
}
```
![Get Started with SurveyJS - Survey Results](images/get-started-primitive-survey-alert.png)

As you can see, survey results are saved in a JSON object. Its properties correspond to the `name` property values of your questions in the model schema.

To view the application, run `ng serve` in a command line and open [http://localhost:4200/](http://localhost:4200/) in your browser.

<details>
    <summary>View full code</summary>  

```html
<div id="surveyContainer"></div>
```

```js
import { Component, OnInit } from '@angular/core';
import { Model, SurveyNG, StylesManager } from "survey-angular";

StylesManager.applyTheme("defaultV2");

const surveyJson = {
  elements: [{
    name: "FirstName",
    title: "Enter your first name:",
    type: "text"
  }, {
    name: "LastName",
    title: "Enter your last name:",
    type: "text"
  }]
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My First Survey';
  alertResults (sender) {
    const results = JSON.stringify(sender.data);
    alert(results);
  }
  ngOnInit() {
    const survey = new Model(surveyJson);
    survey.onComplete.add(this.alertResults);
    SurveyNG.render("surveyContainer", { model: survey });
  }
}
```
</details>

<a href="https://github.com/surveyjs/code-examples/tree/main/get-started-library/angular" target="_blank">View full code on GitHub</a>

## Further Reading

- [Create a Simple Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-simple-survey)
- [Create a Multi-Page Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-multi-page-survey)
- [Create a Quiz](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-quiz)