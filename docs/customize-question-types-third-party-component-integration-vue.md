---
title: Integrate Third-Party Vue 3 Components | SurveyJS Documentation
description: Use any Vue 3 component as an editor in your survey or form.
---

# Integrate Third-Party Vue 3 Components

This help topic describes how to integrate a third-party Vue 3 component into a standalone survey and Survey Creator.

- [Create a Model](#create-a-model)
- [Configure JSON Serialization](#configure-json-serialization)
- [Render the Third-Party Component](#render-the-third-party-component)
- [Specify Captions](#specify-captions)
- [Add an Icon](#add-an-icon)
- [Use the Custom Component as an Editor in the Property Grid](#use-the-custom-component-as-an-editor-in-the-property-grid)

As an example, we will integrate the [Vue 3 Color](https://lk77.github.io/vue3-color/) component. To install it, run the following command:

```cmd
npm install @lk77/vue3-color --save
```

You also need to list Vue 3 Color components within `main.ts`:

```js
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { surveyPlugin } from "survey-vue3-ui";
import { surveyCreatorPlugin } from "survey-creator-vue";
// This is the custom component that we'll create in this tutorial
// import ColorPickerComponent from "./components/ColorPicker.vue";
import { Sketch, Compact, Slider } from "@lk77/vue3-color";

createApp(App)
  .use(surveyPlugin)
  .use(surveyCreatorPlugin)
  // .component("survey-color-picker", ColorPickerComponent)
  .component("slider-picker", Slider)
  .component("sketch-picker", Sketch)
  .component("compact-picker", Compact)
  .mount("#app");
```

<iframe src="https://codesandbox.io/embed/6qdsk5?view=preview&module=%2Fsrc%2Fcomponents%2Fcolorpicker.vue&hidenavigation=1&theme=light"
  style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
  title="reverent-ramanujan-6qdsk5"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/integrate-third-party-vue-components (linkStyle))

## Create a Model

To integrate a third-party component, you need to configure a custom question type for it. All question types in SurveyJS demand a model. To create it, add a custom class (`QuestionColorPickerModel` in the code below) that extends the [`Question`](https://surveyjs.io/Documentation/Library?id=question) class and inherits all its properties and methods. Override the [`getType()`](https://surveyjs.io/Documentation/Library?id=question#getType) method with an implementation that returns the name of your custom question type. If the model requires custom writable properties, declare them as getter + setter pairs. In the following code, the model includes two such properties: `colorPickerType` and `disableAlpha`. Your model may also include read-only properties, which are defined as getters (`isSlider`, `isSketch`, and `isColorCompact` in the code below).

```html
<!-- src/components/ColorPicker.vue -->
<script lang="ts">
import { Question } from "survey-core";

const CUSTOM_TYPE = "color-picker";

export class QuestionColorPickerModel extends Question {
  getType() {
    return CUSTOM_TYPE;
  }

  get colorPickerType(): string {
    return this.getPropertyValue("colorPickerType");
  }
  set colorPickerType(val) {
    this.setPropertyValue("colorPickerType", val);
  }
  get isSlider(): boolean {
    return this.colorPickerType === "Slider";
  }
  get isSketch(): boolean {
    return this.colorPickerType === "Sketch";
  }
  get isColorCompact(): boolean {
    return this.colorPickerType === "Compact";
  }

  get disableAlpha(): boolean {
    return this.getPropertyValue("disableAlpha");
  }
  set disableAlpha(val) {
    this.setPropertyValue("disableAlpha", val);
  }
}
</script>
```

Register the created model in the `ElementFactory` under the name returned by the `getType()` method:

```html
<!-- src/components/ColorPicker.vue -->
<script lang="ts">
import { ..., ElementFactory } from "survey-core";

// ...

ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name: string) => {
  return new QuestionColorPickerModel(name);
});
</script>
```

## Configure JSON Serialization

Our model exists only in JavaScript code, but SurveyJS works with JSON objects. You need to configure how your model should be serialized into JSON. To do this, call the `addClass(name, properties, creator, parentName)` method on the `Serializer` object. This method accepts the following arguments:

- `name`      
A string value that you returned from the model's `getType()` method. This property is used to associate the JSON object with the model's JavaScript class.

- `properties`      
An array of objects used to serialize custom model properties into JSON. This array must include all custom model properties. [Our model](#create-a-model) contains two writable custom properties (`colorPickerType` and `disableAlpha`), and the code below configures their serialization.

- `creator`       
A function that returns an instance of the model's JavaScript class (`QuestionColorPickerModel`) associated with the JSON object.

- `parentName`        
The name of a parent class that the custom class extends (`"question"`).

```html
<!-- src/components/ColorPicker.vue -->
<script lang="ts">
import { ..., Serializer } from "survey-core";

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
    visibleIf: function (obj: QuestionColorPickerModel) {
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
</script>
```

## Render the Third-Party Component

Declare a template that renders your third-party component. Model properties are available through props. In the following example, the template renders different color pickers from the [Vue 3 Color](https://lk77.github.io/vue3-color/) library:

```html
<!-- src/components/ColorPicker.vue -->
<script lang="ts">
// The model configured earlier goes here
</script>
<script setup lang="ts">
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionColorPickerModel }>();

function updateValue(val: any) {
  const hex: string = val.hex;
  if (hex) {
    props.question.value = hex.toLowerCase();
  }
}
</script>
<template>
  <slider-picker
    v-if="props.question.isSlider"
    :modelValue="props.question.value"
    @update:modelValue="updateValue"
  ></slider-picker>
  <sketch-picker
    v-if="props.question.isSketch"
    :modelValue="props.question.value"
    @update:modelValue="updateValue"
  ></sketch-picker>
  <compact-picker
    v-if="props.question.isColorCompact"
    :modelValue="props.question.value"
    @update:modelValue="updateValue"
  ></compact-picker>
</template>
```

Register your custom component (`ColorPickerComponent`) in `main.ts`:

```js
// main.ts
// ...
import ColorPickerComponent from "./components/ColorPicker.vue";

createApp(App)
  // ...
  .component("survey-color-picker", ColorPickerComponent)
  .mount("#app");
```

## Specify Captions

Survey Creator generates captions for your custom question type and its properties automatically. If you need to change them, use the [localization engine](/Documentation/Survey-Creator?id=localization):

```html
<!-- src/components/ColorPicker.vue -->
<script lang="ts">
// ...
import { localization } from "survey-creator-core";

const CUSTOM_TYPE = "color-picker";
// ...

const locale = localization.getLocale("");
locale.qt[CUSTOM_TYPE] = "Color Picker";
locale.pe.colorPickerType = "Color picker type";
locale.pe.disableAlpha = "Disable alpha channel";
</script>
```

## Add an Icon

Each question type has an icon that is displayed next to the type name in the [Toolbox](/Documentation/Survey-Creator?id=toolbox) and the Add Question menu. The following code shows how to register an SVG icon for your custom question type:

```html
<!-- src/components/ColorPicker.vue -->
<script lang="ts">
import { ..., SvgRegistry } from "survey-core"

const CUSTOM_TYPE = "color-picker";
// ...

SvgRegistry.registerIconFromSvg(
  CUSTOM_TYPE,
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="..." /></svg>'
);
</script>
```

Alternatively, you can use one of [built-in SurveyJS icons](https://surveyjs.io/form-library/documentation/icons#built-in-icons). The code below shows how to use the Text icon:

```html
<!-- src/components/ColorPicker.vue -->
<script lang="ts">
import { ..., settings } from "survey-core";

const CUSTOM_TYPE = "color-picker";
// ...

settings.customIcons["icon-" + CUSTOM_TYPE] = "icon-text";
</script>
```

## Use the Custom Component as an Editor in the Property Grid

The [Property Grid](/Documentation/Survey-Creator?id=property-grid) is built upon a regular survey and can be customized using the same techniques. It means that if you integrate a third-party component into a survey, you can integrate it into the Property Grid with little effort. For example, the following code shows how to register the Color Picker configured in this tutorial as an editor for the properties of the `"color"` type:

```html
<!-- src/components/ColorPicker.vue -->
<script lang="ts">
import { ..., PropertyGridEditorCollection } from "survey-creator-core";

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
</script>
```

To try the functionality, you can add a custom property of the `"color"` type to the survey. The code below adds a custom `backgroundColor` property. When users change its value, they change the `--background` CSS variable. The [`onActiveTabChanged`](https://surveyjs.io/survey-creator/documentation/api-reference/survey-creator#onActiveTabChanged) event handler reapplies the selected background color when users switch to the Designer or Preview tab.

```html
<!-- src/components/SurveyCreator.vue -->
<script setup lang="ts">
import 'survey-core/defaultV2.min.css';
import "survey-creator-core/survey-creator-core.min.css";

import { Serializer } from "survey-core";
import { SurveyCreatorModel } from "survey-creator-core";
import type { SurveyModel } from "survey-core";
import type { CreatorBase } from "survey-creator-core";

Serializer.addProperty("survey", {
  name: "backgroundColor",
  displayName: "Background color",
  type: "color",
  category: "general",
  visibleIndex: 3,
  onSetValue: (survey: SurveyModel, value: string) => {
    survey.setPropertyValue("backgroundColor", value);
    applyBackground(value);
  }
});

const surveyJson = {
  elements: [{
    type: "color-picker",
    name: "question1",
    title: "Pick a color",
    colorPickerType: "Sketch"
  }]
};

function applyBackground(color: string) {
  setTimeout(() => {
    const surveyEl = document.getElementsByClassName("sd-root-modern")[0] as HTMLElement;
    if (surveyEl) {
      surveyEl.style.setProperty("--background", color);
    }
  }, 50);
}

function handleActiveTabChange(sender: CreatorBase, { tabName }: { tabName: string }) {
  if (tabName === "test" || tabName === "designer") {
    applyBackground(sender.survey.backgroundColor);
  }
}

const creator = new SurveyCreatorModel({});
creator.onActiveTabChanged.add(handleActiveTabChange);
creator.JSON = surveyJson;
</script>

<template>
  <SurveyCreatorComponent :model="creator" />
</template>
```

[View Demo](/survey-creator/examples/custom-colorpicker-property-editor/vue3js (linkStyle))

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/integrate-third-party-vue-components (linkStyle))

## Further Reading

- [Create Specialized Question Types](/form-library/documentation/customize-question-types/create-specialized-question-types)
- [Create Composite Question Types](/form-library/documentation/customize-question-types/create-composite-question-types)