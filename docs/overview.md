---
title: Form Library | SurveyJS
description: SurveyJS Form Library is a free and open-source JavaScript library for rendering dynamic, JSON-based forms and surveys in React, Angular, Vue, and plain JavaScript applications. It runs in the browser, collects responses from users, and lets you send submitted data to any backend, API, or database.
---
# Form Library Overview

SurveyJS Form Library is a free and open-source JavaScript library for rendering dynamic, JSON-based forms and surveys in React, Angular, Vue, and plain JavaScript applications. It runs in the browser, collects responses from users, and lets you send submitted data to any backend, API, or database.

Use Form Library to build multi-step forms, surveys, quizzes, scored assessments, calculator forms, pop-up surveys, and other data-entry tools. Form content and structure, validation, conditional logic, navigation, calculations, and appearance are defined through a SurveyJS JSON form definition. 

You can create form definitions manually, generate them programmatically, or build them visually with [SurveyJS Survey Creator](/survey-creator/documentation/overview), an embeddable drag-and-drop form builder.

<br><img src="images/overview.png" alt="SurveyJS Form Library" width="1544" height="860">

## How Form Library Works

SurveyJS Form Library renders forms from JSON definitions directly in your web application. It does not require a SurveyJS backend, so you retain control over form definitions, submitted responses, and data storage.

A typical workflow is as follows:

1. Create or load a SurveyJS JSON form definition.
2. Instantiate a survey model and render the form with SurveyJS Form Library.
3. Collect and validate responses in the browser.
4. Send completed or partially completed response data to your backend.
5. Store and process the data using the database or service of your choice.

Because the form definition is stored separately from the rendering component, the same JSON definition can be saved, versioned, reused, edited in Survey Creator, rendered as a web form, and used by other SurveyJS components.

## Key Features

### Dynamic Forms and Surveys

- Multi-page forms, surveys, quizzes, scored assessments, calculator forms, and survey pop-ups
- Conditional visibility, branching, calculated values, and expression-based logic
- [Input validation](/form-library/documentation/data-validation), partial submissions, auto-save, and lazy loading
- Dynamic panels and repeating question groups
- Carry-forward responses and text piping
- Multiple navigation modes for long and complex forms

### Framework and Backend Integration

- Dedicated rendering packages for React, Angular, Vue 3, and plain JavaScript
- TypeScript support
- Client-side rendering with no required SurveyJS backend
- Integration with any server, API, database, or authentication system
- [Backend integration examples for PHP, Node.js, and ASP.NET Core](/backend-integration/examples)

### JSON-Based Forms

- Define form structure, content, behavior, and appearance in JSON
- Load form definitions from your backend or database
- [Save, version, copy, and reuse form definitions](/form-library/documentation/how-to-store-survey-results)
- Create definitions manually or visually with Survey Creator
- Load choices and other form data dynamically from web services

### Form Controls and Customization

- 20+ built-in question and input types
- Dynamic panels and matrix questions
- Electronic signature and image capture
- Custom question types and reusable composite questions
- Third-party component integration
- Custom question rendering

### Localization and Accessibility

- Community-supported localization for 50+ languages
- Multi-language forms and automatic locale selection
- Right-to-left language support
- Accessible input controls and keyboard navigation

### Appearance and UI Customization

- Built-in themes and custom branding
- Shared design-token system based on CSS variables
- [Theme adapters for Bootstrap, Material UI, and shadcn/ui](https://surveyjs.io/documentation/theme-adapters)
- Configurable layouts, navigation controls, validation messages, and form behavior

Explore our interactive [Form Library demos](/form-library/examples/overview) with editable source code for common form configurations and customization scenarios.

## Installation

Choose the package for your framework to get started:

### React

```
npm install survey-react-ui
```

[Get Started with Form Library for React](/form-library/documentation/get-started-react (linkStyle))

### Angular

```
npm install survey-angular-ui
```

[Get Started with Form Library for Angular](/form-library/documentation/get-started-angular (linkStyle))

### Vue.js

```
npm install survey-vue3-ui
```

[Get Started with Form Library for Vue.js](/form-library/documentation/get-started-vue (linkStyle))

### Plain JavaScript

```
npm install survey-js-ui
```

[Get Started with Form Library for Plain JavaScript](/form-library/documentation/get-started-html-css-javascript (linkStyle))

## Package Architecture

SurveyJS Form Library separates form logic from framework-specific rendering.

The framework-independent `survey-core` package provides the survey model, validation, conditional logic, calculations, navigation, localization, and other core functionality.

Framework-specific packages such as `survey-react-ui`, `survey-angular-ui`, and `survey-vue3-ui`, as well as the vanilla JavaScript package `survey-js-ui`, render that model in React, Angular, Vue 3, and plain JavaScript applications. Installing any of these rendering packages also installs `survey-core`.

## Releases and Migration

Visit the [Major Updates](/stay-updated/major-updates/2025-2026) page and [Release Notes](/stay-updated/release-notes) for recent features, fixes, and package updates.

For major-version upgrades, refer to the relevant migration guide.

## Licensing

SurveyJS Form Library is free and open source and is distributed under the MIT license.
