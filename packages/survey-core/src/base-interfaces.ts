// This module is a re-export barrel. The interfaces are defined in focused files
// under ./interfaces and re-exported here so existing `./base-interfaces`
// importers keep working. New code may import from the specific files directly.

// Survey-host callback interfaces.
export type {
  ISurveyElementLifecycle,
  ISurveyFileCallbacks,
  ISurveyMatrixCallbacks,
  ISurveyDynamicPanelCallbacks,
  ISurveyChoiceCallbacks,
  ISurveyCssCallbacks,
  ISurveyAfterRenderCallbacks,
} from "./interfaces/survey-callbacks";

// Data & text-processing interfaces.
export type {
  ISurveyVariables,
  ISurveyDataGetEditingObj,
  ISurveyData,
  ITextProcessorProp,
  ITextProcessorResult,
  ITextProcessor,
} from "./interfaces/data-interfaces";

// Validation/error-owner interfaces.
export type {
  ISurveyErrorOwner,
  ISurveyValidatorOwner,
  ISurveyValidation,
} from "./interfaces/validation-interfaces";

// UI / layout / environment interfaces.
export type {
  IScrollElementToTopOptions,
  IElementUIState,
  ISurveyUIState,
  IWrapperObject,
  ISurveyEnvironment,
  LayoutElementContainer,
  HorizontalAlignment,
  VerticalAlignment,
  ISurveyLayoutElement,
  ILayoutElementModel,
  IDropdownMenuOptions,
} from "./interfaces/ui-interfaces";

// Serialization-option interfaces.
export type {
  IValueItemCustomPropValues,
  IFindElement,
  IPlainDataOptions,
  ILoadFromJSONOptions,
  ISaveToJSONOptions,
} from "./interfaces/serialization-interfaces";

// Element-hierarchy interfaces.
export type {
  IConditionRunner,
  IShortcutText,
  ISurveyElement,
  IElement,
  IQuestion,
  IParentElement,
  IPanel,
  IPage,
  ITitleOwner,
  IProgressInfo,
} from "./interfaces/element-interfaces";

// Survey aggregate interfaces.
export type {
  ISurveyTitleSettings,
  ISurveySingleInput,
  ISurvey,
  ISurveyImpl,
} from "./interfaces/survey-interfaces";
