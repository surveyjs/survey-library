---
title: Integrate Third-Party Angular Components | SurveyJS Documentation
description: Use any Angular component as an editor in your survey or form.
---

# Integrate Third-Party Angular Components

This help topic describes how to integrate a third-party Angular component into a standalone survey and Survey Creator. As an example, we will integrate the [Angular Color](https://www.npmjs.com/package/ngx-color) component. To install it, run the following command:

```cmd
npm install ngx-color --save
```

You also need to list Angular Color modules within `app.module.ts`:

```js
// app.module.ts
import { ColorSketchModule } from "ngx-color/sketch";
import { ColorSliderModule } from "ngx-color/slider";
import { ColorCompactModule } from "ngx-color/compact";

@NgModule({
  declarations: [ ... ],
  imports: [
    // ...
    ColorSketchModule,
    ColorSliderModule,
    ColorCompactModule
  ],
  // ...
})
export class AppModule { }
```

The following live example illustrates Survey Creator with an integrated Angular Color component:

<iframe src="https://codesandbox.io/embed/surveyjs-third-party-angular-component-integration-ivityy?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fcolor-picker%2Fcolor-picker.component.ts&theme=light&view=preview"
  style="width:100%; height:550px; border:0; border-radius: 4px; overflow:hidden;"
  title="SurveyJS: Third-Party Angular Component Integration"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/integrate-third-party-angular-components (linkStyle))

## Create a Model

To integrate a third-party component, you need to configure a custom question type for it. All question types in SurveyJS demand a model. To create it, add a custom class (`QuestionColorPickerModel` in the code below) that extends the [`Question`](https://surveyjs.io/Documentation/Library?id=question) class and inherits all its properties and methods. Override the [`getType()`](https://surveyjs.io/Documentation/Library?id=question#getType) method with an implementation that returns the name of your custom question type. If the model requires custom properties, declare them as getter + setter pairs. In the following code, the model includes two such properties: `colorPickerType` and `disableAlpha`.

```js
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

Register the created model in the `ElementFactory` under the name returned by the `getType()` method:

```js
ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name) => {
  return new QuestionColorPickerModel(name);
});
```

## Configure JSON Serialization

Our model exists only in JavaScript code, but SurveyJS works with JSON objects. You need to configure how your model should be serialized into JSON. To do this, call the `addClass(name, properties, creator, parentName)` method on the `Serializer` object. This method accepts the following arguments:

- `name`      
A string value that you returned from the model's `getType()` method. This property is used to associate the JSON object with the model's JavaScript class.

- `properties`      
An array of objects used to serialize custom model properties into JSON. This array must include all custom model properties. [Our model](#create-a-model) contains two custom properties (`colorPickerType` and `disableAlpha`), and the code below configures their serialization.

- `creator`       
A function that returns an instance of the model's JavaScript class (`QuestionColorPickerModel`) associated with the JSON object.

- `parentName`        
The name of a parent class that the custom class extends (`"question"`).

```js
import { ..., Serializer } from "survey-core";

const CUSTOM_TYPE = "color-picker";

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

Implement a custom Angular component that renders the desired UI elements. This component's class should extend the `QuestionAngular` generic class that accepts a question model (`QuestionColorPickerModel` in our case). Model properties are available through the context variable `this`. Your custom component can include additional members. For example, `ColorPickerComponent` in the code below contains a `handleChange` function that sets the selected color as a question value.

```js
import { Component } from "@angular/core";
import { QuestionAngular } from "survey-angular-ui";
import { ColorEvent } from 'ngx-color';

@Component({
  selector: "color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: [ "./color-picker.component.css" ]
})
export class ColorPickerComponent extends QuestionAngular<QuestionColorPickerModel> {
  handleChange($event: ColorEvent) {
    this.model.value = $event.color.hex;
  }
}

// A custom question model configured earlier
export class QuestionColorPickerModel extends Question {
  // ...
}
```

