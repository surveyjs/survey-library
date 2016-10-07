import {
    AnswerCountValidator, EmailValidator, NumericValidator, RegexValidator,
    default as SurveyValidator, TextValidator, ValidatorResult, ValidatorRunner
} from "../validator";
import Base, {Event, ItemValue, SurveyError} from "../base";
import {ChoicesRestfull} from "../choicesRestfull";
import {Condition, ConditionNode, ConditionRunner} from "../conditions";
import ConditionsParser from "../conditionsParser";
import {CustomError, ExceedSizeError, RequreNumericError} from "../error";
import {
    JsonError, JsonIncorrectTypeError, JsonMetadata, JsonMetadataClass,
    JsonMissingTypeError, JsonMissingTypeErrorBase, default as JsonObject, JsonObjectProperty,
    JsonRequiredPropertyError, JsonUnknownPropertyError
} from "../jsonobject";
import {
    MatrixDropdownCell, MatrixDropdownColumn, MatrixDropdownRowModelBase,
    default as QuestionMatrixDropdownModelBase
} from "../question_matrixdropdownbase";
import {MatrixDropdownRowModel, default as QuestionMatrixDropdownModel} from "../question_matrixdropdown";
import {MatrixDynamicRowModel, default as QuestionMatrixDynamicModel} from "../question_matrixdynamic";
import {MatrixRowModel, default as QuestionMatrixModel} from "../question_matrix";
import {MultipleTextItemModel, default as QuestionMultipleTextModel} from "../question_multipletext";
import PageModel, {QuestionRowModel} from "../page";
import Question from "../question";
import QuestionBase from "../questionbase";
import {QuestionCheckboxBase, default as QuestionSelectBase} from "../question_baseselect";
import {QuestionCheckboxModel} from "../question_checkbox";
import QuestionCommentModel from "../question_comment";
import QuestionDropdownModel from "../question_dropdown";
import QuestionFactory from "../questionfactory";
import {QuestionFileModel} from "../question_file";
import QuestionHtmlModel from "../question_html";
import QuestionRadiogroupModel from "../question_radiogroup";
import QuestionRatingModel from "../question_rating";
import QuestionTextModel from "../question_text";
import SurveyModel from "../survey";
import {
    SurveyTrigger, SurveyTriggerComplete, SurveyTriggerSetValue, SurveyTriggerVisible,
    default as Trigger
} from "../trigger";
import SurveyWindowModel from "../surveyWindow";
import TextPreProcessor from "../textPreProcessor";
import defaultStandardCss from "../defaultCss/cssstandard";
import dxSurveyService from "../dxSurveyService";
import {surveyLocalization, surveyStrings} from "../surveyStrings";
import ReactSurvey from "../react/standard/reactSurveyStandard";
import ReactSurveyBase from "../react/reactSurvey";
import ReactSurveyModel from "../react/reactsurveymodel";
import ReactSurveyNavigation from "../react/reactSurveyNavigation";
import ReactSurveyPage, {ReactSurveyRow} from "../react/reactpage";
import {ReactSurveyProgress} from "../react/standard/reactSurveyProgressStandard";
import ReactSurveyProgressBase from "../react/reactSurveyProgress";
import ReactSurveyQuestion, {ReactSurveyQuestionErrors} from "../react/reactquestion";
import {ReactSurveyQuestionCommentItem, default as ReactSurveyQuestioncomment} from "../react/reactquestioncomment";
import ReactSurveyQuestioncheckbox from "../react/reactquestioncheckbox";
import ReactSurveyQuestiondropdown from "../react/reactquestiondropdown";
import ReactSurveyQuestionmatrixdropdown from "../react/reactquestionmatrixdropdown";
import ReactSurveyQuestionmatrix from "../react/reactquestionmatrix";
import ReactSurveyQuestionhtml from "../react/reactquestionhtml";
import ReactSurveyQuestionfile from "../react/reactquestionfile";
import ReactSurveyQuestionmultipletext from "../react/reactquestionmultipletext";
import ReactSurveyQuestionradiogroup from "../react/reactquestionradiogroup";
import ReactSurveyQuestionrating from "../react/standard/reactquestionratingStandard";
import ReactSurveyQuestiontext from "../react/reactquestiontext";
import ReactSurveyWindow from "../react/standard/reactSurveyWindowStandard";
import {ReactSurveyQuestioncheckboxItem} from "../react/reactquestioncheckbox";
import {ReactSurveyQuestionmatrixRow} from "../react/reactquestionmatrix";
import {ReactSurveyQuestionmatrixdropdownRow} from "../react/reactquestionmatrixdropdown";
import {ReactSurveyQuestionmultipletextItem} from "../react/reactquestionmultipletext";
import ReactSurveyQuestionmatrixdynamic, {ReactSurveyQuestionmatrixdynamicRow} from "../react/reactquestionmatrixdynamic";

export * from '../localization/russian';
export * from '../localization/french';
export * from '../localization/finnish';
export * from '../localization/german';

