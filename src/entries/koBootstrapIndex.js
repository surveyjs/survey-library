import {ItemValue, default as Base, SurveyError} from "../base";
import {
    JsonObjectProperty, JsonMetadataClass, JsonMetadata, JsonError,
    JsonUnknownPropertyError, JsonMissingTypeErrorBase, JsonMissingTypeError, JsonIncorrectTypeError,
    JsonRequiredPropertyError, default as JsonObject
} from "../jsonobject";
import {ChoicesRestfull} from "../choicesRestfull";
import ConditionsParser from "../conditionsParser";
import {Condition, ConditionNode, ConditionRunner} from "../conditions";
import dxSurveyService from "../dxSurveyService";
import {surveyLocalization, surveyStrings} from "../surveyStrings";
import {AnswerRequiredError, RequreNumericError, ExceedSizeError, CustomError} from "../error";
import QuestionBase from "../questionbase";
import QuestionFactory from "../questionfactory";
import {QuestionRowModel, default as PageModel} from "../page";
import {
    ValidatorResult, default as SurveyValidator, ValidatorRunner, NumericValidator,
    TextValidator, AnswerCountValidator, RegexValidator, EmailValidator
} from "../validator";
import TextPreProcessor from "../textPreProcessor";
import Question from "../question";
import QuestionSelectBase from "../question_baseselect";
import {QuestionCheckboxBase} from "../question_baseselect";
import {QuestionCheckboxModel} from "../question_checkbox";
import QuestionCommentModel from "../question_comment";
import QuestionDropdownModel from "../question_dropdown";
import {QuestionFileModel} from "../question_file";
import QuestionHtmlModel from "../question_html";
import {MatrixRowModel, default as QuestionMatrixModel} from "../question_matrix";
import QuestionRadiogroupModel from "../question_radiogroup";
import QuestionTextModel from "../question_text";
import {
    MatrixDropdownColumn, MatrixDropdownCell, MatrixDropdownRowModelBase,
    default as QuestionMatrixDropdownModelBase
} from "../question_matrixdropdownbase";
import {MatrixDropdownRowModel, default as QuestionMatrixDropdownModel} from "../question_matrixdropdown";
import {MatrixDynamicRowModel, default as QuestionMatrixDynamicModel} from "../question_matrixdynamic";
import {MultipleTextItemModel, default as QuestionMultipleTextModel} from "../question_multipletext";
import QuestionRatingModel from "../question_rating";
import Trigger from "../trigger";
import {SurveyTrigger} from "../trigger";
import {SurveyTriggerVisible} from "../trigger";
import {SurveyTriggerComplete} from "../trigger";
import {SurveyTriggerSetValue} from "../trigger";
import SurveyModel from "../survey";
import SurveyWindowModel from "../surveyWindow";
import defaultStandardCss from "../defaultCss/cssbootstrap";
import {QuestionRow, default as Page} from "../knockout/kopage";
import QuestionImplementorBase from "../knockout/koquestionbase";
import {QuestionImplementor} from "../knockout/koquestion";
import QuestionSelectBaseImplementor from "../knockout/koquestion_baseselect";
import {QuestionCheckboxBaseImplementor} from "../knockout/koquestion_baseselect";
import QuestionCheckbox from "../knockout/koquestion_checkbox";
import QuestionComment from "../knockout/koquestion_comment";
import QuestionDropdown from "../knockout/koquestion_dropdown";
import {QuestionFile} from "../knockout/koquestion_file";
import QuestionHtml from "../knockout/koquestion_html";
import {MatrixRow, default as QuestionMatrix} from "../knockout/koquestion_matrix";
import QuestionMatrixDropdown from "../knockout/koquestion_matrixdropdown";
import {
    QuestionMatrixDynamicImplementor,
    default as QuestionMatrixDynamic
} from "../knockout/koquestion_matrixdynamic";
import {
    MultipleTextItem, QuestionMultipleTextImplementor,
    default as QuestionMultipleText
} from "../knockout/koquestion_multipletext";
import QuestionRadiogroup from "../knockout/koquestion_radiogroup";
import QuestionRating from "../knockout/koquestion_rating";
import QuestionText from "../knockout/koquestion_text";
import SurveyBase from "../knockout/kosurvey";
import SurveyWindowBase from "../knockout/koSurveyWindow";
import SurveyTemplateTextBase from "../knockout/templateText";
import SurveyWindow from "../knockout/bootstrap/koSurveyWindowbootstrap";
import SurveyTemplateText from "../knockout/bootstrap/templateTextbootstrap";
import Survey from "../knockout/bootstrap/koSurveybootstrap";

export * from '../localization/russian';
export * from '../localization/french';
export * from '../localization/finnish';
export * from '../localization/german';

