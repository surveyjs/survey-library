---
title: Add Custom Properties | SurveyJS Documentation
description: Learn how to extend predefined properties of a question type by adding custom properties. These custom question properties can then be set in the survey JSON schema and modified in Survey Creator.
---

# Add Custom Properties to Question Types

Question properties define a question's contents, behavior, and appearance. Predefined properties of each question type are listed in the Form Library API help section. If you want to extend the functionality of a question type, you can add custom properties to it as described in this help topic. Once added, custom properties can be set in the survey JSON schema and changed in Survey Creator.

## Add Custom Properties to an Existing Class

In SurveyJS, each question type is implemented by a specific class. These classes can inherit properties from one or more base classes. You can find the inheritance chain of each class in its API reference. For example, the following image illustrates the inheritance chain of the [`QuestionTextModel`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model) class:

  <img src="../images/class-inheritance-chain.png" alt="The inheritance chain of survey element classes" width="461" height="313">

To add a custom property to an existing class, call the `addProperty(className, propMeta)` method on the `Serializer` object. This method has the following parameters:

- `className`     
The name of a base or derived class (see the [`getType()`](https://surveyjs.io/form-library/documentation/api-reference/question#getType) method description).

- `propMeta`      
A JSON object with [property settings](#survey-element-property-settings).

If you add a property to a base class, all its derived classes will also have this property. For instance, the following code adds a custom property to the base Question class and to all questions as a result:

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", {
  name: "customNumericProperty",
  type: "number",
  category: "general",
  default: 1,
  visibleIndex: 0
});
```

[View Demo](https://surveyjs.io/survey-creator/examples/add-properties-to-property-grid/ (linkStyle))

## Define Custom Properties in a New Class

This way is suitable if you create a new class. For instance, the following code implements `MyCustomClass` based on the `Question` class. The custom class has one custom property.

```js
import { Question, ElementFactory } from "survey-core";

export class MyCustomClass extends Question {
  getType() {
    return "my-custom-class";
  }
  get myCustomProperty() {
    return this.getPropertyValue("myCustomProperty");
  }
  set myCustomProperty(val) {
    this.setPropertyValue("myCustomProperty", val);
  }
}

ElementFactory.Instance.registerElement("my-custom-class", (name) => {
  return new MyCustomClass(name);
});
```

To finish creating a new class, you need to configure how it should be serialized to and deserialized from JSON. Call the `addClass(name, propMeta[], constructor, baseClassName)` method on the `Serializer` object. This method has the following parameters:

- `name`      
A string value that you returned from the model's `getType()` method. This property is used to associate the JSON object with the JavaScript class.

- `propMeta[]`      
An array of objects with [property settings](#survey-element-property-settings) used to serialize custom properties to JSON.

- `constructor`       
A function that returns an instance of the JavaScript class associated with the JSON object.

- `baseClassName`        
The name of a class that the custom class extends.

The following code shows how to call the `addClass()` method for the custom class declared previously:

```js
import { ..., Serializer } from "survey-core";

// ...

Serializer.addClass(
  "my-custom-class",
  [{
    name: "myCustomProperty",
    category: "general",
    visibleIndex: 2
  }],
  function () {
    return new MyCustomClass("");
  },
  "question"
);
```

[View Demo](https://surveyjs.io/survey-creator/examples/custom-colorpicker-property-editor/ (linkStyle))

## Survey Element Property Settings

This section describes settings that you can specify within a `propMeta` object when calling the `addProperty(className, propMeta)` or `addClass(name, propMeta[], constructor, baseClassName)` method on the `Serializer` object.

### `name`

A string value that specifies the property name. It is the only required property.

### `type`

A string value that specifies the property type. Accepts one of the values described in the table below. Each type produces a different property editor in Survey Creator's Property Grid.

| `type` | Property Editor | Description |
| ------ | --------------- | ----------- |
| `"string"` (default) | Text input | Use this type for short string values. |
| `"boolean"` | Checkbox | Use this type for Boolean values. |
| `"condition"` | Multi-line text input with an optional dialog window | Use this type for [Boolean expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility) similar to [`visibleIf`](https://surveyjs.io/form-library/documentation/api-reference/question#visibleIf) or [`enableIf`](https://surveyjs.io/form-library/documentation/api-reference/question#enableIf). |
| `"expression"` | Multi-line text input with a hint icon | Use this type for non-Boolean [expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). |
| `"number"` | Text input | Use this type for numeric values. |
| `"text"` | Multi-line text input | Use this type for multi-line text values. |
| `"file"` | Text input with a button that opens a Select File dialog window | Use this type to allow respondents to select a file or enter a file URL. |
| `"color"` | Color picker | Use this type for color values. |
| `"html"` | Multi-line text input | Use this type for HTML markup. |
| `"itemvalues"` | Customized text inputs for entering value-text pairs | Use this type for arrays of objects with the following structure: `{ value: any, text: string }`. For example, Dropdown, Checkboxes, and Radio Button Group questions use this type for the [`choices`](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase#choices) property. |
| `"value"` | Button that opens a dialog window  | The dialog window displays the survey element and allows users to set the element's default value. |
| `"multiplevalues"` | A group of checkboxes with a Select All checkbox | Use this type to allow respondents to select more than one predefined value. Requires a defined [`choices`](#choices) array. |

`type` can also accept custom values. In this case, you need to register a property editor for the custom type in the `PropertyGridEditorCollection` and specify a standard JSON object that the custom type should produce. For example, the following code configures a `"shortname"` property that has a custom `"shorttext"` type: 

```js
import { Serializer } from "survey-core";
import { PropertyGridEditorCollection } from "survey-creator-core";

Serializer.addProperty("question", {
  name: "shortname",
  type: "shorttext",
  isRequired: true,
  category: "general",
  visibleIndex: 3
});

PropertyGridEditorCollection.register({
  // Returns `true` for a property with type "shorttext"
  fit: (prop) => {
    return prop.type === "shorttext";
  },
  // Returns a standard question JSON configuration for the property editor
  // (a text editor that is limited to 5 characters)
  getJSON: (obj, prop, options) => {
    return { type: "text", maxLength: 5 };
  }
});
```

[View Demo](https://surveyjs.io/survey-creator/examples/customize-property-editors/ (linkStyle))

You can add the type to the `name` property after a colon character as a shortcut:

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", 
  { name: "myBooleanProperty", type: "boolean" }
  // ===== or =====
  { name: "myBooleanProperty:boolean" }
);
```

### `default`

A default value for the property. If not specified, `default` equals `""` for string values, 0 for numbers, and `false` for Boolean values. The default value is not serialized into a survey JSON schema.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("dropdown", 
  { name: "myStringProperty", default: "custom-default-value" }
);

Serializer.addProperty("checkbox", 
  { name: "myNumericProperty", type: "number", default: 100 }
);

Serializer.addProperty("question", 
  { name: "myBooleanProperty", type: "boolean", default: true }
);
```

If you are creating a [localizable property](#islocalizable) and want to display different default values for different locales, use localization capabilities to specify these default values. You can assign them at runtime, as shown below:

```js
import { surveyLocalization } from "survey-core";

surveyLocalization.getLocaleStrings("en")["myStringProperty"] = "Default value for English";
surveyLocalization.getLocaleStrings("fr")["myStringProperty"] = "Default value for French";
```

Alternatively, you can add your custom property to each used [localization dictionary](https://github.com/surveyjs/survey-library/tree/master/src/localization). In this case, the default value for the current locale will be applied automatically. [Rebuild the library](https://github.com/surveyjs/survey-library/tree/master/src/localization#update-an-existing-dictionary) after updating the dictionaries.

```js
// localization/english.ts
export var englishStrings = {
  // ...
  myStringProperty: "Default value for English"
}
```

```js
// localization/french.ts
export var frenchSurveyStrings = {
  // ...
  myStringProperty: "Default value for French"
}
```

### `displayName`

A string value that specifies a property caption. If not specified, the [`name`](#name) value is used instead.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("dropdown", 
  { name: "myStringProperty", displayName: "Custom Caption" }
);
```

### `choices`

An array of selection choices or a function that loads the choices from a web service. Applies only to text and numeric properties. If `choices` are specified, Survey Creator renders a drop-down menu as the property editor.

```js
import { Serializer } from "survey-core";

// Define `choices` locally
Serializer.addProperty("question", {
  name: "myStringProperty",
  choices: [ "option1", "option2", "option3" ],
  // If item captions should be different from item values:
  // choices: [
  //   { value: "option1", text: "Option 1" },
  //   { value: "option2", text: "Option 2" },
  //   { value: "option3", text: "Option 3" },
  // ],
  default: "option1"
});

// Load `choices` from a web service
Serializer.addProperty("survey", {
  name: "country",
  category: "general",
  choices: (obj, choicesCallback) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://surveyjs.io/api/CountriesExample");
    xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        const result = [];
        // Make the property nullable
        result.push({ value: null });
        // Web service returns objects that are converted to the `{ value, text }` format
        // If your web service returns an array of strings, pass this array to `choicesCallback`
        response.forEach(item => {
          result.push({ value: item.cioc, text: item.name });
        });
        choicesCallback(result);
      }
    };
    xhr.send();
  }
});
```

### `isRequired`

A Boolean value that specifies whether the property must have a value. Defaults to `false`. You can add an exclamation mark before `name` as a shortcut for this setting:

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", 
  { name: "myBooleanProperty", type: "boolean", isRequired: true }
  // ===== or =====
  { name: "!myBooleanProperty", type: "boolean" }
);
```

### `isSerializable`

A Boolean value that specifies whether to include the property in the survey JSON schema. Defaults to `true`.

### `isLocalizable`

A Boolean value that specifies whether users can translate the property value to different languages in the Translation tab. Applies only to text properties. Defaults to `false`.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", 
  { name: "myTextProperty", type: "text", isLocalizable: true }
);
```

