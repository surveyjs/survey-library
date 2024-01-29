---
title: Create Specialized Question Types | SurveyJS Documentation
description: You can add custom question types to the collection of the built-in components for easier and more secure use of survey elements.
---

# Create Specialized Question Types

Built-in question types are versatile and multi-functional, but in some cases, you need a question type with a more specific functionality. For example, you need to pre-populate a [Dropdown](/Documentation/Library?id=questiondropdownmodel) with a country list. You can use a regular Dropdown and customize it directly, or you can create a specialized question type. The first approach is more straightforward, but the second results in a more reusable solution. Let's consider both. 

The first example pre-populates a standard Dropdown question. You can specify the [`choices`](/Documentation/Library?id=questiondropdownmodel#choices) or [`choicesByUrl`](/Documentation/Library?id=questiondropdownmodel#choicesByUrl) property (depending on whether the choices come from a server or not). The following code shows a Country question configured in this manner:

```js
{
  "name": "country",
  "type": "dropdown",
  "placeholder": "Select a country...",
  "choicesByUrl": {
    "url": "https://surveyjs.io/api/CountriesExample"
  }
}
```

If you [add this question to the Toolbox](/Documentation/Survey-Creator?id=toolbox#add-a-custom-toolbox-item) in Survey Creator, end users can use it in their surveys. However, this approach has a number of drawbacks:

- End users can edit the `choicesByUrl` property in [Property Grid](https://surveyjs.io/survey-creator/documentation/property-grid) and break the functionality.
- If the question needs modifications (for example, if the server URL has changed), end users have to modify every created instance of this question individually.
- In the JSON schema, your custom question looks like a regular Dropdown question.

To avoid these drawbacks, use a different approach: add your [custom question type](https://surveyjs.io/form-library/documentation/api-reference/icustomquestiontypeconfiguration) to the survey's `ComponentCollection`:

```js
Survey.ComponentCollection.Instance.add({
  // A unique name; must use lowercase
  name: "country", 
  // A display name used in the Toolbox
  title: "Country", 
  // A default title for questions created with this question type
  defaultQuestionTitle: "Country",
  // A JSON schema for the base question type (Dropdown in this case)
  questionJSON: {
    "type": "dropdown",
    "placeholder": "Select a country...",
    "choicesByUrl": {
      "url": "https://surveyjs.io/api/CountriesExample",
    }
  },
  // Inherit all or individual properties from the base question type
  inheritBaseProps: true // or [ "allowClear" ]
});
```

This approach gives you the following advantages:

- In Survey Creator, a corresponding toolbox item appears automatically.
- End users cannot break the functionality because the Property Grid hides the `questionJSON` object properties.
- If you modify the question configuration, changes automatically apply to every instance of this question.
- A cleaner JSON schema:
  ```js
  {
    "type": "country",
    "name": "question1"
  }
  ```

[View Demo](/Examples/Survey-Creator?id=component-country (linkStyle))

## Further Reading

- [Create Composite Question Types](/form-library/documentation/customize-question-types/create-composite-question-types)
- [Integrate Third-Party React Components](/form-library/documentation/customize-question-types/third-party-component-integration-react)
- [Integrate Third-Party Angular Components](/form-library/documentation/customize-question-types/third-party-component-integration-angular)
- [Integrate Third-Party Vue 3 Components](/form-library/documentation/customize-question-types/third-party-component-integration-vue)