// styles
import "../../main.scss";
//import "../../modern.scss";

export var Version: string;
Version = `${process.env.VERSION}`;

export { settings } from "../../settings";
export { Helpers, HashTable } from "../../helpers";
export {
  AnswerCountValidator,
  EmailValidator,
  NumericValidator,
  RegexValidator,
  SurveyValidator,
  TextValidator,
  ValidatorResult,
  ExpressionValidator,
  ValidatorRunner
} from "../../validator";
export { ItemValue } from "../../itemvalue";
export { Base, Event, ArrayChanges } from "../../base";
export {
  ISurvey,
  ISurveyElement,
  IElement,
  IPage,
  ITitleOwner
} from "../../base-interfaces";
export { SurveyError } from "../../survey-error";
export { SurveyElement } from "../../survey-element";
export { CalculatedValue } from "../../calculatedValue";
export {
  CustomError,
  AnswerRequiredError,
  OneAnswerRequiredError,
  RequreNumericError,
  ExceedSizeError
} from "../../error";
export {
  ILocalizableOwner,
  ILocalizableString,
  LocalizableString,
  LocalizableStrings
} from "../../localizablestring";
export { HtmlConditionItem, UrlConditionItem } from "../../expressionItems";
export { ChoicesRestful, ChoicesRestfull } from "../../choicesRestful";
export { FunctionFactory, registerFunction } from "../../functionsfactory";
export { ConditionRunner, ExpressionRunner } from "../../conditions";
export {
  Operand,
  Const,
  BinaryOperand,
  Variable,
  FunctionOperand,
  ArrayOperand
} from "../../expressions/expressions";
export { ConditionsParser } from "../../conditionsParser";
export { ProcessValue } from "../../conditionProcessValue";
export {
  JsonError,
  JsonIncorrectTypeError,
  JsonMetadata,
  JsonMetadataClass,
  JsonMissingTypeError,
  JsonMissingTypeErrorBase,
  JsonObject,
  JsonObjectProperty,
  JsonRequiredPropertyError,
  JsonUnknownPropertyError,
  Serializer,
  property,
  propertyArray
} from "../../jsonobject";
export {
  MatrixDropdownCell,
  MatrixDropdownColumn,
  matrixDropdownColumnTypes,
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedCell,
  QuestionMatrixDropdownRenderedRow,
  QuestionMatrixDropdownRenderedTable
} from "../../question_matrixdropdownbase";
export {
  MatrixDropdownRowModel,
  QuestionMatrixDropdownModel
} from "../../question_matrixdropdown";
export {
  MatrixDynamicRowModel,
  QuestionMatrixDynamicModel
} from "../../question_matrixdynamic";
export {
  MatrixRowModel,
  MatrixCells,
  QuestionMatrixModel,
  IMatrixData
} from "../../question_matrix";
export {
  MultipleTextItemModel,
  QuestionMultipleTextModel
} from "../../question_multipletext";
export { PanelModel, PanelModelBase, QuestionRowModel } from "../../panel";
export { FlowPanelModel } from "../../flowpanel";
export { PageModel } from "../../page";
export * from "../../template-renderer";
export { DefaultTitleModel } from "../../defaultTitle";
export { Question } from "../../question";
export { QuestionNonValue } from "../../questionnonvalue";
export { QuestionEmptyModel } from "../../question_empty";
export {
  QuestionCheckboxBase,
  QuestionSelectBase
} from "../../question_baseselect";
export { QuestionCheckboxModel } from "../../question_checkbox";
export { QuestionRankingModel } from "../../question_ranking";
export { QuestionCommentModel } from "../../question_comment";
export { QuestionDropdownModel } from "../../question_dropdown";
export { QuestionFactory, ElementFactory } from "../../questionfactory";
export { QuestionFileModel } from "../../question_file";
export { QuestionHtmlModel } from "../../question_html";
export { QuestionRadiogroupModel } from "../../question_radiogroup";
export { QuestionRatingModel } from "../../question_rating";
export { QuestionExpressionModel } from "../../question_expression";
export { QuestionTextModel } from "../../question_text";
export { QuestionBooleanModel } from "../../question_boolean";
export {
  QuestionImagePickerModel,
  ImageItemValue
} from "../../question_imagepicker";
export { QuestionImageModel } from "../../question_image";
export { QuestionSignaturePadModel } from "../../question_signaturepad";
export {
  QuestionPanelDynamicModel,
  QuestionPanelDynamicItem
} from "../../question_paneldynamic";
export { SurveyTimer } from "../../surveytimer";
export { SurveyProgressButtonsModel } from "../../surveyProgressButtons";
export { SurveyModel } from "../../survey";
export {
  SurveyTrigger,
  SurveyTriggerComplete,
  SurveyTriggerSetValue,
  SurveyTriggerVisible,
  SurveyTriggerCopyValue,
  SurveyTriggerRunExpression,
  Trigger
} from "../../trigger";
export { SurveyWindowModel } from "../../surveyWindow";
export { TextPreProcessor } from "../../textPreProcessor";

export { dxSurveyService } from "../../dxSurveyService";
export { englishStrings } from "../../localization/english";
export { surveyLocalization, surveyStrings } from "../../surveyStrings";
// export { cultureInfo } from "../../cultureInfo";
export {
  QuestionCustomWidget,
  CustomWidgetCollection,
} from "../../questionCustomWidgets";
export {
  QuestionCustomModel,
  QuestionCompositeModel,
  ComponentQuestionJSON,
  ComponentCollection
} from "../../question_custom";

export { StylesManager } from "../../stylesmanager";
export { ListModel } from "../../list";
export { PopupModel, PopupBaseViewModel, createPopupModalViewModel } from "../../popup";
export {
  QuestionButtonGroupModel,
  ButtonGroupItemModel,
  ButtonGroupItemValue
} from "../../question_buttongroup";
export { IsMobile } from "../../utils/is-mobile";
export {
  confirmAction,
  detectIEOrEdge,
  doKey2Click,
  loadFileFromBase64,
  createSvg
} from "../../utils/utils";
export * from "../../utils/cssClassBuilder";

export { surveyCss } from "../../defaultCss/cssstandard";
//Uncomment to include the "date" question type.
//export {default as QuestionDateModel} from "../../plugins/question_date";

export { DragDropHelper } from "../../dragdrophelper";