The component's template should render different color picker elements based upon the `colorPickerType` property value:

```html
<ng-container *ngIf="model.colorPickerType === 'Sketch'">
  <color-sketch [disableAlpha]="model.disableAlpha" (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-sketch>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Slider'">
  <color-slider (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-slider>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Compact'">
  <color-compact (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-compact>
</ng-container>
```

Register your custom component (`ColorPickerComponent`) as a component that renders a custom question type (`color-picker-question`):

```js
import { ..., AngularComponentFactory } from "survey-angular-ui";

AngularComponentFactory.Instance.registerComponent(CUSTOM_TYPE + "-question", ColorPickerComponent);
```

Import your custom component into `AppComponent` as shown in the code below. Otherwise, the component may be removed from the production build by tree shaking.

```js
// app.component.ts
import { Component } from '@angular/core';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  // ...
})
export class AppComponent {
  static declaration = [ColorPickerComponent];
}
```

<details>
  <summary>View Full Code</summary>

```js
// color-picker.component.ts
import { Component } from "@angular/core";
import { AngularComponentFactory, QuestionAngular } from "survey-angular-ui";
import { ElementFactory, Question, Serializer } from "survey-core";
import { ColorEvent } from 'ngx-color';

const CUSTOM_TYPE = "color-picker";

@Component({
  selector: "color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: [ "./color-picker.component.css" ]
})
export class ColorPickerComponent extends QuestionAngular<QuestionColorPickerModel> {
  handleChange($event: ColorEvent) {
    this.model.value = $event.color.hex;
  }
}
AngularComponentFactory.Instance.registerComponent(CUSTOM_TYPE + "-question", ColorPickerComponent);

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

ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name) => {
  return new QuestionColorPickerModel(name);
});

// Add question type metadata for further serialization into JSON
Serializer.addClass(
  CUSTOM_TYPE,
  [{
    name: "colorPickerType",
    default: "Slider",
    choices: ["Slider", "Sketch", "Compact"],
    category: "general",
    visibleIndex: 2 // After the Name and Title
  }, {
    name: "disableAlpha:boolean",
    dependsOn: "colorPickerType",
    visibleIf: function (obj) {
      return obj.colorPickerType === "Sketch";
    },
    category: "general",
    visibleIndex: 3 // After the Name, Title, and Color Picker type
  }],
  function () {
    return new QuestionColorPickerModel("");
  },
  "question"
);
```

```html
<!-- color-picker.component.html -->
<ng-container *ngIf="model.colorPickerType === 'Sketch'">
  <color-sketch [disableAlpha]="model.disableAlpha" (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-sketch>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Slider'">
  <color-slider (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-slider>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Compact'">
  <color-compact (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-compact>
</ng-container>
```

```js
// app.component.ts
import { Component } from '@angular/core';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  static declaration = [ColorPickerComponent];
}
```

</details>

## Specify Captions

Survey Creator generates captions for your custom question type and its properties automatically. If you need to change them, use the [localization engine](/Documentation/Survey-Creator?id=localization):

```js
import { localization } from "survey-creator-core";

const CUSTOM_TYPE = "color-picker";

const locale = localization.getLocale("");
locale.qt[CUSTOM_TYPE] = "Color Picker";
locale.pe.colorPickerType = "Color picker type";
locale.pe.disableAlpha = "Disable alpha channel";
```

<details>
  <summary>View Full Code</summary>

