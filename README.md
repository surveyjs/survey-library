##Fork features

**surveyjs** sources contain **ES2015 modules system** now and build by **webpack**. We use **UMD** build which allows us to use our library in any modules system. 
**surveyjs** can be added as **classic html script tag** with global variable `Survey`. Or with some module system like **ES2015 modules**, for example, `import * as Survey from 'survey-react';`

If you are using **html script tag** you should know, that all "react" objects like `ReactSurveyWindow` is inside global variable `Survey` now. So you need to change your code.
For example, change from `ReactSurveyWindow` to `Survey.ReactSurveyWindow`.

If you are using **ES2015 modules** you can import only those modules that you need.
For example, 
```
import ReactSurveyQuestion from 'survey-react';
import {ReactSurveyQuestionErrors} from 'survey-react';

```
##Building survey.js from sources

To build library yourself:

 1. **Clone the repo from GitHub**  
	```
	git clone https://github.com/andrewtelnov/surveyjs.git
	cd surveyjs
	```

 2. **Acquire build dependencies.** Make sure you have [Node.js](http://nodejs.org/) installed on your workstation. This is only needed to _build_ surveyjs from sources.  
	```
	npm install -g gulp
	npm install -g typings
	npm install
	```
	The first `npm` command sets up the popular [Gulp](http://gulpjs.com/) build tool. 
	The second `npm` command sets up the Typescript Definition Manager [Typings](https://github.com/typings/typings).

 3. **Create TypeScript definition files**
	```
	typings install
	```
	Typescript definition files should be located at 'typings' directory.

 4. **Build the library**
	```
	gulp makedist
	```
	After that you should have the library at 'dist' directory.

 5. **Run unit tests**
	```
	gulp copyfiles
	gulp test_ci
	```
	The first command will copy all required files to 'wwwroot' directory and the last command will run unit tests usign [Karma](https://karma-runner.github.io/0.13/index.html)
