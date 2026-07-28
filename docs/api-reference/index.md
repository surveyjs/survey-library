---
title: Classes and Interfaces
product: Form Library
---

# SurveyJS Form Library API Reference

## Classes

- [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/surveymodel.md) — The `SurveyModel` object contains properties and methods that allow you to control the survey and access its elements.
- [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) — A base class for all questions.
- [`QuestionPanelDynamicModel`](https://surveyjs.io/form-library/documentation/api-reference/questionpaneldynamicmodel.md) — A class that describes the Dynamic Panel question type.
- [`PanelModelBase`](https://surveyjs.io/form-library/documentation/api-reference/panelmodelbase.md) — A base class for the `PanelModel` and `PageModel` classes.
- [`QuestionSelectBase`](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase.md) — A base class for multiple-choice question types (Checkboxes, Dropdown, Radio Button Group, etc.).
- [`MatrixDropdownColumn`](https://surveyjs.io/form-library/documentation/api-reference/matrixdropdowncolumn.md) — An auxiliary class that describes a column in a Multi-Select Matrix or Dynamic Matrix.
- [`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) — A base class for all SurveyJS objects.
- [`QuestionMatrixDynamicModel`](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdynamicmodel.md) — A class that describes the Dynamic Matrix question type.
- [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) — A base class for all survey elements.
- [`QuestionMatrixDropdownModelBase`](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdropdownmodelbase.md) — A base class for the `QuestionMatrixDropdownModel` and `QuestionMatrixDynamicModel` classes.
- [`MultipleTextItemModel`](https://surveyjs.io/form-library/documentation/api-reference/multipletextitemmodel.md) — A class that describes an item in a Multiple Textboxes question.
- [`QuestionFileModel`](https://surveyjs.io/form-library/documentation/api-reference/questionfilemodel.md) — A class that describes the File Upload question type.
- [`QuestionSliderModel`](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel.md) — A class that describes the Slider question type.
- [`QuestionTextModel`](https://surveyjs.io/form-library/documentation/api-reference/questiontextmodel.md) — A class that describes the Single-Line Input question type, which is used to create textual, numeric, date-time, and color input fields.
- [`QuestionRatingModel`](https://surveyjs.io/form-library/documentation/api-reference/questionratingmodel.md) — A class that describes the Rating Scale question type.
- [`QuestionDropdownModel`](https://surveyjs.io/form-library/documentation/api-reference/questiondropdownmodel.md) — A class that describes the Dropdown question type.
- [`QuestionSignaturePadModel`](https://surveyjs.io/form-library/documentation/api-reference/questionsignaturepadmodel.md) — A class that describes the Signature question type.
- [`PopupSurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/popupsurveymodel.md) — A class that renders a survey in a pop-up window.
- [`QuestionMatrixBaseModel`](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixbasemodel.md) — A base class for all matrix question types.
- [`PageModel`](https://surveyjs.io/form-library/documentation/api-reference/pagemodel.md) — The `PageModel` object describes a survey page and contains properties and methods that allow you to control the page and access its elements (panels and questions).
- [`QuestionImagePickerModel`](https://surveyjs.io/form-library/documentation/api-reference/questionimagepickermodel.md) — A class that describes the Image Picker question type.
- [`QuestionCheckboxModel`](https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxmodel.md) — A class that describes the Checkboxes question type.
- [`QuestionTagboxModel`](https://surveyjs.io/form-library/documentation/api-reference/questiontagboxmodel.md) — A class that describes the Multi-Select Dropdown (Tag Box) question type.
- [`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panelmodel.md) — A class that describes the Panel container element.
- [`QuestionExpressionModel`](https://surveyjs.io/form-library/documentation/api-reference/questionexpressionmodel.md) — A class that describes the Expression question type.
- [`ChoicesRestful`](https://surveyjs.io/form-library/documentation/api-reference/choicesrestful.md) — Configures access to a RESTful service that returns choices for Checkbox, Dropdown, Radiogroup, and other multiple-choice question types.
- [`QuestionImageModel`](https://surveyjs.io/form-library/documentation/api-reference/questionimagemodel.md) — A class that describes the Image question type.
- [`QuestionMatrixModel`](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixmodel.md) — A class that describes the Single-Select Matrix question type.
- [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/api-reference/inputmasknumeric.md) — A class that describes an input mask of the `"numeric"` `maskType`.
- [`QuestionBooleanModel`](https://surveyjs.io/form-library/documentation/api-reference/questionbooleanmodel.md) — A class that describes the Yes/No (Boolean) question type.
- [`QuestionMultipleTextModel`](https://surveyjs.io/form-library/documentation/api-reference/questionmultipletextmodel.md) — A class that describes the Multiple Text question type.
- [`QuestionRankingModel`](https://surveyjs.io/form-library/documentation/api-reference/questionrankingmodel.md) — A class that describes the Ranking question type.
- [`QuestionCommentModel`](https://surveyjs.io/form-library/documentation/api-reference/questioncommentmodel.md) — A class that describes the Long Text question type.
- [`QuestionFileModelBase`](https://surveyjs.io/form-library/documentation/api-reference/questionfilemodelbase.md) — A base class for question types that support file upload: `QuestionFileModel` and `QuestionSignaturePadModel`.
- [`QuestionMatrixDropdownModel`](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdropdownmodel.md) — A class that describes the Multi-Select Matrix question type.
- [`QuestionTextBase`](https://surveyjs.io/form-library/documentation/api-reference/questiontextbase.md) — A base class for the Single-Line Input and Long Text question types.
- [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) — A base class for the `SurveyElement` and `SurveyModel` classes.
- [`TextValidator`](https://surveyjs.io/form-library/documentation/api-reference/textvalidator.md) — A class that implements a validator for text values.
- [`AnswerCountValidator`](https://surveyjs.io/form-library/documentation/api-reference/answercountvalidator.md) — A class that implements answer count validation in the question types that can have multiple values (for instance, Checkboxes).
- [`InputMaskCurrency`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskcurrency.md) — A class that describes an input mask of the `"currency"` `maskType`.
- [`InputMaskDateTime`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskdatetime.md) — A class that describes an input mask of the `"datetime"` `maskType`.
- [`NumericValidator`](https://surveyjs.io/form-library/documentation/api-reference/numericvalidator.md) — A class that implements a validator for numeric values.
- [`QuestionRadiogroupModel`](https://surveyjs.io/form-library/documentation/api-reference/questionradiogroupmodel.md) — A class that describes the Radio Button Group question type.
- [`RegexValidator`](https://surveyjs.io/form-library/documentation/api-reference/regexvalidator.md) — A class that implements validation using regular expressions.
- [`SurveyValidator`](https://surveyjs.io/form-library/documentation/api-reference/surveyvalidator.md) — A base class for all classes that implement validators.
- [`ExpressionValidator`](https://surveyjs.io/form-library/documentation/api-reference/expressionvalidator.md) — A class that implements validation using expressions.
- [`InputMaskBase`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskbase.md) — A base class for classes that implement input masks: - `InputMaskNumeric` - `InputMaskCurrency` - `InputMaskDateTime` - `InputMaskPattern`
- [`InputMaskPattern`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskpattern.md) — A class that describes an input mask of the `"pattern"` `maskType`.
- [`QuestionCheckboxBase`](https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxbase.md) — A base class for multiple-selection question types that can display choice items in multiple columns (Checkbox, Radiogroup, Image Picker).
- [`QuestionHtmlModel`](https://surveyjs.io/form-library/documentation/api-reference/questionhtmlmodel.md) — A class that describes the HTML question type.
- [`EmailValidator`](https://surveyjs.io/form-library/documentation/api-reference/emailvalidator.md) — A class that implements a validator for e-mail addresses.
- [`QuestionNonValue`](https://surveyjs.io/form-library/documentation/api-reference/questionnonvalue.md) — A base class for question types that cannot have a value (Html, Image).

## Interfaces

- [`ICustomQuestionTypeConfiguration`](https://surveyjs.io/form-library/documentation/api-reference/icustomquestiontypeconfiguration.md) — An interface used to create custom question types.
- [`IAction`](https://surveyjs.io/form-library/documentation/api-reference/iaction.md) — An action item.
- [`IHeader`](https://surveyjs.io/form-library/documentation/api-reference/iheader.md) — A survey header configuration interface.
- [`ITheme`](https://surveyjs.io/form-library/documentation/api-reference/itheme.md) — A theme configuration interface.
- [`IDialogOptions`](https://surveyjs.io/form-library/documentation/api-reference/idialogoptions.md) — An interface used to configure the content and behavior of a modal dialog displayed via the `showDialog()` method.
- [`IExpressionValidationResult`](https://surveyjs.io/form-library/documentation/api-reference/iexpressionvalidationresult.md) — An interface that describes the result returned by the `validateExpressions` method.
- [`ISaveToJSONOptions`](https://surveyjs.io/form-library/documentation/api-reference/isavetojsonoptions.md) — An interface with configuration options that control how a `SurveyModel` instance is serialized by the `toJSON()` method.

## Variables

- [`settings`](https://surveyjs.io/form-library/documentation/api-reference/settings.md) — Global settings that apply to all surveys on the page.
- [`Serializer`](https://surveyjs.io/form-library/documentation/api-reference/serializer.md) — An alias for the metadata object.