```js
// color-picker.component.ts
import { Component } from "@angular/core";
import { AngularComponentFactory, QuestionAngular } from "survey-angular-ui";
import { ElementFactory, Question, Serializer } from "survey-core";
import { localization } from "survey-creator-core";
import { ColorEvent } from 'ngx-color';

const CUSTOM_TYPE = "color-picker";

@Component({
  selector: "color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: [ "./color-picker.component.css" ]
})
export class ColorPickerComponent extends QuestionAngular<QuestionColorPickerModel> {
  handleChange($event: ColorEvent) {
    this.model.value = $event.color.hex;
  }
}
AngularComponentFactory.Instance.registerComponent(CUSTOM_TYPE + "-question", ColorPickerComponent);

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

ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name) => {
  return new QuestionColorPickerModel(name);
});

// Add question type metadata for further serialization into JSON
Serializer.addClass(
  CUSTOM_TYPE,
  [{
    name: "colorPickerType",
    default: "Slider",
    choices: ["Slider", "Sketch", "Compact"],
    category: "general",
    visibleIndex: 2 // After the Name and Title
  }, {
    name: "disableAlpha:boolean",
    dependsOn: "colorPickerType",
    visibleIf: function (obj) {
      return obj.colorPickerType === "Sketch";
    },
    category: "general",
    visibleIndex: 3 // After the Name, Title, and Color Picker type
  }],
  function () {
    return new QuestionColorPickerModel("");
  },
  "question"
);

const locale = localization.getLocale("");
locale.qt[CUSTOM_TYPE] = "Color Picker";
locale.pe.colorPickerType = "Color picker type";
locale.pe.disableAlpha = "Disable alpha channel";
```

```html
<!-- color-picker.component.html -->
<ng-container *ngIf="model.colorPickerType === 'Sketch'">
  <color-sketch [disableAlpha]="model.disableAlpha" (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-sketch>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Slider'">
  <color-slider (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-slider>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Compact'">
  <color-compact (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-compact>
</ng-container>
```

```js
// app.component.ts
import { Component } from '@angular/core';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  static declaration = [ColorPickerComponent];
}
```

</details>

## Add an Icon

Each question type has an icon that is displayed next to the type name in the [Toolbox](/Documentation/Survey-Creator?id=toolbox) and the Add Question menu. The following code shows how to register an SVG icon for your custom question type:

```js
import { ..., SvgRegistry } from "survey-core"

const CUSTOM_TYPE = "color-picker";

SvgRegistry.registerIconFromSvg(
  CUSTOM_TYPE,
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="..." /></svg>'
);
```

