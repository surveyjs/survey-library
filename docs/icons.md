---
title: UI icons | SurveyJS Form Libraries
description: View the list of all available built-in icons used in SurveyJS libraries, and the code showing how to replace a built-in icon with a custom one.
---
# UI Icons

This help topic describes SVG icons built into SurveyJS Form Library and Survey Creator and shows how you can customize them.

<div id="built-in-icons"></div>

## Built-In SVG Icons

### Form Library Icons

The following SVG icons are available if your application includes the `survey-core` bundle or package:

<iframe src="/proxy/github/code-examples/icons/index-form-library.html"
  style="width:100%; border:0; overflow:hidden;">
</iframe>

### Survey Creator Icons

The SVG icons below are available if your application includes the `survey-creator-core` bundle or package. It depends on the `survey-core` bundle, and thus makes [Form Library icons](#form-library-icons) available as well.

<iframe src="/proxy/github/code-examples/icons/index.html"
  style="width:100%; border:0; overflow:hidden;">
</iframe>

## Icon Customization

### Swap Two Built-In Icons

Swapping two built-in icons allows you to use one icon from SurveyJS Form Library or Survey Creator instead of another, and vice versa. The following code shows how to swap the `icon-export` and `icon-import` icons:

```js
Survey.settings.customIcons["icon-import"] = "icon-export";
Survey.settings.customIcons["icon-export"] = "icon-import";

// In modular applications:
import { settings } from "survey-core";
settings.customIcons["icon-import"] = "icon-export";
settings.customIcons["icon-export"] = "icon-import";
```

<div id="custom-icons"></div>

### Use Custom SVG Icons

If you want to replace a built-in icon with a custom SVG icon, call the `registerIcon` method on the `SvgRegistry` object. Pass the name of the built-in icon as the first argument and the custom icon markup converted to a string as the second argument. In the following code, a custom icon replaces the `icon-delete` icon:

```js
// Option 1: Embed an SVG icon in code:
const customIcon = '<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="..."/></svg>';
Survey.SvgRegistry.registerIcon("icon-delete", customIcon);

// Option 2: Fetch an icon from a file
fetch("./my-icon.svg")
  .then(response => response.text())
  .then(svg => {
    Survey.SvgRegistry.registerIcon("icon-delete", svg);
  });

// Option 2 in React:
import { SvgRegistry } from "survey-core";
import { ReactComponent as MyIcon } from "./my-icon.svg";
import ReactDOMServer from "react-dom/server";

const svg = ReactDOMServer.renderToString(<MyIcon />);
SvgRegistry.registerIcon("icon-delete", svg);
```

[View Demo](https://surveyjs.io/form-library/examples/custom-icons/ (linkStyle))

## See Also

- [Themes & Styles](/form-library/documentation/manage-default-themes-and-styles)
- [Conditional Logic and Dynamic Texts](/Documentation/Library?id=design-survey-conditional-logic)
- [Data Validation](/Documentation/Library?id=data-validation)
- [Localization & Globalization](/Documentation/Library?id=localization)
