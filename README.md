**survey.js** is a JavaScript Survey Library. It is a modern way to add a survey to your website. It uses JSON for survey metadata and results.
[![Build Status](https://travis-ci.org/surveyjs/surveyjs.svg?branch=master)](https://travis-ci.org/surveyjs/surveyjs)

![alt tag](https://cloud.githubusercontent.com/assets/22315929/22462339/ed33f60a-e7bd-11e6-942b-72882e6bf1db.gif)

## Getting started
[![Join the chat at https://gitter.im/andrewtelnov/surveyjs](https://badges.gitter.im/andrewtelnov/surveyjs.svg)](https://gitter.im/andrewtelnov/surveyjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

To find out more about the library go
* to the [surveyjs.org site](http://surveyjs.org)
* explore the live [Examples](http://surveyjs.org/examples/)
* and build a survey JSON using [Visual Editor](http://surveyjs.org/builder/)

You can try plnkr examples at:
* Angular2 http://plnkr.co/edit/OJkKlUn1oxzWYtnruXir?p=preview
* jQuery http://plnkr.co/edit/DH4vJWSBtza7bSCDm2r9?p=preview
* Knockout http://plnkr.co/edit/JKy5wwiAhaBTMze3fOO0?p=preview
* React http://plnkr.co/edit/qXdeQa6x2FHRg0YrOlPL?p=preview
* Vue http://plnkr.co/edit/aTYVAiDvMWOf3zDReayE?p=preview

Install the library using npm.

Angular2 version:
```
npm install survey-angular
```
jQuery version:
```
npm install survey-jquery
```
Knockout version:
```
npm install survey-knockout
```
React version:
```
npm install survey-react
```
Vue version:
```
npm install survey-vue
```

Or use Azure CDN: https://surveyjs.azureedge.net/{version-name}/{filename}. You find all versions/builds in the [surveyjs/build repo](https://github.com/surveyjs/builds).

Or dowload a version as zip file from [Releases](https://github.com/surveyjs/surveyjs/releases)


## Building survey.js from sources

To build library yourself:

 1. **Clone the repo from GitHub**  
	```
	git clone https://github.com/surveyjs/surveyjs.git
	cd surveyjs
	```

 2. **Acquire build dependencies.** Make sure you have [Node.js](http://nodejs.org/) installed on your workstation. This is only needed to _build_ surveyjs from sources.  
	```
	npm install -g karma-cli
	npm install
	```

 3. **Build the library**
	```
	npm run build_prod
	```
	After that you should have the libraries (angular, jquery, knockout, react and vue) at 'packages' directory.

 4. **Run unit tests**
	```
	karma start
	```
	This command will run unit tests using [Karma](https://karma-runner.github.io/0.13/index.html)

## Create your own question type.
Explore the [example](https://github.com/surveyjs/surveyjs/tree/master/src/plugins) of adding a new question type into your survey library.

## Use 3rd party controls as question widgets.
Explore the [example](http://surveyjs.org/examples/react/custom-widget-datepicker.html) based on jquery datepicker

## License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)


## Visual Editor
Visual Editor [site](http://editor.surveyjs.io)
Visual Editor sources are [here](https://github.com/surveyjs/editor)