Alternatively, you can use one of [built-in SurveyJS icons](https://surveyjs.io/form-library/documentation/icons#built-in-icons). The code below shows how to use the Text icon:

```js
import { ..., settings } from "survey-core";

const CUSTOM_TYPE = "color-picker";

settings.customIcons["icon-" + CUSTOM_TYPE] = "icon-text";
```

<details>
  <summary>View Full Code</summary>

```js
// color-picker.component.ts
import { Component } from "@angular/core";
import { AngularComponentFactory, QuestionAngular } from "survey-angular-ui";
import { ElementFactory, Question, Serializer, SvgRegistry } from "survey-core";
import { localization } from "survey-creator-core";
import { ColorEvent } from 'ngx-color';

const CUSTOM_TYPE = "color-picker";

@Component({
  selector: "color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: [ "./color-picker.component.css" ]
})
export class ColorPickerComponent extends QuestionAngular<QuestionColorPickerModel> {
  handleChange($event: ColorEvent) {
    this.model.value = $event.color.hex;
  }
}
AngularComponentFactory.Instance.registerComponent(CUSTOM_TYPE + "-question", ColorPickerComponent);

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

ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name) => {
  return new QuestionColorPickerModel(name);
});

// Add question type metadata for further serialization into JSON
Serializer.addClass(
  CUSTOM_TYPE,
  [{
    name: "colorPickerType",
    default: "Slider",
    choices: ["Slider", "Sketch", "Compact"],
    category: "general",
    visibleIndex: 2 // After the Name and Title
  }, {
    name: "disableAlpha:boolean",
    dependsOn: "colorPickerType",
    visibleIf: function (obj) {
      return obj.colorPickerType === "Sketch";
    },
    category: "general",
    visibleIndex: 3 // After the Name, Title, and Color Picker type
  }],
  function () {
    return new QuestionColorPickerModel("");
  },
  "question"
);

// Specify display names for the question type and its properties
const locale = localization.getLocale("");
locale.qt[CUSTOM_TYPE] = "Color Picker";
locale.pe.colorPickerType = "Color picker type";
locale.pe.disableAlpha = "Disable alpha channel";

// Register an SVG icon for the question type
SvgRegistry.registerIconFromSvg(
  CUSTOM_TYPE,
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 21.4201C23.9387 22.1566 23.5894 22.8394 23.0278 23.3202C22.4662 23.8011 21.7376 24.0413 21 23.9888C20.2624 24.0413 19.5338 23.8011 18.9722 23.3202C18.4106 22.8394 18.0613 22.1566 18 21.4201C18 18.8513 21 16.2826 21 14.9932C21 16.2826 24 18.8513 24 21.4201ZM22 12.9942L11 1.99951L8.71 4.2884L10.12 5.70771L11 4.82814L18.17 11.9946L5.64 15.8028L2.83 12.9942L7.71 8.11653L9.29 9.70576C9.38296 9.79944 9.49356 9.8738 9.61542 9.92455C9.73728 9.97529 9.86799 10.0014 10 10.0014C10.132 10.0014 10.2627 9.97529 10.3846 9.92455C10.5064 9.8738 10.617 9.79944 10.71 9.70576C10.8037 9.61284 10.8781 9.5023 10.9289 9.3805C10.9797 9.2587 11.0058 9.12805 11.0058 8.99611C11.0058 8.86416 10.9797 8.73352 10.9289 8.61172C10.8781 8.48992 10.8037 8.37937 10.71 8.28645L3.71 1.28986C3.5217 1.10165 3.2663 0.995911 3 0.995911C2.7337 0.995911 2.4783 1.10165 2.29 1.28986C2.1017 1.47807 1.99591 1.73334 1.99591 1.99951C1.99591 2.26569 2.1017 2.52096 2.29 2.70917L6.29 6.70722L0 12.9942L10 22.9893L18 14.9932L22 12.9942Z" /></svg>'
);
```

```html
<!-- color-picker.component.html -->
<ng-container *ngIf="model.colorPickerType === 'Sketch'">
  <color-sketch [disableAlpha]="model.disableAlpha" (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-sketch>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Slider'">
  <color-slider (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-slider>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Compact'">
  <color-compact (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-compact>
</ng-container>
```

```js
// app.component.ts
import { Component } from '@angular/core';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  static declaration = [ColorPickerComponent];
}
```
</details>

## Use the Custom Component as an Editor in the Property Grid

The [Property Grid](/Documentation/Survey-Creator?id=property-grid) is built upon a regular survey and can be customized using the same techniques. It means that if you integrate a third-party component into a survey, you can integrate it into the Property Grid with little effort. For example, the following code shows how to register the Color Picker configured in this tutorial as an editor for the properties of the `"color"` type:

```js
// color-picker.component.ts
import { ..., PropertyGridEditorCollection } from "survey-creator-core";

const CUSTOM_TYPE = "color-picker";

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
// survey-creator.component.ts
import { Component, OnInit } from "@angular/core";
import { SurveyCreatorModel } from "survey-creator-core";
import { Serializer, SurveyModel } from "survey-core";

function applyBackground(color) {
  setTimeout(() => {
    const surveyEl = document.getElementsByClassName("sd-root-modern")[0] as HTMLElement;
    if (!!surveyEl) {
      surveyEl.style.setProperty("--background", color);
    }
  }, 50);
};

function handleActiveTabChange(sender, options) {
  if (options.tabName === "test" || options.tabName === "designer") {
    applyBackground(sender.survey.backgroundColor);
  }
};

const creatorOptions = {
  showLogicTab: true
};

@Component({
  selector: "survey-creator-component",
  templateUrl: "./survey-creator.component.html",
  styleUrls: ["./survey-creator.component.css"]
})
export class SurveyCreatorComponent implements OnInit {
  surveyCreatorModel!: SurveyCreatorModel;
  ngOnInit() {
    const creator = new SurveyCreatorModel(creatorOptions);
      
    Serializer.addProperty("survey", {
      name: "backgroundColor",
      displayName: "Background color",
      type: "color",
      category: "general",
      visibleIndex: 3,
      onSetValue: (survey: SurveyModel, value) => {
        survey.setPropertyValue("backgroundColor", value);
        applyBackground(value);
      }
    });
      
    creator.onActiveTabChanged.add(handleActiveTabChange);      
    this.surveyCreatorModel = creator;
  }
}
```

<details>
  <summary>View Full Code</summary>

```js
// color-picker.component.ts
import { Component } from "@angular/core";
import { AngularComponentFactory, QuestionAngular } from "survey-angular-ui";
import { ElementFactory, Question, Serializer, SvgRegistry } from "survey-core";
import { PropertyGridEditorCollection, localization } from "survey-creator-core";
import { ColorEvent } from 'ngx-color';

const CUSTOM_TYPE = "color-picker";

@Component({
  selector: "color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: [ "./color-picker.component.css" ]
})
export class ColorPickerComponent extends QuestionAngular<QuestionColorPickerModel> {
  handleChange($event: ColorEvent) {
    this.model.value = $event.color.hex;
  }
}
AngularComponentFactory.Instance.registerComponent(CUSTOM_TYPE + "-question", ColorPickerComponent);

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

ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name) => {
  return new QuestionColorPickerModel(name);
});

// Add question type metadata for further serialization into JSON
Serializer.addClass(
  CUSTOM_TYPE,
  [{
    name: "colorPickerType",
    default: "Slider",
    choices: ["Slider", "Sketch", "Compact"],
    category: "general",
    visibleIndex: 2 // After the Name and Title
  }, {
    name: "disableAlpha:boolean",
    dependsOn: "colorPickerType",
    visibleIf: function (obj) {
      return obj.colorPickerType === "Sketch";
    },
    category: "general",
    visibleIndex: 3 // After the Name, Title, and Color Picker type
  }],
  function () {
    return new QuestionColorPickerModel("");
  },
  "question"
);

// Specify display names for the question type and its properties 
const locale = localization.getLocale("");
locale.qt[CUSTOM_TYPE] = "Color Picker";
locale.pe.colorPickerType = "Color picker type";
locale.pe.disableAlpha = "Disable alpha channel";

// Register an SVG icon for the question type
SvgRegistry.registerIconFromSvg(
  CUSTOM_TYPE,
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 21.4201C23.9387 22.1566 23.5894 22.8394 23.0278 23.3202C22.4662 23.8011 21.7376 24.0413 21 23.9888C20.2624 24.0413 19.5338 23.8011 18.9722 23.3202C18.4106 22.8394 18.0613 22.1566 18 21.4201C18 18.8513 21 16.2826 21 14.9932C21 16.2826 24 18.8513 24 21.4201ZM22 12.9942L11 1.99951L8.71 4.2884L10.12 5.70771L11 4.82814L18.17 11.9946L5.64 15.8028L2.83 12.9942L7.71 8.11653L9.29 9.70576C9.38296 9.79944 9.49356 9.8738 9.61542 9.92455C9.73728 9.97529 9.86799 10.0014 10 10.0014C10.132 10.0014 10.2627 9.97529 10.3846 9.92455C10.5064 9.8738 10.617 9.79944 10.71 9.70576C10.8037 9.61284 10.8781 9.5023 10.9289 9.3805C10.9797 9.2587 11.0058 9.12805 11.0058 8.99611C11.0058 8.86416 10.9797 8.73352 10.9289 8.61172C10.8781 8.48992 10.8037 8.37937 10.71 8.28645L3.71 1.28986C3.5217 1.10165 3.2663 0.995911 3 0.995911C2.7337 0.995911 2.4783 1.10165 2.29 1.28986C2.1017 1.47807 1.99591 1.73334 1.99591 1.99951C1.99591 2.26569 2.1017 2.52096 2.29 2.70917L6.29 6.70722L0 12.9942L10 22.9893L18 14.9932L22 12.9942Z" /></svg>'
);

// Register the `color-picker` as an editor for properties of the `color` type in the Survey Creator's Property Grid
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

```html
<!-- color-picker.component.html -->
<ng-container *ngIf="model.colorPickerType === 'Sketch'">
  <color-sketch [disableAlpha]="model.disableAlpha" (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-sketch>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Slider'">
  <color-slider (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-slider>
</ng-container>
<ng-container *ngIf="model.colorPickerType === 'Compact'">
  <color-compact (onChange)="handleChange($event)" [color]="model.value || '#fff'"></color-compact>
</ng-container>
```

```js
// survey-creator.component.ts
import { Component, OnInit } from "@angular/core";
import { SurveyCreatorModel } from "survey-creator-core";
import { Serializer, SurveyModel } from "survey-core";

function applyBackground(color) {
  setTimeout(() => {
    const surveyEl = document.getElementsByClassName("sd-root-modern")[0] as HTMLElement;
    if (!!surveyEl) {
      surveyEl.style.setProperty("--background", color);
    }
  }, 50);
};

function handleActiveTabChange(sender, options) {
  if (options.tabName === "test" || options.tabName === "designer") {
    applyBackground(sender.survey.backgroundColor);
  }
};

const creatorOptions = {
  showLogicTab: true
};

const surveyJson = {
  elements: [{
    type: "color-picker",
    name: "question1",
    title: "Pick a color",
    colorPickerType: "Sketch"
  }]
};

@Component({
  selector: "survey-creator-component",
  templateUrl: "./survey-creator.component.html",
  styleUrls: ["./survey-creator.component.css"]
})
export class SurveyCreatorComponent implements OnInit {
  surveyCreatorModel!: SurveyCreatorModel;
  ngOnInit() {
    const creator = new SurveyCreatorModel(creatorOptions);
      
    Serializer.addProperty("survey", {
      name: "backgroundColor",
      displayName: "Background color",
      type: "color",
      category: "general",
      visibleIndex: 3,
      onSetValue: (survey: SurveyModel, value) => {
        survey.setPropertyValue("backgroundColor", value);
        applyBackground(value);
      }
    });
      
    creator.onActiveTabChanged.add(handleActiveTabChange);
    creator.JSON = surveyJson;
      
    this.surveyCreatorModel = creator;
  }
}
```

```html
<!-- survey-creator.component.html -->
<div id="surveyCreator">
  <survey-creator [model]="surveyCreatorModel"></survey-creator>
</div>
```

```js
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { ColorSketchModule } from "ngx-color/sketch";
import { ColorSliderModule } from "ngx-color/slider";
import { ColorCompactModule } from "ngx-color/compact";

import { AppComponent } from './app.component';
import { SurveyCreatorComponent } from './survey-creator/survey-creator.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    SurveyCreatorComponent,
    ColorPickerComponent
  ],
  imports: [
    BrowserModule,
    SurveyCreatorModule,
    ColorSketchModule,
    ColorSliderModule,
    ColorCompactModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```js
// app.component.ts
import { Component } from '@angular/core';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  static declaration = [ColorPickerComponent];
}
```
</details>

[View Demo](https://surveyjs.io/survey-creator/examples/custom-colorpicker-property-editor/angular (linkStyle))

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/integrate-third-party-angular-components (linkStyle))

## Further Reading

- [Create Specialized Question Types](/form-library/documentation/customize-question-types/create-specialized-question-types)
- [Create Composite Question Types](/form-library/documentation/customize-question-types/create-composite-question-types)