module.exports = {
    /*common*/
    "AnswerCountValidator": AnswerCountValidator,
    "Base": Base,
    "ChoicesRestfull": ChoicesRestfull,
    "Condition": Condition,
    "ConditionNode": ConditionNode,
    "ConditionRunner": ConditionRunner,
    "ConditionsParser": ConditionsParser,
    "CustomError": CustomError,
    "EmailValidator": EmailValidator,
    "Event": Event,
    "ExceedSizeError": ExceedSizeError,
    "ItemValue": ItemValue,
    "JsonError": JsonError,
    "JsonIncorrectTypeError": JsonIncorrectTypeError,
    "JsonMetadata": JsonMetadata,
    "JsonMetadataClass": JsonMetadataClass,
    "JsonMissingTypeError": JsonMissingTypeError,
    "JsonMissingTypeErrorBase": JsonMissingTypeErrorBase,
    "JsonObject": JsonObject,
    "JsonObjectProperty": JsonObjectProperty,
    "JsonRequiredPropertyError": JsonRequiredPropertyError,
    "JsonUnknownPropertyError": JsonUnknownPropertyError,
    "MatrixDropdownCell": MatrixDropdownCell,
    "MatrixDropdownColumn": MatrixDropdownColumn,
    "MatrixDropdownRowModel": MatrixDropdownRowModel,
    "MatrixDropdownRowModelBase": MatrixDropdownRowModelBase,
    "MatrixDynamicRowModel": MatrixDynamicRowModel,
    "MatrixRowModel": MatrixRowModel,
    "MultipleTextItemModel": MultipleTextItemModel,
    "NumericValidator": NumericValidator,
    "PageModel": PageModel,
    "Question": Question,
    "QuestionBase": QuestionBase,
    "QuestionCheckboxBase": QuestionCheckboxBase,
    "QuestionCheckboxModel": QuestionCheckboxModel,
    "QuestionCommentModel": QuestionCommentModel,
    "QuestionDropdownModel": QuestionDropdownModel,
    "QuestionFactory": QuestionFactory,
    "QuestionFileModel": QuestionFileModel,
    "QuestionHtmlModel": QuestionHtmlModel,
    "QuestionMatrixDropdownModel": QuestionMatrixDropdownModel,
    "QuestionMatrixDropdownModelBase": QuestionMatrixDropdownModelBase,
    "QuestionMatrixDynamicModel": QuestionMatrixDynamicModel,
    "QuestionMatrixModel": QuestionMatrixModel,
    "QuestionMultipleTextModel": QuestionMultipleTextModel,
    "QuestionRadiogroupModel": QuestionRadiogroupModel,
    "QuestionRatingModel": QuestionRatingModel,
    "QuestionRowModel": QuestionRowModel,
    "QuestionSelectBase": QuestionSelectBase,
    "QuestionTextModel": QuestionTextModel,
    "RegexValidator": RegexValidator,
    "RequreNumericError": RequreNumericError,
    "SurveyError": SurveyError,
    "SurveyModel": SurveyModel,
    "SurveyTrigger": SurveyTrigger,
    "SurveyTriggerComplete": SurveyTriggerComplete,
    "SurveyTriggerSetValue": SurveyTriggerSetValue,
    "SurveyTriggerVisible": SurveyTriggerVisible,
    "SurveyValidator": SurveyValidator,
    "SurveyWindowModel": SurveyWindowModel,
    "TextPreProcessor": TextPreProcessor,
    "TextValidator": TextValidator,
    "Trigger": Trigger,
    "ValidatorResult": ValidatorResult,
    "ValidatorRunner": ValidatorRunner,
    "defaultStandardCss": defaultStandardCss,
    "dxSurveyService": dxSurveyService,
    "surveyLocalization": surveyLocalization,
    "surveyStrings": surveyStrings,
    /*special*/
    "ReactSurvey": ReactSurvey,
    "ReactSurveyBase": ReactSurveyBase,
    "ReactSurveyModel": ReactSurveyModel,
    "ReactSurveyNavigation": ReactSurveyNavigation,
    "ReactSurveyPage": ReactSurveyPage,
    "ReactSurveyProgress": ReactSurveyProgress,
    "ReactSurveyProgressBase": ReactSurveyProgressBase,
    "ReactSurveyQuestion": ReactSurveyQuestion,
    "ReactSurveyQuestionCommentItem": ReactSurveyQuestionCommentItem,
    "ReactSurveyQuestionErrors": ReactSurveyQuestionErrors,
    "ReactSurveyQuestioncheckbox": ReactSurveyQuestioncheckbox,
    "ReactSurveyQuestioncheckboxItem": ReactSurveyQuestioncheckboxItem,
    "ReactSurveyQuestioncomment": ReactSurveyQuestioncomment,
    "ReactSurveyQuestiondropdown": ReactSurveyQuestiondropdown,
    "ReactSurveyQuestionfile": ReactSurveyQuestionfile,
    "ReactSurveyQuestionhtml": ReactSurveyQuestionhtml,
    "ReactSurveyQuestionmatrix": ReactSurveyQuestionmatrix,
    "ReactSurveyQuestionmatrixRow": ReactSurveyQuestionmatrixRow,
    "ReactSurveyQuestionmatrixdropdown": ReactSurveyQuestionmatrixdropdown,
    "ReactSurveyQuestionmatrixdropdownRow": ReactSurveyQuestionmatrixdropdownRow,
    "ReactSurveyQuestionmatrixdynamic": ReactSurveyQuestionmatrixdynamic,
    "ReactSurveyQuestionmatrixdynamicRow": ReactSurveyQuestionmatrixdynamicRow,
    "ReactSurveyQuestionmultipletext": ReactSurveyQuestionmultipletext,
    "ReactSurveyQuestionmultipletextItem": ReactSurveyQuestionmultipletextItem,
    "ReactSurveyQuestionradiogroup": ReactSurveyQuestionradiogroup,
    "ReactSurveyQuestionrating": ReactSurveyQuestionrating,
    "ReactSurveyQuestiontext": ReactSurveyQuestiontext,
    "ReactSurveyRow": ReactSurveyRow,
    "ReactSurveyWindow": ReactSurveyWindow
};