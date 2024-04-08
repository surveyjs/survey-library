---
title: Conditional Logic and Dynamic Texts | SurveyJS
description: Learn how to implement branching and skip logic and add dynamic texts to your surveys.
---
# Conditional Logic and Dynamic Texts

This help topic describes how to implement custom conditional logic and add dynamic texts to your survey.

## Dynamic Texts

Survey UI texts support placeholders whose values are computed at runtime to make the texts dynamic. Placeholders can be used in the following places:

- Titles and descriptions of surveys, pages, panels, and questions
- Properties that accept HTML markup ([`completedHtml`](https://surveyjs.io/Documentation/Library?id=surveymodel#completedHtml), [`loadingHtml`](https://surveyjs.io/Documentation/Library?id=surveymodel#loadingHtml), etc.)
- [Expressions](#expressions)

You can use the following values as placeholders:

- [Question Values](#question-values)
- [Variables](#variables)
- [Calculated Values](#calculated-values)

### Question Values

To use a question value as a placeholder, specify the question's [`name`](https://surveyjs.io/Documentation/Library?id=Question#name) in curly brackets. The name will be replaced with the question value. For instance, the following example defines two [Text](https://surveyjs.io/Documentation/Library?id=questiontextmodel) questions: First Name and Last Name. An [Html](https://surveyjs.io/Documentation/Library?id=questionhtmlmodel) question uses their `name` property to reference them and display their values:

```js
const surveyJson = {
  "elements": [
    { "name": "firstName", "type": "text", "title": "First Name", "defaultValue": "John" },
    { "name": "lastName", "type": "text", "title": "Last Name", "defaultValue": "Smith" },
    {
      "name": "greetings",
      "type": "html",
      "html": "<p>Hello, {firstName} {lastName}!</p>"
    }
  ]
};
```

In single- and multiple-selection question types (Dropdown, Checkbox, Radiogroup, Tag Box, Image Picker), items can contain a display value in addition to a question value. In this case, placeholders are replaced with display values. If you want to use question values instead, disable the [`useDisplayValuesInDynamicTexts`](https://surveyjs.io/form-library/documentation/api-reference/question#useDisplayValuesInDynamicTexts) property.

Certain question types can contain multiple values. Use a dot symbol to access a specific value (item or cell):

<div class="v2-class---doc-table-container">
  <table class="v2-class---doc-table-container__table">
    <thead>
      <tr>
        <th>Question Type</th>
        <th>Syntax</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/Documentation/Library?id=questionmultipletextmodel" class="v2-class---paragraph-link">Multiple Textboxes</a></td>
        <td><code>{questionname.itemname}</code></td>
      </tr>
      <tr>
        <td><a href="/Documentation/Library?id=questionmatrixmodel" class="v2-class---paragraph-link">Single-Select Matrix</a></td>
        <td><code>{questionname.rowname}</code></td>
      </tr>
      <tr>
        <td rowspan="2" style="vertical-align:middle"><a href="/Documentation/Library?id=questionmatrixdropdownmodel" class="v2-class---paragraph-link">Multi-Select Matrix</a></td>
        <td><code>{questionname.rowname.columnname}</code></td>
      </tr>
      <tr>
        <td><code>{questionname-total.columnname}</code> (accesses a cell in the total row)</td>
      </tr>
    </tbody>
  </table>
</div>

[View Demo](/Examples/Library?id=condition-complexquestions (linkStyle))

In dynamic questions, use a zero-based index to access a specific value (question or cell):

| Question Type                                                          | Syntax                                     |
| ---------------------------------------------------------------------- | ------------------------------------------ |
| [Dynamic Panel](/Documentation/Library?id=questionpaneldynamicmodel)   | `{dynamicpanelname[index].questionname}`   |
| [Dynamic Matrix](/Documentation/Library?id=questionmatrixdynamicmodel) | `{dynamicmatrixname[rowindex].columnname}` |

You can also use prefixes, such as `row`, `panel`, and `parentPanel`, to access a specific question or cell relative to the question you configure: 

<div class="v2-class---doc-table-container">
  <table class="v2-class---doc-table-container__table">
    <thead>
      <tr>
        <th>Question Type</th>
        <th>Syntax</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/form-library/documentation/api-reference/matrix-table-question-model" class="v2-class---paragraph-link">Single-Select Matrix</a></td>
        <td rowspan="3" style="vertical-align:middle"><code>{row.columnname}</code></td>
        <td rowspan="3" style="vertical-align:middle">Accesses a cell in the same row.</td>
      </tr>
      <tr>
        <td><a href="/form-library/documentation/api-reference/matrix-table-with-dropdown-list" class="v2-class---paragraph-link">Multi-Select Matrix</a></td>
      </tr>
      <tr>
        <td><a href="/form-library/documentation/api-reference/dynamic-matrix-table-question-model" class="v2-class---paragraph-link">Dynamic Matrix</a></td>
      </tr>
      <tr>
        <td rowspan="2" style="vertical-align:middle"><a href="/form-library/documentation/api-reference/dynamic-panel-model" class="v2-class---paragraph-link">Dynamic Panel</a></td>
        <td><code>{panel.questionname}</code></td>
        <td>Accesses a question within the same panel.</td>
      </tr>
      <tr>
        <td style="vertical-align:middle"><code>{parentPanel.questionname}</code></td>
        <td>Accesses a question within a parent Dynamic Panel.<br>Applies when one Dynamic Panel question is nested in another.</td>
      </tr>
    </tbody>
  </table>
</div>

[View Demo](/Examples/Library?id=condition-dynamic (linkStyle))

### Variables

Variables are used to store JavaScript-calculated values. To create or change a variable, call the Survey's [`setVariable(name, value)`](https://surveyjs.io/Documentation/Library?id=surveymodel#setVariable) method. In the following code, this method sets a `currentYear` variable used to display the current year in an Html question:

```js
import { Model } from "survey-core";

const surveyJson = {
  "elements": [{
    "name": "footer",
    "type": "html",
    "html": "&copy; 2015-{currentyear} Devsoft Baltic OÜ"
  }]
};

const survey = new Model(surveyJson);

survey.setVariable("currentyear", new Date().getFullYear());
```

If you need to get a variable's value, call the [`getVariable(name)`](https://surveyjs.io/Documentation/Library?id=surveymodel#getVariable) method. For example, the following code outputs the `currentyear` variable's value into the browser's console:

```js
console.log(survey.getVariable("currentyear"));
```

You can also call the [`getVariableNames()`](https://surveyjs.io/Documentation/Library?id=surveymodel#getVariableNames) method to get a list of all available variables:

```js
console.log(survey.getVariableNames()); // Outputs [ "currentyear" ]
```

### Calculated Values

Calculated values allow you to register an [expression](#expressions) under a required name. If the expression includes [questions](#question-values), [variables](#variables), or [functions](#built-in-functions), it is recalculated each time their values are changed.

To configure a calculated value, define the [`calculatedValues`](https://surveyjs.io/Documentation/Library?id=surveymodel#calculatedValues) array in the survey JSON schema. Each object in this array should contain the following fields:

- `name` - A name that identifies the calculated value.
- `expression` - An expression that returns the calculated value.
- `includeIntoResult` - A Boolean property that specifies whether to include the calculated value in survey results.

The following code shows how to calculate a full name value based on the first and last names:

```js
const surveyJson = {
  "elements": [
    { "name": "firstName", "type": "text", "title": "First Name", "defaultValue": "John" },
    { "name": "lastName", "type": "text", "title": "Last Name", "defaultValue": "Smith" },
    {
      "name": "greetings",
      "type": "html",
      "html": "<p>Hello, {fullname}!</p>"
    }
  ],
  "calculatedValues": [{
    "name": "fullname",
    "expression": "{firstName} +  ' ' + {lastName}"
  }]
};
```

[View Demo](https://surveyjs.io/Examples/Library?id=survey-calculatedvalues (linkStyle))

### Variables vs Question Values

Variables and question values are both used to perform custom calculations within a survey. However, they also have a number of important differences. The following table compares variables with question values across multiple criteria:

| Criteria | Variables | Calculated values |
|--------- | --------- | ----------------- |
| Configuration | Configured using JavaScript code | Configured using an expression in the survey JSON schema |
| Evaluation / Re-evaluation | Evaluated only once&mdash;when set | Evaluated when the survey model is instantiated and re-evaluated each time dynamic values within the expression are changed |
| Inclusion in survey results | Aren't saved in survey results, but can be (see below) | Saved in survey results if the `includeIntoResult` property is enabled |

If you need to save a variable in survey results, create an intermediary calculated value that references the variable. Enable the calculated value's `includeIntoResult` property to save the value in survey results. The following code shows how to save a `currentyear-var` variable value in survey results via a `currentyear` calculated value:

```js
import { Model } from "survey-core";

const surveyJson = {
  "elements": [{
    "name": "footer",
    "type": "html",
    "html": "&copy; 2015-{currentyear} Devsoft Baltic OÜ"
  }],
  "calculatedValues": [{
    "name": "currentyear",
    "expression": "{currentyear-var}",
    "includeIntoResult": true
  }]
};

const survey = new Model(surveyJson);

survey.setVariable("currentyear-var", new Date().getFullYear());
```

## Expressions

Expressions allow you to add logic to your survey and perform calculations right in the survey JSON schema. Expressions are evaluated and re-evaluated at runtime.

SurveyJS supports the following expression types:

- String expression   
  An expression that evaluates to a string value. The following string expression evaluates to `"Adult"` if the [`age`](#age) function returns a value of 21 or higher; otherwise, the expression evaluates to `"Minor"`:

    ```js
    "expression": "iif(age({birthdate}) >= 21, 'Adult', 'Minor')"
    ```

- Numeric expression    
  An expression that evaluates to a number. The following numeric expression evaluates to the sum of the `total1` and `total2` question values:

    ```js
    "expression": "sum({total1}, {total2})"
    ```

- Boolean expression    
  An expression that evaluates to `true` or `false`. Boolean expressions are widely used to implement conditional logic. Refer to the following help topic for more information: [Conditional Visibility](#conditional-visibility).

Expressions can include question names, variables, and calculated values (described in the [Dynamic Texts](#dynamic-texts) section). Plus, expressions can use [built-in](#built-in-functions) and [custom functions](#custom-functions).

### Built-In Functions

Functions allow you to perform additional calculations within an expression. One expression can contain multiple function calls.

Functions can accept arguments. For example, the following expression shows the built-in [`age`](#age) and [`iif`](#iif) functions. `age` accepts the value of a `birthdate` question. `iif` accepts three arguments: a condition, a value to return when the condition is truthy, and a value to return when the condition is falsy.

```js
"expression": "iif(age({birthdate}) >= 21, 'Adult', 'Minor')"
```

The following built-in functions are available:

- [`iif`](#iif)
- [`isContainerReady`](#iscontainerready)
- [`isDisplayMode`](#isdisplaymode)
- [`age`](#age)
- [`currentDate`](#currentdate)
- [`today`](#today)
- [`getDate`](#getdate)
- [`diffDays`](#diffdays)
- [`sum`](#sum)
- [`max`](#max)
- [`min`](#min)
- [`avg`](#avg)
- [`sumInArray`](#suminarray)
- [`maxInArray`](#maxinarray)
- [`minInArray`](#mininarray)
- [`avgInArray`](#avginarray)
- [`countInArray`](#countinarray)

If you do not find a required function in the list above, you can [implement a custom function](#custom-functions) with the required functionality.

---

#### `iif`

*Definition*: `iif(condition: expression, valueIfTrue: any, valueIfFalse: any): any`

Returns the `valueIfTrue` value if the `condition` is truthy or the `valueIfFalse` value if the `condition` is falsy.

*Example*: `"expression": "iif({question1} + {question2} > 20, 'High', 'Low')"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L205-L209 (linkStyle))

---

#### `isContainerReady`

*Definition*: `isContainerReady(nameOfPanelOrPage: string): boolean`

Returns `true` if all questions in a given panel or page have valid input; otherwise, returns `false`. An empty question value is considered valid if neither validators nor required status is defined for it.

*Example*: `"expression": "isContainerReady('page1')"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L232-L245 (linkStyle))

---

#### `isDisplayMode`

*Definition*: `isDisplayMode(): boolean`

Returns `true` if the survey is in display or preview mode.

*Example*: `"expression": "isDisplayMode()"` 

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L247-L250 (linkStyle))  

---

#### `age`

*Definition*: `age(birthdate: any): number`  

Returns age according to a given birthdate. The date argument (which is typically taken from a question) should be defined as a valid [JavaScript Date](https://www.w3schools.com/jsref/jsref_obj_date.asp).

*Example*: `"expression": "age({birthdate})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L218-L230 (linkStyle))  

---

#### `currentDate`

*Definition*: `currentDate(): Date`

Returns the current date and time. 

*Example*: `"expression": "currentDate()"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L252-L255 (linkStyle))  

---

#### `today`

*Definition*: `today(daysToAdd?: number): Date`

Returns the current date or a date shifted from the current by a given number of days. For example, `today()` returns the current date, 0 hours, 0 minutes, 0 seconds; `today(-1)` returns yesterday's date, same time; `today(1)` returns tomorrow's date, same time.

*Examples*:

- `"expression": "today()"`
- `"expression": "today(2)"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L257-L264 (linkStyle))

---

#### `year`

*Definition*: `year(date?: Date): number`

Returns the year of a given date.

*Example*: `"expression": "year({birthdate})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/b7ff8f2bde82ed09e948fa89b965cb0cad5f19cb/src/functionsfactory.ts#L323-L326 (linkStyle))

---

#### `month`

*Definition*: `month(date?: Date): number`

Returns the month of a given date as a value from 1 (January) to 12 (December).

*Example*: `"expression": "month({birthdate})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/b7ff8f2bde82ed09e948fa89b965cb0cad5f19cb/src/functionsfactory.ts#L329-L332 (linkStyle))

---

#### `day`

*Definition*: `day(date?: Date): number`

Returns the day of the month for a given date as a value from 1 to 31.

*Example*: `"expression": "day({birthdate})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/b7ff8f2bde82ed09e948fa89b965cb0cad5f19cb/src/functionsfactory.ts#L335-L338 (linkStyle))

---

#### `weekday`

*Definition*: `weekday(date?: Date): number`

Returns the day of the week for a given date as a value from 0 (Sunday) to 6 (Saturday).

*Example*: `"expression": "weekday({birthdate})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/b7ff8f2bde82ed09e948fa89b965cb0cad5f19cb/src/functionsfactory.ts#L341-L344 (linkStyle))

---

#### `getDate`

*Definition*: `getDate(questionName: expression): Date`

Returns a Date value converted from a given question's value.

*Example*: `"expression": "getDate({birthdate})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L211-L216 (linkStyle))  

---

#### `diffDays`

*Definition*: `diffDays(fromDate: any, toDate: any): number`
 
Returns the number of days between two given dates.

*Example*: `"expression": "diffDays({startDate}, {endDate}) < 7"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L266-L274 (linkStyle))

---

#### `sum`

*Definition*: `sum(param1: number, param2: number, ...): number`  

Returns the sum of passed numbers.

*Example*: `"expression": "sum({total1}, {total2})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L73-L82 (linkStyle))

---

#### `max`

*Definition*: `max(param1: number, param2: number, ...): number`
 
Returns the maximum of passed numbers.

*Example*: `"expression": "max({total1}, {total2})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L106-L109 (linkStyle))

---

#### `min`

*Definition*: `min(par1: number, par2: number, ...): number`

Returns the minimum of passed numbers.

*Example*: `"expression": "min({total1}, {total2})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L101-L104 (linkStyle))

---

#### `avg`

*Definition*: `avg(par1: number, par2: number, ...): number`

Returns the average of passed numbers.

*Example*: `"expression": "avg({total1}, {total2}, {total3})"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L118-L127 (linkStyle))

---

#### `sumInArray`

*Definition*: `sumInArray(questionName: expression, dataFieldName: string): number`

Returns the sum of numbers taken from a specified data field. This data field is searched in an array that contains a user response to a [Dynamic Panel](/form-library/examples/duplicate-group-of-fields-in-form/) question or a [matrix](/form-library/examples/single-selection-matrix-table-question/) question of any type.

*Example*: `"expression": "sumInArray({matrixdynamic}, 'total') > 1000"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L164-L171 (linkStyle))

---

#### `maxInArray`

*Definition*: `maxInArray(questionName: expression, dataFieldName: string): number`

Returns the maximum of numbers taken from a specified data field. This data field is searched in an array that contains a user response to a [Dynamic Panel](/form-library/examples/duplicate-group-of-fields-in-form/) question or a [matrix](/form-library/examples/single-selection-matrix-table-question/) question of any type.

*Example*: `"expression": "maxInArray({matrixdynamic}, 'quantity') > 20"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L181-L187 (linkStyle))

---

#### `minInArray`

*Definition*: `minInArray(questionName: expression, dataFieldName: string): number`
 
Returns the minimum of numbers taken from a specified data field. This data field is searched in an array that contains a user response to a [Dynamic Panel](/form-library/examples/duplicate-group-of-fields-in-form/) question or a [matrix](/form-library/examples/single-selection-matrix-table-question/) question of any type.

*Example*: `"expression": "minInArray({matrixdynamic}, 'quantity') > 5"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L173-L179 (linkStyle))

---

#### `avgInArray`

*Definition*: `avgInArray(questionName: expression, dataFieldName: string): number`

Returns the average of numbers taken from a specified data field. This data field is searched in an array that contains a user response to a [Dynamic Panel](/form-library/examples/duplicate-group-of-fields-in-form/) question or a [matrix](/form-library/examples/single-selection-matrix-table-question/) question of any type.

*Example*: `"expression": "avgInArray({matrixdynamic}, 'quantity') > 10"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L198-L203 (linkStyle))  

---

#### `countInArray`

*Definition*: `countInArray(questionName: expression, dataFieldName: string): number`

Returns the total number of array items in which a specified data field has a value other than `null` or `undefined`. This data field is searched in an array that contains a user response to a [Dynamic Panel](/form-library/examples/duplicate-group-of-fields-in-form/) question or a [matrix](/form-library/examples/single-selection-matrix-table-question/) question of any type.

*Example*: `"expression": "countInArray({matrixdynamic}, 'quantity') > 10"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L189-L196 (linkStyle))

---

#### `displayValue`

*Definition*: `displayValue(questionName: string): any`

Returns a question's display text. Supports questions nested within panels or matrices.

*Example*: `"expression": "displayValue('question1')"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/f70cd9a367659f475e28e0a317b9583931cdf185/src/functionsfactory.ts#L359-L363 (linkStyle))

---

#### `propertyValue`

*Definition*: `propertyValue(questionName: string, propertyName: string): any`

Returns the value of a property specified for a given question. Supports questions nested within panels or matrices.

*Example*: `"expression": "propertyValue('question1', 'visible')"`

[View Source Code](https://github.com/surveyjs/survey-library/blob/f70cd9a367659f475e28e0a317b9583931cdf185/src/functionsfactory.ts#L365-L370 (linkStyle))

### Custom Functions

In addition to [built-in functions](#built-in-functions), expressions can use custom functions. They allow you to extend the functionality of your survey. 

#### Implement a Custom Function

Your custom function must accept only one array-like parameter that will contain all the passed arguments. For example, the following code passes two arguments to a custom function `myFunc`:

```js
"expression": "myFunc({question1}, {question2})"
```

However, the `myFunc` implementation must accept only one parameter&mdash;an array that contains all arguments:

```js
function myFunc(params) {
  let q1_value = params[0];
  let q2_value = params[1];
  // ...
  return someValue;
}
```

After you implement a custom function, register it in `FunctionFactory`:

```js
import { FunctionFactory } from "survey-core";

FunctionFactory.Instance.register("myFunc", myFunc);
```

For illustrative purposes, the code below shows the built-in `age` function implementation:

```js
import { FunctionFactory } from "survey-core";

// Accepts a birthdate and returns the current age in full years
function age(params: any[]): any {
  if (!params && params.length < 1) return null;
  if (!params[0]) return null;
  var birthDate = new Date(params[0]);
  var today = new Date();
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= age > 0 ? 1 : 0;
  }
  return age;
}
// Register the `age` function under the `age` alias
FunctionFactory.Instance.register("age", age);
```

[View Source Code](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L218-L230 (linkStyle))
[View Demo](https://surveyjs.io/form-library/examples/condition-customfunctions/ (linkStyle))

#### Access Survey Elements Within a Custom Function

You can access any survey element via a [survey instance](https://surveyjs.io/Documentation/Library?id=surveymodel). Use the `this.survey` property to get the survey instance within your custom function implementation. This property allows you to design your function so that it accepts a survey element name as a parameter:

```js
"expression": "myFunc('questionName')"
```

Within the function implementation, you can use the passed name to get the instance of the corresponding element:

```js
function myFunc(params) {
  const questionInstance = this.survey.getQuestionByName(params[0]);
  // ...
}
```

#### Asynchronous Functions

If an expression requires time-consuming calculations or a request to a server, implement an asynchronous custom function. The following code shows an example of an asynchronous function:

```js
function asyncFunc(params: any[]): any {
  setTimeout(() => {
    // Return the function result via the callback
    this.returnResult(yourValue);
  }, 100);
}
```

After you implement an asynchronous function, register it in `FunctionFactory`. The third parameter specifies if this function is asynchronous:

```js
import { FunctionFactory } from "survey-core";

FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
```

[View Demo](https://surveyjs.io/Examples/Library?id=questiontype-expression-async (linkStyle))

## Conditional Visibility

You can specify whether an individual survey element is visible, read-only, or required based on a condition. This functionality is built upon Boolean expressions. Such expressions evaluate to `true` or `false`.

A survey parses and runs all expressions on startup. If a Boolean expression evaluates to `false`, the corresponding element becomes invisible (or read-only, or optional); if it evaluates to `true`, the element becomes visible (or enabled, or required). After any value used in an expression changes, the survey re-evaluates this expression.

The following table shows examples of Boolean expressions:

| Expression                                                      | Description                                                                                                                                                                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"{age} >= 21"`                                                 | Evaluates to `true` if the `"age"` question has a value of 21 or higher.                                                                                                                                                  |
| `"({rank1} + {rank2} + {rank3}) > 21 and {isLoyal} = 'yes'"`    | The `or` and `and` operators combine two or more conditions.                                                                                                                                                              |
| `"!({isLoyal} = 'yes' and ({rank1} + {rank2} + {rank3}) > 21)"` | The `!` or `not` operator reverts the result.                                                                                                                                                                             |
| `"{name} notempty"`                                             | Evaluates to `true` if the `"name"` question has any value.                                                                                                                                                               |
| `"{name} empty"`                                                | Evaluates to `true` if the `"name"` question has no value.                                                                                                                                                                |
| `"{speakinglanguages} = ['English', 'Spanish']"`                | Evaluates to `true` if strictly English and Spanish are selected in the `"speakinglanguages"` question. If one of the languages is not selected or other languages are selected too, the expression evaluates to `false`. |
| `"{speakinglanguages} contains 'Spanish'"`                      | Evaluates to `true` if Spanish is selected. Other languages may or may not be selected.                                                                                                                                   |
| `"age({birthdate}) >= 21"`                                      | Evaluates to `true` if the `age` function returns 21 or higher.                                                                                                                                                           |

You should use different properties to specify the visibility of [questions](#question-visibility) and [items (choices, rows, columns)](#item-visibility-choices-columns-rows).

### Question Visibility

Assign Boolean expressions to the [visibleIf](https://surveyjs.io/Documentation/Library?id=Question#visibleIf), [enableIf](https://surveyjs.io/Documentation/Library?id=Question#enableIf), and [requiredIf](https://surveyjs.io/Documentation/Library?id=Question#requiredIf) properties of questions, panels, and pages. In the following example, the `visibleIf` property is used to hide the `drivers-license` question for respondents under 16 years old:

```js
const surveyJson = {
  "elements": [{
    "name": "birthdate"
  }, {
    "name": "drivers-license",
    "title": "Have you got a driver's license?",
    "visibleIf": "age({birthdate}) >= 16"
  }]
}
```

If you do not specify the `visibleIf`, `enableIf`, and `requiredIf` properties, an element's state depends on the [`isVisible`](/Documentation/Library?id=Question#isVisible), [`isReadOnly`](/Documentation/Library?id=Question#isReadOnly), and [`isRequired`](/Documentation/Library?id=Question#isRequired) properties. You can specify them at design time or use them to get or set the current state at runtime. If you set one of these properties for a panel or page, all nested questions inherit the setting.

[View Demo](https://surveyjs.io/form-library/examples/implement-conditional-logic-to-change-question-visibility/ (linkStyle))

### Item Visibility (Choices, Columns, Rows)

SurveyJS allows you to control available choices, columns, and rows based on previous answers.

#### Specify Visibility Conditions for Individual Items

Individual items (choices, columns, rows) can be configured with objects. Each object can have a `visibleIf` property that accepts an expression. When the expression evaluates to `true`, the associated item becomes visible.

In the following code, the `SMS` and `WhatsApp` choices are visible only if a user has entered their phone number:

```js
const surveyJson = {
  "elements": [{
    "name": "Contacts"
    "choices": [
      "Email",
      { "value": "SMS", "visibleIf": "{phone} notempty" },
      { "value": "WhatsApp", "visibleIf": "{phone} notempty" }
    ]
  },
  // ...
  ]
}
```

[View Demo](https://surveyjs.io/Examples/Library?id=condition-choicesVisibleIf (linkStyle))

This technique has one drawback: if a question contains many items, you have to copy the same expression into every item that should have dynamic visibility. If that is your case, use the technique described in the next topic.

#### Combine Visibility Conditions

You can specify one expression that will run against every item (choice, row, column). If the expression evaluates to `true`, the item becomes visible. Assign your expression to the [`choicesVisibleIf`](/Documentation/Library?id=QuestionSelectBase#choicesVisibleIf), [`rowsVisibleIf`](/Documentation/Library?id=questionmatrixmodel#rowsVisibleIf), or [`columnsVisibleIf`](/Documentation/Library?id=questionmatrixmodel#columnsVisibleIf) property. To access the current item, use the `{item}` operand.

The following code shows how to specify the `choicesVisibleIf` property. The `"default"` question includes selected choices from the `"installed"` question. The `"secondChoice"` question also includes selected choices from the `"installed"` question, but uses the `choiceVisibleIf` property to filter out the choice selected in the `"default"` question.

```js
const surveyJson = {
  "elements": [{
    "name": "installed",
    "choices": ["Google Chrome", "Microsoft Edge", "Firefox", "Internet Explorer", "Safari", "Opera"],
    // ...
  }, {
    "name": "default",
    "choicesFromQuestion": "installed",
    "choicesFromQuestionMode": "selected"
    // ...
  }, {
    "name": "secondChoice",
    "choicesFromQuestion": "installed",
    "choicesFromQuestionMode": "selected",
    "choicesVisibleIf": "{item} != {default}",
    // ...
  }]
}
```

## Conditional Survey Logic (Triggers)

Triggers allow you to implement additional logic that isn't related to [read-only or required state or visibility](#conditional-visibility). Each trigger is associated with an expression and an action. A survey re-evaluates this expression each time values used in it are changed. If the expression returns `true`, the survey preforms the associated action.

The following triggers are available:

- [`complete`](#complete)
- [`setvalue`](#setvalue)
- [`copyvalue`](#copyvalue)
- [`runexpression`](#runexpression)
- [`skip`](#skip)
  
---

### `complete`

Completes the survey. The `expression` is evaluated only when a user switches to the next page.

In the following code, a trigger completes the survey if the `"age"` question on this page has a value under 18:

```js
const surveyJson = {
  "elements": [{
    "name": "age", 
    // ...
  }],
  "triggers": [
    { "type": "complete", "expression": "{age} < 18" }
  ]
}
```

[View Demo](https://surveyjs.io/form-library/examples/trigger-complete/ (linkStyle))

---

### `setvalue`

Sets a specified value to a given question. The `setValue` property specifies the value; the `setToName` property specifies the question name.

In the following code, triggers are used to set the `"ageType"` value to `"minor"` or `"adult"` based on the `"age"` question value:

```js
const surveyJson = {
  "elements": [{
    "name": "age", 
    // ...
  }, {
    "name": "ageType",
    // ...
  }],
  "triggers": [{
    "type": "setvalue",
    "expression": "{age} < 18",
    "setToName": "ageType",
    "setValue": "minor"
  }, {
    "type": "setvalue",
    "expression": "{age} >= 18",
    "setToName": "ageType",
    "setValue": "adult"
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/trigger-setvalue/ (linkStyle))

---

### `copyvalue`

Copies a value from one question to another. The `fromName` property specifies the source question; the `setToName` property specifies the target question.

In the following code, a trigger copies the `"billingAddress"` question value into the `"shippingAddress"` question if the `"sameAsBilling"` question is `Yes`:

```js
const surveyJson = {
  "elements": [{
    "name": "billingAddress", 
    // ...
  }, {
    "name": "shippingAddress",
    // ...
  }, {
    "name": "sameAsBilling",
    "choices": [ "Yes", "No" ]
    // ...
  }],
  "triggers": [{
    "type": "copyvalue",
    "expression": "{sameAsBilling} = 'Yes'",
    "fromName": "billingAddress",
    "setToName": "shippingAddress"
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/trigger-copyvalue/ (linkStyle))

---

### `runexpression`

If the `expression` is `true`, the trigger runs another expression specified by the `runExpression` property. You can also save the result of `runExpression` as a question value. For this, assign the question's name to the `setToName` property.

[View Demo](https://surveyjs.io/form-library/examples/trigger-runexpression/ (linkStyle))

---

### `skip`

Switches the survey to a target question's page and focuses the question. The `gotoName` property specifies the target question.

In the following code, a trigger navigates to the `"additionalInfoPage"` page and focuses the `"additionalInfo"` question if the `"sameAsBilling"` question is `Yes`:

```js
const surveyJson = {
 "pages": [{
   "name": "billingAddressPage",
   "elements": [{
     "name": "billingAddress",
     // ...
    }]
  }, {
   "name": "shippingAddressPage",
   "elements": [{
      "name": "sameAsBilling",
      "choices": [ "Yes", "No" ]
      // ...
  }, {     
     "name": "shippingAddress",
     "visibleIf": "{sameAsBilling} = 'No'",
     // ...
    }]
  }, {
   "name": "additionalInfoPage",
   "elements": [{
     "name": "additionalInfo",
     // ...
    }]
  }],
 "triggers": [{
   "type": "skip",
   "expression": "{sameAsBilling} = 'Yes'",
   "gotoName": "additionalInfo"
  }]
}
```
