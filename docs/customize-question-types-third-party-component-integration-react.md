---
title: Integrate Third-Party React Components | SurveyJS Documentation
description: Use any React component as an editor in your survey or form.
---

# Integrate Third-Party React Components

This help topic describes how to integrate a third-party React component into a standalone survey and Survey Creator.

- [Create a Model](#create-a-model)
- [Configure JSON Serialization](#configure-json-serialization)
- [Render the Third-Party Component](#render-the-third-party-component)
- [Specify Captions](#specify-captions)
- [Add an Icon](#add-an-icon)
- [Use the Custom Component as an Editor in the Property Grid](#use-the-custom-component-as-an-editor-in-the-property-grid)

As an example, we will integrate the [React Color](https://casesandberg.github.io/react-color/) component. To install it, run the following command:

```sh
npm install react-color @types/react-color --save
```

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/integrate-third-party-react-components (linkStyle))

## Create a Model

To integrate a third-party component, you need to configure a custom question type for it. All question types in SurveyJS demand a model. To create it, add a custom class (`QuestionColorPickerModel` in the code below) that extends the [`Question`](https://surveyjs.io/Documentation/Library?id=question) class and inherits all its properties and methods. Override the [`getType()`](https://surveyjs.io/Documentation/Library?id=question#getType) method with an implementation that returns the name of your custom question type. If the model requires custom properties, declare them as getter + setter pairs. In the following code, the model includes two such properties: `colorPickerType` and `disableAlpha`.

```js
// components/ColorPicker.tsx
'use client'

import { Question } from "survey-core";

const CUSTOM_TYPE = "color-picker";

export class QuestionColorPickerModel extends Question {
  getType() {
    return CUSTOM_TYPE;
  }
  get colorPickerType() {
    return this.getPropertyValue("colorPickerType");
  }
  set colorPickerType(val) {
    this.setPropertyValue("colorPickerType", val);
  }

  get disableAlpha() {
    return this.getPropertyValue("disableAlpha");
  }
  set disableAlpha(val) {
    this.setPropertyValue("disableAlpha", val);
  }
}
```

Implement a function that registers the created model in the `ElementFactory` under the name returned by the `getType()` method:

```js
// components/ColorPicker.tsx
// ...
import { ElementFactory } from "survey-core";

const CUSTOM_TYPE = "color-picker";
// ...
export function registerColorPicker() {
  ElementFactory.Instance.registerElement(
    CUSTOM_TYPE,
    (name) => {
      return new QuestionColorPickerModel(name);
    }
  );
}
```

Call the implemented function in the component that renders the Survey Creator to register the model:

```js
// components/SurveyCreator.tsx
'use client'

import { useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { registerColorPicker } from "./ColorPicker";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

registerColorPicker();

export function SurveyCreatorWidget () {
  let [creator, setCreator] = useState<SurveyCreator>();

  if (!creator) {
    creator = new SurveyCreator();
    setCreator(creator);
  }
  return <SurveyCreatorComponent creator={creator} />;
}
```

## Configure JSON Serialization

Our model exists only in JavaScript code, but SurveyJS works with JSON objects. You need to configure how your model should be serialized into JSON. To do this, call the `addClass(name, propMeta[], constructor, baseClassName)` method on the `Serializer` object. This method accepts the following arguments:

- `name`      
A string value that you returned from the model's `getType()` method. This property is used to associate the JSON object with the model's JavaScript class.

- `propMeta[]`      
An array of objects used to serialize custom model properties into JSON. This array must include all custom model properties. [Our model](#create-a-model) contains two custom properties (`colorPickerType` and `disableAlpha`), and the code below configures their serialization.

- `constructor`       
A function that returns an instance of the model's JavaScript class (`QuestionColorPickerModel`) associated with the JSON object.

- `baseClassName`        
The name of a class that the custom class extends (`"question"`).

```js
// components/ColorPicker.tsx
// ...
import { Serializer } from "survey-core";

const CUSTOM_TYPE = "color-picker";
// ...
Serializer.addClass(
  CUSTOM_TYPE,
  [{
    name: "colorPickerType",
    default: "Slider",
    choices: ["Slider", "Sketch", "Compact"],
    category: "general",
    visibleIndex: 2 // Place after the Name and Title
  }, {
    name: "disableAlpha:boolean",
    dependsOn: "colorPickerType",
    visibleIf: function (obj) {
      return obj.colorPickerType === "Sketch";
    },
    category: "general",
    visibleIndex: 3 // Place after the Name, Title, and Color Picker Type
  }],
  function () {
    return new QuestionColorPickerModel("");
  },
  "question"
);
```

## Render the Third-Party Component

Implement a custom class that extends `SurveyQuestionElementBase` and renders the desired UI elements. Model properties are available through props. In the following example, a custom class uses the `type` property to render different color picker types from the [React Color](https://casesandberg.github.io/react-color/) library:

```js
// components/ColorPicker.tsx
// ...
import { CSSProperties } from "react";
import { SurveyQuestionElementBase } from "survey-react-ui";
import { SliderPicker, SketchPicker, CompactPicker } from "react-color";

// ...

export class SurveyQuestionColorPicker extends SurveyQuestionElementBase {
  constructor(props) {
    super(props);
    this.state = { value: this.question.value };
  }
  get question() {
    return this.questionBase;
  }
  get value() {
    return this.question.value;
  }
  get disableAlpha() {
    return this.question.disableAlpha;
  }
  get type() {
    return this.question.colorPickerType;
  }
  handleColorChange = (data) => {
    this.question.value = data.hex;
  };

  // Support the read-only and design modes
  get style(): CSSProperties {
    return this.question.getPropertyValue("readOnly")
      || this.question.isDesignMode ? { pointerEvents: "none" } : {};
  }

  renderColorPicker(type) {
    switch (type) {
      case "Slider": {
        return (
          <SliderPicker color={this.value} onChange={this.handleColorChange} />
        );
      }
      case "Sketch": {
        return (
          <SketchPicker color={this.value} onChange={this.handleColorChange} disableAlpha={this.disableAlpha} />
        );
      }
      case "Compact": {
        return (
          <CompactPicker color={this.value} onChange={this.handleColorChange} />
        );
      }
      default:
        return <div>Unknown type</div>;
    }
  }

  renderElement() {
    return (
      <div style={this.style}>
        {this.renderColorPicker(this.type)}
      </div>
    );
  }
}
```

Register your custom class (`SurveyQuestionColorPicker`) as a class that renders a custom question type (`color-picker`):

```js
// components/ColorPicker.tsx
// ...
import { createElement } from "react";
import { ReactQuestionFactory } from "survey-react-ui";

const CUSTOM_TYPE = "color-picker";
// ...
ReactQuestionFactory.Instance.registerQuestion(CUSTOM_TYPE, (props) => {
  return createElement(SurveyQuestionColorPicker, props);
});
```

## Specify Captions

Survey Creator generates captions for your custom question type and its properties automatically. If you need to change them, use the [localization engine](/Documentation/Survey-Creator?id=localization):

```js
// components/ColorPicker.tsx
// ...
import { getLocaleStrings } from "survey-creator-core";

const CUSTOM_TYPE = "color-picker";
// ...
const locale = getLocaleStrings("en");
locale.qt[CUSTOM_TYPE] = "Color Picker";
locale.pe.colorPickerType = "Color picker type";
locale.pe.disableAlpha = "Disable alpha channel";
```

## Add an Icon

Each question type has an icon that is displayed next to the type name in the [Toolbox](/Documentation/Survey-Creator?id=toolbox) and the Add Question menu. The following code shows how to register an SVG icon for your custom question type:

```js
// components/icons/color-picker.js
const ColorPickerIcon = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path ... />
  </svg>
);

export default ColorPickerIcon;
```

```js
// components/ColorPicker.tsx
// ...
import ColorPickerIcon from "./icons/color-picker";
import ReactDOMServer from "react-dom/server";
import { SvgRegistry } from "survey-core"

const CUSTOM_TYPE = "color-picker";
// ...
const svg = ReactDOMServer.renderToString(ColorPickerIcon);
SvgRegistry.registerIcon(CUSTOM_TYPE, svg);
```

Alternatively, you can use one of [built-in SurveyJS icons](https://surveyjs.io/form-library/documentation/icons#built-in-icons). The code below shows how to use the Text icon:

```js
// components/ColorPicker.tsx
// ...
import { settings } from "survey-core";

const CUSTOM_TYPE = "color-picker";
// ...
settings.customIcons["icon-" + CUSTOM_TYPE] = "icon-text";
```

## Use the Custom Component as an Editor in the Property Grid

The [Property Grid](/Documentation/Survey-Creator?id=property-grid) is built upon a regular survey and can be customized using the same techniques. It means that if you integrate a third-party component into a survey, you can integrate it into the Property Grid with little effort. For example, the following code shows how to register the Color Picker configured in this tutorial as an editor for the properties of the `"color"` type:

```js
// components/ColorPicker.tsx
// ...
import { PropertyGridEditorCollection } from "survey-creator-core";

const CUSTOM_TYPE = "color-picker";
// ...
PropertyGridEditorCollection.register({
  fit: function (prop) {
    return prop.type === "color";
  },
  getJSON: function () {
    return {
      type: CUSTOM_TYPE,
      colorPickerType: "Compact"
    };
  }
});
```

To try the functionality, you can add a custom property of the `"color"` type to the survey. The code below adds a custom `backgroundColor` property. When users change its value, they change the `--background` CSS variable. The [`onActiveTabChanged`](https://surveyjs.io/survey-creator/documentation/api-reference/survey-creator#onActiveTabChanged) event handler reapplies the selected background color when users switch to the Designer or Preview tab.

```js
// components/SurveyCreator.tsx
'use client'

import { useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { Serializer } from "survey-core";
import { registerColorPicker } from "./ColorPicker";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import { ActiveTabChangedEvent, SurveyCreatorModel } from "survey-creator-core";

registerColorPicker();
addBackgroundColorProperty();

export function SurveyCreatorWidget () {
  let [creator, setCreator] = useState<SurveyCreator>();

  if (!creator) {
    creator = new SurveyCreator();
    setCreator(creator);
  }

  creator.onActiveTabChanged.add(handleActiveTabChange);
  return <SurveyCreatorComponent creator={creator} />;
}

function addBackgroundColorProperty() {
  Serializer.addProperty("survey", {
    name: "backgroundColor",
    displayName: "Background color",
    type: "color",
    category: "general",
    visibleIndex: 3,
    onSetValue: (survey, value) => {
      survey.setPropertyValue("backgroundColor", value);
      applyBackground(value);
    }
  });
}

function applyBackground(color) {
  setTimeout(() => {
    const surveyEl = document.getElementsByClassName("sd-root-modern")[0] as HTMLElement;
    if (!!surveyEl) {
      surveyEl.style.setProperty("--background", color);
    }
  }, 50);
}

function handleActiveTabChange(sender: SurveyCreatorModel, options: ActiveTabChangedEvent) {
  if (options.tabName === "preview" || options.tabName === "designer") {
    applyBackground(sender.survey.backgroundColor);
  }
}
```

You might want to use a third-party component only as a property editor, without allowing survey authors to use it in questions. In this case, you need to hide the component from the Toolbox and the Add Question menu. To do this, pass `false` as a third argument to the `ElementFactory.Instance.registerElement` method when you register a [freshly created model](#create-a-model):

```js
// components/ColorPicker.tsx
// ...
import { ElementFactory } from "survey-core";

const CUSTOM_TYPE = "color-picker";
// ...
export function registerColorPicker() {
  ElementFactory.Instance.registerElement(
    CUSTOM_TYPE,
    (name) => {
      return new QuestionColorPickerModel(name);
    },
    false
  );
}
```

[View Demo](/survey-creator/examples/custom-colorpicker-property-editor/reactjs (linkStyle))

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/integrate-third-party-react-components (linkStyle))

## See Also

The following demo shows how to use the [React Select](https://react-select.com/home) control as a drop-down editor for a survey question.

[View Demo](https://surveyjs.io/survey-creator/examples/react-select/ (linkStyle))

## Further Reading

- [Create Specialized Question Types](/form-library/documentation/customize-question-types/create-specialized-question-types)
- [Create Composite Question Types](/form-library/documentation/customize-question-types/create-composite-question-types)