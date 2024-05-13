// styles
// import "../../main.scss";
//import "../../modern.scss";

import { DomWindowHelper } from "../../global_variables_utils";

export var Version: string;
export var ReleaseDate: string;
Version = `${process.env.VERSION}`;
ReleaseDate = `${process.env.RELEASE_DATE}`;

export function checkLibraryVersion(ver: string, libraryName: string): void {
  if (Version != ver) {
    const str = "survey-core has version '" + Version + "' and " + libraryName
      + " has version '" + ver + "'. SurveyJS libraries should have the same versions to work correctly.";
    /* eslint no-console: ["error", { allow: ["error"] }] */
    console.error(str);
  }
}
export function setLicenseKey(key: string): void {
  slk(key);
}
export function slk(key: string): void {
  _slk(key, lic, ReleaseDate);
}
export function hasLicense(index: number): boolean {
  return lic[index.toString()] === true;
}
const lic: any = {};
function _slk(k: any, lh: any, rd: any) {
  if (!k) return;
  const en = (s: string) => {
    var e: any = {}, i, b = 0, c, x, l = 0, a, r = "", w = String.fromCharCode, L = s.length;
    var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0; i < 64; i++) { e[A.charAt(i)] = i; }
    for (x = 0; x < L; x++) {
      let c = e[s.charAt(x)]; b = (b << 6) + c; l += 6;
      while (l >= 8) { ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a)); }
    }
    return r;
  };
  let v = en(k);
  if (!v) return;
  let index = v.indexOf(";");
  if (index < 0) return;
  if (!checkPrefix(v.substring(0, index))) return;
  v = v.substring(index + 1);
  v.split(",").forEach(s => {
    let i = s.indexOf("=");
    if (i > 0) {
      lh[s.substring(0, i)] = new Date(rd) <= new Date(s.substring(i + 1));
    }
  });
}
function checkPrefix(prefix: string): boolean {
  if (!prefix) return true;
  const s = "domains:";
  const index = prefix.indexOf(s);
  if (index < 0) return true;
  const ds = prefix.substring(index + s.length).toLowerCase().split(",");
  if (!Array.isArray(ds) || ds.length === 0) return true;
  const location = DomWindowHelper.getLocation();
  if (!!location && !!location.hostname) {
    const hn = location.hostname.toLowerCase();
    ds.push("localhost");
    for (let i = 0; i < ds.length; i++) {
      if (hn.indexOf(ds[i]) > -1) return true;
    }
    return false;
  }
  return true;
}

