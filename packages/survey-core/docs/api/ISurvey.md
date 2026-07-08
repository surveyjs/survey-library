---
title: ISurvey
product: Form Library
api-type: interface
description: The main survey interface, composed from focused sub-interfaces.
source: https://surveyjs.io/form-library/documentation/api-reference/isurvey
---

# `ISurvey`

The main survey interface, composed from focused sub-interfaces.

Consumers that only need a subset of survey functionality can depend on the
narrower sub-interfaces (e.g. `ISurveyFileCallbacks`, `ISurveyMatrixCallbacks`)
instead of the full `ISurvey`.

## Inheritance

`ISurveySingleInput` &rarr; `ISurveyValidation` &rarr; `ISurveyTitleSettings` &rarr; `ISurveyAfterRenderCallbacks` &rarr; `ISurveyCssCallbacks` &rarr; `ISurveyChoiceCallbacks` &rarr; `ISurveyDynamicPanelCallbacks` &rarr; `ISurveyMatrixCallbacks` &rarr; `ISurveyFileCallbacks` &rarr; `ISurveyElementLifecycle` &rarr; `ISurvey`
