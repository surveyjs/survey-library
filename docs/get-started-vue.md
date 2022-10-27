---
title: Vue.js Form Library | Getting Started Guide
description: A step-by-step tutorial on how to add the SurveyJS Form Library to a Vue.js application.
---
# Add a Survey to a Vue Application

This step-by-step tutorial will help you get started with the SurveyJS Form Library in a Vue application. To add a survey to your Vue application, follow the steps below:

- [Install the `survey-vue-ui` npm Package](#install-the-survey-vue-ui-npm-package)
- [Configure Styles](#configure-styles)
- [Create a Model](#create-a-model)
- [Render the Survey](#render-the-survey)
- [Handle Survey Completion](#handle-survey-completion)

As a result, you will create a survey displayed below:

<iframe src="https://codesandbox.io/embed/surveyjs-add-a-survey-to-a-vue-application-nn9zm?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcomponents%2FMyFirstSurvey.vue&theme=dark"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    title="SurveyJS - Add a Survey to a Vue Application"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

You can find the full code in the following GitHub repository: <a href="https://github.com/surveyjs/code-examples/tree/main/get-started-library/vue" target="_blank">Get Started with SurveyJS - Vue</a>.

## Install the `survey-vue-ui` npm Package

The SurveyJS Form Library for Vue consists of two npm packages: [`survey-core`](https://www.npmjs.com/package/survey-core) (platform-independent code) and [`survey-vue-ui`](https://www.npmjs.com/package/survey-vue-ui) (rendering code). Run the following command to install `survey-vue-ui`. The `survey-core` package will be installed automatically because it is listed in `survey-vue-ui` dependencies.

```cmd
npm install survey-vue-ui --save
```

## Configure Styles

SurveyJS ships with the Modern and Default V2 UI themes illustrated below.

![Themes in SurveyJS Form Library](images/survey-library-themes.png)

Open the Vue component in which your survey will be and import a style sheet that implements the required theme.

```js
<template>
  <!-- ... -->
</template>

<script>
// Default V2 theme
import 'survey-core/defaultV2.min.css';
// Modern theme
// import 'survey-core/modern.min.css';
</script>
```

To apply the imported theme, call the `applyTheme(themeName)` method. Depending on the theme, pass `"modern"` or `"defaultV2"` as the method's argument. For instance, the following code applies the Default V2 theme:

```js
<template>
  <!-- ... -->
</template>

<script>
// ...
import { StylesManager } from 'survey-core';

StylesManager.applyTheme("defaultV2");
</script>
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
<template>
  <!-- ... -->
</template>

<script>
// ...
import { ..., Model } from 'survey-core';

export default {
  data() {
    const survey = new Model(surveyJson);
    return {
      survey
    }
  },
}
</script>

```

<details>
    <summary>View full code</summary>  

```js
<template>
  <!-- ... -->
</template>

<script>
import 'survey-core/defaultV2.min.css';
import { StylesManager, Model } from 'survey-core';

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

export default {
  name: 'MyFirstSurvey',
  data() {
    const survey = new Model(surveyJson);
    return {
      survey
    }
  },
}
</script>
```
</details>


## Render the Survey

To render a survey, import the `Survey` component, add it to the template, and pass the model instance you created in the previous step to the component's `survey` attribute:

```js
<template>
  <Survey :survey="survey" />
</template>

<script>
// ...
import { Survey } from 'survey-vue-ui';
// ...
const surveyJson = { ... };

export default {
  components: {
    Survey
  },
  data() {
    const survey = new Model(surveyJson);
    return {
      survey
    }
  },
}
</script>
```

If you replicate the code correctly, you should see the following survey:

![Get Started with SurveyJS - Primitive Survey](images/get-started-primitive-survey.png)

<details>
    <summary>View full code</summary>  

```js
<template>
  <Survey :survey="survey" />
</template>

<script>
import 'survey-core/defaultV2.min.css';
import { StylesManager, Model } from 'survey-core';
import { Survey } from 'survey-vue-ui';

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

export default {
  name: 'MyFirstSurvey',
  components: {
    Survey
  },
  data() {
    const survey = new Model(surveyJson);
    return {
      survey
    }
  },
}
</script>
```
</details>

## Handle Survey Completion

After a respondent completes a survey, the results are available within the [onComplete](https://surveyjs.io/Documentation/Library?id=surveymodel#onComplete) event handler. In real-world applications, you should send the results to a server where they will be stored in a database and processed:

```js
<template>
  <!-- ... -->
</template>

<script>
// ...
const SURVEY_ID = 1;

export default {
  // ...
  data() {
    const survey = new Model(surveyJson);
    survey.onComplete.add(this.surveyComplete);

    return {
      survey
    }
  },
  methods: {
    surveyComplete (sender) {
      saveSurveyResults(
        "https://your-web-service.com/" + SURVEY_ID,
        sender.data
      )
    }
  },
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
</script>
```

In this tutorial, the results are simply output in an alert dialog:

```js
<template>
  <!-- ... -->
</template>

<script>
// ...
export default {
  // ...
  data() {
    const survey = new Model(surveyJson);
    survey.onComplete.add(this.alertResults);

    return {
      survey
    }
  },
  methods: {
    alertResults (sender) {
      const results = JSON.stringify(sender.data);
      alert(results);
    }
  },
}
</script>
```

![Get Started with SurveyJS - Survey Results](images/get-started-primitive-survey-alert.png)

As you can see, survey results are saved in a JSON object. Its properties correspond to the `name` property values of your questions in the model schema.

To view the application, run `npm run serve` in a command line and open [http://localhost:8080/](http://localhost:8080/) in your browser.

<details>
    <summary>View full code</summary>  

```js
<template>
  <Survey :survey="survey" />
</template>

<script>
import 'survey-core/defaultV2.min.css';
import { StylesManager, Model } from 'survey-core';
import { Survey } from 'survey-vue-ui';

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

export default {
  name: 'MyFirstSurvey',
  components: {
    Survey
  },
  data() {
    const survey = new Model(surveyJson);
    survey.onComplete.add(this.alertResults);

    return {
      survey
    }
  },
  methods: {
    alertResults (sender) {
      const results = JSON.stringify(sender.data);
      alert(results);
    }
  },
}
</script>
```
</details>

<a href="https://github.com/surveyjs/code-examples/tree/main/get-started-library/vue" target="_blank">View full code on GitHub</a>

## Further Reading

- [Create a Simple Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-simple-survey)
- [Create a Multi-Page Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-multi-page-survey)
- [Create a Quiz](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-quiz)