The `isLocalizable` setting applies only if you add a custom property to an existing class. If you want to add a custom localizable property to a [new class](#define-custom-properties-in-a-new-class), follow the steps below:

1. Call the `this.createLocalizableString(name, owner)` method in the class constructor to create a `LocalizableString` instance. This instance contains its own inner dictionary with translations of a particular string for different locales.
2. Add a getter/setter pair that returns and sets localized text and a getter that returns the `LocalizableString` instance itself.
3. In serialization settings, set the `serializationProperty` setting to the name of the getter that returns the `LocalizableString` instance.

```js
import { Question, ElementFactory, Serializer } from "survey-core";

export class MyCustomClass extends Question {
  constructor() {
    super();
    // Step 1: Create a `LocalizableString` instance
    this.createLocalizableString("myCustomProperty", this);
  }
  getType() {
    return "my-custom-class";
  }
  // Step 2: Add getters and setters
  get myCustomProperty() {
    // Return the property text for the current locale
    return this.getLocalizableStringText("myCustomProperty");
  }
  set myCustomProperty(val) {
    // Set the property text for the current locale
    this.setLocalizableStringText("myCustomProperty", val);
  }
  get locMyCustomProperty() {
    // Return a `LocalizationString` instance for `myCustomProperty`
    return this.getLocalizableString("myCustomProperty");
  }
}

ElementFactory.Instance.registerElement("my-custom-class", (name) => {
  return new MyCustomClass(name);
});

Serializer.addClass(
  "my-custom-class",
  [{
    name: "myCustomProperty",
    category: "general",
    visibleIndex: 2,
    // Step 3: Deserialize `myCustomProperty` to `locMyCustomProperty`
    serializationProperty: "locMyCustomProperty"
  }],
  function () {
    return new MyCustomClass("");
  },
  "question"
);
```

[View Demo](https://surveyjs.io/survey-creator/examples/custom-descriptive-text-element/ (linkStyle))

### `visible`

A Boolean value that specifies whether the property is visible in Survey Creator's Property Grid. Defaults to `true`.

### `visibleIf`

A function that specifies a condition based on which to set the [`visible`](#visible) property value. The function accepts the question or panel that a user configures as a parameter.

If the property visibility depends on another property, use the [`dependsOn`](#dependson) setting. You can use `visibleIf` in conjunction with `dependsOn` to impose more specific rules on property visibility. In this case, Survey Creator calls the `visibleIf` function only when one of the properties from the `dependsOn` array is changed.

In the following code, the `dateFormat` property depends on the `inputType` property and is visible only if `inputType` is set to one of the date types:

```js
import { Serializer } from "survey-core";

Serializer.addProperty("text", {
  name: "dateFormat",
  category: "general",
  visibleIndex: 7,
  dependsOn: ["inputType"],
  visibleIf: (obj) => {
    return (
      obj.inputType === "date" ||
      obj.inputType === "datetime" ||
      obj.inputType === "datetime-local"
    );
  }
});
```

[View Demo](https://surveyjs.io/survey-creator/examples/configure-property-dependencies/ (linkStyle))

### `visibleIndex`

A number that specifies the property position within its [`category`](#category). Defaults to -1 (the last position).

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", 
  // Display "myStringProperty" at the top in the General category
  { name: "myStringProperty", category: "general", visibleIndex: 0 }
);
```

### `readOnly`

A Boolean value that specifies whether the property value is read-only. Defaults to `false`.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", 
  { name: "myStringProperty", readOnly: true }
);
```

### `enableIf`

A function that specifies a condition based on which the property is switched to read-only mode. This function accepts the question or panel that a user configures as a parameter.

In the following code, the `dateFormat` property is enabled only if an `inputType` property is set to one of the date types:

```js
import { Serializer } from "survey-core";

Serializer.addProperty("text", {
  name: "dateFormat",
  category: "general",
  visibleIndex: 7,
  enableIf: (obj) => {
    return (
      obj.inputType === "date" ||
      obj.inputType === "datetime" ||
      obj.inputType === "datetime-local"
    );
  }
});
```

### `category`

A string value that specifies a category in which to display the property. If `category` is not set, the property falls into the Others category. Categories are sorted according to [`categoryIndex`](#categoryindex) values.

The following table describes predefined categories:

| `category`           | Category title             | Element types that have the category                  | `categoryIndex` |
| -------------------- | -------------------------- | ----------------------------------------------------- | --------------- |
| `"general"`          | General                    | Question, Panel, Page, Survey                         | -1              |
| `"logo"`             | Logo in the Survey Header  | Survey                                                | 50              |
| `"navigation"`       | Navigation                 | Survey                                                | 100             |
| `"navigation"`       | Navigation                 | Page                                                  | 350             |
| `"question"`         | Question Settings          | Survey                                                | 200             |
| `"pages"`            | Pages                      | Survey                                                | 250             |
| `"logic"`            | Conditions                 | Survey                                                | 300             |
| `"logic"`            | Conditions                 | Question, Panel, Page                                 | 200             |
| `"data"`             | Data                       | Survey                                                | 400             |
| `"data"`             | Data                       | Question, Panel, Page                                 | 300             |
| `"validation"`       | Validation                 | Survey                                                | 500             |
| `"validation"`       | Validation                 | Question, Panel, Page                                 | 400             |
| `"showOnCompleted"`  | "Thank You" Page           | Survey                                                | 600             |
| `"timer"`            | Quiz Mode                  | Survey                                                | 700             |
| `"questionSettings"` | Question Settings          | Panel, Page                                           | 100             |
| `"layout"`           | Layout                     | Question                                              | 100             |
| `"layout"`           | Panel Layout               | Panel                                                 | 150             |
| `"numbering"`        | Numbering                  | Panel                                                 | 350             |
| `"columns"`          | Columns                    | Matrices                                              | 10              |
| `"rows"`             | Rows                       | Matrices                                              | 11              |
| `"choices"`          | Choice Options             | Multi-Select Matrix, Dynamic Matrix                   | 12              |
| `"cells"`            | Individual Cell Texts      | Single-Select Matrix                                  | 500             |
| `"items"`            | Items                      | Multiple Textboxes                                    | 10              |
| `"rateValues"`       | Rating Values              | Rating Scale                                          | 10              |
| `"choices"`          | Choice Options             | SelectBase (Dropdown, Checkboxes, Radio Button Group) | 10              |
| `"choicesByUrl"`     | Choices from a Web Service | SelectBase (Dropdown, Checkboxes, Radio Button Group) | 11              |

### `categoryIndex`

A number that specifies a category position. If `categoryIndex` is not set, the category is added to the end. No category can be placed above General.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question",
  // Display "Custom Category" after the General category
  { name: "myStringProperty", category: "Custom Category", categoryIndex: 1 }
);
```

### `maxLength`

A numeric value that specifies the maximum number of characters users can enter into the text input.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question",
  { name: "myTextProperty", type: "text", maxLength: 280 }
);
```

### `minValue` and `maxValue`

Numeric values that specify the minimum and maximum numbers users can enter into the editor.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question",
  { name: "myNumericProperty", type: "number", minValue: 0, maxValue: 100 }
);
```

### `dependsOn`

An array of property names upon which the current property depends. When one of the listed properties changes, the dependent property reevaluates the [`visibleIf`](#visibleif) and [`choices`](#choices) functions. This allows you to control the property visibility and fill choices conditionally.

The following code declares two custom properties. `dependent-property` fills `choices` depending on the `myCustomProperty` value:

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", {
  name: "myCustomProperty",
  choices: ["Option 1", "Option 2", "Option 3"],
});

Serializer.addProperty("question", {
  name: "dependent-property",
  dependsOn: [ "myCustomProperty" ],
  choices: (obj) => {
    const choices = [];
    const targetPropertyValue = !!obj ? obj["myCustomProperty"] : null;
    // If `targetPropertyValue` is empty, return an empty array
    if (!targetPropertyValue) return choices;
    // Make the dependent property nullable
    choices.push({ value: null });
    // Populate `choices`
    choices.push(targetPropertyValue + ": Suboption 1");
    choices.push(targetPropertyValue + ": Suboption 2");
    choices.push(targetPropertyValue + ": Suboption 3");
    return choices;
  }
});
```

The following example shows how to load `choices` for the `country` property from a web service. They are reloaded each time a user changes the `region` value:

```js
import { Serializer } from "survey-core";

Serializer.addProperty("survey", {
  name: "region",
  category: "Region",
  categoryIndex: 1,
  choices: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
});

Serializer.addProperty("survey", {
  name: "country",
  category: "Region",
  dependsOn: [ "region" ],
  choices: (obj, choicesCallback) => {
    const xhr = new XMLHttpRequest();
    const url =
      !!obj && !!obj.region
        ? "https://surveyjs.io/api/CountriesExample?region=" + obj.region
        : "https://surveyjs.io/api/CountriesExample";
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        const result = [];
        // Make the property nullable
        result.push({ value: null });
        response.forEach(item => {
          result.push({ value: item.cioc, text: item.name });
        });
        choicesCallback(result);
      }
    };
    xhr.send();
  }
});
```

[View Demo](https://surveyjs.io/survey-creator/examples/configure-property-dependencies/ (linkStyle))

### `overridingProperty`

The name of a property that overrides the current property.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", 
  { name: "myMasterProperty", type: "condition" }
  { name: "myDependentProperty", type: "boolean", overridingProperty: "myMasterProperty" }
);
```

If you specify `overridingProperty`, the Property Grid disables the current property and displays a jump link to the overriding property:

<img src="../images/property-grid-overridding-properties.png" alt="Survey Creator - Property Grid with overridden properties" width="281" height="305">

### `onGetValue`

A function that you can use to adjust the property value or exclude it from the survey JSON schema.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", {
  name: "calculated-property",
  onGetValue: (surveyElement) => {
    // Do not serialize the property to JSON
    return null;
  }
});
```
### `onSetValue`

A function that you can use to perform actions when the property value is set (for example, update another property value).

> Do not assign a value directly to an object property because this will trigger the `onSetValue` function again. Use the object's `setPropertyValue(propertyName, newValue)` method instead.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("question", {
  name: "myStringProperty",
  onSetValue: (surveyElement, value) => {
    // You can perform required checks or modify the `value` here
    // ...
    // Set the `value`
    surveyElement.setPropertyValue("myStringProperty", value);
    // You can perform required actions after the `value` is set
    // ...
  }
});
```

### `onExecuteExpression`

A function that is called when an expression is evaluated.

Define this function for custom properties of the `"condition"` or `"expression"` [`type`](#type). Within it, you can handle the expression evaluation result. For example, the following code adds a custom `showHeaderIf` property to the [Single-Select Matrix](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/) question type. This property shows or hides the matrix header based on a condition: the result of the condition evaluation is assigned to the question's [`showHeader`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model#showHeader) property.

```js
import { Serializer } from "survey-core";

Serializer.addProperty("matrix", {
  name: "showHeaderIf",
  type: "condition",
  category: "logic",
  onExecuteExpression: (obj, res) => {
    obj.showHeader = res;
  }
});

// Usage
const surveyJson = {
  "elements": [{
    "type": "matrix",
    "showHeaderIf": "{question1} = 'item2'"
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/add-custom-expression-property/ (linkStyle))   

The `onExecuteExpression` function applies only if you [add a custom property to an existing class](#add-custom-properties-to-an-existing-class). If you are adding a custom expression or condition property to a [new class](#define-custom-properties-in-a-new-class), call the `this.addExpressionProperty(name, onExecuteExpression)` method in the class constructor instead:

```js
import { Question, ElementFactory, Serializer } from "survey-core";

export class MyCustomClass extends Question {
  constructor() {
    super();
    this.addExpressionProperty(
      "myCustomPropertyExpression",
      (obj, res) => {
        if (res) {
          obj.myCustomProperty = res.toString();
        }
      }
    );
  }
  getType() {
    return "my-custom-class";
  }
  get myCustomProperty() {
    return this.getPropertyValue("myCustomProperty");
  }
  set myCustomProperty(val) {
    this.setPropertyValue("myCustomProperty", val);
  }
  get myCustomPropertyExpression() {
    return this.getPropertyValue("myCustomPropertyExpression");
  }
  set myCustomPropertyExpression(val) {
    this.setPropertyValue("myCustomPropertyExpression", val);
  }
}

ElementFactory.Instance.registerElement("my-custom-class", (name) => {
  return new MyCustomClass(name);
});

Serializer.addClass(
  "my-custom-class",
  [{
    name: "myCustomProperty",
    category: "general",
    visibleIndex: 2
  }, {
    name: "myCustomPropertyExpression",
    type: "expression",
    category: "logic"
  }],
  function () {
    return new MyCustomClass("");
  },
  "question"
);
```

## Further Reading

- [Create Specialized Question Types](/form-library/documentation/customize-question-types/create-specialized-question-types)
- [Create Composite Question Types](/form-library/documentation/customize-question-types/create-composite-question-types)
- Integrate Third-Party Components: [Angular](/form-library/documentation/customize-question-types/third-party-component-integration-angular) | [React](/form-library/documentation/customize-question-types/third-party-component-integration-react) | [Vue 3](/form-library/documentation/customize-question-types/third-party-component-integration-vue)