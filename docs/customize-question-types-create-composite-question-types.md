---
title: Create Composite Question Types | SurveyJS Documentation
description: Add a custom question type that combines two or more built-in components.
---

# Create Composite Question Types

This help topic describes how to combine multiple questions into a composite question type.

- [Configure a Composite Question Type](#configure-a-composite-question-type)
- [Add Custom Properties to Composite Question Types](#add-custom-properties-to-composite-question-types)
- [Expressions and Triggers in Composite Question Types](#expressions-and-triggers-in-composite-question-types)
- [Override Base Question Properties](#override-base-question-properties)

## Configure a Composite Question Type

Composite questions are containers for other questions. They are useful when a group of questions has a specific logic that users should not change. End users cannot customize the nested questions directly. However, they can customize the composite question.

The following code configures a Full Name composite question that contains the First Name and Last Name [Text](/Documentation/Library?id=questiontextmodel) questions:

```js
Survey.ComponentCollection.Instance.add({
  // A unique name; must use lowercase
  name: "fullname", 
  // A display name used in the Toolbox
  title: "Full Name",
  // A default title for questions created with this question type
  defaultQuestionTitle: "Enter your full name:",
  // An array of JSON schemas that configure the nested questions
  elementsJSON: [
    { type: "text", name: "firstName", title: "First Name", isRequired: true },
    { type: "text", name: "lastName", title: "Last Name", isRequired: true, startWithNewLine: false }
  ]
});
```

The Full Name composite question in the survey JSON schema looks as follows:

```js
{
  "type": "fullname",
  "name": "question1"
}
```

A composite question produces an object for a value:

```js
{
  "question1": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

[View Demo](/Examples/Survey-Creator?id=component-fullname (linkStyle))

## Add Custom Properties to Composite Question Types

If you need to control nested questions, add a custom property to their composite questions. Users can change custom properties in the [Property Grid](/Documentation/Survey-Creator?id=property-grid).

For example, the Full Name composite question from the previous topic may include an optional Middle Name question. The following code adds a custom `showMiddleName` property that controls the Middle Name question visibility:

```js
Survey.ComponentCollection.Instance.add({
  name: "fullname", 
  title: "Full Name", 
  defaultQuestionTitle: "Enter your full name:",
  elementsJSON: [
    { type: "text", name: "firstName", title: "First Name", isRequired: true },
    // Optional question, hidden by default
    { type: "text", name: "middleName", title: "Middle Name", startWithNewLine: false, visible: false },
    { type: "text", name: "lastName", title: "Last Name", isRequired: true, startWithNewLine: false }
  ],

  onInit() {
    // Add a `showMiddleName` Boolean property to the `fullname` question type
    Survey.Serializer.addProperty("fullname", {
      name: "showMiddleName",
      type: "boolean",
      default: false,
      category: "general",
    });
  },
  // Set the Middle Name question visibility at startup
  onLoaded(question) {
    this.changeMiddleNameVisibility(question);
  },
  // Track the changes of the `showMiddleName` property
  onPropertyChanged(question, propertyName, newValue) {
    if (propertyName === "showMiddleName") {
      this.changeMiddleNameVisibility(question);
    }
  },
  changeMiddleNameVisibility(question) {
    const middleName = question.contentPanel.getQuestionByName("middleName");
    if (!!middleName) {
      // Set the `middleName` question's visibility based on the composite question's `showMiddleName` property 
      middleName.visible = question.showMiddleName;
    }
  },
});
```

In the survey JSON schema, the custom `showMiddleName` property looks as follows:

```js
{
  "type": "fullname",
  "name": "question1",
  "showMiddleName": "true"
}
```

The steps below summarize how to add a custom property to your composite question:

1. Implement the [`onInit`](https://surveyjs.io/Documentation/Library?id=ICustomQuestionTypeConfiguration#onInit) function to add a custom property to your question.
2. Implement a function that connects your custom property with a nested question's property (`changeMiddleNameVisibility` in the code above).
3. Call this function from the [`onLoaded`](https://surveyjs.io/Documentation/Library?id=ICustomQuestionTypeConfiguration#onLoaded) function to apply the custom property when the survey JSON schema is loaded.
4. Call the same function from the [`onPropertyChanged`](https://surveyjs.io/Documentation/Library?id=ICustomQuestionTypeConfiguration#onPropertyChanged) function to reapply the custom property each time its value changes.

[View Demo](/Examples/Survey-Creator?id=component-fullname (linkStyle))

## Expressions and Triggers in Composite Question Types

[Expressions](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-logic#expressions) and [triggers](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-logic#conditional-survey-logic-triggers) help you build conditional logic in a survey. Let us consider a survey example in which respondents should enter their business and shipping addresses. For the case when the addresses are the same, the survey has a "Shipping address same as business address" question that displays a Yes/No toggle switch. When the switch is set to Yes, the Shipping Address field is disabled and its value is copied from the Business Address field:

![Composite question type - Shipping Address](../images/composite-question-shipping-address-disabled.png)

When respondents set the switch to No, Shipping Address becomes enabled and its value is cleared:

![Composite question type - Shipping Address](../images/composite-question-shipping-address-enabled.png)

The following code shows how you can use expressions and triggers to implement this logic in code:

```js
{
  "elements": [
    {
     "type": "comment",
     "name": "businessAddress",
     "title": "Business Address",
     "isRequired": "true"
    },
    {
     "type": "boolean",
     "name": "shippingSameAsBusiness",
     "title": "Shipping address same as business address",
     "defaultValue": "true"
    },
    {
     "type": "comment",
     "name": "shippingAddress",
     "title": "Shipping Address",
     "enableIf": "{shippingSameAsBusiness} <> true",
     "isRequired": "true"
    }
  ],
  "triggers": [
    {
      "type": "copyvalue",
      "expression": "{shippingSameAsBusiness} = true and {businessAddress} notempty",
      "setToName": "shippingAddress",
      "fromName": "businessAddress"
    },
    {
      "type": "setvalue",
      "expression": "{shippingSameAsBusiness} = false",
      "setToName": "shippingAddress"
    }
  ]
}
```

Survey Creator users can implement the same UI and logic, but this requires time and basic understanding of expressions and triggers. To help the users with this task, you can create a custom composite question type that already implements this UI and logic. The code below demonstrates this composite question type configuration. Note that the [`enableIf`](/Documentation/Library?id=questioncommentmodel#enableIf) expression uses the `composite` prefix to access a nested question. Instead of triggers, composite questions use the [`onValueChanged`](https://surveyjs.io/form-library/documentation/api-reference/icustomquestiontypeconfiguration#onValueChanged) function to implement the trigger logic.

```js
Survey.ComponentCollection.Instance.add({
  name: "shippingaddress",
  title: "Shipping Address",
  elementsJSON: [{
    type: "comment",
    name: "businessAddress",
    title: "Business Address",
    isRequired: true
  }, {
    type: "boolean",
    name: "shippingSameAsBusiness",
    title: "Shipping address same as business address",
    defaultValue: true
  }, {
    type: "comment",
    name: "shippingAddress",
    title: "Shipping Address",
    // Use the `composite` prefix to access a question nested in the composite question
    enableIf: "{composite.shippingSameAsBusiness} <> true",
    isRequired: true
  }],
  onValueChanged(question, name) {
    const businessAddress = question.contentPanel.getQuestionByName("businessAddress");
    const shippingAddress = question.contentPanel.getQuestionByName("shippingAddress");
    const shippingSameAsBusiness = question.contentPanel.getQuestionByName("shippingSameAsBusiness");

    if (name === "businessAddress") {
      // If "Shipping address same as business address" is selected
      if (shippingSameAsBusiness.value == true) {
        // Copy the Business Address value to Shipping Address
        shippingAddress.value = businessAddress.value;
      }
    }
    if (name === "shippingSameAsBusiness") {
      // If "Shipping address same as business address" is selected, copy the Business Address to Shipping Address
      // Otherwise, clear the Shipping Address value
      shippingAddress.value = shippingSameAsBusiness.value == true ? businessAddress.value : "";
    }
  }
});
```

Users can add a custom question to their survey like they add a built-in question, and they can use it without any knowledge of expressions and triggers. The resulting survey JSON schema looks as follows:

```js
{
  "type": "shippingaddress",
  "name": "question1"
}
```

[View Demo](https://surveyjs.io/Examples/Survey-Creator?id=component-shippingaddress (linkStyle))

## Override Base Question Properties

Composite questions inherit properties from their base question type ([`Question`](/Documentation/Library?id=Question)). To override a base property, add it to your composite question and specify a new configuration for it. Call the `addProperty(questionType, propertySettings)` method on the `Survey.Serializer` object. You can call it in the [`onInit`](https://surveyjs.io/Documentation/Library?id=ICustomQuestionTypeConfiguration#onInit) function within the composite question configuration object.

The following code shows how to override base question properties. This code hides the properties from the Property Grid (`visible: false`) and excludes them from serialization to JSON. The [`titleLocation`](/Documentation/Library?id=Question#titleLocation) property also gets a new default value.

```js
Survey.ComponentCollection.Instance.add({
  name: "shippingaddress",
  // ...
  onInit() {
    Survey.Serializer.addProperty("shippingaddress", {
      name: "titleLocation",
      visible: false,
      default: "hidden",
    });
    Survey.Serializer.addProperty("shippingaddress", {
      name: "title",
      visible: false,
    });
    Survey.Serializer.addProperty("shippingaddress", {
      name: "description",
      visible: false,
    });
  }
});
```

You can also override the properties of the objects nested in a composite question. For example, the following code overrides the [`showQuestionNumbers`](/Documentation/Library?id=panelmodel#showQuestionNumbers) property of the [Panel](/Documentation/Library?id=panelmodel) that contains all the other nested questions:

```js
Survey.ComponentCollection.Instance.add({
  name: "shippingaddress",
  // ...
  onCreated(question) {
    question.contentPanel.showQuestionNumbers = "default";
    // ...
  }
});
```

If you want to override a nested question property, call the Panel's [`getQuestionByName`](/Documentation/Library?id=panelmodel#getQuestionByName) method to access the question:

```js
Survey.ComponentCollection.Instance.add({
  name: "shippingaddress",
  // ...
  onCreated(question) {
    const businessAddress = question.contentPanel.getQuestionByName("businessAddress");
    businessAddress.visible = false;
  }
});
```

## Further Reading

- [Create Specialized Question Types](/form-library/documentation/customize-question-types/create-specialized-question-types)
- [Integrate Third-Party React Components](/form-library/documentation/customize-question-types/third-party-component-integration-react)
- [Integrate Third-Party Angular Components](/form-library/documentation/customize-question-types/third-party-component-integration-angular)
- [Integrate Third-Party Vue 3 Components](/form-library/documentation/customize-question-types/third-party-component-integration-vue)