module.exports = {
    ItemValue:ItemValue,
    Base:Base,
    SurveyError:SurveyError,
    Event:Event,
    JsonObjectProperty:JsonObjectProperty,
    JsonMetadataClass:JsonMetadataClass,
    JsonMetadata:JsonMetadata,
    JsonError:JsonError,
    JsonUnknownPropertyError:JsonUnknownPropertyError,
    JsonMissingTypeErrorBase:JsonMissingTypeErrorBase,
    JsonMissingTypeError:JsonMissingTypeError,
    JsonIncorrectTypeError:JsonIncorrectTypeError,
    JsonRequiredPropertyError:JsonRequiredPropertyError,
    JsonObject:JsonObject,
    ChoicesRestfull:ChoicesRestfull,
    ConditionsParser:ConditionsParser,
    Condition:Condition,
    ConditionNode:ConditionNode,
    ConditionRunner:ConditionRunner,
    dxSurveyService:dxSurveyService,
    surveyLocalization:surveyLocalization,
    surveyStrings:surveyStrings,
    AnswerRequiredError:AnswerRequiredError,
    RequreNumericError:RequreNumericError,
    ExceedSizeError:ExceedSizeError,
    CustomError:CustomError,
    QuestionBase:QuestionBase,
    QuestionFactory:QuestionFactory,
    QuestionRowModel:QuestionRowModel,
    PageModel:PageModel,
    ValidatorResult:ValidatorResult,
    SurveyValidator:SurveyValidator,
    ValidatorRunner:ValidatorRunner,
    NumericValidator:NumericValidator,
    TextValidator:TextValidator,
    AnswerCountValidator:AnswerCountValidator,
    RegexValidator:RegexValidator,
    EmailValidator:EmailValidator,
    TextPreProcessor:TextPreProcessor,
    Question:Question,
    QuestionSelectBase:QuestionSelectBase,
    QuestionCheckboxBase:QuestionCheckboxBase,
    QuestionCheckboxModel:QuestionCheckboxModel,
    QuestionCommentModel:QuestionCommentModel,
    QuestionDropdownModel:QuestionDropdownModel,
    QuestionFileModel:QuestionFileModel,
    QuestionHtmlModel:QuestionHtmlModel,
    MatrixRowModel:MatrixRowModel,
    QuestionMatrixModel:QuestionMatrixModel,
    QuestionRadiogroupModel:QuestionRadiogroupModel,
    QuestionTextModel:QuestionTextModel,
    MatrixDropdownColumn:MatrixDropdownColumn,
    MatrixDropdownCell:MatrixDropdownCell,
    MatrixDropdownRowModelBase:MatrixDropdownRowModelBase,
    QuestionMatrixDropdownModelBase:QuestionMatrixDropdownModelBase,
    MatrixDropdownRowModel:MatrixDropdownRowModel,
    QuestionMatrixDropdownModel:QuestionMatrixDropdownModel,
    MatrixDynamicRowModel:MatrixDynamicRowModel,
    QuestionMatrixDynamicModel:QuestionMatrixDynamicModel,
    MultipleTextItemModel:MultipleTextItemModel,
    QuestionMultipleTextModel:QuestionMultipleTextModel,
    QuestionRatingModel:QuestionRatingModel,
    Trigger:Trigger,
    SurveyTrigger:SurveyTrigger,
    SurveyTriggerVisible:SurveyTriggerVisible,
    SurveyTriggerComplete:SurveyTriggerComplete,
    SurveyTriggerSetValue:SurveyTriggerSetValue,
    SurveyModel:SurveyModel,
    SurveyWindowModel:SurveyWindowModel,
    defaultStandardCss:defaultStandardCss,
    QuestionRow:QuestionRow,
    Page:Page,
    QuestionImplementorBase:QuestionImplementorBase,
    QuestionImplementor:QuestionImplementor,
    QuestionSelectBaseImplementor:QuestionSelectBaseImplementor,
    QuestionCheckboxBaseImplementor:QuestionCheckboxBaseImplementor,
    QuestionCheckbox:QuestionCheckbox,
    QuestionComment:QuestionComment,
    QuestionDropdown:QuestionDropdown,
    QuestionFile:QuestionFile,
    QuestionHtml:QuestionHtml,
    MatrixRow:MatrixRow,
    QuestionMatrix:QuestionMatrix,
    QuestionMatrixDropdown:QuestionMatrixDropdown,
    QuestionMatrixDynamicImplementor:QuestionMatrixDynamicImplementor,
    QuestionMatrixDynamic:QuestionMatrixDynamic,
    MultipleTextItem:MultipleTextItem,
    QuestionMultipleTextImplementor:QuestionMultipleTextImplementor,
    QuestionMultipleText:QuestionMultipleText,
    QuestionRadiogroup:QuestionRadiogroup,
    QuestionRating:QuestionRating,
    QuestionText:QuestionText,
    SurveyBase:SurveyBase,
    SurveyWindowBase:SurveyWindowBase,
    SurveyTemplateTextBase:SurveyTemplateTextBase,
    Survey:Survey,
    //bootstrap
    SurveyWindow:SurveyWindow,
    SurveyTemplateText:SurveyTemplateText
};