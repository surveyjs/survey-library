# Getting Started with SurveyJS - The Very Basics

This section will help you get started using SurveyJS Library. You will learn how to create a simple ('Hello world' fashioned) web page with a working instance of a SurveyJS-powered survey.


## Create an empty web page based on HTML5 template
Begin with an empty HTML document. You can create and edit it using any text editor, even Notepad. This tutorial uses Visual Studio Code as a code editor (_it is more suitable for a video lesson_).

For the SurveyJS library to function properly, it is required to specify the HTML5 document type (DOCTYPE) for the page. To create a new HTML5 document, you can, for instance, use the following markup taken from w3.org's [template](https://www.w3.org/QA/2002/04/valid-dtd-list.html#Template).

````html
<!DOCTYPE html>
<html>
<head>
    <title><!-- Your title here --></title>
    <meta charset="utf-8">
</head>
<body>
    <!-- Your HTML content here -->
</body>
</html>
````

Give the page a title. Set it to "SurveyJS Getting Started", for instance:  
`<title>SurveyJS Getting Started</title>`

````html
<!DOCTYPE html>
<html>
<head>
    <title>SurveyJS Getting Started</title>
    <meta charset="utf-8">
</head>
<body>
    <!-- Your HTML content here -->
</body>
</html>
````

Now you are ready to modify this simple web page to incorporate a SurveyJS survey into it.

<!-- And now you are ready to add the code required to incorporate a SurveyJS survey into this simple page. -->

## Add links to resources (scripts and CSS) required for SurveyJS

To add a survey to your web page, you first need to attach the required resources - scripts and CSS files. The simplest way to link such resources is to reference them from CDNs. 

### Add a link to the platform resources

