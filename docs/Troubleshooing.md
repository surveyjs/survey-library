
# Troubleshooting

This help topic describes how to troubleshoot problems that may occur when you use the SurveyJS library in your application.

## There is no visible page or question in the survey.

**Issue**: The survey appears empty and the following message is displayed: "There is no visible page or question in the survey".

**Solution**:
You may encounter this issue in the following cases.

* A survey JSON is bad-formatted.
A survey model can be built from JSON. A survey JSON schema can be declared in your appplication, or imported from a file. 

Validate JSON and ensure it is well-formatted. Also, ensure that the JSON schema follows the [survey structure](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#survey-structure) and declares the `elements` node at a minimum. For more information, refer to: [Define a Static Survey Model in JSON](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#define-a-static-survey-model-in-json).

> NOTE: It is possible to programmatically build a survey model using the [addNewPage](https://surveyjs.io/form-library/documentation/surveymodel#addNewPage), [addNewPanel](https://surveyjs.io/form-library/documentation/pagemodel#addNewPanel), and [addNewQuestion](https://surveyjs.io/form-library/documentation/pagemodel#addNewQuestion) functions. For more details, refer to [Create or Change a Survey Model Dynamically](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#create-or-change-a-survey-model-dynamically).

* A survey does not contain visible elements.
Survey elements may have the [visible](https://surveyjs.io/form-library/documentation/question#visible) property set to `false`. Or, their [visibleIf](https://surveyjs.io/form-library/documentation/question#visibleIf) expression evaluates to `false`.

Ensure the [visible](https://surveyjs.io/form-library/documentation/question#visible) option for survey elements is enabled or the [visibleIf](https://surveyjs.io/form-library/documentation/question#visibleIf) expression evaluates to `true`.

* A survey uses a custom question component which is not registered on a page.

If you use a custom question component, ensure that it is registered in a survey's `ComponentCollection`. For more information, refer to [Create Specialized Question Types](https://surveyjs.io/survey-creator/documentation/create-specialized-question-types).

 

