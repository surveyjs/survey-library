import {
    AnswerCountValidator, EmailValidator, NumericValidator, RegexValidator,
    default as SurveyValidator, TextValidator, ValidatorResult, ValidatorRunner
} from "../src/validator";
import Base, {Event, ItemValue, SurveyError} from "../src/base";
import {ChoicesRestfull} from "../src/choicesRestfull";
import {Condition, ConditionNode, ConditionRunner} from "../src/conditions";
import ConditionsParser from "../src/conditionsParser";
import {CustomError, ExceedSizeError, RequreNumericError} from "../src/error";
import {
    JsonError, JsonIncorrectTypeError, JsonMetadata, JsonMetadataClass,
    JsonMissingTypeError, JsonMissingTypeErrorBase, default as JsonObject, JsonObjectProperty,
    JsonRequiredPropertyError, JsonUnknownPropertyError
} from "../src/jsonobject";
import {
    MatrixDropdownCell, MatrixDropdownColumn, MatrixDropdownRowModelBase,
    default as QuestionMatrixDropdownModelBase
} from "../src/question_matrixdropdownbase";
import {MatrixDropdownRowModel, default as QuestionMatrixDropdownModel} from "../src/question_matrixdropdown";
import {MatrixDynamicRowModel, default as QuestionMatrixDynamicModel} from "../src/question_matrixdynamic";
import {MatrixRowModel, default as QuestionMatrixModel} from "../src/question_matrix";
import {MultipleTextItemModel, default as QuestionMultipleTextModel} from "../src/question_multipletext";
import PageModel, {QuestionRowModel} from "../src/page";
import Question from "../src/question";
import QuestionBase from "../src/questionbase";
import {QuestionCheckboxBase, default as QuestionSelectBase} from "../src/question_baseselect";
import {QuestionCheckboxModel} from "../src/question_checkbox";
import QuestionCommentModel from "../src/question_comment";
import QuestionDropdownModel from "../src/question_dropdown";
import QuestionFactory from "../src/questionfactory";
import {QuestionFileModel} from "../src/question_file";
import QuestionHtmlModel from "../src/question_html";
import QuestionRadiogroupModel from "../src/question_radiogroup";
import QuestionRatingModel from "../src/question_rating";
import QuestionTextModel from "../src/question_text";
import SurveyModel from "../src/survey";
import {
    SurveyTrigger, SurveyTriggerComplete, SurveyTriggerSetValue, SurveyTriggerVisible,
    default as Trigger
} from "../src/trigger";
import SurveyWindowModel from "../src/surveyWindow";
import TextPreProcessor from "../src/textPreProcessor";
import defaultStandardCss from "../src/defaultCss/cssstandard";
import dxSurveyService from "../src/dxSurveyService";
import {surveyLocalization, surveyStrings} from "../src/surveyStrings";
import ReactSurvey from "../src/react/standard/reactSurveyStandard";
import ReactSurveyBase from "../src/react/reactSurvey";
import ReactSurveyModel from "../src/react/reactsurveymodel";
import ReactSurveyNavigation from "../src/react/reactSurveyNavigation";
import ReactSurveyPage, {ReactSurveyRow} from "../src/react/reactpage";
import {ReactSurveyProgress} from "../src/react/standard/reactSurveyProgressStandard";
import ReactSurveyProgressBase from "../src/react/reactSurveyProgress";
import ReactSurveyQuestion, {ReactSurveyQuestionErrors} from "../src/react/reactquestion";
import {ReactSurveyQuestionCommentItem, default as ReactSurveyQuestioncomment} from "../src/react/reactquestioncomment";
import ReactSurveyQuestioncheckbox from "../src/react/reactquestioncheckbox";
import ReactSurveyQuestiondropdown from "../src/react/reactquestiondropdown";
import ReactSurveyQuestionmatrixdropdown from "../src/react/reactquestionmatrixdropdown";
import ReactSurveyQuestionmatrix from "../src/react/reactquestionmatrix";
import ReactSurveyQuestionhtml from "../src/react/reactquestionhtml";
import ReactSurveyQuestionfile from "../src/react/reactquestionfile";
import ReactSurveyQuestionmultipletext from "../src/react/reactquestionmultipletext";
import ReactSurveyQuestionradiogroup from "../src/react/reactquestionradiogroup";
import ReactSurveyQuestionrating from "../src/react/standard/reactquestionratingStandard";
import ReactSurveyQuestiontext from "../src/react/reactquestiontext";
import ReactSurveyWindow from "../src/react/standard/reactSurveyWindowStandard";
import {ReactSurveyQuestioncheckboxItem} from "../src/react/reactquestioncheckbox";
import {ReactSurveyQuestionmatrixRow} from "../src/react/reactquestionmatrix";
import {ReactSurveyQuestionmatrixdropdownRow} from "../src/react/reactquestionmatrixdropdown";
import {ReactSurveyQuestionmultipletextItem} from "../src/react/reactquestionmultipletext";

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
/*    "ReactSurveyQuestionmatrixdynamic": ReactSurveyQuestionmatrixdynamic,
    "ReactSurveyQuestionmatrixdynamicRow": ReactSurveyQuestionmatrixdynamicRow,*/
    "ReactSurveyQuestionmultipletext": ReactSurveyQuestionmultipletext,
    "ReactSurveyQuestionmultipletextItem": ReactSurveyQuestionmultipletextItem,
    "ReactSurveyQuestionradiogroup": ReactSurveyQuestionradiogroup,
    "ReactSurveyQuestionrating": ReactSurveyQuestionrating,
    "ReactSurveyQuestiontext": ReactSurveyQuestiontext,
    "ReactSurveyRow": ReactSurveyRow,
    "ReactSurveyWindow": ReactSurveyWindow
};