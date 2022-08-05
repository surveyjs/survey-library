# Icons

This help topic describes icons built into SurveyJS components and shows how you can replace them with custom icons.

- [Built-In Icons](#built-in-icons)
- [Custom Icons](#custom-icons)

## Built-In Icons

SurveyJS uses icons in SVG format. The following built-in SVG icons are available:

<iframe src="https://surveyjs.github.io/code-examples/icons/"
  style="width:100%; height:1770px; border:0; overflow:hidden;">
</iframe>

The following code shows how you can swap two built-in icons. It uses the `icon-export` icon instead of `icon-import`, and vice versa:

```js
Survey.settings.customIcons["icon-import"] = "icon-export";
Survey.settings.customIcons["icon-export"] = "icon-import";

// In modular applications:
import { settings } from "survey-core";
settings.customIcons["icon-import"] = "icon-export";
settings.customIcons["icon-export"] = "icon-import";
```

## Custom Icons

If you want to replace a built-in icon with a custom SVG icon, call the `registerIconFromSvg` method on the `SvgRegistry` object. Pass the name of the built-in icon as the first argument and the custom icon markup converted to a string as the second argument. In the following code, a custom icon replaces the `icon-delete` icon:

```js
const creator = new SurveyCreator.SurveyCreator(creatorOptions);

fetch("./my-icon.svg")
  .then(response => response.text())
  .then(svg => {
    Survey.SvgRegistry.registerIconFromSvg("icon-delete", svg);
    creator.render("creatorElement");
  });

// In React:
import { SvgRegistry } from "survey-core";
import { ReactComponent as MyIcon } from "./my-icon.svg";
import ReactDOMServer from "react-dom/server";

const svg = ReactDOMServer.renderToString(<MyIcon />);
SvgRegistry.registerIconFromSvg("icon-delete", svg);
```

## See Also

- [Conditional Logic and Dynamic Texts](/Documentation/Library?id=design-survey-conditional-logic)
- [Data Validation](/Documentation/Library?id=data-validation)
- [Localization & Globalization](/Documentation/Library?id=localization)
