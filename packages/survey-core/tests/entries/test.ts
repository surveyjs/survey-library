// common
export * from "../choicesRestfultests"; //
export * from "../surveyquestiontests"; //
export * from "../surveyserializationtests"; //
export * from "../surveytests"; //
export * from "../surveyWindowTests"; //
export * from "../surveywidthmodetests"; //
export * from "../surveytriggertests"; //
export * from "../surveyvalidatortests"; //
export * from "../surveyShowPreviewTests";
export * from "../surveyProgressButtonsTest";
export * from "../surveytimertests";
export * from "../dragdropcoretests";
export * from "../dragdrophelpertests";
export * from "../expressions/expressionsTest";
export * from "../expressions/expressionParserTest";
export * from "../expressions/expressionValidationTest";
export * from "../expressions/expressionFunctionCacheTests";
export * from "../questionDropdownTests";
export * from "../question_imagemap_tests";
export * from "../listModelTests";
export * from "../dropdown_list_model_test";
export * from "../multi_select_list_model_tests";
export * from "../dropdown_multi_select_list_model_test";
export * from "../notifier_tests";
export * from "../surveyTOCTests";
export * from "../paneltests";
export * from "../dragDropMatrixTests";

export * from "../components/popuptests";
export * from "../components/actionbartests";
export * from "../icons/icons";
export * from "../components/liststests";
export * from "../responsivityTests";
export * from "../icons/svgRegistryTests";
export * from "../mask/input_mask_tests";
export * from "../mask/mask_pattern_tests";
export * from "../mask/mask_number_tests";
export * from "../mask/mask_currency_tests";
export * from "../mask/lexical_analyzer_tests";
export * from "../mask/syntactic_analyzer_tests";
export * from "../mask/mask_datetime_tests";
export * from "../mask/mask_settings_tests";
export * from "../mask/multipletext_mask_settings_tests";
export * from "../headerTests";
export * from "../layout_tests";
export * from "../inputPerPageTests";
export * from "../surveyServiceRemovingTests";
export * from "../surveyStateTests";
export * from "../surveySeparateLocalesTests";

// localization
import "../../src/localization/russian";
import "../../src/localization/french";
import "../../src/localization/finnish";
import "../../src/localization/german";
import { settings } from "../../src/settings";

settings.animationEnabled = false;
settings.dropdownSearchDelay = 0;
