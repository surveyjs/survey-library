# Add a Survey to a jQuery Application

This step-by-step tutorial will help you get started with the SurveyJS Library in a jQuery application. To add a survey to your jQuery application, follow the steps below:

- [Link SurveyJS Resources](#link-surveyjs-resources)
- [Create a Model](#create-a-model)
- [Render the Survey](#render-the-survey)
- [Handle Survey Completion](#handle-survey-completion)

As a result, you will create a survey displayed below:

<p class="codepen" data-height="443" data-default-tab="js,result" data-slug-hash="QWqbyPE" data-user="romantsukanov" style="height: 443px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/romantsukanov/pen/QWqbyPE">
  SurveyJS - Add a Survey to a jQuery Application</a> by RomanTsukanov (<a href="https://codepen.io/romantsukanov">@romantsukanov</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

You can find the full code in the following GitHub repository: <a href="https://github.com/surveyjs/code-examples/tree/main/get-started-library/jquery" target="_blank">Get Started with SurveyJS - jQuery</a>.

## Link SurveyJS Resources

The SurveyJS Library ships with a script and several style sheets that implement different themes. Insert links to the script and one of the style sheets within the `<head>` tag on your HTML page _after_ the jQuery link:

```html
<head>
    <!-- ... -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Modern theme -->
    <link href="https://unpkg.com/survey-jquery/modern.min.css" type="text/css" rel="stylesheet">

    <!-- Default theme -->
    <!-- <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"> -->

    <!-- Bootstrap theme -->
    <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet"> -->

    <script type="text/javascript" src="https://unpkg.com/survey-jquery"></script>
    <!-- ... -->
</head>
```

To apply the linked theme, call the `applyTheme(themeName)` method. Its argument accepts different values depending on the chosen theme:

- Modern theme      
*"modern"*

- Bootstrap theme       
*"bootstrap"*

- Default theme (in various color schemes)     
*"default"*, *"orange"*, *"darkblue"*, *"darkrose"*, *"stone"*, *"winter"*, *"winterstone"*

For instance, the following code applies the Modern theme:

```js
Survey.StylesManager.applyTheme("modern");
```

## Create a Model

A model describes the layout and contents of your survey. The simplest survey model contains one or several questions without layout modifications.

Models are specified by model definitions (JSON objects). For example, the following model definition declares two [textual questions](https://surveyjs.io/Documentation/Library?id=questiontextmodel), each with a [title](https://surveyjs.io/Documentation/Library?id=questiontextmodel#title) and a [name](https://surveyjs.io/Documentation/Library?id=questiontextmodel#name). Titles are displayed on screen. Names are used to identify the questions in code.

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

To instantiate a model, pass the model definition to the [Survey.Model](https://surveyjs.io/Documentation/Library?id=surveymodel) constructor as shown in the code below. The model instance will be later used to render the survey. 

```js
const survey = new Survey.Model(surveyJson);
```

<details>
    <summary>View full code</summary>  

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Survey</title>
    <meta charset="utf-8">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Modern theme -->
    <link href="https://unpkg.com/survey-jquery/modern.min.css" type="text/css" rel="stylesheet">

    <!-- Default theme -->
    <!-- <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"> -->

    <!-- Bootstrap theme -->
    <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet"> -->

    <script type="text/javascript" src="https://unpkg.com/survey-jquery/survey.jquery.min.js"></script>
    <script type="text/javascript" src="index.js"></script>
</head>
<body>
</body>
</html>
```

```js
Survey
    .StylesManager
    .applyTheme("modern");

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
    <summary>View full code</summary>  

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Survey</title>
    <meta charset="utf-8">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Modern theme -->
    <link href="https://unpkg.com/survey-jquery/modern.min.css" type="text/css" rel="stylesheet">

    <!-- Default theme -->
    <!-- <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"> -->

    <!-- Bootstrap theme -->
    <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet"> -->

    <script type="text/javascript" src="https://unpkg.com/survey-jquery/survey.jquery.min.js"></script>
    <script type="text/javascript" src="index.js"></script>
</head>
<body>
    <div id="surveyContainer"></div>
</body>
</html>
```

```js
Survey
    .StylesManager
    .applyTheme("modern");

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

After a respondent completes a survey, the results are available within the [onComplete](https://surveyjs.io/Documentation/Library?id=surveymodel#onComplete) event handler. In real-world applications, you should send the results to a server where they will be stored in a database and processed. In this tutorial, the results are simply output in an alert dialog:

```js
function alertResults (sender) {
    const results = JSON.stringify(sender.data);
    alert(results);
}

const survey = new Survey.Model(surveyJson);

survey.onComplete.add(alertResults);
```

![Get Started with SurveyJS - Survey Results](images/get-started-primitive-survey-alert.png)

As you can see, survey results are saved in a JSON object. Its properties correspond to the `name` property values of your questions in the model definition.

<details>
    <summary>View full code</summary>  

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Survey</title>
    <meta charset="utf-8">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Modern theme -->
    <link href="https://unpkg.com/survey-jquery/modern.min.css" type="text/css" rel="stylesheet">

    <!-- Default theme -->
    <!-- <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"> -->

    <!-- Bootstrap theme -->
    <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet"> -->

    <script type="text/javascript" src="https://unpkg.com/survey-jquery/survey.jquery.min.js"></script>
    <script type="text/javascript" src="index.js"></script>
</head>
<body>
    <div id="surveyContainer"></div>
</body>
</html>
```

```js
Survey
    .StylesManager
    .applyTheme("modern");

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

<a href="https://github.com/surveyjs/code-examples/tree/main/get-started-library/jquery" target="_blank">View full code on GitHub</a>

## Further Reading

- [Create a Simple Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-simple-survey)
- [Create a Multi-Page Survey](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-multi-page-survey)
- [Create a Quiz](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-quiz)