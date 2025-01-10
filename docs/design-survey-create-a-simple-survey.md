---
title: Create a Simple Survey | SurveyJS Form Libraries
description: The guide describes a basic survey structure and its elements and offers code examples of how to display an on-page form or a pop-up survey in a web app.
---
# Create a Simple Survey

This article illustrates a SurveyJS survey structure and the different ways you can describe this structure using a survey model. The article also contains code examples that show how to display the survey inside your page or in an expandable window. 

- [Survey Structure](#survey-structure)
- [Create a Survey Model](#create-a-survey-model)
  - [Define a Static Survey Model in JSON](#define-a-static-survey-model-in-json)
  - [Create or Change a Survey Model Dynamically](#create-or-change-a-survey-model-dynamically)
- [Display the Survey](#display-the-survey)

## Survey Structure

A survey consists of one or several pages. A page can contain panels and questions. Panels are used to group questions and control them as one. A panel can contain other panels and questions (nested panels are supported). The following image illustrates this structure:

<img src="../images/survey-structure.svg" width="860" alt="SurveyJS: Survey Structure">

## Create a Survey Model

A survey model describes the survey structure. You can create a survey model as follows:

- [Define a static survey model in JSON](#define-a-static-survey-model-in-json)      
Use this approach if the survey structure is known beforehand.

- [Create a survey model dynamically](#create-or-change-a-survey-model-dynamically)     
Use this approach if you want to add or remove survey elements at runtime.

### Define a Static Survey Model in JSON

Static survey models are specified by model schemas (JSON objects). For example, the following model schema declares a [page](https://surveyjs.io/Documentation/Library?id=pagemodel) that contains two [textual questions](https://surveyjs.io/Documentation/Library?id=questiontextmodel) and an expandable panel with two more textual questions. All survey elements have unique [names](https://surveyjs.io/Documentation/Library?id=questiontextmodel#name) that can be used to identify the elements in code. The panel and questions also have [titles](https://surveyjs.io/Documentation/Library?id=questiontextmodel#title) that are displayed on screen.

```js
const surveyJson = {
  pages: [{
    name: "PersonalDetails",
    elements: [{
      type: "text",
      name: "FirstName",
      title: "Enter your first name:"
    }, {
      type: "text",
      name: "LastName",
      title: "Enter your last name:"
    }, {
      type: "panel",
      name: "Contacts",
      state: "collapsed",
      title: "Contacts (optional)",
      elements: [{
        type: "text",
        name: "Telegram",
        title: "Telegram:"
      }, {
        type: "text",
        name: "GitHub",
        title: "GitHub username:"
      }]
    }]
  }]
};

const survey = new Survey.Model(surveyJson);
```

The model schema above produces the following survey:

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="eYGgGZP" data-user="romantsukanov" style="height: 528px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/romantsukanov/pen/eYGgGZP">
  SurveyJS - Define a Static Survey Model in JSON</a> by RomanTsukanov (<a href="https://codepen.io/romantsukanov">@romantsukanov</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

If your survey contains only one page, as in the previous example, you can skip the `pages` array declaration and specify the `elements` array at the top level:

```js
const surveyJson = {
  elements: [{
    type: "text",
    name: "FirstName",
    title: "Enter your first name:"
  },
  // ...
  ]
};

const survey = new Survey.Model(surveyJson);
```

### Create or Change a Survey Model Dynamically

SurveyJS allows you to create or modify a survey model at runtime. Call different methods to add or remove survey elements; specify properties using dot notation to configure the elements. For example, the following code adds survey elements using the [addNewPage(name)](https://surveyjs.io/Documentation/Library?id=surveymodel#addNewPage), [addNewPanel(name)](https://surveyjs.io/Documentation/Library?id=pagemodel#addNewPanel), and [addNewQuestion(type, name)](https://surveyjs.io/Documentation/Library?id=pagemodel#addNewQuestion) methods. The [title](https://surveyjs.io/Documentation/Library?id=questiontextmodel#title) and [state](https://surveyjs.io/Documentation/Library?id=panelmodel#state) properties configure the added elements. Refer to the [API](https://surveyjs.io/Documentation/Library?id=surveymodel) help section for a full list of supported methods and properties.

```js
// Create an empty model
const survey = new Survey.Model();
// Add a PersonalDetails page to the model
const page = survey.addNewPage("PersonalDetails");
// Add a FirstName question to the page
const firstName = page.addNewQuestion("text", "FirstName");
firstName.title = "Enter your first name:";

// Add a LastName question to the page
const lastName = page.addNewQuestion("text", "LastName");
lastName.title = "Enter your last name:";

// Add a Contacts panel to the page
const panel = page.addNewPanel("Contacts");
panel.title = "Contacts (optional)";
panel.state = "collapsed";

// Add a Telegram question to the panel
const telegram = panel.addNewQuestion("text", "Telegram");
telegram.title = "Telegram:"

// Add a GitHub question to the panel
const github = panel.addNewQuestion("text", "GitHub");
github.title = "GitHub username:"
```

You can combine both approaches to survey model configuration. The following example shows how to define a survey model in JSON, and then change it using methods and properties:

```js
const surveyJson = {
  pages: [{
    name: "PersonalDetails",
    elements: [{
      type: "text",
      name: "FirstName",
      title: "Enter your first name:"
    }, {
      type: "text",
      name: "LastName",
      title: "Enter your last name:"
    }, {
      type: "panel",
      name: "Contacts",
      title: "Contacts (optional)",
      elements: [{
        type: "text",
        name: "GitHub"
      }]
    }]
  }]
};

const survey = new Survey.Model(surveyJson);

// Add a title to the GitHub question
const github = survey.getQuestionByName("GitHub");
if (github) {
  github.title = "GitHub username:"
}
// Configure the Contacts panel
const panel = survey.getPanelByName("Contacts");
if (panel) {
  // Collapse the panel
  panel.state = "collapsed";

  // Add a Telegram question to the panel
  const telegram = panel.addNewQuestion("text", "Telegram");
  telegram.title = "Telegram:"
}
```

## Display the Survey

You can embed the survey inside your page or display it as a pop-up survey:

<details>
    <summary>Angular</summary> 

```html
<!-- Render the survey inside the page -->
<survey [model]="surveyModel"></survey>

<!-- Render the survey in a pop-up window -->
<popup-survey [model]="surveyModel" [isExpanded]="true"></popup-survey>
```

```js
import { Component, OnInit } from '@angular/core';
import { Model } from "survey-core";

const surveyJson = {
  // ...
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  surveyModel: Model;
  ngOnInit() {
    const survey = new Model(surveyJson);
    this.surveyModel = survey;
  }
}
```

</details>

<details>
    <summary>Vue 2</summary> 

```js
<template>
  <!-- Render the survey inside the page -->
  <Survey :survey="survey" />

  <!-- Render the survey in a pop-up window -->
  <PopupSurvey :survey="survey" :isExpanded="true" />
</template>

<script>
import { Model } from 'survey-core';
import { Survey, PopupSurvey } from 'survey-vue-ui';

const surveyJson = {
  // ...
};

export default {
  components: {
    Survey,
    PopupSurvey
  },
  data() {
    const survey = new Model(surveyJson);

    return {
      survey
    }
  }
}
</script>
```
</details>

<details>
    <summary>Vue 3</summary> 

```html
<script setup lang="ts">
import { Model } from 'survey-core';

const surveyJson = {
  // ...
};
const survey = new Model(surveyJson);
</script>

<template>
  <!-- Render the survey inside the page -->
  <SurveyComponent :model="survey" />

  <!-- Render the survey in a pop-up window -->
  <PopupSurveyComponent :model="survey" :isExpanded="true" />
</template>
```
</details>

<details>
    <summary>React</summary> 

```js
import { Model } from 'survey-core';
import { Survey, PopupSurvey } from 'survey-react-ui';

const surveyJson = {
  // ...
};

function App() {
  const survey = new Model(surveyJson);

  // Render the survey inside the page
  return <Survey model={survey} />;

  // Render the survey in a pop-up window
  return <PopupSurvey model={survey} isExpanded={true} />;
}

export default App;
```
</details>


<details>
    <summary>Knockout</summary> 

```html
<survey params="survey: model"></survey>
```

```js
const surveyJson = {
    // ...
};

// Render the survey inside the page
const survey = new Survey.Model(surveyJson);
document.addEventListener("DOMContentLoaded", function() {
    ko.applyBindings({
        model: survey
    });
});

// Render the survey in a pop-up window
const survey = new Survey.PopupSurveyModel(survey);
survey.isExpanded = true;
document.addEventListener("DOMContentLoaded", function() {
  survey.show();
});
```
</details>


<details>
    <summary>jQuery</summary> 

```html
<div id="surveyContainer"></div>
```

```js
const surveyJson = {
    // ...
};

const survey = new Survey.Model(surveyJson);

$(function() {
    // Render the survey inside the page
    $("#surveyContainer").Survey({ model: survey });

    // Render the survey in a pop-up window
    $("#surveyContainer").PopupSurvey({ model: survey, isExpanded: true });
});
```
</details>

[View Demo](https://surveyjs.io/Examples/Library?id=survey-window (linkStyle))

## See Also

- [Create a Multi-Page Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-multi-page-survey)
- [Create a Quiz](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-quiz)
- [Conditional Logic and Dynamic Texts](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-logic)
- [Access Survey Results](https://surveyjs.io/Documentation/Library?id=handle-survey-results-access)