For the purpose of this tutorial, the web page will use [jQuery](https://jquery.com/) framework. So you need to add a reference to a jQuery file from the jQuery CDN.

To quickly find out a particular link to add, you can open the [Add a link to your platform scripts](https://surveyjs.io/Documentation/Library?id=Add-Survey-into-your-Web-Page#step-1.add-a-link-to-your-platform) documentation section and search for the related platform link in the section's table. 

![](images/gs0-add-link-to-platform.png)

The table suggests using the following link for the jQuery platform:    
`<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>`

Copy the link code and paste it to the script tag within the page's header section.  

````html
<!DOCTYPE html>
<html>
<head>
    <title>SurveyJS Getting Started</title>
    <meta charset="utf-8">
    <!-- A reference to the jQuery script goes here: -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
</head>
<body>
    <!-- Your HTML content here -->
</body>
</html>
````



### Add links to SurveyJS resources

To add SurveyJS-related resources, open the [Add links to SurveyJS files](https://surveyjs.io/Documentation/Library?id=Add-Survey-into-your-Web-Page#step-2.add-link-to-surveyjs-files) section in the documentation and find the jQuery-related links in both tables within the section:
 - a script link:  
`<script src="https://unpkg.com/survey-jquery"></script>`  
 - a CSS link:  
`<link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>`

![](images/gs0-add-link-to-surveyjs-files.png)

Copy these links and paste them into the web page's header section.

````html
<!DOCTYPE html>
<html>
<head>
    <title>SurveyJS Getting Started</title>
    <meta charset="utf-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <!-- A reference to the jQuery-related SurveyJS script: -->
    <script src="https://unpkg.com/survey-jquery"></script>
    <!-- A reference to the jQuery-related SurveyJS css: -->
    <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>
</head>
<body>
    <!-- Your HTML content here -->
</body>
</html>
````

If you run the web page at this time, you see that it does not contain any content and displays as an empty page. This is because no content is defined within the page.

![](images/gs0-blank-page.png)


## Add a survey instance to the page

After you linked all required resources to the web page, you can add specific code to create a survey instance within the page. The [Add jQuery-related survey into web page](https://surveyjs.io/Documentation/Library?id=Add-Survey-into-your-Web-Page#jquery-inside-your-web-page) documentation section describes which code to add for this purpose. Due to this article, you should do the following`:

- Add an HTML element to contain a survey.

    ```html
    <div id="surveyContainer"></div>
    ```

- Add a script to render a survey instance into the container.

    ````html
    <script>
        var survey = new Survey.Model(surveyJSON);
        survey.onComplete.add(sendDataToServer);
        $("#surveyContainer").Survey({model:survey});
    </script>
    ````
    >This code:  
    >- creates a new survey object (a [SurveyModel](https://surveyjs.io/Documentation/Library?id=surveymodel) class instance) based on the passed survey definition in JSON format,
    >- assigns a handler to the survey's [onComplete](https://surveyjs.io/Documentation/Library?id=surveymodel#onComplete) event,    
    >- renders the survey into its container.  
    >
    >Related API used in code (see links to sources):  
    >- var survey = new [Survey](https://github.com/surveyjs/survey-library/blob/737086cc7993e560bb3513f464e064a19b728c31/src/knockout/kosurvey.ts#L26).[Model](https://github.com/surveyjs/survey-library/blob/737086cc7993e560bb3513f464e064a19b728c31/src/entries/jquery.ts#L24-L25)(surveyJSON);   
    >- [survey](https://github.com/surveyjs/survey-library/blob/48ad72218b5216f3b3375fd62c09fbc99da1f6ae/src/survey.ts#L50).[onComplete](https://github.com/surveyjs/survey-library/blob/48ad72218b5216f3b3375fd62c09fbc99da1f6ae/src/survey.ts#L105-L118).[add](https://github.com/surveyjs/survey-library/blob/48ad72218b5216f3b3375fd62c09fbc99da1f6ae/src/base.ts#L1613)(sendDataToServer);
    >- $("#surveyContainer").[Survey](https://github.com/surveyjs/survey-library/blob/48ad72218b5216f3b3375fd62c09fbc99da1f6ae/src/entries/jquery.ts#L31-L36)({[model](https://github.com/surveyjs/survey-library/blob/48ad72218b5216f3b3375fd62c09fbc99da1f6ae/src/entries/jquery.ts#L33):survey});

    

Insert the above code pieces into the page's body.

```html
<!DOCTYPE html>
<html>
<head>
    <title>SurveyJS Getting Started</title>
    <meta charset="utf-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://unpkg.com/survey-jquery"></script>
    <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>
</head>
<body>
    <!-- A DIV container where to render a survey: -->
    <div id="surveyContainer"></div>
    <!-- A script that instantiates a survey and renders it into the designated DIV container: -->
    <script>
        var survey = new Survey.Model(surveyJSON);
        survey.onComplete.add(sendDataToServer);
        $("#surveyContainer").Survey({model:survey});
    </script>
</body>
</html>
```

If you open this HTML page in a browser at this time, you still see an empty page without any content. 

<img/>

You can find the reason in the browser's Developer Tools (F12) - it indicates an error: the `surveyJSON` variable is undefined.  

![](images/gs0-blank-page-error1.png)

Let us define this variable and temporarily set it to null to find out whether the page will be rendered without errors.  
`var surveyJSON = null;`  

```html
<!DOCTYPE html>
<html>
<head>
    <title>SurveyJS Getting Started</title>
    <meta charset="utf-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://unpkg.com/survey-jquery"></script>
    <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>
</head>
<body>
    <div id="surveyContainer"></div>
    <script>
        //Define the missed surveyJSON variable and try setting it to null.
        var surveyJSON = null;
        var survey = new Survey.Model(surveyJSON);
        survey.onComplete.add(sendDataToServer);
        $("#surveyContainer").Survey({model:survey});
    </script>
</body>
</html>
```

Open the page. Now a browser still displays an empty page and the Developer Tools shows another error - the sendDataToServer method is not defined at this time.  

![](images/gs0-blank-page-error2.png)

A simple workaround that comes to mind to get rid of this error is to comment the following code line:  
`onComplete:sendDataToServer` 

```html
<!DOCTYPE html>
<html>
<head>
    <title>SurveyJS Getting Started</title>
    <meta charset="utf-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://unpkg.com/survey-jquery"></script>
    <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>
</head>
<body>
    <div id="surveyContainer"></div>
    <script>
        var surveyJSON = null;
        var survey = new Survey.Model(surveyJSON);
        //Comment the following line to get rid of an error:
        //survey.onComplete.add(sendDataToServer);
        $("#surveyContainer").Survey({model:survey});
    </script>
</body>
</html>
```

After that, open the page once again. See that now the page is rendered without errors and it is not blank - the page contains the following explanatory text: 

`There is no visible page or question within the survey.`

![](images/gs0-page-with-empty-survey.png)

This means that a survey instance is created successfully but does not yet have any definition of its content (such as pages and/or questions). It is logical to assume that this is due to the surveyJSON variable which you previously set to null (instead of declaring the necessary content). As a result, SurveyJS renders the above "no content" text into the DIV ("surveyContainer") specified as a container for the survey markup.

Now you are ready to define the survey content to create your first survey and to make it functional within a browser's page.

## Define survey content through JSON

To structure a survey, form a proper JSON survey definition. 

Initially, change the surveyJSON variable's value - replace `null` with curly brackets `{}` to specify a JSON object which will define a model of a survey ([SurveyModel](https://surveyjs.io/Documentation/Library?id=SurveyModel)).

```
var surveyJSON = {};
```

### Create a survey page

Start defining a survey with its root structure element - a page. Create a [pages](https://surveyjs.io/Documentation/Library?id=surveymodel#pages) array and insert a single page object ([PageModel](https://surveyjs.io/Documentation/Library?id=PageModel)) into it:  
`pages: [{}]`

```js
var surveyJSON = { 
    //Insert a page:
    pages: [{}] 
};
```



### Create a survey element within a page

Pages are base containers for other survey elements, such as panels and questions. To create a simple survey element, define an [elements](https://surveyjs.io/Documentation/Library?id=PageModel#elements) array within the page and insert a single element ([IElement](https://github.com/surveyjs/survey-library/blob/4c3b31cf2cd893f40fff837e9e7140db7365baca/src/base.ts#L235)) into the array:  
`elements: [{}]`

```js
var surveyJSON = { 
    pages: [
        { 
            //Insert a survey element:
            elements: [{}] 
        }
    ] 
};
```

### Specify the survey element's type

Specify the type of the created element to help SurveyJS understand how to render the element - for instance, as a [text](https://surveyjs.io/Documentation/Library?id=questiontextmodel), [checkbox](https://surveyjs.io/Documentation/Library?id=questioncheckboxmodel), or [dropdown](https://surveyjs.io/Documentation/Library?id=questiondropdownmodel) question, as a [static](https://surveyjs.io/Documentation/Library?id=panelmodel) or [dynamic](https://surveyjs.io/Documentation/Library?id=questionpaneldynamicmodel) panel, as an [image](https://surveyjs.io/Documentation/Library?id=questionimagemodel) or [HTML](https://surveyjs.io/Documentation/Library?id=questionhtmlmodel) container, etc.  

Set the element's **type** (link?) property to `"text"` to display this element as a simple text question ([QuestionTextModel](https://surveyjs.io/Documentation/Library?id=questiontextmodel)). This question uses a textbox for user input.  

`type: "text"`

```js
var surveyJSON = { 
    pages: [
        { 
            elements: [
                {
                    //Specify the element's type:
                    type: "text"
                }
            ] 
        }
    ] 
};
```
In this stage, your web page's entire code looks like as follows.

```html
<!DOCTYPE html>
<html>
<head>
    <title>SurveyJS Getting Started</title>
    <meta charset="utf-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://unpkg.com/survey-jquery"></script>
    <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>
</head>
<body>
    <div id="surveyContainer"></div>
    <script>
        var surveyJSON = { 
            pages: [
                { 
                    elements: [
                        {
                            type: "text"
                        }
                    ] 
                }
            ] 
        };
        var survey = new Survey.Model(surveyJSON);
        //survey.onComplete.add(sendDataToServer);
        $("#surveyContainer").Survey({model:survey});
    </script>
</body>
</html>
```
If you open the web page in a browser, you can now see a functional survey with a single text question (to collect a response from a user) and a 'Complete' button (to submit user responses).

![](images/gs0-page-with-survey.png)

As you can see, the text question displays a textbox editor with an automatically generated title. The title text - "question1" - is by default formed based upon the value of the element's [name](https://surveyjs.io/Documentation/Library?id=SurveyElement#name) property (for it, `question` is used by default, combined with the element's position within the survey - `1`).



### Specify the survey element's title

Let us give a meaningful title to the question to point respondents to the question subject.  
Add the [title](https://surveyjs.io/Documentation/Library?id=questiontextmodel#title) property and set it as follows.


`title: "What is your name?",`

```js
var surveyJSON = { 
    pages: [
        { 
            elements: [
                {
                    //Specify the question's title:
                    title: "What is your name?",
                    type: "text"
                }
            ] 
        }
    ] 
};
```
See how the question title changes in a browser. Now it indicates the question purpose and helps users provide correct answers.

![](images/gs0-page-with-survey-question-title.png)


## Get user answers

In response to a click on the **Complete** button, SurveyJS automatically collects user answers and forms another JSON (survey response). This JSON typically contains an array of key/value pairs where the key is a question's identifier (name) and the value is the user answer to the question.

To get access to a survey response JSON, handle the survey's [onComplete](https://surveyjs.io/Documentation/Library?id=surveymodel#onComplete) event and obtain the [sender.data](https://surveyjs.io/Documentation/Library?id=surveymodel#data) property's value in the event handler.

For this purpose, you can do the following.


<!--
* Find a handler's demonstrational implementation in SurveyJS documentation and insert it into your page.
* Uncomment the code line that assigns an onComplete event handler.  
`//survey.onComplete.add(sendDataToServer);`
* Rename the handling function from sendDataToServer to onCompleteHandler.


### Implement an onComplete handler
-->


Open the [Save survey data on the web server](https://surveyjs.io/Documentation/Library?id=Add-Survey-into-your-Web-Page#step-5.save-survey-data-on-the-web-server) documentation section and copy the code from its "Your web server" part. 

![](images/gs0-doc-with-event-handler.png)

```js
function sendDataToServer(sender) {
    var resultAsString = JSON.stringify(sender.data);
    alert(resultAsString); //send Ajax request to your web server.
}
```


Insert the code into your page's body, into the script section, right before the surveyJSON variable definition.  

```html
<!DOCTYPE html>
<html>
<head>
    <title>SurveyJS Getting Started</title>
    <meta charset="utf-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://unpkg.com/survey-jquery"></script>
    <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>
</head>
<body>
    <div id="surveyContainer"></div>
    <script>
        // Insert the handling function implementation.
        function sendDataToServer(sender) {
            var resultAsString = JSON.stringify(survey.data);
            alert(resultAsString); //Send data to your web server instead.
        }    
        var surveyJSON = { 
            pages: [
                { 
                    elements: [
                        {
                            type: "text"
                        }
                    ] 
                }
            ] 
        };
        var survey = new Survey.Model(surveyJSON);
        //survey.onComplete.add(sendDataToServer);
        $("#surveyContainer").Survey({model:survey});
    </script>
</body>
</html>
```


Uncomment the following (previously commented) code line that assigns an onComplete event handler:  
`//survey.onComplete.add(sendDataToServer);`

Finally, you might find it useful to give a more informative name to the handling function in the context of this tutorial, since you do not send data to any server but just preview them in an alert message. Change the handling function name from 'sendDataToServer' to 'onCompleteHandler' as an example.  

The result code of the web page is given below.

```html
<!DOCTYPE html>
<html>
<head>
    <title>SurveyJS Getting Started</title>
    <meta charset="utf-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://unpkg.com/survey-jquery"></script>
    <link href="https://unpkg.com/survey-jquery/survey.min.css" type="text/css" rel="stylesheet"/>
</head>
<body>
    <div id="surveyContainer"></div>
    <script>
        function onCompleteHandler(sender) {
            var resultAsString = JSON.stringify(sender.data);
            alert(resultAsString); 
        }    
        var surveyJSON = { 
            pages: [
                { 
                    elements: [
                        {
                            type: "text"
                        }
                    ] 
                }
            ] 
        };
        var survey = new Survey.Model(surveyJSON);
        survey.onComplete.add(onCompleteHandler);
        $("#surveyContainer").Survey({model:survey});
    </script>
</body>
</html>
```

Open the page, answer the question, and click the **Complete** button. You will see the collected data in the opened alert message box.

![](images/gs0-survey-response-in-alert.png)

Pay attention to the data format - it is a JSON containing an array with a single item - a key/value pair that represents a user answer to the question. In this item, the key is the [name](https://surveyjs.io/Documentation/Library?id=SurveyElement#name) that identifies the question and the value is the text "John" entered into the question's textbox.

In a real application, you will need to process the obtained response data by passing them to a server and saving to a survey data store. 


## Conclusion

From this tutorial, you have learned how to create a simple survey, display it on a web page and get access to user responses.

In the next lessons you will know how to define more complex survey scenarios.

Spoiler test:
    <details>
      <summary>Example</summary>

      ```
      Example code
      ```
    </details>
