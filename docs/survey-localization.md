---
title: Survey Localization | SurveyJS Form Libraries
description: To adapt a survey to the local language of your respondents, localize survey UI elements and contents. Leverage our community-sourced support for 50+ languages.
---
# Localization & Globalization

This article describes how to localize UI elements and contents of your survey.

- [Localize UI Elements](#localize-ui-elements)
  - [Available Languages](#available-languages)
  - [Enable Localization and Switch Between Locales](#enable-localization-and-switch-between-locales)
  - [Override Individual Translations](#override-individual-translations)
- [Localize Survey Contents](#localize-survey-contents)
  - [Localize `choicesByUrl`](#localize-choicesbyurl)

## Localize UI Elements

### Available Languages

Survey UI is translated into over 50 languages. We ship translated strings as [dictionary files](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization). They are supported by the community and may contain untranslated strings. To fill the gap, these strings are translated by <a href="https://learn.microsoft.com/en-us/azure/ai-services/translator/" target="_blank">Azure AI Translator by Microsoft</a>. Each dictionary file contains a log of machine translations at the end. You can use it to find individual machine-translated strings and revise them if required. Delete revised strings from the log to exclude them from machine translation.

You can also create new dictionaries for unsupported languages. Use English as a base dictionary: copy the file, replace English translations in it, and submit a pull request with the resulting file to the [survey-library](https://github.com/surveyjs/survey-library) repository.

### Enable Localization and Switch Between Locales

The localization engine that works with dictionaries is available as a separate script/module. This script/module imports dictionaries for all languages. Reference this script in the `<head>` tag of your page or import this module into the component that renders your survey:

```html
<script src="https://unpkg.com/survey-core/survey.i18n.min.js"></script>
```

```js
import "survey-core/survey.i18n";
```

Since SurveyJS v1.9.112, you may reference or import only the languages you need, as shown below:

```html
<script src="https://unpkg.com/survey-core/i18n/french.js"></script>
<script src="https://unpkg.com/survey-core/i18n/german.js"></script>
<script src="https://unpkg.com/survey-core/i18n/italian.js"></script>
```

```js
import "survey-core/i18n/french";
import "survey-core/i18n/german";
import "survey-core/i18n/italian";
```

The default language for UI elements is English. To select another language, use `SurveyModel`'s [`locale`](https://surveyjs.io/Documentation/Library?id=surveymodel#locale) property. For example, the following code translates the survey UI to French:

```js
import { Model } from "survey-core";
import "survey-core/i18n/french";
const surveyJson = { ... };
const survey = new Model(surveyJson);

survey.locale = "fr";
```

### Override Individual Translations

If you want to change individual translation strings, get an object with all translation strings for a specific locale and override the required properties in this object. Refer to the [English dictionary](https://github.com/surveyjs/survey-library/blob/master/packages/survey-core/src/localization/english.ts) for a full list of available properties.

```js
import { getLocaleStrings } from 'survey-core';

// Get the English locale. To get the default locale, pass an empty string.
const engLocale = getLocaleStrings("en");
// Override individual translations
engLocale.pagePrevText = "Back";
engLocale.pageNextText = "Forward";
```

You can also create a custom locale to apply multiple translations in a batch. The following code shows how to do it in a separate TypeScript translation file (dictionary):

```js
// custom-locale.ts
import { setupLocale } from 'survey-core';

const customLocaleStrings = {
  pagePrevText: "Back",
  pageNextText: "Forward",
  completeText: "Send"
};

setupLocale({
  localeCode: "customlocale",   // A short code used as a locale identifier (for example, "en", "de", "fr")
  strings: customLocaleStrings, // An array with custom translations
  nativeName: "Custom Locale",  // The locale name in native language
  englishName: "Custom Locale", // The locale name in English 
  rtl: false                    // A flag that indicates whether the language is right-to-left
});
```

```js
import './localization/custom-locale.ts'
// ...
// Activate the custom locale
survey.locale = "customlocale";
```

If any translation strings or other settings are missing in your custom locale, they will be taken from the English locale. You can specify the `defaultLocale` property to use another fallback locale:

```js
import { Model, surveyLocalization } from "survey-core";
import "survey-core/i18n/french";

surveyLocalization.defaultLocale = "fr";

const surveyJson = { ... };
const survey = new Model(surveyJson);
```

[View Demo](https://surveyjs.io/Examples/Library/survey-localization/ (linkStyle))

## Localize Survey Contents

You can localize questions, choices, columns, rows, and other survey texts right in the survey JSON schema. Normally, properties that specify survey texts accept string values, like the [`title`](/Documentation/Library?id=Question#title) property does in the code below:

```js
const surveyJson = {
  "elements": [{
    "type": "text",
    "name": "firstname"
    "title": "Enter your first name"
  }]
};
```

To localize survey texts, specify the properties with objects instead of string values. Each object field should indicate a locale and the field value&mdash;a translation for this locale:

```js
const surveyJson = {
  "elements": [{
    "type": "text",
    "name": "firstname"
    "title": {
      "default": "Enter your first name",
      "de": "Geben Sie Ihren Vornamen ein",
      "fr": "Entrez votre prénom"
    }
  }]
};
```

You do not have to specify translations for all locales. If a translation is missing for the current locale, the survey takes the translation from the `default` field.

To apply your translations, set the current locale:

```js
survey.locale = "de";
```

[View Demo](https://surveyjs.io/Examples/Library/?id=survey-multilanguages/ (linkStyle))

### Localize `choicesByUrl`

Checkbox, Dropdown, and Radiogroup questions can load choices from a RESTful service if you specify the [`choicesByUrl`](/Documentation/Library?id=QuestionSelectBase#choicesByUrl) property. To localize choices, ensure that the RESTful service returns them in the following format:

```js
[{
  "choiceId": 1,
  "choiceTitle": {
    "en": "En 1",
    "de": "De 1"
  }
}, {
  "choiceId": 2,
  "choiceTitle": {
    "en": "En 2",
    "de": "De 2"
  }
},
// ...
]
```

[View Plunker Example](https://plnkr.co/edit/vefTbkOtrY1mVS6D (linkStyle))

## See Also

- [Data Validation](/Documentation/Library?id=data-validation)
- [Access Survey Results](/Documentation/Library?id=handle-survey-results-access)
- [Conditional Logic and Dynamic Texts](/Documentation/Library?id=design-survey-conditional-logic)
