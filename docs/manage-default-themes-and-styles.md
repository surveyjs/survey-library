# Themes & Styles

This help topic describes how to add SurveyJS themes to your Angular, Vue, React, Knockout, or jQuery application and switch between them if you want to apply multiple themes.

## Add SurveyJS Themes to Your Application

SurveyJS ships with the Modern and Default V2 UI themes illustrated below.

![Themes in SurveyJS Form Library](images/survey-library-themes.png)

Themes are added differently depending on your framework. Refer to the following sections within Get Started help topics for instructions: 

- [Configure Styles in Angular](https://surveyjs.io/form-library/documentation/get-started-angular#configure-styles)
- [Configure Styles in Vue](https://surveyjs.io/form-library/documentation/get-started-vue#configure-styles)
- [Configure Styles in React](https://surveyjs.io/form-library/documentation/get-started-react#configure-styles)
- [Link SurveyJS Resources in Knockout](https://surveyjs.io/form-library/documentation/get-started-knockout#link-surveyjs-resources)
- [Link SurveyJS Resources in jQuery](https://surveyjs.io/form-library/documentation/get-started-jquery#link-surveyjs-resources)

## Customize Themes

### Colors and Sizes

SurveyJS themes use CSS variables to specify colors and sizes. You can find a full list of CSS variables for the Default V2 theme in the following file on GitHub: [variables.scss](https://github.com/surveyjs/survey-library/blob/master/src/defaultV2-theme/variables.scss). To customize a theme, change variable values and rebuild your application.

[View Demo](https://surveyjs.io/form-library/examples/create-custom-ui-theme/ (linkStyle))

### Custom CSS Classes

If you want to apply custom CSS classes to all survey elements of a specific type, define a JavaScript object in which keys specify survey elements and values specify CSS classes. For information on the object structure, refer to the following file on GitHub: [defaultV2Css.ts](https://github.com/surveyjs/survey-library/blob/master/src/defaultCss/defaultV2Css.ts#L13). Assign this object to [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model)'s `css` property.

[View Demo](https://surveyjs.io/form-library/examples/survey-customcss/ (linkStyle))

In addition, the `SurveyModel` object raises events that allow you to override CSS classes for individual questions, panels, pages, and choice items. Refer to event descriptions in the API reference for more information:

- [`onUpdateQuestionCssClasses`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUpdateQuestionCssClasses)
- [`onUpdatePanelCssClasses`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUpdatePanelCssClasses)
- [`onUpdatePageCssClasses`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUpdatePageCssClasses)
- [`onUpdateChoiceItemCss`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUpdateChoiceItemCss)

[View Demo](https://surveyjs.io/form-library/examples/survey-cssclasses/ (linkStyle))

## Switch Between Themes

If you add more than one SurveyJS theme to your application, call the `applyTheme(themeName)` method to specify which of the themes should be applied. Pass one of the following theme names as the method's argument:

- `"defaultV2"`
- `"modern"`

The following theme names are also supported, but they are obsolete:

- `"default"`
- `"orange"`
- `"darkblue"`
- `"darkrose"`
- `"stone"`
- `"winter"`
- `"winterstone"`

The code example below shows how to apply the Default V2 theme:

```js
import { StylesManager } from 'survey-core';

StylesManager.applyTheme("defaultV2");
```

> Previously, you needed to call the `applyTheme(themeName)` method even if your application includes only one SurveyJS theme. Since v1.9.69, a theme applies automatically if it is the only SurveyJS theme in the application.

## Bootstrap Support (Obsolete)

SurveyJS includes themes designed for use with Bootstrap and Bootstrap Material. However, they are considered obsolete and no longer receive updates.

Previously, Bootstrap integration was part of the main package. Since v1.9.69, it is shipped as a separate module/script. The following code shows how to apply the Bootstrap or Bootstrap Material theme by importing a module:

```js
// Apply the Bootstrap theme
import { bootstrapThemeName } from "survey-core/plugins/bootstrap-integration";
import { StylesManager } from 'survey-core';

StylesManager.applyTheme(bootstrapThemeName);
```

```js
// Apply the Bootstrap Material theme
import { bootstrapMaterialThemeName } from "survey-core/plugins/bootstrap-material-integration";
import { StylesManager } from 'survey-core';

StylesManager.applyTheme(bootstrapMaterialThemeName);
```

The code below shows how to apply the themes by referencing a script:

```html
<!-- Apply the Bootstrap theme -->
<script src="https://unpkg.com/survey-core/plugins/bootstrap-integration.min.js"></script>
```
```js
Survey.StylesManager.applyTheme("bootstrap");
```

```html
<!-- Apply the Bootstrap Material theme -->
<script src="https://unpkg.com/survey-core/plugins/bootstrap-material-integration.min.js"></script>
```
```js
Survey.StylesManager.applyTheme("bootstrapmaterial");
```

Bootstrap theme customization in code has also changed. Objects that specify applied CSS classes have been moved to the separate module/script.

**Previously:**

```js
// Assign another CSS class in Bootstrap (obsolete approach)
Survey.defaultBootstrapCss.page.description = "sv_page_description";

// In modular applications
import { defaultBootstrapCss } from "survey-core";

defaultBootstrapCss.page.description = "sv_page_description";
```

```js
// Assign another CSS class in Bootstrap Material (obsolete approach)
Survey.defaultBootstrapMaterialCss.page.description = "sv_page_description";

// In modular applications
import { defaultBootstrapMaterialCss } from "survey-core";

defaultBootstrapMaterialCss.page.description = "sv_page_description";
```

**Since v1.9.69:**

```js
// Assign another CSS class in Bootstrap (relevant approach)
SurveyBootstrap.defaultCss.page.description = "sv_page_description";

// In modular applications
import { defaultCss } from "survey-core/plugins/bootstrap-integration";

defaultCss.page.description = "sv_page_description";
```

```js
// Assign another CSS class in Bootstrap Material (relevant approach)
SurveyBootstrapMaterial.defaultCss.page.description = "sv_page_description";

// In modular applications
import { defaultCss } from "survey-core/plugins/bootstrap-material-integration";

defaultCss.page.description = "sv_page_description";
```

## See Also

- [UI Icons](https://surveyjs.io/form-library/documentation/icons)