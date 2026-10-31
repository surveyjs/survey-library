---
title: SurveyJS Forms in Shadow DOM
description: Learn how to render a SurveyJS form inside the Shadow DOM to isolate styles, prevent CSS conflicts, and ensure consistent appearance across applications.
---

# Shadow DOM Support

SurveyJS Form Library can be rendered inside the Shadow DOM to isolate its markup and styles from the rest of the page. This approach is useful in applications that require strict style encapsulation, such as component-based architectures or when integrating SurveyJS into third-party environments.

When rendered in the Shadow DOM, the survey behaves the same as in the regular DOM, but its styles do not leak out, and external styles do not affect it unless explicitly shared.

## Benefits

Rendering a survey in the Shadow DOM provides the following advantages:

- Style encapsulation  
  Prevents global styles from affecting survey elements and avoids unintended overrides.

- No CSS conflicts  
  Eliminates naming collisions between SurveyJS styles and application styles.

- Safer embedding  
  Makes it easier to integrate surveys into complex applications, widgets, or micro-frontends.

- Predictable rendering  
  Ensures consistent appearance regardless of the host application's styling.

## Render Survey in Shadow DOM

### Angular

Import the SurveyJS Form Library stylesheet and set the component's `encapsulation` property to `ViewEncapsulation.ShadowDom`:

```js
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
// ...
import "survey-core/survey-core.css";

@Component({
  selector: "component-survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.css"],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SurveyComponent implements OnInit {
  // ...
}
```

[View Demo](/form-library/examples/render-survey-inside-shadow-dom/angular (linkStyle))

### React

Append the `survey-core.css` stylesheet to the shadow root instead of importing it into the component:

```js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const shadowHost = document.getElementById('root');
const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://unpkg.com/survey-core/survey-core.min.css";

shadowRoot.appendChild(link);

const root = createRoot(shadowRoot);
root.render(<App />);
```

[View Demo](/form-library/examples/render-survey-inside-shadow-dom/reactjs (linkStyle))

### Vue

Append the `survey-core.css` stylesheet to the shadow root instead of importing it into the component. Add the stylesheet *after* mounting:

```js
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
const shadowHost = document.getElementById("app");
const shadowRoot = shadowHost.attachShadow({ mode: "open" });

app.mount(shadowRoot);

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://unpkg.com/survey-core/survey-core.min.css";

shadowRoot.appendChild(link);
```

[View Demo](/form-library/examples/render-survey-inside-shadow-dom/vue3js (linkStyle))

### HTML/JS/CSS

Append the `survey-core.css` stylesheet to the shadow root instead of referencing it globally:

```js
const shadowHost = document.getElementById("root");
const shadowRoot = shadowHost.attachShadow({ mode: "open" });

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://unpkg.com/survey-core/survey-core.min.css";

shadowRoot.appendChild(link);

const surveyElement = document.createElement("div");
shadowRoot.appendChild(surveyElement);

const survey = new Survey.Model(json);
survey.render(surveyElement);
```

[View Demo](/form-library/examples/render-survey-inside-shadow-dom/vanillajs (linkStyle))