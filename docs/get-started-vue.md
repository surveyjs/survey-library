# Add a Survey to a Vue Application

This step-by-step tutorial will help you get started with the SurveyJS Library in a Vue application. To add a survey to your Vue application, follow the steps below:

- [Install the `survey-vue` npm Package](#install-the-survey-vue-npm-package)
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

You can find the full code in the following GitHub repository: <a href="https://github.com/surveyjs/code-examples/tree/main/get-started-vue" target="_blank">Get Started with SurveyJS - Vue</a>.

## Install the `survey-vue` npm Package

The SurveyJS Library for Vue is distributed as a <a href="https://www.npmjs.com/package/survey-vue" target="_blank">survey-vue</a> npm package. Run the following command to install it:

```cmd
npm install survey-vue --save
```

## Configure Styles

SurveyJS is shipped with several style sheets that implement different themes. Import one of the style sheets in the Vue component in which your survey will be.

To apply the imported theme, call the `applyTheme(themeName)` method. Its argument accepts different values depending on the chosen theme:

- Modern theme      
*"modern"*

- Default theme (in various color schemes)     
*"default"*, *"orange"*, *"darkblue"*, *"darkrose"*, *"stone"*, *"winter"*, *"winterstone"*

- Bootstrap theme (if your application uses Bootstrap)       
*"bootstrap"*

For instance, the following code applies the Modern theme:

```js
<template>
  <!-- ... -->
</template>

<script>
// Modern theme
import 'survey-vue/modern.min.css';
// Default theme
// import 'survey-vue/survey.min.css';
import { StylesManager } from 'survey-vue';

StylesManager.applyTheme("modern");
</script>
```

## Create a Model

A model describes the layout and contents of your survey. The simplest survey model contains one or several questions without layout modifications.

Models are specified by model definitions (JSON objects). For example, the following model definition declares two [textual questions](https://surveyjs.io/Documentation/Library?id=questiontextmodel), each with a [title](https://surveyjs.io/Documentation/Library?id=questiontextmodel#title) and a [name](https://surveyjs.io/Documentation/Library?id=questiontextmodel#name). Titles are displayed on screen. Names are used to identify the questions in code.

```js
const surveyJson = {
  questions: [{
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

To instantiate a model, pass the model definition to the [Model](https://surveyjs.io/Documentation/Library?id=surveymodel) constructor as shown in the code below. The model instance will be later used to render the survey. 

```js
<template>
  <!-- ... -->
</template>

<script>
// ...
import { ..., Model } from 'survey-vue';

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
import 'survey-vue/modern.min.css';
// import 'survey-vue/survey.min.css';
import { StylesManager, Model } from 'survey-vue';

StylesManager.applyTheme("modern");

const surveyJson = {
  questions: [{
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
import { ..., Survey } from 'survey-vue';
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
import 'survey-vue/modern.min.css';
// import 'survey-vue/survey.min.css';
import { Survey, StylesManager, Model } from 'survey-vue';

StylesManager.applyTheme("modern");

const surveyJson = {
  questions: [{
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

After a respondent completes a survey, the results are available within the [onComplete](https://surveyjs.io/Documentation/Library?id=surveymodel#onComplete) event handler. In real-world applications, you should send the results to a server where they will be stored in a database and processed. In this tutorial, the results are simply output in an alert dialog:

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

As you can see, survey results are saved in a JSON object. Its properties correspond to the `name` property values of your questions in the model definition.

<details>
    <summary>View full code</summary>  

```js
<template>
  <Survey :survey="survey" />
</template>

<script>
import 'survey-vue/modern.min.css';
// import 'survey-vue/survey.min.css';
import { Survey, StylesManager, Model } from 'survey-vue';

StylesManager.applyTheme("modern");

const surveyJson = {
  questions: [{
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

## Conclusion

You have learnt how to add a survey to your Vue application. For further information, refer to help topics within the [Design a Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-simple-survey) section.