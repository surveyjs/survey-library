// model
export * from "./chunks/model";

// localization
import "./chunks/localization";

// helpers
export * from "./chunks/helpers";

// css standard
export { defaultStandardCss } from "../defaultCss/cssstandard";
// css bootstrap
export { defaultBootstrapCss } from "../defaultCss/cssbootstrap";
// css bootstrap + material
export { defaultBootstrapMaterialCss } from "../defaultCss/cssbootstrapmaterial";
export { modernCss } from "../defaultCss/cssmodern";

// knockout
export { Survey } from "../knockout/kosurvey";
export { Survey as Model } from "../knockout/kosurvey";
export { ImplementorBase } from "../knockout/kobase";
export { QuestionRow, Page, Panel } from "../knockout/kopage";
export { FlowPanel } from "../knockout/koflowpanel";
export { QuestionImplementor } from "../knockout/koquestion";
export { QuestionSelectBaseImplementor } from "../knockout/koquestion_baseselect";
export { QuestionCheckboxBaseImplementor } from "../knockout/koquestion_baseselect";
export { QuestionCheckbox } from "../knockout/koquestion_checkbox";
export { QuestionRanking } from "../knockout/koquestion_ranking";
export { QuestionComment } from "../knockout/koquestion_comment";
export { QuestionDropdown } from "../knockout/koquestion_dropdown";
export { QuestionFile } from "../knockout/koquestion_file";
export { QuestionHtml } from "../knockout/koquestion_html";
export { QuestionMatrix } from "../knockout/koquestion_matrix";
export { QuestionMatrixDropdown } from "../knockout/koquestion_matrixdropdown";
export {
  QuestionMatrixDynamicImplementor,
  QuestionMatrixDynamic,
} from "../knockout/koquestion_matrixdynamic";
export { QuestionPanelDynamic } from "../knockout/koquestion_paneldynamic";
export {
  MultipleTextItem,
  QuestionMultipleText,
} from "../knockout/koquestion_multipletext";
export { QuestionRadiogroup } from "../knockout/koquestion_radiogroup";
export { QuestionRating } from "../knockout/koquestion_rating";
export { QuestionText } from "../knockout/koquestion_text";
export { QuestionBoolean } from "../knockout/koquestion_boolean";
export { QuestionEmpty } from "../knockout/koquestion_empty";
export { QuestionExpression } from "../knockout/koquestion_expression";
export { QuestionImagePicker } from "../knockout/koquestion_imagepicker";
export { SurveyWindow } from "../knockout/koSurveyWindow";
export { SurveyTemplateText } from "../knockout/templateText";
export { QuestionImage } from "../knockout/koquestion_image";
export { QuestionSignaturePad } from "../knockout/koquestion_signaturepad";
export { QuestionCustom } from "../knockout/koquestion_custom";

export * from "../knockout/components/action-bar/action-bar";
export * from "../knockout/components/boolean-checkbox/boolean-checkbox";
export * from "../knockout/components/default-title/default-title";
export * from "../knockout/components/panel/panel";
export * from "../knockout/components/popup/popup";
export * from "../knockout/components/progress/buttons";
export * from "../knockout/components/progress/progress";
export * from "../knockout/components/title-actions/title-actions";
export * from "../knockout/components/string-editor";
export * from "../knockout/components/string-viewer";


export * from "../knockout/components/default-title/default-title";
export * from "../knockout/components/list/list";
export * from "../knockout/components/svg-icon/svg-icon";
export * from "../utils/resonsibilitymanager";
//Uncomment to include the "date" question type.
//export {QuestionDate} from "../plugins/knockout/koquestion_date";

export * from "../rendererFactory";

import * as ko from "knockout";
import { SurveyModel } from "../survey";
import { registerTemplateEngine } from "../knockout/kosurvey";
registerTemplateEngine(ko, SurveyModel.platform);
