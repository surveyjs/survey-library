---
title: jQuery Form Library | Getting Started Guide
description: A step-by-step tutorial on how to add SurveyJS Form Library to a jQuery application.
---
# jQuery Form Library

This step-by-step tutorial will help you get started with SurveyJS Form Library in a jQuery application. To add a survey to your jQuery application, follow the steps below:

- [Link SurveyJS Resources](#link-surveyjs-resources)
- [Create a Model](#create-a-model)
- [Render the Survey](#render-the-survey)
- [Handle Survey Completion](#handle-survey-completion)

As a result, you will create a survey displayed below:

<iframe src="/proxy/github/code-examples/get-started-library/knockout/index.html"
    style="width:100%; border:0; border-radius: 4px; overflow:hidden;"
></iframe>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/get-started-library/jquery (linkStyle))

## Link SurveyJS Resources

SurveyJS Form Library resources include a script and a style sheet. Insert links to them within the `<head>` tag on your HTML page _after_ the jQuery link:

```html
<head>
    <!-- ... -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <link href="https://unpkg.com/survey-jquery/defaultV2.min.css" type="text/css" rel="stylesheet">
    <script type="text/javascript" src="https://unpkg.com/survey-jquery/survey.jquery.min.js"></script>
    <!-- ... -->
</head>
```

The style sheet above applies the Default theme. SurveyJS Form Library is shipped with several more predefined themes illustrated below and a flexible theme customization mechanism based on CSS variables.

![Themes in SurveyJS Form Library](images/survey-library-themes.png)

If you want to apply a predefined theme different from Default or create a custom theme, refer to the following help topic for detailed instructions: [Themes & Styles](https://surveyjs.io/form-library/documentation/manage-default-themes-and-styles).

> Previous to v1.9.100, SurveyJS also supplied the Modern theme, which is now obsolete. Please migrate to one of the predefined themes or create a custom theme.

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

To instantiate a model, pass the model schema to the [Survey.Model](https://surveyjs.io/Documentation/Library?id=surveymodel) constructor as shown in the code below. The model instance will be later used to render the survey. 

```js
const survey = new Survey.Model(surveyJson);
```

<details>
    <summary>View Full Code</summary>  

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Survey</title>
    <meta charset="utf-8">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Default V2 theme -->
    <link href="https://unpkg.com/survey-jquery/defaultV2.min.css" type="text/css" rel="stylesheet">

    <!-- Modern theme -->
    <!-- <link href="https://unpkg.com/survey-jquery/modern.min.css" type="text/css" rel="stylesheet"> -->

    <script type="text/javascript" src="https://unpkg.com/survey-jquery/survey.jquery.min.js"></script>
    <script type="text/javascript" src="index.js"></script>
</head>
<body>
</body>
</html>
```

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

const survey = new Survey.Model(surveyJson);
```
</details> 

## Render the Survey

A survey should be rendered in a page element. Add this element to your page:

```html
<body>
    <div id="surveyContainer"></div>
</body>
```

To render a survey in the page element, use the `Survey()` jQuery plugin as shown in the code below. Pass the model instance you created in the previous step to the `model` property of the plugin configuration object.

```js
$(function() {
    $("#surveyContainer").Survey({ model: survey });
});
```

If you replicate the code correctly, you should see the following survey:

![Get Started with SurveyJS - Primitive Survey](images/get-started-primitive-survey.png)

<details>
    <summary>View Full Code</summary>  

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Survey</title>
    <meta charset="utf-8">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Default V2 theme -->
    <link href="https://unpkg.com/survey-jquery/defaultV2.min.css" type="text/css" rel="stylesheet">

    <!-- Modern theme -->
    <!-- <link href="https://unpkg.com/survey-jquery/modern.min.css" type="text/css" rel="stylesheet"> -->

    <script type="text/javascript" src="https://unpkg.com/survey-jquery/survey.jquery.min.js"></script>
    <script type="text/javascript" src="index.js"></script>
</head>
<body>
    <div id="surveyContainer"></div>
</body>
</html>
```

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

const survey = new Survey.Model(surveyJson);

$(function() {
    $("#surveyContainer").Survey({ model: survey });
});
```
</details>

## Handle Survey Completion

After a respondent completes a survey, the results are available within the [`onComplete`](https://surveyjs.io/Documentation/Library?id=surveymodel#onComplete) event handler. In real-world applications, you should send the results to a server where they will be stored in a database and processed. If your application has a user identification system, you can add the user ID to the survey results before sending them to the server:

```js
const SURVEY_ID = 1;

function surveyComplete (survey) {
    const userId = /* ... Getting the user ID ... */
    survey.setValue("userId", userId);

    saveSurveyResults(
        "https://your-web-service.com/" + SURVEY_ID,
        survey.data
    )
}

function saveSurveyResults(url, json) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(json)
    })
    .then(response => {
        if (response.ok) {
            // Handle success
        } else {
            // Handle error
        }
    })
    .catch(error => {
        // Handle error
    });
}

const survey = new Survey.Model(surveyJson);

survey.onComplete.add(surveyComplete);
```

In this tutorial, the results are simply output in an alert dialog:

```js
function alertResults (sender) {
    const results = JSON.stringify(sender.data);
    alert(results);
}

const survey = new Survey.Model(surveyJson);

survey.onComplete.add(alertResults);
```

![Get Started with SurveyJS - Survey Results](images/get-started-primitive-survey-alert.png)

As you can see, survey results are saved in a JSON object. Its properties correspond to the `name` property values of your questions in the model schema.

<details>
    <summary>View Full Code</summary>  

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Survey</title>
    <meta charset="utf-8">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Default V2 theme -->
    <link href="https://unpkg.com/survey-jquery/defaultV2.min.css" type="text/css" rel="stylesheet">

    <!-- Modern theme -->
    <!-- <link href="https://unpkg.com/survey-jquery/modern.min.css" type="text/css" rel="stylesheet"> -->

    <script type="text/javascript" src="https://unpkg.com/survey-jquery/survey.jquery.min.js"></script>
    <script type="text/javascript" src="index.js"></script>
</head>
<body>
    <div id="surveyContainer"></div>
</body>
</html>
```

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

const survey = new Survey.Model(surveyJson);

function alertResults (sender) {
    const results = JSON.stringify(sender.data);
    alert(results);
}

survey.onComplete.add(alertResults);

$(function() {
    $("#surveyContainer").Survey({ model: survey });
});
```
</details>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/get-started-library/jquery (linkStyle))

## Further Reading

- [Create a Simple Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-simple-survey)
- [Create a Multi-Page Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-multi-page-survey)
- [Create a Quiz](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-quiz)