export { settings, ISurveyEnvironment } from "../../settings";
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
export { Base, Event, EventBase, ArrayChanges, ComputedUpdater } from "../../base";
export {
  ISurvey,
  ISurveyElement,
  IElement,
  IQuestion,
  IPage,
  IPanel,
  ISurveyData,
  ITitleOwner,
  ISurveyLayoutElement,
  IPlainDataOptions as IPlainData,
  IShortcutText,
  ILoadFromJSONOptions,
  ISaveToJSONOptions,
  HorizontalAlignment,
  VerticalAlignment
} from "../../base-interfaces";
export { SurveyError } from "../../survey-error";
export { SurveyElementCore, SurveyElement, DragTypeOverMeEnum } from "../../survey-element";
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
export { ConditionRunner, ExpressionRunner, IExpresionExecutor, ExpressionExecutor } from "../../conditions";
export {
  Operand,
  Const,
  BinaryOperand,
  Variable,
  FunctionOperand,
  ArrayOperand,
  UnaryOperand
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
  IJsonPropertyInfo,
  JsonObjectProperty,
  JsonRequiredPropertyError,
  JsonUnknownPropertyError,
  Serializer,
  property,
  propertyArray
} from "../../jsonobject";
export {
  IMatrixDropdownData,
  MatrixDropdownCell,
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase
} from "../../question_matrixdropdownbase";
export { MatrixDropdownColumn, matrixDropdownColumnTypes } from "../../question_matrixdropdowncolumn";
export { QuestionMatrixDropdownRenderedCell, QuestionMatrixDropdownRenderedRow, QuestionMatrixDropdownRenderedErrorRow, QuestionMatrixDropdownRenderedTable } from "../../question_matrixdropdownrendered";
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
export { QuestionMatrixBaseModel } from "../../martixBase";
export {
  MultipleTextItemModel,
  MultipleTextCell,
  MultipleTextErrorCell,
  MutlipleTextErrorRow,
  MutlipleTextRow,
  QuestionMultipleTextModel,
  MultipleTextEditorModel
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
export { QuestionTagboxModel } from "../../question_tagbox";
export { QuestionRankingModel } from "../../question_ranking";
export { QuestionCommentModel } from "../../question_comment";
export { QuestionDropdownModel } from "../../question_dropdown";
export { QuestionFactory, ElementFactory } from "../../questionfactory";
export { QuestionFileModel } from "../../question_file";
export { QuestionHtmlModel } from "../../question_html";
export { QuestionRadiogroupModel } from "../../question_radiogroup";
export { QuestionRatingModel, RenderedRatingItem } from "../../question_rating";
export { QuestionExpressionModel } from "../../question_expression";
export { QuestionTextBase, CharacterCounter } from "../../question_textbase";
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
export { SurveyTimerModel } from "../../surveyTimerModel";
export * from "../../surveyToc";
export { SurveyProgressModel } from "../../surveyProgress";
export { ProgressButtons, ProgressButtonsResponsivityManager, IProgressButtonsViewModel } from "../../progress-buttons";
export * from "../../themes";
export { SurveyModel } from "../../survey";
export * from "../../survey-events-api";
export {
  SurveyTrigger,
  SurveyTriggerComplete,
  SurveyTriggerSetValue,
  SurveyTriggerVisible,
  SurveyTriggerCopyValue,
  SurveyTriggerRunExpression,
  SurveyTriggerSkip,
  Trigger
} from "../../trigger";
export { PopupSurveyModel, SurveyWindowModel } from "../../popup-survey";
export { TextPreProcessor } from "../../textPreProcessor";
export { Notifier } from "../../notifier";
export { Cover, CoverCell } from "../../header";

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
  ComponentCollection,
  ICustomQuestionTypeConfiguration
} from "../../question_custom";

export { StylesManager } from "../../stylesmanager";
export { ListModel } from "../../list";
export { MultiSelectListModel } from "../../multiSelectListModel";
export { PopupModel, createDialogOptions, IDialogOptions } from "../../popup";
export { PopupBaseViewModel } from "../../popup-view-model";
export { PopupDropdownViewModel } from "../../popup-dropdown-view-model";
export { PopupModalViewModel } from "../../popup-modal-view-model";
export { createPopupViewModel, createPopupModalViewModel } from "../../popup-utils";
export { DropdownListModel } from "../../dropdownListModel";
export { DropdownMultiSelectListModel } from "../../dropdownMultiSelectListModel";
export {
  QuestionButtonGroupModel,
  ButtonGroupItemModel,
  ButtonGroupItemValue
} from "../../question_buttongroup";
export { IsMobile, IsTouch, _setIsTouch } from "../../utils/devices";
export {
  confirmAction,
  confirmActionAsync,
  detectIEOrEdge,
  doKey2ClickUp,
  doKey2ClickDown,
  doKey2ClickBlur,
  loadFileFromBase64,
  increaseHeightByContent,
  createSvg,
  chooseFiles,
  sanitizeEditableContent,
  IAttachKey2clickOptions
} from "../../utils/utils";
export { InputMaskBase } from "../../mask/mask_base";
export { InputMaskPattern } from "../../mask/mask_pattern";
export { InputMaskNumeric } from "../../mask/mask_numeric";
export { InputMaskDateTime } from "../../mask/mask_datetime";
export { InputMaskCurrency } from "../../mask/mask_currency";
export * from "../../utils/cssClassBuilder";

export { surveyCss, defaultV2Css, defaultV2ThemeName } from "../../defaultCss/defaultV2Css";
//Uncomment to include the "date" question type.
//export {default as QuestionDateModel} from "../../plugins/question_date";

export { DragDropCore } from "../../dragdrop/core";
export { DragDropChoices } from "../../dragdrop/choices";
export { DragDropRankingSelectToRank } from "../../dragdrop/ranking-select-to-rank";
